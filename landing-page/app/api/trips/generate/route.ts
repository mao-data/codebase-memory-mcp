import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

interface ActivityInput {
  type?: string
  title: string
  description?: string
  start_time?: string
  end_time?: string
  location?: string
  cost?: number
  currency?: string
}

interface DayInput {
  day_number: number
  date?: string
  title?: string
  activities?: ActivityInput[]
}

interface ItineraryResponse {
  title: string
  destination: string
  days: DayInput[]
}

// Simple in-memory rate limiter: max 5 generations per user per hour.
// Replace with Redis (e.g. Upstash) for multi-instance deployments.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60 * 60 * 1000

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(userId)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count += 1
  return true
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!checkRateLimit(user.id)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before generating another trip.' },
      { status: 429 }
    )
  }

  const body = await request.json()

  // Validate date range before hitting the AI service
  if (body.startDate && body.endDate) {
    const start = new Date(body.startDate)
    const end = new Date(body.endDate)
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
    }
    if (end < start) {
      return NextResponse.json({ error: 'End date must be on or after start date' }, { status: 400 })
    }
  }

  // FASTAPI_URL is required — no localhost fallback in production
  const fastApiUrl = process.env.FASTAPI_URL
  if (!fastApiUrl) {
    console.error('[Config] FASTAPI_URL environment variable is not set')
    return NextResponse.json({ error: 'Service misconfigured' }, { status: 500 })
  }

  let itinerary: ItineraryResponse

  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (process.env.BACKEND_SECRET_TOKEN) {
      headers['X-Backend-Token'] = process.env.BACKEND_SECRET_TOKEN
    }

    const aiRes = await fetch(`${fastApiUrl}/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(60_000),
    })

    if (!aiRes.ok) {
      const err = await aiRes.text()
      console.error('[AI] FastAPI error:', { status: aiRes.status, body: err, userId: user.id })
      return NextResponse.json({ error: 'AI generation failed' }, { status: 502 })
    }

    itinerary = await aiRes.json()
  } catch (err) {
    console.error('[AI] Fetch error:', { error: err, userId: user.id })
    return NextResponse.json({ error: 'Could not reach AI service' }, { status: 502 })
  }

  // ── Save to Supabase ───────────────────────────────────────────────────────

  // 1. Create trip
  const { data: trip, error: tripErr } = await supabase
    .from('trips')
    .insert({
      owner_id: user.id,
      title: itinerary.title,
      destination: itinerary.destination,
      start_date: body.startDate || null,
      end_date: body.endDate || null,
    })
    .select()
    .single()

  if (tripErr || !trip) {
    console.error('[DB] Trip insert error:', { error: tripErr, userId: user.id })
    return NextResponse.json({ error: 'Failed to save trip' }, { status: 500 })
  }

  // 2. Insert days + activities — fail fast and roll back on error
  for (const day of itinerary.days) {
    const { data: tripDay, error: dayErr } = await supabase
      .from('trip_days')
      .insert({
        trip_id: trip.id,
        day_number: day.day_number,
        date: day.date || null,
        title: day.title || `Day ${day.day_number}`,
      })
      .select()
      .single()

    if (dayErr || !tripDay) {
      console.error('[DB] Day insert error:', { error: dayErr, tripId: trip.id, userId: user.id })
      // Delete the trip so the DB doesn't end up in a partial state
      await supabase.from('trips').delete().eq('id', trip.id)
      return NextResponse.json({ error: 'Failed to save itinerary' }, { status: 500 })
    }

    if (day.activities && day.activities.length > 0) {
      const { error: actErr } = await supabase.from('activities').insert(
        day.activities.map((act, idx) => ({
          day_id: tripDay.id,
          trip_id: trip.id,
          type: act.type ?? 'activity',
          title: act.title,
          description: act.description ?? null,
          start_time: act.start_time ?? null,
          end_time: act.end_time ?? null,
          location: act.location ?? null,
          cost: act.cost ?? null,
          currency: act.currency ?? 'USD',
          sort_order: idx,
        }))
      )
      if (actErr) {
        console.error('[DB] Activities insert error:', { error: actErr, dayId: tripDay.id, userId: user.id })
      }
    }
  }

  return NextResponse.json({ tripId: trip.id })
}

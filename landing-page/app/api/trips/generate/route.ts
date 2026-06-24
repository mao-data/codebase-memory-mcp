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

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  // Call FastAPI AI service
  const fastApiUrl = process.env.FASTAPI_URL ?? 'http://localhost:8000'
  let itinerary: ItineraryResponse

  try {
    const aiRes = await fetch(`${fastApiUrl}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(60_000), // 60s timeout for AI generation
    })

    if (!aiRes.ok) {
      const err = await aiRes.text()
      console.error('[AI] FastAPI error:', err)
      return NextResponse.json({ error: 'AI generation failed' }, { status: 502 })
    }

    itinerary = await aiRes.json()
  } catch (err) {
    console.error('[AI] Fetch error:', err)
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
    console.error('[DB] Trip insert error:', tripErr)
    return NextResponse.json({ error: 'Failed to save trip' }, { status: 500 })
  }

  // 2. Insert days + activities sequentially
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
      console.error('[DB] Day insert error:', dayErr)
      continue
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
      if (actErr) console.error('[DB] Activities insert error:', actErr)
    }
  }

  return NextResponse.json({ tripId: trip.id })
}

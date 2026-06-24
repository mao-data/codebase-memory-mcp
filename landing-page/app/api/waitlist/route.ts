import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

// RFC 5322-inspired regex — stricter than the previous one
const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/

// Simple in-memory rate limit: max 3 waitlist submissions per IP per hour
const ipRateMap = new Map<string, { count: number; resetAt: number }>()
const IP_LIMIT = 3
const IP_WINDOW_MS = 60 * 60 * 1000

function checkIpRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = ipRateMap.get(ip)

  if (!entry || now > entry.resetAt) {
    ipRateMap.set(ip, { count: 1, resetAt: now + IP_WINDOW_MS })
    return true
  }
  if (entry.count >= IP_LIMIT) return false
  entry.count += 1
  return true
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  if (!checkIpRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const body = await request.json()
    const email: unknown = body?.email

    if (typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
    const sheetId = process.env.GOOGLE_SHEET_ID

    if (!serviceAccountKey || !sheetId) {
      console.log(`[Journi Waitlist] ${email} — ${new Date().toISOString()}`)
      return NextResponse.json({ success: true })
    }

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(serviceAccountKey),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:C',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[email, new Date().toISOString(), 'journi_landing']],
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Waitlist API Error]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

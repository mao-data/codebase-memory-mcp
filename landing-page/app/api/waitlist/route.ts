import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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

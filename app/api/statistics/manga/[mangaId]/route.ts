import { NextRequest, NextResponse } from "next/server"

const MANGADX_API_BASE = "https://api.mangadx.org"

export async function GET(
  request: NextRequest,
  { params }: { params: { mangaId: string } }
) {
  const { mangaId } = params

  try {
    const response = await fetch(`${MANGADX_API_BASE}/statistics/manga/${mangaId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`MangaDX API error: ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error) {
    console.error('Statistics API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics data' },
      { status: 500 }
    )
  }
}

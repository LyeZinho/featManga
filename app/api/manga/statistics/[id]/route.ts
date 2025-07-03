import { type NextRequest, NextResponse } from "next/server"

const BASE_URL = "https://api.mangadx.org"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const response = await fetch(`${BASE_URL}/statistics/manga/${params.id}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "featManga/1.0",
      },
    })

    if (!response.ok) {
      throw new Error(`MangaDx API error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  } catch (error) {
    console.error("Statistics API Route Error:", error)

    // Return mock statistics as fallback
    const mockStats = {
      statistics: {
        [params.id]: {
          rating: { average: 8.5, bayesian: 8.2 },
          follows: 12500,
        },
      },
    }

    return NextResponse.json(mockStats)
  }
}

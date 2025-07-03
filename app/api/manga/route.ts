import { type NextRequest, NextResponse } from "next/server"

const BASE_URL = "https://api.mangadex.org"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Forward all search parameters to MangaDx API
    const apiUrl = `${BASE_URL}/manga?${searchParams.toString()}`

    const response = await fetch(apiUrl, {
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
    console.error("API Route Error:", error)

    // Return mock data as fallback
    const mockData = {
      result: "ok",
      response: "collection",
      data: Array.from({ length: 10 }, (_, i) => ({
        id: `mock-${i}`,
        type: "manga",
        attributes: {
          title: { en: `Mock Manga ${i + 1}` },
          description: { en: `Description for mock manga ${i + 1}` },
          status: ["ongoing", "completed", "hiatus"][i % 3],
          year: 2020 + (i % 4),
          contentRating: "safe",
          publicationDemographic: ["shounen", "seinen", "shoujo", "josei"][i % 4],
          tags: [
            { id: `tag-${i}-1`, attributes: { name: { en: "Action" } } },
            { id: `tag-${i}-2`, attributes: { name: { en: "Adventure" } } },
          ],
          lastVolume: null,
          lastChapter: null,
        },
        relationships: [
          {
            id: `cover-${i}`,
            type: "cover_art",
            attributes: { fileName: `mock-cover-${i}.jpg` },
          },
        ],
      })),
      limit: 10,
      offset: 0,
      total: 100,
    }

    return NextResponse.json(mockData)
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}

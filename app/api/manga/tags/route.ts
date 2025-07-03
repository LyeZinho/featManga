import { NextResponse } from "next/server"

const BASE_URL = "https://api.mangadx.org"

export async function GET() {
  try {
    const response = await fetch(`${BASE_URL}/manga/tag`, {
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
    console.error("Tags API Route Error:", error)

    // Return mock tags as fallback
    const mockTags = {
      data: [
        { id: "tag-1", attributes: { name: { en: "Action" } } },
        { id: "tag-2", attributes: { name: { en: "Romance" } } },
        { id: "tag-3", attributes: { name: { en: "Comedy" } } },
        { id: "tag-4", attributes: { name: { en: "Drama" } } },
        { id: "tag-5", attributes: { name: { en: "Fantasy" } } },
        { id: "tag-6", attributes: { name: { en: "Adventure" } } },
        { id: "tag-7", attributes: { name: { en: "Slice of Life" } } },
        { id: "tag-8", attributes: { name: { en: "Supernatural" } } },
        { id: "tag-9", attributes: { name: { en: "School Life" } } },
        { id: "tag-10", attributes: { name: { en: "Isekai" } } },
      ],
    }

    return NextResponse.json(mockTags)
  }
}

export interface MangaTag {
  id: string
  attributes: {
    name: {
      en: string
    }
  }
}

export interface MangaAttributes {
  title: {
    en?: string
    [key: string]: string | undefined
  }
  description: {
    en?: string
    [key: string]: string | undefined
  }
  status: string
  year: number | null
  contentRating: string
  publicationDemographic: string | null
  tags: MangaTag[]
  lastVolume: string | null
  lastChapter: string | null
}

export interface MangaRelationship {
  id: string
  type: string
  attributes?: {
    fileName?: string
    name?: string
  }
}

export interface Manga {
  id: string
  type: string
  attributes: MangaAttributes
  relationships: MangaRelationship[]
}

export interface MangaResponse {
  result: string
  response: string
  data: Manga[]
  limit: number
  offset: number
  total: number
}

export interface MangaStatistics {
  rating: {
    average: number
    bayesian: number
  }
  follows: number
}

export class MangaDxAPI {
  static async searchManga(params: {
    title?: string
    includedTags?: string[]
    excludedTags?: string[]
    includedTagsMode?: "AND" | "OR"
    excludedTagsMode?: "AND" | "OR"
    status?: string[]
    publicationDemographic?: string[]
    contentRating?: string[]
    order?: Record<string, "asc" | "desc">
    limit?: number
    offset?: number
  }): Promise<MangaResponse> {
    const searchParams = new URLSearchParams()

    if (params.title) searchParams.append("title", params.title)
    if (params.limit) searchParams.append("limit", params.limit.toString())
    if (params.offset) searchParams.append("offset", params.offset.toString())
    if (params.includedTagsMode) searchParams.append("includedTagsMode", params.includedTagsMode)
    if (params.excludedTagsMode) searchParams.append("excludedTagsMode", params.excludedTagsMode)

    params.includedTags?.forEach((tag) => searchParams.append("includedTags[]", tag))
    params.excludedTags?.forEach((tag) => searchParams.append("excludedTags[]", tag))
    params.status?.forEach((status) => searchParams.append("status[]", status))
    params.publicationDemographic?.forEach((demo) => searchParams.append("publicationDemographic[]", demo))
    params.contentRating?.forEach((rating) => searchParams.append("contentRating[]", rating))

    if (params.order) {
      Object.entries(params.order).forEach(([key, value]) => {
        searchParams.append(`order[${key}]`, value)
      })
    }

    searchParams.append("includes[]", "cover_art")
    searchParams.append("includes[]", "author")
    searchParams.append("includes[]", "artist")

    try {
      const response = await fetch(`/api/manga?${searchParams}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API Error:", error)
      // Return mock data as fallback
      return this.getMockData(params.limit || 10)
    }
  }

  static async getMangaTags(): Promise<{ data: MangaTag[] }> {
    try {
      const response = await fetch("/api/manga/tags")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Tags API Error:", error)
      return { data: this.getMockTags() }
    }
  }

  static async getMangaStatistics(mangaId: string): Promise<{ statistics: Record<string, MangaStatistics> }> {
    try {
      const response = await fetch(`/api/manga/statistics/${mangaId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Statistics API Error:", error)
      return {
        statistics: {
          [mangaId]: {
            rating: { average: 8.5, bayesian: 8.2 },
            follows: 12500,
          },
        },
      }
    }
  }

  static async getPopularManga(limit = 20): Promise<MangaResponse> {
    return this.searchManga({
      order: { followedCount: "desc" },
      limit,
      contentRating: ["safe", "suggestive"],
    })
  }

  static async getRecentlyUpdated(limit = 20): Promise<MangaResponse> {
    return this.searchManga({
      order: { latestUploadedChapter: "desc" },
      limit,
      contentRating: ["safe", "suggestive"],
    })
  }

  static async getTopRated(limit = 20): Promise<MangaResponse> {
    return this.searchManga({
      order: { rating: "desc" },
      limit,
      contentRating: ["safe", "suggestive"],
    })
  }

  static getCoverUrl(mangaId: string, fileName: string, size?: 256 | 512): string {
    const baseUrl = `https://uploads.mangadx.org/covers/${mangaId}/${fileName}`
    return size ? `${baseUrl}.${size}.jpg` : baseUrl
  }

  static getMangaDxUrl(mangaId: string, title?: string): string {
    const slug = title
      ? title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim()
      : "manga"

    return `https://mangadx.org/title/${mangaId}/${slug}`
  }

  static getTitle(manga: Manga): string {
    return manga.attributes.title.en || Object.values(manga.attributes.title)[0] || "Título não disponível"
  }

  static getDescription(manga: Manga): string {
    return (
      manga.attributes.description.en || Object.values(manga.attributes.description)[0] || "Descrição não disponível"
    )
  }

  static getCoverArt(manga: Manga): string | null {
    const coverArt = manga.relationships.find((rel) => rel.type === "cover_art")
    return coverArt?.attributes?.fileName || null
  }

  // Mock data fallback methods
  static getMockData(limit: number): MangaResponse {
    const mockManga: Manga[] = Array.from({ length: limit }, (_, i) => ({
      id: `mock-${i}`,
      type: "manga",
      attributes: {
        title: { en: `Manga Title ${i + 1}` },
        description: {
          en: `This is a description for manga ${i + 1}. An exciting story with great characters and plot.`,
        },
        status: ["ongoing", "completed", "hiatus"][i % 3],
        year: 2020 + (i % 4),
        contentRating: "safe",
        publicationDemographic: ["shounen", "seinen", "shoujo", "josei"][i % 4],
        tags: this.getMockTags().slice(0, 3),
        lastVolume: null,
        lastChapter: null,
      },
      relationships: [
        {
          id: `cover-${i}`,
          type: "cover_art",
          attributes: {
            fileName: `mock-cover-${i}.jpg`,
          },
        },
      ],
    }))

    return {
      result: "ok",
      response: "collection",
      data: mockManga,
      limit,
      offset: 0,
      total: limit,
    }
  }

  static getMockTags(): MangaTag[] {
    return [
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
    ]
  }
}

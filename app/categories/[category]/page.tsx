"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MangaCard } from "@/components/manga-card"
import { ArrowLeft, Filter, Grid, List, TrendingUp, Star, Clock } from "lucide-react"
import { MangaDxAPI, type Manga } from "@/lib/mangadx-api"
import Link from "next/link"

const CATEGORY_INFO = {
  shounen: {
    name: "Shounen",
    description:
      "Mangás voltados para jovens do sexo masculino, geralmente com foco em ação, aventura, amizade e superação. Histórias que inspiram e emocionam com protagonistas determinados.",
    color: "bg-orange-500",
    demographic: "shounen",
  },
  seinen: {
    name: "Seinen",
    description:
      "Mangás para homens adultos, apresentando temas mais maduros, complexos e realistas. Narrativas profundas que exploram aspectos psicológicos e sociais.",
    color: "bg-purple-500",
    demographic: "seinen",
  },
  shoujo: {
    name: "Shoujo",
    description:
      "Mangás voltados para jovens do sexo feminino, focando principalmente em romance, relacionamentos e desenvolvimento emocional dos personagens.",
    color: "bg-pink-500",
    demographic: "shoujo",
  },
  josei: {
    name: "Josei",
    description:
      "Mangás para mulheres adultas, com romances mais realistas e temas maduros sobre vida adulta, carreira e relacionamentos complexos.",
    color: "bg-indigo-500",
    demographic: "josei",
  },
}

export default function CategoryPage() {
  const params = useParams()
  const category = params.category as string
  const [manga, setManga] = useState<Manga[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "recent">("popular")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  const categoryInfo = CATEGORY_INFO[category as keyof typeof CATEGORY_INFO]

  useEffect(() => {
    if (!categoryInfo) return

    const loadCategoryManga = async () => {
      try {
        setIsLoading(true)

        const orderMap = {
          popular: { followedCount: "desc" as const },
          rating: { rating: "desc" as const },
          recent: { latestUploadedChapter: "desc" as const },
        }

        const response = await MangaDxAPI.searchManga({
          publicationDemographic: [categoryInfo.demographic],
          order: orderMap[sortBy],
          limit: 20,
          offset: (currentPage - 1) * 20,
          contentRating: ["safe", "suggestive"],
        })

        if (currentPage === 1) {
          setManga(response.data)
        } else {
          setManga((prev) => [...prev, ...response.data])
        }

        setTotalResults(response.total)
      } catch (error) {
        console.error("Erro ao carregar mangás da categoria:", error)
        // Fallback with mock data
        const mockResponse = MangaDxAPI.getMockData(20)
        setManga(mockResponse.data)
        setTotalResults(mockResponse.total)
      } finally {
        setIsLoading(false)
      }
    }

    loadCategoryManga()
  }, [category, sortBy, currentPage, categoryInfo])

  const handleSortChange = (newSort: "popular" | "rating" | "recent") => {
    setSortBy(newSort)
    setCurrentPage(1)
  }

  const loadMore = () => {
    setCurrentPage((prev) => prev + 1)
  }

  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-manga-light flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-8">
            <h2 className="text-2xl font-bold text-manga-dark mb-4">Categoria não encontrada</h2>
            <p className="text-manga-dark/70 mb-6">A categoria que você procura não existe.</p>
            <Link href="/categories">
              <Button className="bg-manga-accent hover:bg-manga-accent/90">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar às Categorias
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-manga-light">
      {/* Header */}
      <div className={`${categoryInfo.color} text-white py-12`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/categories">
              <Button
                variant="outline"
                size="sm"
                className="border-white text-white hover:bg-white hover:text-manga-dark bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{categoryInfo.name}</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-6">{categoryInfo.description}</p>
            <Badge variant="outline" className="border-white text-white">
              {totalResults} mangás disponíveis
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-manga-dark">Mangás {categoryInfo.name}</h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <Button
                variant={sortBy === "popular" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSortChange("popular")}
                className={sortBy === "popular" ? "bg-manga-accent" : ""}
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                Popular
              </Button>
              <Button
                variant={sortBy === "rating" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSortChange("rating")}
                className={sortBy === "rating" ? "bg-manga-accent" : ""}
              >
                <Star className="w-4 h-4 mr-1" />
                Avaliação
              </Button>
              <Button
                variant={sortBy === "recent" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSortChange("recent")}
                className={sortBy === "recent" ? "bg-manga-accent" : ""}
              >
                <Clock className="w-4 h-4 mr-1" />
                Recente
              </Button>
            </div>

            {/* View Mode */}
            <div className="flex border border-manga-dark/20 rounded">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && manga.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-manga-accent mx-auto mb-4"></div>
              <p className="text-manga-dark">Carregando mangás {categoryInfo.name.toLowerCase()}...</p>
            </div>
          </div>
        )}

        {/* Manga Grid */}
        {manga.length > 0 && (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                  : "space-y-4"
              }
            >
              {manga.map((mangaItem) => (
                <MangaCard key={mangaItem.id} manga={mangaItem} showStats />
              ))}
            </div>

            {/* Load More */}
            {manga.length < totalResults && (
              <div className="text-center mt-8">
                <Button onClick={loadMore} disabled={isLoading} className="bg-manga-accent hover:bg-manga-accent/90">
                  {isLoading ? "Carregando..." : "Carregar Mais"}
                </Button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && manga.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Filter className="w-16 h-16 text-manga-dark/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-manga-dark mb-2">Nenhum mangá encontrado</h3>
              <p className="text-manga-dark/70">Não foi possível carregar mangás desta categoria no momento.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

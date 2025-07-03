"use client"

import { useState } from "react"
import { SearchFilters, type SearchFilters as SearchFiltersType } from "@/components/search-filters"
import { MangaCard } from "@/components/manga-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, Grid, List } from "lucide-react"
import { MangaDxAPI, type Manga } from "@/lib/mangadx-api"

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<Manga[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [hasSearched, setHasSearched] = useState(false)
  const [currentFilters, setCurrentFilters] = useState<SearchFiltersType | null>(null)

  const handleSearch = async (filters: SearchFiltersType, page = 1) => {
    setIsLoading(true)
    setHasSearched(true)
    setCurrentFilters(filters)

    try {
      const searchParams = {
        title: filters.title || undefined,
        includedTags: filters.includedTags.length > 0 ? filters.includedTags : undefined,
        excludedTags: filters.excludedTags.length > 0 ? filters.excludedTags : undefined,
        status: filters.status.length > 0 ? filters.status : undefined,
        publicationDemographic: filters.demographic.length > 0 ? filters.demographic : undefined,
        contentRating: filters.contentRating.length > 0 ? filters.contentRating : undefined,
        order: { [filters.sortBy]: filters.sortOrder },
        limit: 20,
        offset: (page - 1) * 20,
      }

      const response = await MangaDxAPI.searchManga(searchParams)

      if (page === 1) {
        setSearchResults(response.data)
        setCurrentPage(1)
      } else {
        setSearchResults((prev) => [...prev, ...response.data])
        setCurrentPage(page)
      }

      setTotalResults(response.total)
    } catch (error) {
      console.error("Erro na busca:", error)
      setSearchResults([])
      setTotalResults(0)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMore = () => {
    if (currentFilters) {
      handleSearch(currentFilters, currentPage + 1)
    }
  }

  // Check if current search includes sensitive content
  const hasSensitiveContent = currentFilters?.contentRating.includes("pornographic") || false

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-manga-dark dark:bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Search className="w-8 h-8 text-manga-accent" />
              <h1 className="text-3xl font-bold">Busca Avançada</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="border-white text-white hover:bg-white hover:text-manga-dark"
              >
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? "Ocultar" : "Mostrar"} Filtros
              </Button>
              <div className="flex border border-white rounded">
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
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <SearchFilters onSearch={handleSearch} isLoading={isLoading} />
              </div>
            </div>
          )}

          {/* Results */}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            {/* Results Header */}
            {hasSearched && (
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Resultados da Busca</h2>
                  <p className="text-muted-foreground">{totalResults} mangás encontrados</p>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && searchResults.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-manga-accent mx-auto mb-4"></div>
                  <p className="text-foreground">Buscando mangás...</p>
                </div>
              </div>
            )}

            {/* No Results */}
            {hasSearched && !isLoading && searchResults.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum resultado encontrado</h3>
                  <p className="text-muted-foreground">Tente ajustar seus filtros ou usar termos de busca diferentes</p>
                </CardContent>
              </Card>
            )}

            {/* Results Grid */}
            {searchResults.length > 0 && (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                      : "space-y-4"
                  }
                >
                  {searchResults.map((manga) => (
                    <MangaCard key={manga.id} manga={manga} showStats hasSensitiveContent={hasSensitiveContent} />
                  ))}
                </div>

                {/* Load More */}
                {searchResults.length < totalResults && (
                  <div className="text-center mt-8">
                    <Button
                      onClick={loadMore}
                      disabled={isLoading}
                      className="bg-manga-accent hover:bg-manga-accent/90"
                    >
                      {isLoading ? "Carregando..." : "Carregar Mais"}
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Initial State */}
            {!hasSearched && (
              <Card className="text-center py-16">
                <CardContent>
                  <Search className="w-20 h-20 text-manga-accent mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-foreground mb-4">Encontre Seu Mangá Perfeito</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Use os filtros ao lado para descobrir mangás que combinam com seus gostos. Você pode filtrar por
                    gênero, status, demografia e muito mais!
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-manga-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Filter className="w-6 h-6 text-manga-accent" />
                      </div>
                      <h4 className="font-semibold text-foreground">Filtros Avançados</h4>
                      <p className="text-sm text-muted-foreground">Combine gêneros e preferências</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-manga-secondary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Search className="w-6 h-6 text-manga-secondary" />
                      </div>
                      <h4 className="font-semibold text-foreground">Busca Inteligente</h4>
                      <p className="text-sm text-muted-foreground">Resultados personalizados</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-manga-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Grid className="w-6 h-6 text-manga-accent" />
                      </div>
                      <h4 className="font-semibold text-foreground">Visualização Flexível</h4>
                      <p className="text-sm text-muted-foreground">Grade ou lista</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

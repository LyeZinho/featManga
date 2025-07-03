"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, AlertTriangle } from "lucide-react"
import { MangaDxAPI, type MangaTag } from "@/lib/mangadx-api"

interface SearchFiltersProps {
  onSearch: (filters: SearchFilters) => void
  isLoading?: boolean
}

export interface SearchFilters {
  title: string
  includedTags: string[]
  excludedTags: string[]
  status: string[]
  demographic: string[]
  contentRating: string[]
  sortBy: string
  sortOrder: "asc" | "desc"
}

const STATUS_OPTIONS = [
  { value: "ongoing", label: "Em Andamento" },
  { value: "completed", label: "Completo" },
  { value: "hiatus", label: "Hiato" },
  { value: "cancelled", label: "Cancelado" },
]

const DEMOGRAPHIC_OPTIONS = [
  { value: "shounen", label: "Shounen" },
  { value: "seinen", label: "Seinen" },
  { value: "shoujo", label: "Shoujo" },
  { value: "josei", label: "Josei" },
]

const CONTENT_RATING_OPTIONS = [
  { value: "safe", label: "Seguro" },
  { value: "suggestive", label: "Sugestivo" },
  { value: "erotica", label: "Erótico" },
  { value: "pornographic", label: "Pornográfico", sensitive: true },
]

const SORT_OPTIONS = [
  { value: "followedCount", label: "Popularidade" },
  { value: "rating", label: "Avaliação" },
  { value: "latestUploadedChapter", label: "Última Atualização" },
  { value: "createdAt", label: "Data de Criação" },
  { value: "title", label: "Título" },
]

// Genre mapping for URL parameters
const GENRE_MAPPING: Record<string, string[]> = {
  action: ["Action"],
  romance: ["Romance"],
  comedy: ["Comedy"],
  fantasy: ["Fantasy"],
  "slice-of-life": ["Slice of Life"],
  supernatural: ["Supernatural"],
  drama: ["Drama"],
  adventure: ["Adventure"],
  "school-life": ["School Life"],
  isekai: ["Isekai"],
}

export function SearchFilters({ onSearch, isLoading }: SearchFiltersProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [filters, setFilters] = useState<SearchFilters>({
    title: "",
    includedTags: [],
    excludedTags: [],
    status: [],
    demographic: [],
    contentRating: ["safe", "suggestive"],
    sortBy: "followedCount",
    sortOrder: "desc",
  })

  const [tags, setTags] = useState<MangaTag[]>([])
  const [selectedIncludedTags, setSelectedIncludedTags] = useState<MangaTag[]>([])
  const [selectedExcludedTags, setSelectedExcludedTags] = useState<MangaTag[]>([])
  const [tagSearch, setTagSearch] = useState("")

  useEffect(() => {
    const loadTags = async () => {
      try {
        const response = await MangaDxAPI.getMangaTags()
        setTags(response.data)
      } catch (error) {
        console.error("Erro ao carregar tags:", error)
      }
    }
    loadTags()
  }, [])

  // Handle URL parameters on component mount
  useEffect(() => {
    if (tags.length === 0) return

    const genre = searchParams.get("genre")
    const title = searchParams.get("title")
    const demographic = searchParams.get("demographic")

    const updatedFilters = { ...filters }
    let updatedIncludedTags: MangaTag[] = []

    // Handle genre parameter
    if (genre && GENRE_MAPPING[genre]) {
      const genreNames = GENRE_MAPPING[genre]
      const genreTags = tags.filter((tag) =>
        genreNames.some((name) => tag.attributes.name.en.toLowerCase() === name.toLowerCase()),
      )

      updatedIncludedTags = [...updatedIncludedTags, ...genreTags]
      updatedFilters.includedTags = [...updatedFilters.includedTags, ...genreTags.map((tag) => tag.id)]
    }

    // Handle title parameter
    if (title) {
      updatedFilters.title = title
    }

    // Handle demographic parameter
    if (demographic && DEMOGRAPHIC_OPTIONS.some((opt) => opt.value === demographic)) {
      updatedFilters.demographic = [demographic]
    }

    // Update state if there are changes
    if (updatedIncludedTags.length > 0 || title || demographic) {
      setFilters(updatedFilters)
      setSelectedIncludedTags(updatedIncludedTags)

      // Trigger search automatically
      setTimeout(() => {
        onSearch(updatedFilters)
      }, 100)
    }
  }, [tags, searchParams])

  const filteredTags = tags.filter((tag) => tag.attributes.name.en.toLowerCase().includes(tagSearch.toLowerCase()))

  const handleTagToggle = (tag: MangaTag, type: "include" | "exclude") => {
    if (type === "include") {
      const isSelected = selectedIncludedTags.some((t) => t.id === tag.id)
      if (isSelected) {
        setSelectedIncludedTags((prev) => prev.filter((t) => t.id !== tag.id))
        setFilters((prev) => ({ ...prev, includedTags: prev.includedTags.filter((id) => id !== tag.id) }))
      } else {
        setSelectedIncludedTags((prev) => [...prev, tag])
        setFilters((prev) => ({ ...prev, includedTags: [...prev.includedTags, tag.id] }))
        // Remove from excluded if present
        setSelectedExcludedTags((prev) => prev.filter((t) => t.id !== tag.id))
        setFilters((prev) => ({ ...prev, excludedTags: prev.excludedTags.filter((id) => id !== tag.id) }))
      }
    } else {
      const isSelected = selectedExcludedTags.some((t) => t.id === tag.id)
      if (isSelected) {
        setSelectedExcludedTags((prev) => prev.filter((t) => t.id !== tag.id))
        setFilters((prev) => ({ ...prev, excludedTags: prev.excludedTags.filter((id) => id !== tag.id) }))
      } else {
        setSelectedExcludedTags((prev) => [...prev, tag])
        setFilters((prev) => ({ ...prev, excludedTags: [...prev.excludedTags, tag.id] }))
        // Remove from included if present
        setSelectedIncludedTags((prev) => prev.filter((t) => t.id !== tag.id))
        setFilters((prev) => ({ ...prev, includedTags: prev.includedTags.filter((id) => id !== tag.id) }))
      }
    }
  }

  const handleSearch = () => {
    onSearch(filters)

    // Update URL without triggering navigation
    const params = new URLSearchParams()
    if (filters.title) params.set("title", filters.title)
    if (selectedIncludedTags.length > 0) {
      const genreKey = Object.keys(GENRE_MAPPING).find((key) =>
        GENRE_MAPPING[key].some((name) => selectedIncludedTags.some((tag) => tag.attributes.name.en === name)),
      )
      if (genreKey) params.set("genre", genreKey)
    }
    if (filters.demographic.length > 0) params.set("demographic", filters.demographic[0])

    const newUrl = params.toString() ? `?${params.toString()}` : ""
    router.replace(`/search${newUrl}`, { scroll: false })
  }

  const clearFilters = () => {
    setFilters({
      title: "",
      includedTags: [],
      excludedTags: [],
      status: [],
      demographic: [],
      contentRating: ["safe", "suggestive"],
      sortBy: "followedCount",
      sortOrder: "desc",
    })
    setSelectedIncludedTags([])
    setSelectedExcludedTags([])
    router.replace("/search", { scroll: false })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Filter className="w-5 h-5" />
          Filtros de Busca
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Título */}
        <div className="space-y-2">
          <Label htmlFor="title">Título do Mangá</Label>
          <Input
            id="title"
            placeholder="Digite o nome do mangá..."
            value={filters.title}
            onChange={(e) => setFilters((prev) => ({ ...prev, title: e.target.value }))}
          />
        </div>

        {/* Tags */}
        <div className="space-y-4">
          <div>
            <Label>Gêneros/Tags</Label>
            <Input
              placeholder="Buscar tags..."
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Selected Tags */}
          {(selectedIncludedTags.length > 0 || selectedExcludedTags.length > 0) && (
            <div className="space-y-2">
              {selectedIncludedTags.length > 0 && (
                <div>
                  <Label className="text-sm text-green-600 dark:text-green-400">Incluir:</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedIncludedTags.map((tag) => (
                      <Badge key={tag.id} className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {tag.attributes.name.en}
                        <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => handleTagToggle(tag, "include")} />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {selectedExcludedTags.length > 0 && (
                <div>
                  <Label className="text-sm text-red-600 dark:text-red-400">Excluir:</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedExcludedTags.map((tag) => (
                      <Badge key={tag.id} className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        {tag.attributes.name.en}
                        <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => handleTagToggle(tag, "exclude")} />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tag Selection */}
          <div className="max-h-40 overflow-y-auto border rounded p-2">
            <div className="grid grid-cols-1 gap-2">
              {filteredTags.slice(0, 20).map((tag) => (
                <div key={tag.id} className="flex items-center justify-between">
                  <span className="text-sm">{tag.attributes.name.en}</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={selectedIncludedTags.some((t) => t.id === tag.id) ? "default" : "outline"}
                      onClick={() => handleTagToggle(tag, "include")}
                      className="h-6 px-2 text-xs"
                    >
                      +
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedExcludedTags.some((t) => t.id === tag.id) ? "destructive" : "outline"}
                      onClick={() => handleTagToggle(tag, "exclude")}
                      className="h-6 px-2 text-xs"
                    >
                      -
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label>Status</Label>
          <div className="grid grid-cols-2 gap-2">
            {STATUS_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${option.value}`}
                  checked={filters.status.includes(option.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFilters((prev) => ({ ...prev, status: [...prev.status, option.value] }))
                    } else {
                      setFilters((prev) => ({ ...prev, status: prev.status.filter((s) => s !== option.value) }))
                    }
                  }}
                />
                <Label htmlFor={`status-${option.value}`} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Demografia */}
        <div className="space-y-2">
          <Label>Demografia</Label>
          <div className="grid grid-cols-2 gap-2">
            {DEMOGRAPHIC_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`demo-${option.value}`}
                  checked={filters.demographic.includes(option.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFilters((prev) => ({ ...prev, demographic: [...prev.demographic, option.value] }))
                    } else {
                      setFilters((prev) => ({
                        ...prev,
                        demographic: prev.demographic.filter((d) => d !== option.value),
                      }))
                    }
                  }}
                />
                <Label htmlFor={`demo-${option.value}`} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Content Rating */}
        <div className="space-y-2">
          <Label>Classificação de Conteúdo</Label>
          <div className="grid grid-cols-1 gap-2">
            {CONTENT_RATING_OPTIONS.map((option) => (
              <div key={option.value} className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${option.value}`}
                    checked={filters.contentRating.includes(option.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFilters((prev) => ({ ...prev, contentRating: [...prev.contentRating, option.value] }))
                      } else {
                        setFilters((prev) => ({
                          ...prev,
                          contentRating: prev.contentRating.filter((r) => r !== option.value),
                        }))
                      }
                    }}
                  />
                  <Label htmlFor={`rating-${option.value}`} className="text-sm">
                    {option.label}
                  </Label>
                </div>
                {option.sensitive && filters.contentRating.includes(option.value) && (
                  <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400 ml-6">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Conteúdo sensível - As capas serão exibidas com blur</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Ordenação */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Ordenar por</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, sortBy: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Ordem</Label>
            <Select
              value={filters.sortOrder}
              onValueChange={(value: "asc" | "desc") => setFilters((prev) => ({ ...prev, sortOrder: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Decrescente</SelectItem>
                <SelectItem value="asc">Crescente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-2">
          <Button
            onClick={handleSearch}
            className="flex-1 bg-manga-accent hover:bg-manga-accent/90"
            disabled={isLoading}
          >
            <Search className="w-4 h-4 mr-2" />
            {isLoading ? "Buscando..." : "Buscar"}
          </Button>
          <Button
            onClick={clearFilters}
            variant="outline"
            className="border-manga-secondary text-manga-secondary hover:bg-manga-secondary hover:text-white bg-transparent"
          >
            Limpar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

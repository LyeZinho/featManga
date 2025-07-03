"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Grid, Users, Heart, Zap, Sparkles, BookOpen, Sword, Crown, Flower, Coffee } from "lucide-react"
import { MangaDxAPI, type Manga } from "@/lib/mangadx-api"
import Link from "next/link"

interface Category {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  demographic: string
  count: string
}

const CATEGORIES: Category[] = [
  {
    id: "shounen",
    name: "Shounen",
    description: "Mangás voltados para jovens do sexo masculino, com foco em ação, aventura e amizade",
    icon: <Sword className="w-8 h-8" />,
    color: "bg-orange-500",
    demographic: "shounen",
    count: "2,500+",
  },
  {
    id: "seinen",
    name: "Seinen",
    description: "Mangás para homens adultos, com temas mais maduros e complexos",
    icon: <Crown className="w-8 h-8" />,
    color: "bg-purple-500",
    demographic: "seinen",
    count: "1,800+",
  },
  {
    id: "shoujo",
    name: "Shoujo",
    description: "Mangás voltados para jovens do sexo feminino, focando em romance e relacionamentos",
    icon: <Flower className="w-8 h-8" />,
    color: "bg-pink-500",
    demographic: "shoujo",
    count: "1,200+",
  },
  {
    id: "josei",
    name: "Josei",
    description: "Mangás para mulheres adultas, com romances mais realistas e temas maduros",
    icon: <Coffee className="w-8 h-8" />,
    color: "bg-indigo-500",
    demographic: "josei",
    count: "800+",
  },
]

const GENRE_CATEGORIES = [
  {
    id: "action",
    name: "Ação",
    description: "Mangás cheios de lutas, batalhas e sequências de ação emocionantes",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-red-500",
    tags: ["Action"],
    count: "3,200+",
  },
  {
    id: "romance",
    name: "Romance",
    description: "Histórias de amor, relacionamentos e desenvolvimento romântico",
    icon: <Heart className="w-6 h-6" />,
    color: "bg-pink-400",
    tags: ["Romance"],
    count: "2,800+",
  },
  {
    id: "comedy",
    name: "Comédia",
    description: "Mangás divertidos que vão te fazer rir com situações hilárias",
    icon: <Sparkles className="w-6 h-6" />,
    color: "bg-yellow-500",
    tags: ["Comedy"],
    count: "2,100+",
  },
  {
    id: "fantasy",
    name: "Fantasia",
    description: "Mundos mágicos, criaturas fantásticas e aventuras épicas",
    icon: <BookOpen className="w-6 h-6" />,
    color: "bg-purple-400",
    tags: ["Fantasy"],
    count: "1,900+",
  },
  {
    id: "slice-of-life",
    name: "Slice of Life",
    description: "Histórias do cotidiano, focando na vida diária dos personagens",
    icon: <Coffee className="w-6 h-6" />,
    color: "bg-green-500",
    tags: ["Slice of Life"],
    count: "1,500+",
  },
  {
    id: "supernatural",
    name: "Sobrenatural",
    description: "Elementos sobrenaturais, poderes especiais e mistérios",
    icon: <Sparkles className="w-6 h-6" />,
    color: "bg-indigo-400",
    tags: ["Supernatural"],
    count: "1,300+",
  },
]

export default function CategoriesPage() {
  const [featuredManga, setFeaturedManga] = useState<Record<string, Manga[]>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadFeaturedManga = async () => {
      try {
        setIsLoading(true)

        // Load a few manga for each demographic category
        const promises = CATEGORIES.map(async (category) => {
          const response = await MangaDxAPI.searchManga({
            publicationDemographic: [category.demographic],
            limit: 4,
            order: { followedCount: "desc" },
          })
          return { category: category.id, manga: response.data }
        })

        const results = await Promise.allSettled(promises)
        const mangaByCategory: Record<string, Manga[]> = {}

        results.forEach((result, index) => {
          if (result.status === "fulfilled") {
            mangaByCategory[result.value.category] = result.value.manga
          } else {
            // Fallback with mock data
            mangaByCategory[CATEGORIES[index].id] = MangaDxAPI.getMockData(4).data
          }
        })

        setFeaturedManga(mangaByCategory)
      } catch (error) {
        console.error("Erro ao carregar mangás em destaque:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFeaturedManga()
  }, [])

  return (
    <div className="min-h-screen bg-manga-light dark:bg-manga-dark">
      {/* Header */}
      <div className="manga-gradient dark:text-white text-manga-dark py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Grid className="w-16 h-16 text-manga-accent dark:text-manga-accent-light mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Explorar por Categorias</h1>
            <p className="text-xl dark:text-gray-300 text-gray-700 max-w-2xl mx-auto">
              Descubra mangás organizados por demografia e gênero. Encontre exatamente o tipo de história que você
              procura.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Demographics Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-manga-dark dark:text-manga-light mb-4">Por Demografia</h2>
            <p className="text-manga-dark/70 dark:text-manga-light/70 max-w-2xl mx-auto">
              Mangás organizados pelo público-alvo principal, cada um com suas características únicas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {CATEGORIES.map((category) => (
              <Link key={category.id} href={`/categories/${category.id}`}>
                <Card className="manga-card-hover cursor-pointer h-full">
                  <CardHeader className="text-center">
                    <div
                      className={`
                        ${category.color}
                        text-white
                        dark:text-manga-dark
                        w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4
                        border-4 border-white dark:border-manga-light
                      `}
                      style={{
                        backgroundColor:
                          category.id === "shounen"
                            ? "#f59e42"
                            : category.id === "seinen"
                            ? "#a78bfa"
                            : category.id === "shoujo"
                            ? "#f472b6"
                            : "#6366f1",
                      }}
                    >
                      {category.icon}
                    </div>
                    <CardTitle className="text-manga-dark dark:text-manga-light">{category.name}</CardTitle>
                    <Badge variant="outline" className="mx-auto border-manga-accent dark:border-manga-accent-light text-manga-accent dark:text-manga-accent-light">
                      {category.count} mangás
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-manga-dark/70 dark:text-manga-light/70 text-center mb-4">{category.description}</p>
                    {/* Featured manga preview */}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Genres Section */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-manga-dark dark:text-manga-light mb-4">Por Gênero</h2>
            <p className="text-manga-dark/70 dark:text-manga-light/70 max-w-2xl mx-auto">
              Explore mangás pelos gêneros mais populares e encontre suas histórias favoritas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GENRE_CATEGORIES.map((genre) => (
              <Link key={genre.id} href={`/search?genre=${genre.id}`}>
                <Card className="manga-card-hover cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`
                          ${genre.color}
                          text-white
                          dark:text-manga-dark
                          w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
                          border-4 border-white dark:border-manga-light
                        `}
                        style={{
                          backgroundColor:
                            genre.id === "action"
                              ? "#ef4444"
                              : genre.id === "romance"
                              ? "#f472b6"
                              : genre.id === "comedy"
                              ? "#facc15"
                              : genre.id === "fantasy"
                              ? "#a78bfa"
                              : genre.id === "slice-of-life"
                              ? "#22c55e"
                              : "#818cf8",
                        }}
                      >
                        {genre.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-manga-dark dark:text-manga-light">{genre.name}</h3>
                          <Badge variant="outline" className="text-xs border-manga-accent dark:border-manga-accent-light text-manga-accent dark:text-manga-accent-light">
                            {genre.count}
                          </Badge>
                        </div>
                        <p className="text-sm text-manga-dark/70 dark:text-manga-light/70">{genre.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-8">
              <Users className="w-16 h-16 text-manga-accent dark:text-manga-accent-light mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-manga-dark dark:text-manga-light mb-4">Não Encontrou o Que Procura?</h3>
              <p className="text-manga-dark/70 dark:text-manga-light/70 mb-6">
                Use nossa busca avançada para combinar múltiplos gêneros e encontrar exatamente o que você quer ler
              </p>
              <Link href="/search">
                <Button size="lg" className="bg-manga-accent dark:bg-manga-accent-light hover:bg-manga-accent/90 dark:hover:bg-manga-accent-light/90 text-white dark:text-manga-dark">
                  <Grid className="w-5 h-5 mr-2" />
                  Busca Avançada
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

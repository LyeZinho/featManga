"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MangaCard } from "@/components/manga-card"
import { TrendingUp, Star, Clock, Search, BookOpen } from "lucide-react"
import { MangaDxAPI, type Manga } from "@/lib/mangadx-api"
import Link from "next/link"

export default function HomePage() {
  const [popularManga, setPopularManga] = useState<Manga[]>([])
  const [recentManga, setRecentManga] = useState<Manga[]>([])
  const [topRatedManga, setTopRatedManga] = useState<Manga[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMangaData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log("Carregando dados dos mangás...")

        const [popularResponse, recentResponse, topRatedResponse] = await Promise.allSettled([
          MangaDxAPI.getPopularManga(12),
          MangaDxAPI.getRecentlyUpdated(12),
          MangaDxAPI.getTopRated(12),
        ])

        if (popularResponse.status === "fulfilled") {
          setPopularManga(popularResponse.value.data)
        } else {
          console.error("Erro ao carregar mangás populares:", popularResponse.reason)
        }

        if (recentResponse.status === "fulfilled") {
          setRecentManga(recentResponse.value.data)
        } else {
          console.error("Erro ao carregar mangás recentes:", recentResponse.reason)
        }

        if (topRatedResponse.status === "fulfilled") {
          setTopRatedManga(topRatedResponse.value.data)
        } else {
          console.error("Erro ao carregar mangás bem avaliados:", topRatedResponse.reason)
        }

        console.log("Dados carregados com sucesso!")
      } catch (error) {
        console.error("Erro geral ao carregar dados:", error)
        setError("Erro ao carregar dados. Usando dados de exemplo.")
      } finally {
        setIsLoading(false)
      }
    }

    loadMangaData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-manga-light">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-manga-accent mx-auto mb-4"></div>
              <p className="text-manga-dark">Carregando mangás...</p>
              {error && <p className="text-manga-accent text-sm mt-2">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-manga-light">
      {/* Hero Section */}
      <section className="manga-gradient text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            feat<span className="text-manga-secondary">Manga</span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Descubra os melhores mangás com recomendações personalizadas baseadas em seus gostos e interesses
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/search">
              <Button size="lg" className="bg-manga-secondary hover:bg-manga-secondary/90">
                <Search className="w-5 h-5 mr-2" />
                Buscar Mangás
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-manga-dark bg-transparent"
              asChild
            >
              <Link href="/categories">
                <BookOpen className="w-5 h-5 mr-2" />
                Explorar Categorias
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Error Message */}
        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            <p className="text-sm">
              <strong>Aviso:</strong> {error} A funcionalidade completa será restaurada quando a conexão com a API for
              estabelecida.
            </p>
          </div>
        )}

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
            <CardContent className="pt-6">
              <TrendingUp className="w-12 h-12 text-manga-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-manga-dark dark:text-white mb-2">10,000+</h3>
              <p className="text-manga-dark/70 dark:text-manga-light/80">Mangás Disponíveis</p>
            </CardContent>
            </Card>
            <Card className="text-center">
            <CardContent className="pt-6">
              <Star className="w-12 h-12 text-manga-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-manga-dark dark:text-white mb-2">4.8/5</h3>
              <p className="text-manga-dark/70 dark:text-manga-light/80">Avaliação Média</p>
            </CardContent>
            </Card>
            <Card className="text-center">
            <CardContent className="pt-6">
              <Clock className="w-12 h-12 text-manga-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-manga-dark dark:text-white mb-2">Diário</h3>
              <p className="text-manga-dark/70 dark:text-manga-light/80">Atualizações</p>
            </CardContent>
            </Card>
        </section>

        {/* Popular Manga */}
        {popularManga.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-manga-accent" />
                <h2 className="text-3xl font-bold text-manga-dark">Mais Populares</h2>
              </div>
              <Badge className="bg-manga-accent text-white">Mais Seguidos</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {popularManga.map((manga) => (
                <MangaCard key={manga.id} manga={manga} showStats />
              ))}
            </div>
          </section>
        )}

        {/* Recently Updated */}
        {recentManga.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-manga-secondary" />
                <h2 className="text-3xl font-bold text-manga-dark">Atualizados Recentemente</h2>
              </div>
              <Badge className="bg-manga-secondary text-white">Novos Capítulos</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {recentManga.map((manga) => (
                <MangaCard key={manga.id} manga={manga} />
              ))}
            </div>
          </section>
        )}

        {/* Top Rated */}
        {topRatedManga.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 text-manga-accent" />
                <h2 className="text-3xl font-bold text-manga-dark">Melhores Avaliados</h2>
              </div>
              <Badge className="bg-manga-accent text-white">Top Rating</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {topRatedManga.map((manga) => (
                <MangaCard key={manga.id} manga={manga} showStats />
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="text-center py-12">
            <Card className="max-w-2xl mx-auto bg-manga-primary dark:bg-manga-dark text-white shadow-lg">
            <CardContent className="pt-8">
              <h3 className="text-2xl font-bold mb-4">Encontre Seu Próximo Mangá Favorito</h3>
              <p className="mb-6 opacity-90">
              Use nossos filtros avançados para descobrir mangás que combinam perfeitamente com seus gostos
              </p>
              <Link href="/search">
              <Button
                size="lg"
                className="bg-white text-manga-primary dark:bg-manga-accent dark:text-white hover:bg-manga-accent hover:text-white dark:hover:bg-manga-primary dark:hover:text-white"
              >
                <Search className="w-5 h-5 mr-2" />
                Começar Busca Personalizada
              </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

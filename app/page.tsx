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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-foreground">Carregando mangás...</p>
              {error && <p className="text-destructive text-sm mt-2">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="manga-gradient text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background/20 to-transparent"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl font-bold mb-6 text-white animate-fade-in">
            feat<span className="text-accent">Manga</span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Descubra os melhores mangás com recomendações personalizadas baseadas em seus gostos e interesses
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/search">
              <Button size="lg" className="bg-primary hover:bg-primary/80 text-primary-foreground tokyo-glow">
                <Search className="w-5 h-5 mr-2" />
                Buscar Mangás
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-background bg-transparent"
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
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded mb-6">
            <p className="text-sm">
              <strong>Aviso:</strong> {error} A funcionalidade completa será restaurada quando a conexão com a API for
              estabelecida.
            </p>
          </div>
        )}

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center bg-card border-border tokyo-glow">
            <CardContent className="pt-6">
              <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-card-foreground mb-2">10,000+</h3>
              <p className="text-muted-foreground">Mangás Disponíveis</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-card border-border tokyo-glow">
            <CardContent className="pt-6">
              <Star className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-card-foreground mb-2">4.8/5</h3>
              <p className="text-muted-foreground">Avaliação Média</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-card border-border tokyo-glow">
            <CardContent className="pt-6">
              <Clock className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-card-foreground mb-2">Diário</h3>
              <p className="text-muted-foreground">Atualizações</p>
            </CardContent>
          </Card>
        </section>

        {/* Popular Manga */}
        {popularManga.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">Mais Populares</h2>
              </div>
              <Badge className="bg-primary text-primary-foreground hover:bg-primary/80">Mais Seguidos</Badge>
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
                <Clock className="w-6 h-6 text-accent" />
                <h2 className="text-3xl font-bold text-foreground">Atualizados Recentemente</h2>
              </div>
              <Badge className="bg-accent text-accent-foreground hover:bg-accent/80">Novos Capítulos</Badge>
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
                <Star className="w-6 h-6 text-secondary" />
                <h2 className="text-3xl font-bold text-foreground">Melhores Avaliados</h2>
              </div>
              <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary/80">Top Rating</Badge>
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
          <Card className="max-w-2xl mx-auto bg-card border-border tokyo-glow">
            <CardContent className="pt-8">
              <h3 className="text-2xl font-bold text-card-foreground mb-4">Encontre Seu Próximo Mangá Favorito</h3>
              <p className="text-muted-foreground mb-6">
                Use nossos filtros avançados para descobrir mangás que combinam perfeitamente com seus gostos
              </p>
              <Link href="/search">
                <Button size="lg" className="bg-primary hover:bg-primary/80 text-primary-foreground tokyo-glow">
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

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MangaCard } from "@/components/manga-card"
import { TrendingUp, FlameIcon as Fire, Star, Clock, Users, Calendar } from "lucide-react"
import { MangaDxAPI, type Manga } from "@/lib/mangadx-api"

interface TrendingSection {
  title: string
  description: string
  icon: React.ReactNode
  manga: Manga[]
  badge: string
  color: string
}

export default function TrendingPage() {
  const [trendingSections, setTrendingSections] = useState<TrendingSection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "all">("week")

  useEffect(() => {
    const loadTrendingData = async () => {
      try {
        setIsLoading(true)

        const [popularResponse, topRatedResponse, recentResponse] = await Promise.allSettled([
          MangaDxAPI.searchManga({
            order: { followedCount: "desc" },
            limit: 12,
            contentRating: ["safe", "suggestive"],
          }),
          MangaDxAPI.searchManga({
            order: { rating: "desc" },
            limit: 12,
            contentRating: ["safe", "suggestive"],
          }),
          MangaDxAPI.searchManga({
            order: { latestUploadedChapter: "desc" },
            limit: 12,
            contentRating: ["safe", "suggestive"],
          }),
        ])

        const sections: TrendingSection[] = [
          {
            title: "Mais Populares da Semana",
            description: "Os mangás que mais ganharam seguidores recentemente",
            icon: <Fire className="w-6 h-6" />,
            manga:
              popularResponse.status === "fulfilled" ? popularResponse.value.data : MangaDxAPI.getMockData(12).data,
            badge: "🔥 Hot",
            color: "bg-red-500",
          },
          {
            title: "Melhores Avaliados",
            description: "Mangás com as maiores notas da comunidade",
            icon: <Star className="w-6 h-6" />,
            manga:
              topRatedResponse.status === "fulfilled" ? topRatedResponse.value.data : MangaDxAPI.getMockData(12).data,
            badge: "⭐ Top Rated",
            color: "bg-yellow-500",
          },
          {
            title: "Atualizados Recentemente",
            description: "Novos capítulos que acabaram de sair",
            icon: <Clock className="w-6 h-6" />,
            manga: recentResponse.status === "fulfilled" ? recentResponse.value.data : MangaDxAPI.getMockData(12).data,
            badge: "🆕 Fresh",
            color: "bg-green-500",
          },
        ]

        setTrendingSections(sections)
      } catch (error) {
        console.error("Erro ao carregar dados trending:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTrendingData()
  }, [selectedPeriod])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-manga-light">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-manga-accent mx-auto mb-4"></div>
              <p className="text-manga-dark">Carregando tendências...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-manga-light">
      {/* Header */}
      <div className="manga-gradient text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <TrendingUp className="w-16 h-16 text-manga-secondary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Trending Mangás</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Descubra os mangás que estão fazendo sucesso agora. Acompanhe as tendências e não perca nenhuma novidade!
            </p>

            {/* Period Selector */}
            {/* <div className="flex justify-center gap-2">
              <Button
                variant={selectedPeriod === "week" ? "secondary" : "outline"}
                onClick={() => setSelectedPeriod("week")}
                className="border-white text-white hover:bg-white hover:text-manga-dark"
              >
                Esta Semana
              </Button>
              <Button
                variant={selectedPeriod === "month" ? "secondary" : "outline"}
                onClick={() => setSelectedPeriod("month")}
                className="border-white text-white hover:bg-white hover:text-manga-dark"
              >
                Este Mês
              </Button>
              <Button
                variant={selectedPeriod === "all" ? "secondary" : "outline"}
                onClick={() => setSelectedPeriod("all")}
                className="border-white text-white hover:bg-white hover:text-manga-dark"
              >
                Todos os Tempos
              </Button>
            </div> */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Fire className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-manga-dark mb-2">1,250</h3>
              <p className="text-manga-dark/70">Mangás Trending</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="w-12 h-12 text-manga-secondary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-manga-dark mb-2">45.2K</h3>
              <p className="text-manga-dark/70">Novos Seguidores</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Calendar className="w-12 h-12 text-manga-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-manga-dark mb-2">328</h3>
              <p className="text-manga-dark/70">Novos Capítulos</p>
            </CardContent>
          </Card>
        </section>

        {/* Trending Sections */}
        {trendingSections.map((section, index) => (
          <section key={index} className="mb-16">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`${section.color} text-white w-12 h-12 rounded-lg flex items-center justify-center`}
                    >
                      {section.icon}
                    </div>
                    <div>
                      <CardTitle className="text-manga-dark text-2xl">{section.title}</CardTitle>
                      <p className="text-manga-dark/70">{section.description}</p>
                    </div>
                  </div>
                  <Badge className={`${section.color} text-white`}>{section.badge}</Badge>
                </div>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {section.manga.map((manga, mangaIndex) => (
                <div key={manga.id} className="relative">
                  <MangaCard manga={manga} showStats />
                  {/* Ranking Badge */}
                  <div
                    className={`absolute -top-2 -left-2 ${section.color} text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10`}
                  >
                    {mangaIndex + 1}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* CTA Section */}
        <section className="text-center py-12">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-8">
              <TrendingUp className="w-16 h-16 text-manga-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-manga-dark mb-4">Quer Descobrir Mais?</h3>
              <p className="text-manga-dark/70 mb-6">
                Use nossa busca avançada para encontrar mangás específicos ou explore por categorias
              </p>
              <div className="flex gap-4 justify-center">
                <Button className="bg-manga-accent hover:bg-manga-accent/90">Busca Avançada</Button>
                <Button
                  variant="outline"
                  className="border-manga-secondary text-manga-secondary hover:bg-manga-secondary hover:text-white bg-transparent"
                >
                  Ver Categorias
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

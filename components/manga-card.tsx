"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Users, Calendar, Eye, EyeOff, ExternalLink } from "lucide-react"
import { type Manga, MangaDxAPI } from "@/lib/mangadx-api"

interface MangaCardProps {
  manga: Manga
  showStats?: boolean
  hasSensitiveContent?: boolean
}

export function MangaCard({ manga, showStats = false, hasSensitiveContent }: MangaCardProps) {
  const [showSensitive, setShowSensitive] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [imageError, setImageError] = useState(false)

  const title = MangaDxAPI.getTitle(manga)
  const description = MangaDxAPI.getDescription(manga)
  const coverFileName = MangaDxAPI.getCoverArt(manga)
  const mangaDxUrl = `https://mangadex.org/title/${manga.id}`

  // Check if content is sensitive
  const isSensitive = hasSensitiveContent || manga.attributes.contentRating === "pornographic"

  // Generate cover URL with better error handling
  const getCoverUrl = () => {
    if (!coverFileName || coverFileName.includes("mock") || imageError) {
      return `/placeholder.svg?height=300&width=200&text=${encodeURIComponent(title.slice(0, 15))}`
    }

    return `https://uploads.mangadex.org/covers/${manga.id}/${coverFileName}`
  }

  const coverUrl = getCoverUrl()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "bg-blue-500 hover:bg-blue-400"
      case "completed":
        return "bg-green-500 hover:bg-green-400"
      case "hiatus":
        return "bg-yellow-500 hover:bg-yellow-400"
      case "cancelled":
        return "bg-red-500 hover:bg-red-400"
      default:
        return "bg-muted hover:bg-muted/80"
    }
  }

  const getDemographicColor = (demo: string | null) => {
    switch (demo) {
      case "shounen":
        return "bg-orange-500 hover:bg-orange-400"
      case "seinen":
        return "bg-purple-500 hover:bg-purple-400"
      case "shoujo":
        return "bg-pink-500 hover:bg-pink-400"
      case "josei":
        return "bg-blue-500 hover:bg-blue-400"
      default:
        return "bg-muted hover:bg-muted/80"
    }
  }

  const handleImageClick = () => {
    if (isSensitive && !showSensitive) {
      setShowConfirmDialog(true)
    } else {
      window.open(mangaDxUrl, "_blank")
    }
  }

  const handleConfirmSensitive = () => {
    setShowSensitive(true)
    setShowConfirmDialog(false)
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on buttons or sensitive content overlay
    if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest(".sensitive-overlay")) {
      return
    }
    window.open(mangaDxUrl, "_blank")
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <>
      <Card
        className="manga-card-hover overflow-hidden cursor-pointer transition-all duration-300 group"
        onClick={handleCardClick}
      >
        <div className="relative">
          <img
            src={coverUrl || "/placeholder.svg"}
            alt={title}
            className={`w-full h-64 object-cover transition-all duration-300 group-hover:scale-105 ${
              isSensitive && !showSensitive ? "blur-lg" : ""
            }`}
            onError={handleImageError}
            loading="lazy"
          />

          {/* Sensitive Content Overlay */}
          {isSensitive && !showSensitive && (
            <div
              className="sensitive-overlay absolute inset-0 bg-background/80 flex items-center justify-center cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                handleImageClick()
              }}
            >
              <div className="text-center text-foreground p-4">
                <EyeOff className="w-8 h-8 mx-auto mb-2 text-destructive" />
                <p className="text-sm font-medium">Conteúdo Sensível</p>
                <p className="text-xs text-muted-foreground">Clique para visualizar</p>
              </div>
            </div>
          )}

          {/* External Link Icon */}
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="secondary"
              className="h-6 w-6 p-0 bg-background/80 hover:bg-primary text-foreground hover:text-primary-foreground border-0"
              onClick={(e) => {
                e.stopPropagation()
                window.open(mangaDxUrl, "_blank")
              }}
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>

          {/* Status and Demographic Badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <Badge className={`${getStatusColor(manga.attributes.status)} text-white text-xs border-0`}>
              {manga.attributes.status}
            </Badge>
            {manga.attributes.publicationDemographic && (
              <Badge
                className={`${getDemographicColor(manga.attributes.publicationDemographic)} text-white text-xs border-0`}
              >
                {manga.attributes.publicationDemographic}
              </Badge>
            )}
            {isSensitive && (
              <Badge className="bg-destructive hover:bg-destructive/80 text-white text-xs border-0">18+</Badge>
            )}
          </div>

          {/* Show/Hide Sensitive Content Button */}
          {isSensitive && (
            <div className="absolute bottom-2 right-2">
              <Button
                size="sm"
                variant="secondary"
                className="h-6 px-2 text-xs bg-background/80 hover:bg-primary text-foreground hover:text-primary-foreground border-0"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowSensitive(!showSensitive)
                }}
              >
                {showSensitive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </Button>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-bold text-card-foreground mb-2 line-clamp-2 text-sm group-hover:text-primary transition-colors">
            {title}
          </h3>

          <p className="text-xs text-muted-foreground mb-3 line-clamp-3">{description}</p>

          <div className="flex flex-wrap gap-1 mb-3">
            {manga.attributes.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {tag.attributes.name.en}
              </Badge>
            ))}
            {manga.attributes.tags.length > 3 && (
              <Badge variant="outline" className="text-xs border-muted text-muted-foreground">
                +{manga.attributes.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowConfirmDialog(false)}
        >
          <Card className="max-w-md mx-4 bg-card border-border tokyo-glow" onClick={(e) => e.stopPropagation()}>
            <CardContent className="pt-6">
              <div className="text-center">
                <EyeOff className="w-12 h-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-card-foreground">Conteúdo Sensível</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Este mangá contém conteúdo adulto. Deseja realmente visualizar?
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmDialog(false)}
                    className="border-border text-card-foreground hover:bg-muted"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleConfirmSensitive}
                    className="bg-destructive hover:bg-destructive/80 text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Mostrar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

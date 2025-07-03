import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Users, Calendar, Eye, EyeOff } from "lucide-react"
import { type Manga, MangaDxAPI } from "@/lib/mangadx-api"
import { useState } from "react"
import { AdultContentConfirmation } from "@/components/adult-content-confirmation"
import { useAdultContent } from "@/lib/adult-content-context"

interface MangaCardProps {
  manga: Manga
  showStats?: boolean
}

export function MangaCard({ manga, showStats = false }: MangaCardProps) {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { showAdultContent } = useAdultContent()
  const title = MangaDxAPI.getTitle(manga)
  const description = MangaDxAPI.getDescription(manga)
  const coverFileName = MangaDxAPI.getCoverArt(manga)

  // Check if content is pornographic
  const isPornographic = manga.attributes.contentRating === "pornographic"
  const shouldBlur = isPornographic && !showAdultContent

  // Use placeholder for mock data or when cover is not available
  const coverUrl =
    coverFileName && !coverFileName.includes("mock")
      ? MangaDxAPI.getCoverUrl(manga.id, coverFileName, 256)
      : `/placeholder.svg?height=300&width=200&text=${encodeURIComponent(title.slice(0, 20))}`

  const handleViewAdultContent = () => {
    setShowConfirmation(true)
  }

  const handleConfirmAdultContent = () => {
    // Content will be shown automatically when showAdultContent context updates
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "bg-green-500"
      case "completed":
        return "bg-blue-500"
      case "hiatus":
        return "bg-yellow-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getDemographicColor = (demo: string | null) => {
    switch (demo) {
      case "shounen":
        return "bg-orange-500"
      case "seinen":
        return "bg-purple-500"
      case "shoujo":
        return "bg-pink-500"
      case "josei":
        return "bg-indigo-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="manga-card-hover overflow-hidden border-border bg-card">
      <div className="relative">
        <img
          src={coverUrl || "/placeholder.svg"}
          alt={title}
          className={`w-full h-64 object-cover ${
            shouldBlur ? "blur-md" : ""
          }`}
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = `/placeholder.svg?height=300&width=200&text=${encodeURIComponent(title.slice(0, 15))}`
          }}
        />
        
        {/* Blur overlay and confirmation button for pornographic content */}
        {shouldBlur && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <EyeOff className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm mb-3 font-medium">Conteúdo Adulto</p>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleViewAdultContent}
                className="bg-white/90 text-black hover:bg-white"
              >
                <Eye className="w-4 h-4 mr-1" />
                Visualizar
              </Button>
            </div>
          </div>
        )}

        {/* Content rating badge for pornographic content */}
        {isPornographic && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-red-600 text-white text-xs">
              18+
            </Badge>
          </div>
        )}
        
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <Badge className={`${getStatusColor(manga.attributes.status)} text-white text-xs`}>
            {manga.attributes.status}
          </Badge>
          {manga.attributes.publicationDemographic && (
            <Badge className={`${getDemographicColor(manga.attributes.publicationDemographic)} text-white text-xs`}>
              {manga.attributes.publicationDemographic}
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-bold text-manga-text-primary mb-2 line-clamp-2 text-sm">{title}</h3>

        <p className="text-xs text-manga-text-secondary mb-3 line-clamp-3">{description}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {manga.attributes.tags.slice(0, 3).map((tag) => (
            <Badge key={tag.id} variant="outline" className="text-xs border-manga-secondary text-manga-secondary">
              {tag.attributes.name.en}
            </Badge>
          ))}
          {manga.attributes.tags.length > 3 && (
            <Badge variant="outline" className="text-xs border-border text-muted-foreground">
              +{manga.attributes.tags.length - 3}
            </Badge>
          )}
        </div>

        {showStats && (
          <div className="flex items-center justify-between text-xs text-manga-text-muted">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              <span>8.5</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>12.5k</span>
            </div>
            {manga.attributes.year && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{manga.attributes.year}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      {/* Adult Content Confirmation Modal */}
      <AdultContentConfirmation
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmAdultContent}
        title={`Visualizar "${title}"`}
      />
    </Card>
  )
}

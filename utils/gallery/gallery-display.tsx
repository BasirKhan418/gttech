"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Play, ImageIcon } from "lucide-react"
import Image from "next/image"

interface GalleryItem {
  _id: string
  type: "image" | "video"
  title: string
  description?: string
  images?: string[]
  videoUrl?: string
  thumbnail?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface GalleryDisplayProps {
  onEdit: (item: GalleryItem) => void
  onDelete: (item: GalleryItem) => void
}

export function GalleryDisplay({ onEdit, onDelete }: GalleryDisplayProps) {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGalleryItems()
  }, [])

  const fetchGalleryItems = async () => {
    try {
      const response = await fetch("/api/gallery")
      const data = await response.json();
      setGalleryItems(data.data)
    } catch (error) {
      console.error("Error fetching gallery items:", error)
    } finally {
      setLoading(false)
    }
  }

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }

  const getYouTubeThumbnail = (url: string) => {
    const videoId = getYouTubeVideoId(url)
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-muted rounded-t-lg"></div>
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gallery Items</h2>
        <Badge variant="secondary">{galleryItems.length} items</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item) => (
          <Card key={item._id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 bg-muted">
              {item.type === "image" && item.images && item.images.length > 0 ? (
                <div className="relative w-full h-full">
                  <img src={item.images[0] || "/placeholder.svg"} alt={item.title} className="object-cover" />
                  {item.images.length > 1 && (
                    <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                      +{item.images.length - 1} more
                    </Badge>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      Image
                    </Badge>
                  </div>
                </div>
              ) : item.type === "video" && item.videoUrl ? (
                <div className="relative w-full h-full">
                  <img
                    src={
                      item.thumbnail ||
                      getYouTubeThumbnail(item.videoUrl) ||
                      "/placeholder.svg?height=200&width=300&query=video thumbnail" ||
                      "/placeholder.svg"
                    }
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/70 rounded-full p-3">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Play className="w-3 h-3" />
                      Video
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <ImageIcon className="w-12 h-12" />
                </div>
              )}
            </div>

            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-1">{item.title}</CardTitle>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(item)} className="h-8 w-8 p-0">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(item)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {item.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                <Badge variant={item.isActive ? "default" : "secondary"}>{item.isActive ? "Active" : "Inactive"}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {galleryItems.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No gallery items found</h3>
          <p className="text-muted-foreground">Start by adding your first gallery item.</p>
        </div>
      )}
    </div>
  )
}

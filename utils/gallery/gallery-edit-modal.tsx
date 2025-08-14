"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { X, Upload, ImageIcon, Video, Loader2 } from "lucide-react"
import { toast } from "sonner"
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

interface GalleryEditModalProps {
  item: GalleryItem
  onClose: () => void
  onSuccess: () => void
}

export function GalleryEditModal({ item, onClose, onSuccess }: GalleryEditModalProps) {
  const [type, setType] = useState<"image" | "video">(item.type)
  const [title, setTitle] = useState(item.title)
  const [description, setDescription] = useState(item.description || "")
  const [isActive, setIsActive] = useState(item.isActive)
  const [videoUrl, setVideoUrl] = useState(item.videoUrl || "")
  const [thumbnail, setThumbnail] = useState(item.thumbnail || "")
  const [existingImages, setExistingImages] = useState<string[]>(item.images || [])
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)



  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const imageFiles = files.filter((file) => file.type.startsWith("image/"))

    if (existingImages.length + newFiles.length + imageFiles.length > 10) {
     toast.error("You can only upload up to 10 images per album.")
      return
    }

    setNewFiles((prev) => [...prev, ...imageFiles])
  }

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index))
  }

  const uploadNewFiles = async () => {
    if (newFiles.length === 0) return []

    setUploading(true)
    const uploadedUrls: string[] = []

    try {
      for (const file of newFiles) {
        const signedUrlResponse = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
          }),
        })

        if (!signedUrlResponse.ok) {
          throw new Error("Failed to get upload URL")
        }

        const { uploadURL, fileURL } = await signedUrlResponse.json()

        // Upload file to S3
        const uploadResponse = await fetch(uploadURL, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        })

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload file")
        }

        uploadedUrls.push(fileURL)
      }

      return uploadedUrls
    } catch (error) {
      console.error("Upload error:", error)
     toast.error("Failed to upload images. Please try again.")
      return []
    } finally {
      setUploading(false)
    }
  }

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }

  const generateYouTubeThumbnail = () => {
    if (videoUrl && !thumbnail) {
      const videoId = getYouTubeVideoId(videoUrl)
      if (videoId) {
        setThumbnail(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error("Please enter a title for your gallery item.")
      return
    }

    if (type === "image" && existingImages.length === 0 && newFiles.length === 0) {
      toast.error("Please keep at least one image for the album.")
      return
    }

    if (type === "video" && !videoUrl.trim()) {
      toast.error("YouTube URL is required for video gallery")
      return
    }

    setSubmitting(true)

    try {
      let finalImages = existingImages

      // Upload new files if any
      if (type === "image" && newFiles.length > 0) {
        const newUploadedImages = await uploadNewFiles()
        if (newUploadedImages.length === 0 && newFiles.length > 0) {
          setSubmitting(false)
          return
        }
        finalImages = [...existingImages, ...newUploadedImages]
      }

      const payload = {
        id: item._id,
        type,
        title: title.trim(),
        description: description.trim() || undefined,
        isActive,
        ...(type === "image"
          ? { images: finalImages }
          : {
              videoUrl: videoUrl.trim(),
              thumbnail: thumbnail.trim() || undefined,
            }),
      }

      const response = await fetch("/api/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast.success("Gallery item updated successfully!")
        onSuccess()
        onClose()
      } else {
        throw new Error("Failed to update gallery item")
      }
    } catch (error) {
      console.error("Submit error:", error)
     toast.error("Failed to update gallery item. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Edit Gallery Item</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selection */}
            <div className="space-y-3">
              <Label>Content Type</Label>
              <RadioGroup value={type} onValueChange={(value: "image" | "video") => setType(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="image" id="image" />
                  <Label htmlFor="image" className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Image Album
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video" id="video" />
                  <Label htmlFor="video" className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Video
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter gallery item title"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description (optional)"
                rows={3}
              />
            </div>

            {/* Image Management */}
            {type === "image" && (
              <div className="space-y-4">
                <Label>Images (up to 10)</Label>

                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Current Images</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {existingImages.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                            <img
                              src={imageUrl || "/placeholder.svg"}
                              alt={`Image ${index + 1}`}
                              width={200}
                              height={200}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeExistingImage(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add New Images */}
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to add more images</p>
                  </Label>
                </div>

                {/* New Files Preview */}
                {newFiles.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">New Images to Add</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {newFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                            <Image
                              src={URL.createObjectURL(file) || "/placeholder.svg"}
                              alt={file.name}
                              width={200}
                              height={200}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeNewFile(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                          <p className="text-xs text-muted-foreground mt-1 truncate">{file.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Video URL */}
            {type === "video" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="videoUrl">YouTube URL *</Label>
                  <Input
                    id="videoUrl"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    onBlur={generateYouTubeThumbnail}
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Custom Thumbnail URL</Label>
                  <Input
                    id="thumbnail"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    placeholder="https://example.com/thumbnail.jpg (optional)"
                  />
                  <p className="text-xs text-muted-foreground">Leave empty to use YouTube's default thumbnail</p>
                </div>
              </div>
            )}

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="isActive">Active (visible to users)</Label>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || uploading}>
                {submitting || uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {uploading ? "Uploading..." : "Updating..."}
                  </>
                ) : (
                  "Update Gallery Item"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

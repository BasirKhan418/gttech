"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Upload, X, Loader2, Sparkles } from "lucide-react"

interface Slider {
  _id: string
  title: string
  category: string
  description: string
  image?: string
  lastEditedAuthor: {
    _id: string
    name: string
    email: string
  }
  author: {
    _id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

interface SliderModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  slider?: Slider | null
  aiGeneratedData?: Partial<Slider> | null
}

export function SliderModal({ isOpen, onClose, onSuccess, slider, aiGeneratedData }: SliderModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    image: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
 

  useEffect(() => {
    if (slider) {
      setFormData({
        title: slider.title,
        category: slider.category,
        description: slider.description,
        image: slider.image || "",
      })
    } else if (aiGeneratedData) {
      setFormData({
        title: aiGeneratedData.title || "",
        category: aiGeneratedData.category || "",
        description: aiGeneratedData.description || "",
        image: aiGeneratedData.image || "",
      })
    } else {
      setFormData({
        title: "",
        category: "",
        description: "",
        image: "",
      })
    }
  }, [slider, aiGeneratedData, isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.success("Please select a valid image file")
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB")
      return
    }

    try {
      setIsUploading(true)

      // Get signed URL
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      })

      const uploadData = await uploadResponse.json()

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || "Failed to get upload URL")
      }

      // Upload file to S3
      const s3Response = await fetch(uploadData.uploadURL, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      })

      if (!s3Response.ok) {
        throw new Error("Failed to upload image")
      }

      setFormData((prev) => ({ ...prev, image: uploadData.fileURL }))
      toast.success("Image uploaded successfully")
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.category.trim() || !formData.description.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setIsSubmitting(true)

      const url = "/api/slider"
      const method = slider ? "PUT" : "POST"
      const body = slider ? { ...formData, id: slider._id } : formData

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`Slider ${slider ? "updated" : "created"} successfully`)
        onSuccess()
      } else {
        toast.error(data.message || `Failed to ${slider ? "update" : "create"} slider`)
      }
    } catch (error) {
      toast.error("Failed to upload image")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {aiGeneratedData && <Sparkles className="h-4 w-4 text-primary" />}
            {slider ? "Edit Slider" : aiGeneratedData ? "AI Generated Slider" : "Create New Slider"}
          </DialogTitle>
          {aiGeneratedData && (
            <p className="text-sm text-muted-foreground">Review and customize the AI-generated content below</p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter slider title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="Enter category"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter slider description"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            {formData.image ? (
              <div className="relative">
                <div className="w-full h-48 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={formData.image || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <div className="mt-4">
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <span className="text-sm font-medium text-primary hover:text-primary/80">Click to upload</span>
                      <span className="text-sm text-muted-foreground"> or drag and drop</span>
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto bg-transparent"
              disabled={isSubmitting || isUploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isUploading} className="w-full sm:w-auto">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUploading ? "Uploading..." : isSubmitting ? "Saving..." : slider ? "Update Slider" : "Create Slider"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

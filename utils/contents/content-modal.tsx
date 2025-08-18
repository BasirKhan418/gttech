"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Upload, Plus } from "lucide-react"
import { Toaster,toast } from "sonner"

interface Content {
  _id?: string
  sectionName: string
  title: string
  description: string
  poster: string
  images: string[]
  lists: string[]
  designType: string
}

interface ContentModalProps {
  isOpen: boolean
  onClose: () => void
  content: Content | null
  onSuccess: () => void
}

export function ContentModal({ isOpen, onClose, content, onSuccess }: ContentModalProps) {
  const [formData, setFormData] = useState<Content>({
    sectionName: "",
    title: "",
    description: "",
    poster: "",
    images: [],
    lists: [],
    designType: "default",
  })
  const [newListItem, setNewListItem] = useState("")
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Available sections
  const sections = [
    { value: "solutions", label: "Technology Solutions" },
    { value: "consult", label: "Consulting Services" }
  ]

  useEffect(() => {
    if (content) {
      setFormData(content)
    } else {
      setFormData({
        sectionName: "",
        title: "",
        description: "",
        poster: "",
        images: [],
        lists: [],
        designType: "default",
      })
    }
  }, [content])

  const handleInputChange = (field: keyof Content, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const uploadFile = async (file: File): Promise<string> => {
    try {
      // Get signed URL
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      })

      const { uploadURL, fileURL } = await response.json()

      // Upload file to S3
      await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      })

      return fileURL
    } catch (error) {
      throw new Error("Failed to upload file")
    }
  }

  const handlePosterUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const fileURL = await uploadFile(file)
      console.log("Poster uploaded:", fileURL)
      setFormData((prev) => ({ ...prev, poster: fileURL }))
      toast.success("Poster uploaded successfully")
    } catch (error) {
      toast.error("Failed to upload poster")
    } finally {
      setUploading(false)
    }
  }

  const handleImagesUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    try {
      setUploading(true)
      const uploadPromises = files.map((file) => uploadFile(file))
      const fileURLs = await Promise.all(uploadPromises)

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...fileURLs],
      }))

      toast.success(`${files.length} image(s) uploaded successfully`)
    } catch (error) {
      toast.error("Failed to upload images")
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const addListItem = () => {
    if (newListItem.trim()) {
      setFormData((prev) => ({
        ...prev,
        lists: [...prev.lists, newListItem.trim()],
      }))
      setNewListItem("")
    }
  }

  const removeListItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      lists: prev.lists.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.sectionName || !formData.title || !formData.description) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setSaving(true)
      const url = "/api/content"
      const method = content?._id ? "PUT" : "POST"
      const body = content ? { ...formData, id: content._id } : formData
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`Content ${content ? "updated" : "created"} successfully`)
        onSuccess()
      } else {
        toast.error(data.message || `Failed to ${content ? "update" : "create"} content`)
      }
    } catch (error) {
      toast.error("Failed to save content")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{content ? "Edit Content" : "Create New Content"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="sectionName">Service Section *</Label>
            <Select value={formData.sectionName} onValueChange={(value: string) => handleInputChange("sectionName", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select service section" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section.value} value={section.value}>
                    {section.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Choose whether this content belongs to Technology Solutions or Consulting Services
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Content title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Content description"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Poster Image *</Label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("poster-upload")?.click()}
                disabled={uploading}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading..." : "Upload Poster"}
              </Button>
              <input id="poster-upload" type="file" accept="image/*" onChange={handlePosterUpload} className="hidden" />
              {formData.poster && (
                <div className="flex items-center gap-2">
                  <img
                    src={formData.poster || "/placeholder.svg"}
                    alt="Poster preview"
                    className="h-12 w-12 object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData((prev) => ({ ...prev, poster: "" }))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Additional Images</Label>
            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("images-upload")?.click()}
                disabled={uploading}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading..." : "Upload Images"}
              </Button>
              <input
                id="images-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesUpload}
                className="hidden"
              />

              {formData.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Image ${index + 1}`}
                        className="h-20 w-20 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-destructive text-destructive-foreground rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Key Features / Benefits</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newListItem}
                  onChange={(e) => setNewListItem(e.target.value)}
                  placeholder="Add feature or benefit"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addListItem())}
                />
                <Button type="button" onClick={addListItem} variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {formData.lists.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.lists.map((item, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {item}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeListItem(index)}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Add key features, benefits, or capabilities for this {formData.sectionName === 'solutions' ? 'solution' : 'service'}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || uploading}>
              {saving ? "Saving..." : content ? "Update Content" : "Create Content"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
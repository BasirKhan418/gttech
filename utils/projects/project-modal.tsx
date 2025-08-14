"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { X, Upload, Plus, Code, Star, Layers, Lightbulb, Zap, Rocket, Settings, Monitor, Smartphone, Database, Globe } from "lucide-react"
import { toast } from "sonner"

// Available icons for projects
const AVAILABLE_ICONS = [
  { name: 'Code', icon: Code, value: 'code' },
  { name: 'Star', icon: Star, value: 'star' },
  { name: 'Layers', icon: Layers, value: 'layers' },
  { name: 'Lightbulb', icon: Lightbulb, value: 'lightbulb' },
  { name: 'Zap', icon: Zap, value: 'zap' },
  { name: 'Rocket', icon: Rocket, value: 'rocket' },
  { name: 'Settings', icon: Settings, value: 'settings' },
  { name: 'Monitor', icon: Monitor, value: 'monitor' },
  { name: 'Smartphone', icon: Smartphone, value: 'smartphone' },
  { name: 'Database', icon: Database, value: 'database' },
  { name: 'Globe', icon: Globe, value: 'globe' }
]

interface Project {
  _id?: string
  title: string
  category: string
  description: string
  poster: string
  images: string[]
  icon?: string
  technologies?: string[]
  features?: string[]
  isActive: boolean
  isFeatured: boolean
}

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  project: Project | null
  onSuccess: () => void
}

export function ProjectModal({ isOpen, onClose, project, onSuccess }: ProjectModalProps) {
  const [formData, setFormData] = useState<Project>({
    title: "",
    category: "",
    description: "",
    poster: "",
    images: [],
    icon: "",
    technologies: [],
    features: [],
    isActive: true,
    isFeatured: false,
  })
  const [newTechnology, setNewTechnology] = useState("")
  const [newFeature, setNewFeature] = useState("")
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (project) {
      setFormData(project)
    } else {
      setFormData({
        title: "",
        category: "",
        description: "",
        poster: "",
        images: [],
        icon: "",
        technologies: [],
        features: [],
        isActive: true,
        isFeatured: false,
      })
    }
  }, [project])

  const handleInputChange = (field: keyof Project, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const uploadFile = async (file: File): Promise<string> => {
    try {
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

  const addTechnology = () => {
    if (newTechnology.trim()) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...(prev.technologies || []), newTechnology.trim()],
      }))
      setNewTechnology("")
    }
  }

  const removeTechnology = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies?.filter((_, i) => i !== index) || [],
    }))
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()],
      }))
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || [],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.category || !formData.description || !formData.poster) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setSaving(true)
      const url = "/api/project"
      const method = project?._id ? "PUT" : "POST"
      const body = project ? { ...formData, id: project._id } : formData
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`Product ${project ? "updated" : "created"} successfully`)
        onSuccess()
      } else {
        toast.error(data.message || `Failed to ${project ? "update" : "create"} project`)
      }
    } catch (error) {
      toast.error("Failed to save product")
    } finally {
      setSaving(false)
    }
  }

  const getIconComponent = (iconValue: string) => {
    const iconData = AVAILABLE_ICONS.find(icon => icon.value === iconValue)
    return iconData ? iconData.icon : Code
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Product" : "Create New Product"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Product Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter product title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                placeholder="e.g., Web Development, Mobile App, AI/ML"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the product..."
              rows={4}
              required
            />
          </div>

          {/* Icon Selection */}
          <div className="space-y-2">
            <Label>Product Icon</Label>
            <div className="grid grid-cols-6 md:grid-cols-11 gap-2">
              {AVAILABLE_ICONS.map((iconData) => {
                const IconComponent = iconData.icon
                return (
                  <button
                    key={iconData.value}
                    type="button"
                    onClick={() => handleInputChange("icon", iconData.value)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                      formData.icon === iconData.value
                        ? 'border-cyan-500 bg-cyan-50 text-cyan-600'
                        : 'border-gray-300 hover:border-cyan-300 text-gray-600'
                    }`}
                    title={iconData.name}
                  >
                    <IconComponent className="w-5 h-5 mx-auto" />
                  </button>
                )
              })}
            </div>
            {formData.icon && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Selected:</span>
                {React.createElement(getIconComponent(formData.icon), { className: "w-4 h-4" })}
                <span>{AVAILABLE_ICONS.find(icon => icon.value === formData.icon)?.name}</span>
              </div>
            )}
          </div>

          {/* Poster Image */}
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
                    src={formData.poster}
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

          {/* Additional Images */}
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
                        src={image}
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

          {/* Technologies */}
          <div className="space-y-2">
            <Label>Technologies Used</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  placeholder="Add technology"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTechnology())}
                />
                <Button type="button" onClick={addTechnology} variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {formData.technologies && formData.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {tech}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTechnology(index)}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label>Key Features</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add feature"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature} variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {formData.features && formData.features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      {feature}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            </div>

          {/* Status Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange("isActive", checked)}
              />
              <Label htmlFor="isActive">Active Product</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) => handleInputChange("isFeatured", checked)}
              />
              <Label htmlFor="isFeatured">Featured Products</Label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || uploading}>
              {saving ? "Saving..." : project ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
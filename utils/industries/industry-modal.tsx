"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { X, Upload, Plus } from "lucide-react"
import { toast } from "sonner"

interface Industry {
  _id?: string
  title: string
  subtitle: string
  description: string
  highlights: string[]
  technologies: string[]
  poster: string
  images: string[]
  icon?: string
  category: string
  gradientFrom: string
  gradientTo: string
  borderColor: string
  hoverBorderColor: string
  textColor: string
  hoverTextColor: string
  buttonGradient: string
  iconBg: string
  iconBorder: string
  isActive: boolean
  isFeatured: boolean
  slug?: string
}

interface Category {
  _id: string
  name: string
  slug: string
  isActive: boolean
}

interface IndustryModalProps {
  isOpen: boolean
  onClose: () => void
  industry: Industry | null
  categories: Category[]
  onSuccess: () => void
  aiGeneratedData?: Partial<Industry> | null
}

export function IndustryModal({ isOpen, onClose, industry, categories, onSuccess, aiGeneratedData }: IndustryModalProps) {
  const [formData, setFormData] = useState<Industry>({
    title: "",
    subtitle: "",
    description: "",
    highlights: [],
    technologies: [],
    poster: "",
    images: [],
    category: "",
    gradientFrom: "from-sky-500/20",
    gradientTo: "to-cyan-500/20",
    borderColor: "border-sky-500/20",
    hoverBorderColor: "hover:border-sky-400/40",
    textColor: "text-sky-400",
    hoverTextColor: "group-hover:text-sky-200",
    buttonGradient: "from-sky-500/80 to-sky-600/80 hover:from-sky-600/90 hover:to-sky-700/90",
    iconBg: "bg-gradient-to-r from-sky-500/20 to-cyan-500/20",
    iconBorder: "border-sky-400/30",
    isActive: true,
    isFeatured: false,
  })
  
  const [newHighlight, setNewHighlight] = useState("")
  const [newTechnology, setNewTechnology] = useState("")
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (industry) {
      setFormData(industry)
    } else if (aiGeneratedData) {
      // Pre-populate with AI generated data
      setFormData({
        title: aiGeneratedData.title || "",
        subtitle: aiGeneratedData.subtitle || "",
        description: aiGeneratedData.description || "",
        highlights: aiGeneratedData.highlights || [],
        technologies: aiGeneratedData.technologies || [],
        poster: aiGeneratedData.poster || "",
        images: aiGeneratedData.images || [],
        category: aiGeneratedData.category || "",
        gradientFrom: aiGeneratedData.gradientFrom || "from-sky-500/20",
        gradientTo: aiGeneratedData.gradientTo || "to-cyan-500/20",
        borderColor: aiGeneratedData.borderColor || "border-sky-500/20",
        hoverBorderColor: aiGeneratedData.hoverBorderColor || "hover:border-sky-400/40",
        textColor: aiGeneratedData.textColor || "text-sky-400",
        hoverTextColor: aiGeneratedData.hoverTextColor || "group-hover:text-sky-200",
        buttonGradient: aiGeneratedData.buttonGradient || "from-sky-500/80 to-sky-600/80 hover:from-sky-600/90 hover:to-sky-700/90",
        iconBg: aiGeneratedData.iconBg || "bg-gradient-to-r from-sky-500/20 to-cyan-500/20",
        iconBorder: aiGeneratedData.iconBorder || "border-sky-400/30",
        isActive: aiGeneratedData.isActive !== false,
        isFeatured: aiGeneratedData.isFeatured || false,
      })
    } else {
      setFormData({
        title: "",
        subtitle: "",
        description: "",
        highlights: [],
        technologies: [],
        poster: "",
        images: [],
        category: "",
        gradientFrom: "from-sky-500/20",
        gradientTo: "to-cyan-500/20",
        borderColor: "border-sky-500/20",
        hoverBorderColor: "hover:border-sky-400/40",
        textColor: "text-sky-400",
        hoverTextColor: "group-hover:text-sky-200",
        buttonGradient: "from-sky-500/80 to-sky-600/80 hover:from-sky-600/90 hover:to-sky-700/90",
        iconBg: "bg-gradient-to-r from-sky-500/20 to-cyan-500/20",
        iconBorder: "border-sky-400/30",
        isActive: true,
        isFeatured: false,
      })
    }
  }, [industry, aiGeneratedData])

  const handleInputChange = (field: keyof Industry, value: any) => {
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

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setFormData((prev) => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()],
      }))
      setNewHighlight("")
    }
  }

  const removeHighlight = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }))
  }

  const addTechnology = () => {
    if (newTechnology.trim()) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()],
      }))
      setNewTechnology("")
    }
  }

  const removeTechnology = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.subtitle || !formData.description || !formData.category) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setSaving(true)
      const url = "/api/industry"
      const method = industry?._id ? "PUT" : "POST"
      const body = industry ? { ...formData, id: industry._id } : formData
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`Industry ${industry ? "updated" : "created"} successfully`)
        onSuccess()
      } else {
        toast.error(data.message || `Failed to ${industry ? "update" : "create"} industry`)
      }
    } catch (error) {
      toast.error("Failed to save industry")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {industry ? "Edit Industry" : aiGeneratedData ? "Create Industry from AI" : "Create New Industry"}
          </DialogTitle>
        </DialogHeader>

        {aiGeneratedData && !industry && (
          <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800 mb-4">
            <p className="text-purple-700 dark:text-purple-300 text-sm">
              ✨ This form has been pre-filled with AI-generated content. You can review and modify any fields before saving.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Industry title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle *</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => handleInputChange("subtitle", e.target.value)}
                placeholder="Industry subtitle"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Industry description"
              rows={4}
              required
            />
          </div>

          {/* Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange("isActive", checked)}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) => handleInputChange("isFeatured", checked)}
              />
              <Label htmlFor="isFeatured">Featured</Label>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label>Poster Image</Label>
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
                Upload Images
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

          {/* Highlights */}
          <div className="space-y-2">
            <Label>Highlights</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  placeholder="Add highlight"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())}
                />
                <Button type="button" onClick={addHighlight} variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {formData.highlights.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.highlights.map((item, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {item}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHighlight(index)}
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

          {/* Technologies */}
          <div className="space-y-2">
            <Label>Technologies</Label>
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

              {formData.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((item, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {item}
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

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || uploading}>
              {saving ? "Saving..." : industry ? "Update Industry" : "Create Industry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
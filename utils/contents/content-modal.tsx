"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Upload, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"

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
    designType: ""
  })
  const [loading, setLoading] = useState(false)
  const [newListItem, setNewListItem] = useState("")
  const [newImage, setNewImage] = useState("")

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
        designType: ""
      })
    }
  }, [content, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = "/api/content"
      const method = content?._id ? "PUT" : "POST"
      const body = content?._id ? { ...formData, id: content._id } : formData

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(content?._id ? "Content updated successfully" : "Content created successfully")
        onSuccess()
      } else {
        toast.error(data.message || "Failed to save content")
      }
    } catch (error) {
      toast.error("Failed to save content")
    } finally {
      setLoading(false)
    }
  }

  const addListItem = () => {
    if (newListItem.trim()) {
      setFormData(prev => ({
        ...prev,
        lists: [...prev.lists, newListItem.trim()]
      }))
      setNewListItem("")
    }
  }

  const removeListItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      lists: prev.lists.filter((_, i) => i !== index)
    }))
  }

  const addImage = () => {
    if (newImage.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }))
      setNewImage("")
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-sky-500/30 text-white">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent rounded-lg"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-sky-500/[0.08] via-transparent to-cyan-500/[0.05] rounded-lg"></div>
        
        <div className="relative z-10">
          <DialogHeader className="space-y-3 pb-6 border-b border-sky-500/20">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">
              {content?._id ? "Edit Content" : "Create New Content"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Section Name */}
              <div className="space-y-2">
                <Label htmlFor="sectionName" className="text-white font-medium">
                  Section Name
                </Label>
                <Input
                  id="sectionName"
                  value={formData.sectionName}
                  onChange={(e) => setFormData(prev => ({ ...prev, sectionName: e.target.value }))}
                  required
                  className="bg-black/20 border-sky-500/30 text-white placeholder-gray-400 focus:border-sky-400/60 focus:ring-sky-400/30"
                  placeholder="e.g., Hero Section, Features"
                />
              </div>

              {/* Design Type */}
              <div className="space-y-2">
                <Label htmlFor="designType" className="text-white font-medium">
                  Design Type
                </Label>
                <Select
                  value={formData.designType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, designType: value }))}
                >
                  <SelectTrigger className="bg-black/20 border-sky-500/30 text-white focus:border-sky-400/60 focus:ring-sky-400/30">
                    <SelectValue placeholder="Select design type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-sky-500/30 text-white">
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="banner">Banner</SelectItem>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="list">List</SelectItem>
                    <SelectItem value="hero">Hero</SelectItem>
                    <SelectItem value="feature">Feature</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white font-medium">
                Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                className="bg-black/20 border-sky-500/30 text-white placeholder-gray-400 focus:border-sky-400/60 focus:ring-sky-400/30"
                placeholder="Enter content title"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                rows={4}
                className="bg-black/20 border-sky-500/30 text-white placeholder-gray-400 focus:border-sky-400/60 focus:ring-sky-400/30 resize-none"
                placeholder="Enter content description"
              />
            </div>

            {/* Poster Image */}
            <div className="space-y-2">
              <Label htmlFor="poster" className="text-white font-medium flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Poster Image URL
              </Label>
              <Input
                id="poster"
                value={formData.poster}
                onChange={(e) => setFormData(prev => ({ ...prev, poster: e.target.value }))}
                required
                className="bg-black/20 border-sky-500/30 text-white placeholder-gray-400 focus:border-sky-400/60 focus:ring-sky-400/30"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Additional Images */}
            <div className="space-y-4">
              <Label className="text-white font-medium flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Additional Images
              </Label>
              
              <div className="flex gap-2">
                <Input
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="Enter image URL"
                  className="bg-black/20 border-sky-500/30 text-white placeholder-gray-400 focus:border-sky-400/60 focus:ring-sky-400/30"
                />
                <Button
                  type="button"
                  onClick={addImage}
                  className="bg-sky-500/20 border border-sky-400/50 text-sky-400 hover:bg-sky-500/30 hover:text-white backdrop-blur-sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.images.map((image, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-sky-500/20 text-sky-200 border border-sky-400/30 pr-1"
                    >
                      <span className="truncate max-w-32">{image}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="h-4 w-4 p-0 ml-2 text-sky-400 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Lists */}
            <div className="space-y-4">
              <Label className="text-white font-medium">List Items</Label>
              
              <div className="flex gap-2">
                <Input
                  value={newListItem}
                  onChange={(e) => setNewListItem(e.target.value)}
                  placeholder="Enter list item"
                  className="bg-black/20 border-sky-500/30 text-white placeholder-gray-400 focus:border-sky-400/60 focus:ring-sky-400/30"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addListItem())}
                />
                <Button
                  type="button"
                  onClick={addListItem}
                  className="bg-cyan-500/20 border border-cyan-400/50 text-cyan-400 hover:bg-cyan-500/30 hover:text-white backdrop-blur-sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {formData.lists.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.lists.map((listItem, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 pr-1"
                    >
                      <span className="truncate max-w-40">{listItem}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeListItem(index)}
                        className="h-4 w-4 p-0 ml-2 text-cyan-400 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-sky-500/20">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="bg-transparent border-gray-500/50 text-gray-300 hover:bg-gray-500/20 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white border-0 shadow-lg shadow-sky-500/25"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {content?._id ? "Updating..." : "Creating..."}
                  </div>
                ) : (
                  content?._id ? "Update Content" : "Create Content"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
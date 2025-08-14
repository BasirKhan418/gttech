"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Toaster,toast } from "sonner"
import { Pencil, Trash2, Plus, Sparkles, Eye, EyeOff, Wand2, Upload, X } from "lucide-react"
import { format } from "date-fns"

interface Banner {
  _id: string
  title: string
  tags: string[]
  description: string
  buttonText: string
  buttonLink: string
  image?: string
  showImage: boolean
  isActive: boolean
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

interface BannerFormData {
  title: string
  tags: string
  description: string
  buttonText: string
  buttonLink: string
  image: string
  showImage: boolean
  isActive: boolean
}

const defaultFormData: BannerFormData = {
  title: "",
  tags: "",
  description: "",
  buttonText: "",
  buttonLink: "",
  image: "",
  showImage: true,
  isActive: true,
}

interface BannerFormProps {
  formData: BannerFormData
  setFormData: (data: BannerFormData) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  editingBanner: Banner | null
  submitting: boolean
  uploading: boolean
  uploadProgress: number
  onImageUpload: (file: File) => void
}

const BannerForm: React.FC<BannerFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  editingBanner,
  submitting,
  uploading,
  uploadProgress,
  onImageUpload,
}) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="featured, promotion, sale"
          required
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        rows={3}
        required
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="buttonText">Button Text</Label>
        <Input
          id="buttonText"
          value={formData.buttonText}
          onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="buttonLink">Button Link</Label>
        <Input
          id="buttonLink"
          value={formData.buttonLink}
          onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
          placeholder="/get-started"
          required
        />
      </div>
    </div>

    <div className="space-y-4">
      <Label>Banner Image</Label>
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          {formData.image ? (
            <div className="relative w-full max-w-md">
              <img
                src={formData.image || "/placeholder.svg"}
                alt="Banner preview"
                className="w-full h-32 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0"
                onClick={() => setFormData({ ...formData, image: "" })}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">Drag and drop an image here, or click to select</p>
              <p className="text-xs text-muted-foreground">Supports: JPG, PNG, GIF (max 5MB)</p>
            </div>
          )}
          <div className="flex gap-2 w-full max-w-md">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              disabled={uploading}
              onClick={() => {
                const input = document.createElement("input")
                input.type = "file"
                input.accept = "image/*"
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0]
                  if (file) onImageUpload(file)
                }
                input.click()
              }}
            >
              {uploading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </>
              )}
            </Button>
          </div>
          {uploading && uploadProgress > 0 && (
            <div className="w-full max-w-md">
              <div className="bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1 text-center">{uploadProgress}% uploaded</p>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="imageUrl" className="text-sm text-muted-foreground">
          Or enter image URL manually
        </Label>
        <Input
          id="imageUrl"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
      </div>
    </div>

    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Switch
          id="showImage"
          checked={formData.showImage}
          onCheckedChange={(checked) => setFormData({ ...formData, showImage: checked })}
        />
        <Label htmlFor="showImage">Show Image</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>
    </div>

    <div className="flex justify-end space-x-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={submitting || uploading}>
        {submitting ? "Saving..." : editingBanner ? "Update Banner" : "Create Banner"}
      </Button>
    </div>
  </form>
)

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isAiPromptOpen, setIsAiPromptOpen] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [generatingAi, setGeneratingAi] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [formData, setFormData] = useState<BannerFormData>(defaultFormData)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await fetch("/api/banner")
      const data = await response.json()
      setBanners(data.data)
    } catch (error) {
      toast.error("Failed to fetch banners")
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB")
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
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

      if (!uploadResponse.ok) {
        throw new Error("Failed to get upload URL")
      }

      const { uploadURL, fileURL } = await uploadResponse.json()

      const uploadToS3 = await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      })

      if (!uploadToS3.ok) {
        throw new Error("Failed to upload image")
      }

      setFormData({ ...formData, image: fileURL })
      setUploadProgress(100)

      toast.success("Image uploaded successfully")
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload image")
    } finally {
      setUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  const handleCreate = async (useAI = false) => {
    if (useAI) {
      setAiPrompt("")
      setIsAiPromptOpen(true)
    } else {
      setFormData(defaultFormData)
      setIsCreateOpen(true)
    }
  }

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      tags: banner.tags.join(", "),
      description: banner.description,
      buttonText: banner.buttonText,
      buttonLink: banner.buttonLink,
      image: banner.image || "",
      showImage: banner.showImage,
      isActive: banner.isActive,
    })
    setIsEditOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const payload = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      }

      const url = editingBanner ? "/api/banner" : "/api/banner"
      const method = editingBanner ? "PUT" : "POST"
      const body = editingBanner ? { ...payload, id: editingBanner._id } : payload

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Banner saved successfully");
        fetchBanners()
        setIsCreateOpen(false)
        setIsEditOpen(false)
        setEditingBanner(null)
        setFormData(defaultFormData)
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast.error("Failed to save banner");
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return

    try {
      const response = await fetch("/api/banner", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      const result = await response.json()

      if (result.success) {
       toast.success("Banner deleted successfully")
        fetchBanners()
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast.error("Failed to delete banner");
    }
  }

  const generateAiContent = (prompt: string): BannerFormData => {
    const lowerPrompt = prompt.toLowerCase()

    if (lowerPrompt.includes("sale") || lowerPrompt.includes("discount") || lowerPrompt.includes("offer")) {
      return {
        title: "🔥 Limited Time Sale - Up to 50% Off!",
        tags: "sale, discount, limited-time, hot-deal",
        description:
          "Don't miss out on our biggest sale of the year! Get incredible discounts on all your favorite products. Limited time only - shop now before it's too late!",
        buttonText: "Shop Sale Now",
        buttonLink: "/sale",
        image: "/placeholder.svg?height=200&width=400",
        showImage: true,
        isActive: true,
      }
    } else if (lowerPrompt.includes("product") || lowerPrompt.includes("launch") || lowerPrompt.includes("new")) {
      return {
        title: "🚀 Introducing Our Latest Innovation",
        tags: "new-product, launch, innovation, featured",
        description:
          "Experience the future with our groundbreaking new product. Designed with cutting-edge technology and user-centric features that will transform your workflow.",
        buttonText: "Discover Now",
        buttonLink: "/products/new",
        image: "/placeholder.svg?height=200&width=400",
        showImage: true,
        isActive: true,
      }
    } else if (
      lowerPrompt.includes("service") ||
      lowerPrompt.includes("business") ||
      lowerPrompt.includes("professional")
    ) {
      return {
        title: "💼 Professional Services That Deliver Results",
        tags: "services, professional, business, solutions",
        description:
          "Partner with industry experts who understand your business needs. Our comprehensive services are designed to help you achieve your goals faster and more efficiently.",
        buttonText: "Get Started",
        buttonLink: "/services",
        image: "/placeholder.svg?height=200&width=400",
        showImage: true,
        isActive: true,
      }
    } else if (lowerPrompt.includes("event") || lowerPrompt.includes("webinar") || lowerPrompt.includes("conference")) {
      return {
        title: "📅 Join Our Exclusive Event",
        tags: "event, webinar, exclusive, registration",
        description:
          "Don't miss this opportunity to learn from industry leaders and network with like-minded professionals. Limited seats available - register today!",
        buttonText: "Register Now",
        buttonLink: "/events/register",
        image: "/placeholder.svg?height=200&width=400",
        showImage: true,
        isActive: true,
      }
    } else {
      return {
        title: "✨ Transform Your Experience Today",
        tags: "featured, premium, transformation, growth",
        description:
          "Discover a new way to achieve your goals with our innovative solutions. Join thousands of satisfied customers who have already transformed their experience.",
        buttonText: "Learn More",
        buttonLink: "/learn-more",
        image: "/placeholder.svg?height=200&width=400",
        showImage: true,
        isActive: true,
      }
    }
  }

  const handleAiPromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiPrompt.trim()) return

    setGeneratingAi(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const aiGeneratedContent = generateAiContent(aiPrompt)
    setFormData(aiGeneratedContent)

    setGeneratingAi(false)
    setIsAiPromptOpen(false)
    setIsCreateOpen(true)

    toast.success("AI Content Generated!")
  }

  const handleCancel = () => {
    setIsCreateOpen(false)
    setIsEditOpen(false)
    setEditingBanner(null)
    setFormData(defaultFormData)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading banners...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banner Management</h1>
          <p className="text-muted-foreground">Manage your website banners and promotional content</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleCreate(true)} className="gap-2">
            <Sparkles className="h-4 w-4" />
            Create with AI
          </Button>
          <Button onClick={() => handleCreate(false)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Banner
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Banners</CardTitle>
          <CardDescription>
            {banners.length} banner{banners.length !== 1 ? "s" : ""} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Last Updated By</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No banners found. Create your first banner to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  banners.map((banner) => (
                    <TableRow key={banner._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {banner.showImage ? (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          )}
                          {banner.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={banner.isActive ? "default" : "secondary"}>
                          {banner.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {banner.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {banner.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{banner.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            {banner.lastEditedAuthor?.name || banner.lastEditedAuthor?.email || "Unknown"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(banner.updatedAt), "MMM dd, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(banner)} className="h-8 w-8 p-0">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(banner._id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAiPromptOpen} onOpenChange={setIsAiPromptOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-purple-500" />
              Create Banner with AI
            </DialogTitle>
            <DialogDescription>
              Describe what kind of banner you want to create and AI will generate the content for you.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAiPromptSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="aiPrompt">What kind of banner do you want?</Label>
              <Textarea
                id="aiPrompt"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., A promotional banner for a summer sale with 30% discount, or a banner for launching a new product..."
                rows={4}
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAiPromptOpen(false)
                  setAiPrompt("")
                }}
                disabled={generatingAi}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={generatingAi || !aiPrompt.trim()} className="gap-2">
                {generatingAi ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Banner
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Banner</DialogTitle>
            <DialogDescription>Add a new banner to your website. Fill in the details below.</DialogDescription>
          </DialogHeader>
          <BannerForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            editingBanner={null}
            submitting={submitting}
            uploading={uploading}
            uploadProgress={uploadProgress}
            onImageUpload={handleImageUpload}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
            <DialogDescription>Update the banner details below.</DialogDescription>
          </DialogHeader>
          <BannerForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            editingBanner={editingBanner}
            submitting={submitting}
            uploading={uploading}
            uploadProgress={uploadProgress}
            onImageUpload={handleImageUpload}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

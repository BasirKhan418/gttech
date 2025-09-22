"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Upload } from "lucide-react"
import { toast } from "sonner"

interface Partner {
  name: string
  logo: string
  description: string
  website: string
  partnership_type: string
}

interface AboutData {
  _id?: string
  title: string
  ourstory: string
  card1title: string
  card1subtitle: string
  card1desc: string
  card1features: string[]
  card2title: string
  card2subtitle: string
  card2desc: string
  card2features: string[]
  foundationdesc: string[]
  partners: Partner[]
}

interface AboutModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit"
  initialData?: AboutData | null
}

export function AboutModal({ isOpen, onClose, mode, initialData }: AboutModalProps) {
  const [formData, setFormData] = useState<AboutData>({
    title: "",
    ourstory: "",
    card1title: "",
    card1subtitle: "",
    card1desc: "",
    card1features: [],
    card2title: "",
    card2subtitle: "",
    card2desc: "",
    card2features: [],
    foundationdesc: [],
    partners: [],
  })

  const [newFeature1, setNewFeature1] = useState("")
  const [newFeature2, setNewFeature2] = useState("")
  const [newFoundation, setNewFoundation] = useState("")
  const [newPartner, setNewPartner] = useState<Partner>({
    name: "",
    logo: "",
    description: "",
    website: "",
    partnership_type: "",
  })
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        title: "",
        ourstory: "",
        card1title: "",
        card1subtitle: "",
        card1desc: "",
        card1features: [],
        card2title: "",
        card2subtitle: "",
        card2desc: "",
        card2features: [],
        foundationdesc: [],
        partners: [],
      })
    }
  }, [mode, initialData, isOpen])

  const handleInputChange = (field: keyof AboutData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addFeature1 = () => {
    if (newFeature1.trim()) {
      setFormData((prev) => ({
        ...prev,
        card1features: [...prev.card1features, newFeature1.trim()],
      }))
      setNewFeature1("")
    }
  }

  const removeFeature1 = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      card1features: prev.card1features.filter((_, i) => i !== index),
    }))
  }

  const addFeature2 = () => {
    if (newFeature2.trim()) {
      setFormData((prev) => ({
        ...prev,
        card2features: [...prev.card2features, newFeature2.trim()],
      }))
      setNewFeature2("")
    }
  }

  const removeFeature2 = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      card2features: prev.card2features.filter((_, i) => i !== index),
    }))
  }

  const addFoundation = () => {
    if (newFoundation.trim()) {
      setFormData((prev) => ({
        ...prev,
        foundationdesc: [...prev.foundationdesc, newFoundation.trim()],
      }))
      setNewFoundation("")
    }
  }

  const removeFoundation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      foundationdesc: prev.foundationdesc.filter((_, i) => i !== index),
    }))
  }

  const handleLogoUpload = async (file: File) => {
    try {
      setUploading(true)

      // Get signed URL for upload
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

      if (!uploadData.uploadURL) {
        throw new Error("Failed to get upload URL")
      }

      // Upload file to S3
      const uploadResult = await fetch(uploadData.uploadURL, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      })

      if (!uploadResult.ok) {
        throw new Error("Failed to upload file")
      }

      return uploadData.fileURL
    } catch (error) {
     toast.error("Failed to upload logo. Please try again.")
      return null
    } finally {
      setUploading(false)
    }
  }

  const addPartner = async () => {
    if (newPartner.name && newPartner.description && newPartner.partnership_type) {
      setFormData((prev) => ({
        ...prev,
        partners: [...prev.partners, { ...newPartner }],
      }))
      setNewPartner({
        name: "",
        logo: "",
        description: "",
        website: "",
        partnership_type: "",
      })
    }
  }

  const removePartner = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      partners: prev.partners.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = mode === "create" ? "/api/about" : "/api/about"
      const method = mode === "create" ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`About page ${mode === "create" ? "created" : "updated"} successfully`)
        onClose()
      } else {
        toast.error(result.message || "Failed to save about page. Please try again.")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create About Page" : "Edit About Page"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a new about page with all the necessary information"
              : "Update the about page information"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="About Our Company"
                  required
                />
              </div>
              <div>
                <Label htmlFor="ourstory">Our Story</Label>
                <Textarea
                  id="ourstory"
                  value={formData.ourstory}
                  onChange={(e) => handleInputChange("ourstory", e.target.value)}
                  placeholder="Tell your company's story..."
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Mission Card */}
          <Card>
            <CardHeader>
              <CardTitle>Mission Card</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="card1title">Mission Title</Label>
                  <Input
                    id="card1title"
                    value={formData.card1title}
                    onChange={(e) => handleInputChange("card1title", e.target.value)}
                    placeholder="Our Mission"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="card1subtitle">Mission Subtitle</Label>
                  <Input
                    id="card1subtitle"
                    value={formData.card1subtitle}
                    onChange={(e) => handleInputChange("card1subtitle", e.target.value)}
                    placeholder="Empowering Digital Transformation"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="card1desc">Mission Description</Label>
                <Textarea
                  id="card1desc"
                  value={formData.card1desc}
                  onChange={(e) => handleInputChange("card1desc", e.target.value)}
                  placeholder="Describe your mission..."
                  rows={3}
                  required
                />
              </div>
              <div>
                <Label>Mission Features</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newFeature1}
                    onChange={(e) => setNewFeature1(e.target.value)}
                    placeholder="Add a feature..."
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature1())}
                  />
                  <Button type="button" onClick={addFeature1} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.card1features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {feature}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeFeature1(index)} />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vision Card */}
          <Card>
            <CardHeader>
              <CardTitle>Vision Card</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="card2title">Vision Title</Label>
                  <Input
                    id="card2title"
                    value={formData.card2title}
                    onChange={(e) => handleInputChange("card2title", e.target.value)}
                    placeholder="Our Vision"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="card2subtitle">Vision Subtitle</Label>
                  <Input
                    id="card2subtitle"
                    value={formData.card2subtitle}
                    onChange={(e) => handleInputChange("card2subtitle", e.target.value)}
                    placeholder="Building Tomorrow's Technology Today"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="card2desc">Vision Description</Label>
                <Textarea
                  id="card2desc"
                  value={formData.card2desc}
                  onChange={(e) => handleInputChange("card2desc", e.target.value)}
                  placeholder="Describe your vision..."
                  rows={3}
                  required
                />
              </div>
              <div>
                <Label>Vision Features</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newFeature2}
                    onChange={(e) => setNewFeature2(e.target.value)}
                    placeholder="Add a feature..."
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature2())}
                  />
                  <Button type="button" onClick={addFeature2} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.card2features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {feature}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeFeature2(index)} />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Foundation Values */}
          <Card>
            <CardHeader>
              <CardTitle>Foundation Values</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label>Foundation Descriptions</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newFoundation}
                    onChange={(e) => setNewFoundation(e.target.value)}
                    placeholder="Add a foundation value..."
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFoundation())}
                  />
                  <Button type="button" onClick={addFoundation} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 mt-2">
                  {formData.foundationdesc.map((desc, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                      <span className="flex-1">{desc}</span>
                      <X className="h-4 w-4 cursor-pointer" onClick={() => removeFoundation(index)} />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Partners */}
          <Card>
            <CardHeader>
              <CardTitle>Partners</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="partner-name">Partner Name</Label>
                  <Input
                    id="partner-name"
                    value={newPartner.name}
                    onChange={(e) => setNewPartner((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Microsoft"
                  />
                </div>
                <div>
                  <Label htmlFor="partner-type">Partnership Type</Label>
                  <Input
                    id="partner-type"
                    value={newPartner.partnership_type}
                    onChange={(e) => setNewPartner((prev) => ({ ...prev, partnership_type: e.target.value }))}
                    placeholder="Technology"
                  />
                </div>
                <div>
                  <Label htmlFor="partner-website">Website</Label>
                  <Input
                    id="partner-website"
                    value={newPartner.website}
                    onChange={(e) => setNewPartner((prev) => ({ ...prev, website: e.target.value }))}
                    placeholder="https://microsoft.com"
                  />
                </div>
                <div>
                  <Label htmlFor="partner-logo">Logo URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="partner-logo"
                      value={newPartner.logo}
                      onChange={(e) => setNewPartner((prev) => ({ ...prev, logo: e.target.value }))}
                      placeholder="Logo URL or upload file"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={uploading}
                      onClick={() => {
                        const input = document.createElement("input")
                        input.type = "file"
                        input.accept = "image/*"
                        input.onchange = async (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0]
                          if (file) {
                            const url = await handleLogoUpload(file)
                            if (url) {
                              setNewPartner((prev) => ({ ...prev, logo: url }))
                            }
                          }
                        }
                        input.click()
                      }}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="partner-desc">Description</Label>
                <Textarea
                  id="partner-desc"
                  value={newPartner.description}
                  onChange={(e) => setNewPartner((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Strategic technology partner"
                  rows={2}
                />
              </div>
              <Button type="button" onClick={addPartner} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Partner
              </Button>

              <div className="space-y-2">
                {formData.partners.map((partner, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded">
                    {partner.logo && (
                      <img
                        src={partner.logo || "/placeholder.svg"}
                        alt={partner.name}
                        className="w-8 h-8 object-contain"
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{partner.name}</div>
                      <div className="text-sm text-muted-foreground">{partner.description}</div>
                      <Badge variant="outline" className="text-xs">
                        {partner.partnership_type}
                      </Badge>
                    </div>
                    <X className="h-4 w-4 cursor-pointer" onClick={() => removePartner(index)} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : mode === "create" ? "Create" : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

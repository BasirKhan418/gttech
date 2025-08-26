"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

// Product categories
const PRODUCT_CATEGORIES = [
  { value: 'Software products', label: 'Software Products' },
  { value: 'saap', label: 'SaaS' },
  { value: 'electric vehicles', label: 'Electric Vehicles' },
  { value: 'furnitures', label: 'Furnitures' },
  { value: 'garments', label: 'Garments' }
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
  
  // Software products specific
  portfolios?: string[]
  industries?: string[]
  capabilities?: string[]
  valuePropositions?: string[]
  
  // SaaS specific
  pricingModel?: string
  integrations?: string[]
  apiSupport?: boolean
  
  // Electric vehicles specific
  batteryCapacity?: string
  range?: string
  chargingTime?: string
  motorType?: string
  
  // Furnitures specific
  material?: string[]
  dimensions?: string
  weight?: string
  assemblyRequired?: boolean
  
  // Garments specific
  sizes?: string[]
  colors?: string[]
  fabric?: string[]
  careInstructions?: string[]
}

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  project: Project | null
  onSuccess: () => void
  aiGeneratedData?: Partial<Project> | null
}

export function ProjectModal({ isOpen, onClose, project, onSuccess, aiGeneratedData }: ProjectModalProps) {
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
  
  // Dynamic input states
  const [newTechnology, setNewTechnology] = useState("")
  const [newFeature, setNewFeature] = useState("")
  const [newPortfolio, setNewPortfolio] = useState("")
  const [newIndustry, setNewIndustry] = useState("")
  const [newCapability, setNewCapability] = useState("")
  const [newValueProposition, setNewValueProposition] = useState("")
  const [newIntegration, setNewIntegration] = useState("")
  const [newMaterial, setNewMaterial] = useState("")
  const [newSize, setNewSize] = useState("")
  const [newColor, setNewColor] = useState("")
  const [newFabric, setNewFabric] = useState("")
  const [newCareInstruction, setNewCareInstruction] = useState("")
  
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (project) {
      setFormData(project)
    } else if (aiGeneratedData) {
      setFormData({
        title: aiGeneratedData.title || "",
        category: aiGeneratedData.category || "",
        description: aiGeneratedData.description || "",
        poster: aiGeneratedData.poster || "",
        images: aiGeneratedData.images || [],
        icon: aiGeneratedData.icon || "",
        technologies: aiGeneratedData.technologies || [],
        features: aiGeneratedData.features || [],
        isActive: aiGeneratedData.isActive !== false,
        isFeatured: aiGeneratedData.isFeatured || false,
        // Category specific fields
        portfolios: aiGeneratedData.portfolios || [],
        industries: aiGeneratedData.industries || [],
        capabilities: aiGeneratedData.capabilities || [],
        valuePropositions: aiGeneratedData.valuePropositions || [],
        pricingModel: aiGeneratedData.pricingModel || "",
        integrations: aiGeneratedData.integrations || [],
        apiSupport: aiGeneratedData.apiSupport || false,
        batteryCapacity: aiGeneratedData.batteryCapacity || "",
        range: aiGeneratedData.range || "",
        chargingTime: aiGeneratedData.chargingTime || "",
        motorType: aiGeneratedData.motorType || "",
        material: aiGeneratedData.material || [],
        dimensions: aiGeneratedData.dimensions || "",
        weight: aiGeneratedData.weight || "",
        assemblyRequired: aiGeneratedData.assemblyRequired || false,
        sizes: aiGeneratedData.sizes || [],
        colors: aiGeneratedData.colors || [],
        fabric: aiGeneratedData.fabric || [],
        careInstructions: aiGeneratedData.careInstructions || [],
      })
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
        portfolios: [],
        industries: [],
        capabilities: [],
        valuePropositions: [],
        pricingModel: "",
        integrations: [],
        apiSupport: false,
        batteryCapacity: "",
        range: "",
        chargingTime: "",
        motorType: "",
        material: [],
        dimensions: "",
        weight: "",
        assemblyRequired: false,
        sizes: [],
        colors: [],
        fabric: [],
        careInstructions: [],
      })
    }
  }, [project, aiGeneratedData])

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

  // Generic add/remove functions for arrays
  const addToArray = (field: keyof Project, value: string, setter: (value: string) => void) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...(prev[field] as string[] || []), value.trim()],
      }))
      setter("")
    }
  }

  const removeFromArray = (field: keyof Project, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[])?.filter((_, i) => i !== index) || [],
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

  const renderCategorySpecificFields = () => {
    switch (formData.category) {
      case 'Software products':
        return (
          <div className="space-y-6">
            {/* Portfolios */}
            <div className="space-y-2">
              <Label>Portfolios</Label>
              <div className="flex gap-2">
                <Input
                  value={newPortfolio}
                  onChange={(e) => setNewPortfolio(e.target.value)}
                  placeholder="Add portfolio"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addToArray('portfolios', newPortfolio, setNewPortfolio))}
                />
                <Button type="button" onClick={() => addToArray('portfolios', newPortfolio, setNewPortfolio)} variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.portfolios && formData.portfolios.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.portfolios.map((portfolio, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {portfolio}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromArray('portfolios', index)}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Industries */}
            <div className="space-y-2">
              <Label>Industries Served</Label>
              <div className="flex gap-2">
                <Input
                  value={newIndustry}
                  onChange={(e) => setNewIndustry(e.target.value)}
                  placeholder="Add industry"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addToArray('industries', newIndustry, setNewIndustry))}
                />
                <Button type="button" onClick={() => addToArray('industries', newIndustry, setNewIndustry)} variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.industries && formData.industries.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.industries.map((industry, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      {industry}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromArray('industries', index)}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Capabilities */}
            <div className="space-y-2">
              <Label>Key Capabilities</Label>
              <div className="flex gap-2">
                <Input
                  value={newCapability}
                  onChange={(e) => setNewCapability(e.target.value)}
                  placeholder="Add capability"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addToArray('capabilities', newCapability, setNewCapability))}
                />
                <Button type="button" onClick={() => addToArray('capabilities', newCapability, setNewCapability)} variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.capabilities && formData.capabilities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.capabilities.map((capability, index) => (
                    <Badge key={index} variant="default" className="gap-1">
                      {capability}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromArray('capabilities', index)}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Value Propositions */}
            <div className="space-y-2">
              <Label>Value Propositions</Label>
              <div className="flex gap-2">
                <Input
                  value={newValueProposition}
                  onChange={(e) => setNewValueProposition(e.target.value)}
                  placeholder="Add value proposition"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addToArray('valuePropositions', newValueProposition, setNewValueProposition))}
                />
                <Button type="button" onClick={() => addToArray('valuePropositions', newValueProposition, setNewValueProposition)} variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.valuePropositions && formData.valuePropositions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.valuePropositions.map((vp, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      {vp}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromArray('valuePropositions', index)}
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
        )

      case 'saap':
        return (
          <div className="space-y-6">
            {/* Pricing Model */}
            <div className="space-y-2">
              <Label>Pricing Model</Label>
              <Input
                value={formData.pricingModel || ""}
                onChange={(e) => handleInputChange("pricingModel", e.target.value)}
                placeholder="e.g., Subscription, Pay-per-use, Freemium"
              />
            </div>

            {/* Integrations */}
            <div className="space-y-2">
              <Label>Integrations</Label>
              <div className="flex gap-2">
                <Input
                  value={newIntegration}
                  onChange={(e) => setNewIntegration(e.target.value)}
                  placeholder="Add integration"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addToArray('integrations', newIntegration, setNewIntegration))}
                />
                <Button type="button" onClick={() => addToArray('integrations', newIntegration, setNewIntegration)} variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.integrations && formData.integrations.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.integrations.map((integration, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {integration}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromArray('integrations', index)}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* API Support */}
            <div className="flex items-center space-x-2">
              <Switch
                id="apiSupport"
                checked={formData.apiSupport || false}
                onCheckedChange={(checked) => handleInputChange("apiSupport", checked)}
              />
              <Label htmlFor="apiSupport">API Support Available</Label>
            </div>
          </div>
        )

      case 'electric vehicles':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Battery Capacity */}
              <div className="space-y-2">
                <Label>Battery Capacity</Label>
                <Input
                  value={formData.batteryCapacity || ""}
                  onChange={(e) => handleInputChange("batteryCapacity", e.target.value)}
                  placeholder="e.g., 75 kWh"
                />
              </div>

              {/* Range */}
              <div className="space-y-2">
                <Label>Range</Label>
                <Input
                  value={formData.range || ""}
                  onChange={(e) => handleInputChange("range", e.target.value)}
                  placeholder="e.g., 400 km"
                />
              </div>

              {/* Charging Time */}
              <div className="space-y-2">
                <Label>Charging Time</Label>
                <Input
                  value={formData.chargingTime || ""}
                  onChange={(e) => handleInputChange("chargingTime", e.target.value)}
                  placeholder="e.g., 45 minutes (DC fast charging)"
                />
              </div>

              {/* Motor Type */}
              <div className="space-y-2">
                <Label>Motor Type</Label>
                <Input
                  value={formData.motorType || ""}
                  onChange={(e) => handleInputChange("motorType", e.target.value)}
                  placeholder="e.g., Permanent Magnet Synchronous"
                />
              </div>
            </div>
          </div>
        )

      case 'furnitures':
        return (
          <div className="space-y-6">
            {/* Materials */}
            <div className="space-y-2">
              <Label>Materials</Label>
              <div className="flex gap-2">
                <Input
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value)}
                  placeholder="Add material"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addToArray('material', newMaterial, setNewMaterial))}
                />
                <Button type="button" onClick={() => addToArray('material', newMaterial, setNewMaterial)} variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.material && formData.material.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.material.map((mat, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {mat}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromArray('material', index)}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dimensions */}
              <div className="space-y-2">
                <Label>Dimensions</Label>
                <Input
                  value={formData.dimensions || ""}
                  onChange={(e) => handleInputChange("dimensions", e.target.value)}
                  placeholder="e.g., 120 x 80 x 75 cm"
                />
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <Label>Weight</Label>
                <Input
                  value={formData.weight || ""}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  placeholder="e.g., 25 kg"
                />
              </div>
            </div>

            {/* Assembly Required */}
            <div className="flex items-center space-x-2">
              <Switch
                id="assemblyRequired"
                checked={formData.assemblyRequired || false}
                onCheckedChange={(checked) => handleInputChange("assemblyRequired", checked)}
              />
              <Label htmlFor="assemblyRequired">Assembly Required</Label>
            </div>
          </div>
        )

      case 'garments':
        return (
          <div className="space-y-6">
            {/* Sizes */}
            <div className="space-y-2">
              <Label>Available Sizes</Label>
              <div className="flex gap-2">
                <Input
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  placeholder="Add size"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addToArray('sizes', newSize, setNewSize))}
                />
                <Button type="button" onClick={() => addToArray('sizes', newSize, setNewSize)} variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.sizes && formData.sizes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.sizes.map((size, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {size}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromArray('sizes', index)}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Colors */}
            <div className="space-y-2">
              <Label>Available Colors</Label>
              <div className="flex gap-2">
                <Input
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  placeholder="Add color"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addToArray('colors', newColor, setNewColor))}
                />
                <Button type="button" onClick={() => addToArray('colors', newColor, setNewColor)} variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.colors && formData.colors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.colors.map((color, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      {color}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromArray('colors', index)}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Fabric */}
            <div className="space-y-2">
              <Label>Fabric Composition</Label>
              <div className="flex gap-2">
                <Input
                  value={newFabric}
                  onChange={(e) => setNewFabric(e.target.value)}
                  placeholder="Add fabric type"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addToArray('fabric', newFabric, setNewFabric))}
                />
                <Button type="button" onClick={() => addToArray('fabric', newFabric, setNewFabric)} variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.fabric && formData.fabric.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.fabric.map((fab, index) => (
                    <Badge key={index} variant="default" className="gap-1">
                      {fab}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromArray('fabric', index)}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Care Instructions */}
            <div className="space-y-2">
              <Label>Care Instructions</Label>
              <div className="flex gap-2">
                <Input
                  value={newCareInstruction}
                  onChange={(e) => setNewCareInstruction(e.target.value)}
                  placeholder="Add care instruction"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addToArray('careInstructions', newCareInstruction, setNewCareInstruction))}
                />
                <Button type="button" onClick={() => addToArray('careInstructions', newCareInstruction, setNewCareInstruction)} variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.careInstructions && formData.careInstructions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.careInstructions.map((instruction, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      {instruction}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromArray('careInstructions', index)}
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
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {project ? "Edit Product" : aiGeneratedData ? "Create Product from AI" : "Create New Product"}
          </DialogTitle>
        </DialogHeader>

        {aiGeneratedData && !project && (
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
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addToArray('technologies', newTechnology, setNewTechnology))}
                />
                <Button type="button" onClick={() => addToArray('technologies', newTechnology, setNewTechnology)} variant="outline" size="sm">
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
                        onClick={() => removeFromArray('technologies', index)}
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
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addToArray('features', newFeature, setNewFeature))}
                />
                <Button type="button" onClick={() => addToArray('features', newFeature, setNewFeature)} variant="outline" size="sm">
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
                        onClick={() => removeFromArray('features', index)}
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

          {/* Category-Specific Fields */}
          {formData.category && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Category-Specific Details</h3>
              {renderCategorySpecificFields()}
            </div>
          )}

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
              <Label htmlFor="isFeatured">Featured Product</Label>
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
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Rocket, Lightbulb, Zap, Code, Car, Sofa, Shirt, Monitor } from "lucide-react"
import { toast } from "sonner"

// Product categories with icons and descriptions
const PRODUCT_CATEGORIES = [
  { 
    value: 'Software products', 
    label: 'Software Products',
    icon: Code,
    description: 'Enterprise software, development tools, and digital solutions',
    fields: ['portfolios', 'industries', 'capabilities', 'valuePropositions']
  },
  { 
    value: 'saap', 
    label: 'SaaS',
    icon: Monitor,
    description: 'Software as a Service solutions and cloud platforms',
    fields: ['pricingModel', 'integrations', 'apiSupport']
  },
  { 
    value: 'electric vehicles', 
    label: 'Electric Vehicles',
    icon: Car,
    description: 'Electric cars, bikes, and transportation solutions',
    fields: ['batteryCapacity', 'range', 'chargingTime', 'motorType']
  },
  { 
    value: 'furnitures', 
    label: 'Furnitures',
    icon: Sofa,
    description: 'Home and office furniture products',
    fields: ['material', 'dimensions', 'weight', 'assemblyRequired']
  },
  { 
    value: 'garments', 
    label: 'Garments',
    icon: Shirt,
    description: 'Clothing and fashion products',
    fields: ['sizes', 'colors', 'fabric', 'careInstructions']
  }
]

interface Project {
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
  
  // Category-specific fields
  portfolios?: string[]
  industries?: string[]
  capabilities?: string[]
  valuePropositions?: string[]
  pricingModel?: string
  integrations?: string[]
  apiSupport?: boolean
  batteryCapacity?: string
  range?: string
  chargingTime?: string
  motorType?: string
  material?: string[]
  dimensions?: string
  weight?: string
  assemblyRequired?: boolean
  sizes?: string[]
  colors?: string[]
  fabric?: string[]
  careInstructions?: string[]
}

interface ProjectAIModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateProject: (projectData: Project) => void
}

export function ProjectAIModal({ open, onOpenChange, onCreateProject }: ProjectAIModalProps) {
  const [category, setCategory] = useState("")
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!category) {
      toast.error("Please select a product category")
      return
    }
    
    if (!prompt.trim()) {
      toast.error("Please enter a prompt")
      return
    }

    setLoading(true)
    
    try {
      const toastId = toast.loading("Generating AI project content...")

      // Create enhanced prompt with category context
      const enhancedPrompt = `Create a ${category} product with the following description: ${prompt.trim()}. 

      Please ensure the response includes appropriate fields for this category type and follows GT Tech's expertise in advanced technology solutions.`

      const response = await fetch("/api/generate-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          prompt: enhancedPrompt,
          category: category 
        }),
      })

      const data = await response.json()

      if (data.success) {
        const generatedProject = JSON.parse(data.content)

        console.log("Generated project data:", generatedProject)
        
        // Transform the AI response to match Project interface with category-specific fields
        const projectData: Project = {
          title: generatedProject.title,
          category: category, // Use selected category
          description: generatedProject.description,
          poster: generatedProject.poster || "/placeholder.svg?height=400&width=600",
          images: generatedProject.images || [
            "/placeholder.svg?height=300&width=400",
            "/placeholder.svg?height=300&width=400"
          ],
          icon: generatedProject.icon || getDefaultIconForCategory(category),
          technologies: generatedProject.technologies || [],
          features: generatedProject.features || [],
          isActive: generatedProject.isActive !== false,
          isFeatured: generatedProject.isFeatured || false,
          
          // Category-specific fields
          ...(category === 'Software products' && {
            portfolios: generatedProject.portfolios || [],
            industries: generatedProject.industries || [],
            capabilities: generatedProject.capabilities || [],
            valuePropositions: generatedProject.valuePropositions || []
          }),
          
          ...(category === 'saap' && {
            pricingModel: generatedProject.pricingModel || "",
            integrations: generatedProject.integrations || [],
            apiSupport: generatedProject.apiSupport || false
          }),
          
          ...(category === 'electric vehicles' && {
            batteryCapacity: generatedProject.batteryCapacity || "",
            range: generatedProject.range || "",
            chargingTime: generatedProject.chargingTime || "",
            motorType: generatedProject.motorType || ""
          }),
          
          ...(category === 'furnitures' && {
            material: generatedProject.material || [],
            dimensions: generatedProject.dimensions || "",
            weight: generatedProject.weight || "",
            assemblyRequired: generatedProject.assemblyRequired || false
          }),
          
          ...(category === 'garments' && {
            sizes: generatedProject.sizes || [],
            colors: generatedProject.colors || [],
            fabric: generatedProject.fabric || [],
            careInstructions: generatedProject.careInstructions || []
          })
        }

        onCreateProject(projectData)
        setPrompt("")
        setCategory("")
        toast.dismiss(toastId)
        toast.success("AI-generated project created successfully!")
        onOpenChange(false)
        
      } else {
        toast.dismiss(toastId)
        toast.error(data.message || "Failed to generate project content")
      }
    } catch (error) {
      console.error("AI Generation Error:", error)
      toast.dismiss()
      toast.error("Failed to generate project content")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setPrompt("")
    setCategory("")
    onOpenChange(false)
  }

  const getDefaultIconForCategory = (cat: string): string => {
    switch (cat) {
      case 'Software products': return 'code'
      case 'saap': return 'monitor'
      case 'electric vehicles': return 'zap'
      case 'furnitures': return 'layers'
      case 'garments': return 'star'
      default: return 'rocket'
    }
  }

  const selectedCategoryData = PRODUCT_CATEGORIES.find(cat => cat.value === category)

  const getCategorySpecificPromptExample = () => {
    switch (category) {
      case 'Software products':
        return "AI-powered CAD software for automotive design with advanced simulation capabilities, supporting multiple portfolios including design engineering and systems modeling"
      case 'saap':
        return "Cloud-based project management platform with API integrations for enterprise teams, freemium pricing model with advanced collaboration features"
      case 'electric vehicles':
        return "Electric sports car with 500km range, 80kWh battery capacity, fast charging in 30 minutes, and dual-motor AWD system"
      case 'furnitures':
        return "Modern office desk made from sustainable bamboo materials, 120x60x75cm dimensions, easy assembly with ergonomic design"
      case 'garments':
        return "Premium cotton t-shirt collection available in multiple sizes (S-XXL) and colors, with eco-friendly fabric and easy care instructions"
      default:
        return "Advanced technology solution for industry innovation"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-purple-600" />
            Create Project with AI
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Select Product Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a product category" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_CATEGORIES.map((cat) => {
                  const IconComponent = cat.icon
                  return (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <span>{cat.label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            {selectedCategoryData && (
              <p className="text-sm text-muted-foreground">
                {selectedCategoryData.description}
              </p>
            )}
          </div>

          {/* Prompt Input */}
          <div className="space-y-2">
            <Label htmlFor="prompt">Describe the product you want to create</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={category ? getCategorySpecificPromptExample() : "First select a category to see examples..."}
              rows={4}
              className="resize-none"
              disabled={loading || !category}
            />
          </div>

          {/* Category-specific guidance */}
          {selectedCategoryData && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <selectedCategoryData.icon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    {selectedCategoryData.label} Specific Fields
                  </p>
                  <p className="text-blue-700 dark:text-blue-300 mb-2">
                    The AI will generate content including these category-specific fields:
                  </p>
                  <ul className="text-blue-600 dark:text-blue-300 text-xs space-y-1">
                    {selectedCategoryData.fields.map((field) => (
                      <li key={field}>• {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* General AI Tips */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-purple-900 dark:text-purple-100 mb-1">AI Assistant Tips</p>
                <p className="text-purple-700 dark:text-purple-300 mb-2">
                  Be specific about GT Tech's capabilities and your product requirements:
                </p>
                <ul className="text-purple-600 dark:text-purple-300 text-xs space-y-1">
                  <li>• <strong>Technologies:</strong> Mention specific tech stack, tools, or innovations</li>
                  <li>• <strong>Target Market:</strong> Specify the intended industry or user base</li>
                  <li>• <strong>Key Features:</strong> Highlight unique selling points and functionalities</li>
                  <li>• <strong>Use Cases:</strong> Describe practical applications and benefits</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim() || !category}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate {selectedCategoryData?.label || 'Product'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
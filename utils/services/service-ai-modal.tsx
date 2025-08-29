"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Rocket, Lightbulb } from "lucide-react"
import { toast } from "sonner"
import type { Service } from "@/app/admin/services/page"

const SERVICE_SECTIONS = [
  { value: "Development", fields: ["technologies", "capabilities", "lists"] },
  { value: "Design", fields: ["capabilities", "lists"] },
  { value: "Marketing", fields: ["capabilities", "lists"] },
  { value: "Consulting", fields: ["capabilities", "lists"] },
]

const DESIGN_TYPES = ["modern", "minimal", "classic", "brutalist", "glassmorphism"]

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  onCreateService: (serviceDraft: Partial<Service>) => void
}

export function ServiceAIModal({ open, onOpenChange, onCreateService }: Props) {
  const [section, setSection] = useState("")
  const [designType, setDesignType] = useState("modern")
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCancel = () => {
    setSection("")
    setDesignType("modern")
    setPrompt("")
    onOpenChange(false)
  }

  const generateSystemPrompt = (section: string, designType: string, userPrompt: string) => {
    return `You are an AI assistant that generates professional service offerings for GT Tech, a leading technology company. Your task is to create a comprehensive service draft based on the user's description.

INSTRUCTIONS:
- Generate content for the "${section}" section with "${designType}" design approach
- Create professional, compelling copy that positions GT Tech as an industry leader
- Focus on technical excellence, innovation, and business value
- Ensure all content is production-ready and market-appropriate

REQUIRED OUTPUT FORMAT (JSON):
{
  "title": "Service title (max 80 characters)",
  "tagline": "Compelling one-liner that highlights key value proposition",
  "description": "Detailed service description (200-500 words)",
  "technologies": ["Array of relevant technologies/tools"],
  "capabilities": ["Array of key capabilities/features"],
  "lists": ["Array of service benefits/deliverables (3-6 items)"],
  "icon": "lucide-react icon name for ${section.toLowerCase()}",
  "designType": "${designType}"
}

SECTION-SPECIFIC GUIDELINES:
${getSectionGuidelines(section)}

USER REQUEST: ${userPrompt}

Generate a complete, professional service offering that would appeal to enterprise clients and showcase GT Tech's expertise.`
  }

  const getSectionGuidelines = (section: string) => {
    switch (section) {
      case "Development":
        return `- Focus on modern web technologies, scalable architecture, and performance
- Include technologies like Next.js, React, TypeScript, cloud services
- Emphasize capabilities like SSR, RSC, SEO optimization, CI/CD
- Highlight deliverables like custom applications, APIs, deployment`
      case "Design":
        return `- Focus on user experience, modern design principles, and brand identity
- Include capabilities like UI/UX design, prototyping, design systems
- Emphasize user research, accessibility, responsive design
- Highlight deliverables like wireframes, prototypes, brand guidelines`
      case "Marketing":
        return `- Focus on digital marketing, growth strategies, and brand positioning
- Include capabilities like SEO, content marketing, social media, analytics
- Emphasize data-driven strategies, conversion optimization, lead generation
- Highlight deliverables like marketing campaigns, content strategy, analytics reports`
      case "Consulting":
        return `- Focus on strategic guidance, technical advisory, and digital transformation
- Include capabilities like architecture review, technology strategy, process optimization
- Emphasize expertise, industry knowledge, best practices
- Highlight deliverables like strategic roadmaps, technical audits, implementation guides`
      default:
        return ""
    }
  }

  const handleGenerate = async () => {
    if (!section) {
      toast.error("Please select a section")
      return
    }
    if (!prompt.trim()) {
      toast.error("Please enter a prompt")
      return
    }
    
    setLoading(true)
    const toastId = toast.loading("Generating service draft with AI...")
    
    try {
      const response = await fetch("/api/generate-service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          section,
          designType
        }),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.content) {
        const generatedService = JSON.parse(data.content)
        
        // Create base slug from prompt
        const baseSlug = prompt
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
        
        const draft: Partial<Service> = {
          slug: `${baseSlug || "new-service"}-${Date.now()}`,
          sectionName: section,
          title: generatedService.title,
          tagline: generatedService.tagline,
          description: generatedService.description,
          poster: "/service-poster.png",
          images: ["/service-gallery-1.png", "/service-gallery-2.png"],
          lists: generatedService.lists || [],
          designType,
          icon: generatedService.icon || iconForSection(section),
          isActive: true,
          isFeatured: false,
          technologies: generatedService.technologies || [],
          capabilities: generatedService.capabilities || [],
        }
        
        toast.dismiss(toastId)
        toast.success("AI-generated service draft created successfully!")
        onCreateService(draft)
        handleCancel()
      } else {
        throw new Error(data.message || "Failed to generate service content")
      }
    } catch (error: any) {
      console.error("OpenAI Generation Error:", error)
      toast.dismiss(toastId)
      toast.error(error?.message || "Failed to generate service draft")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-purple-600" />
            Create Service with AI
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Service Section *</Label>
              <Select value={section} onValueChange={setSection}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a section" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_SECTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Design Type</Label>
              <Select value={designType} onValueChange={setDesignType}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a design style" />
                </SelectTrigger>
                <SelectContent>
                  {DESIGN_TYPES.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Describe the service you want to create</Label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. End-to-end Next.js development with RSC, SEO, performance tuning, and CI/CD best practices"
              rows={4}
              className="resize-none"
              disabled={loading || !section}
            />
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-purple-900 dark:text-purple-100 mb-1">AI Assistant Tips</p>
                <p className="text-purple-700 dark:text-purple-300 mb-2">
                  Be specific about the stack, features, and outcomes you want:
                </p>
                <ul className="text-purple-600 dark:text-purple-300 text-xs space-y-1">
                  <li>• Technologies (Next.js, Tailwind, AWS, Postgres)</li>
                  <li>• Capabilities (SSR, RSC, Analytics, SEO)</li>
                  <li>• Deliverables (landing page, dashboard, auth)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              variant={"default"}
              disabled={loading || !prompt.trim() || !section}
             
            >
              {loading ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Draft
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function iconForSection(section: string): string {
  switch (section.toLowerCase()) {
    case "development":
      return "code"
    case "design":
      return "lightbulb"
    case "marketing":
      return "rocket"
    case "consulting":
      return "settings"
    default:
      return "star"
  }
}
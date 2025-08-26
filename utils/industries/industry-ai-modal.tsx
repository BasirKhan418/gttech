"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Sparkles, Brain, Lightbulb } from "lucide-react"
import { toast } from "sonner"

interface Industry {
  title: string
  subtitle: string
  description: string
  highlights: string[]
  technologies: string[]
  poster: string
  images: string[]
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
}

interface IndustryAIModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateIndustry: (industryData: Industry) => void
}

export function IndustryAIModal({ open, onOpenChange, onCreateIndustry }: IndustryAIModalProps) {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt")
      return
    }

    setLoading(true)
    
    try {
      const toastId = toast.loading("Generating AI industry content...")

      const response = await fetch("/api/generate-industry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })

      const data = await response.json()

      if (data.success) {
        const generatedIndustry = JSON.parse(data.content)

        console.log("Generated industry data:", generatedIndustry)
        
        // Transform the AI response to match Industry interface
        const industryData: Industry = {
          title: generatedIndustry.title,
          subtitle: generatedIndustry.subtitle,
          description: generatedIndustry.description,
          highlights: generatedIndustry.highlights || [],
          technologies: generatedIndustry.technologies || [],
          poster: "/placeholder.svg?height=400&width=600",
          images: [
            "/placeholder.svg?height=300&width=400",
            "/placeholder.svg?height=300&width=400"
          ],
          category: generatedIndustry.category || "technology",
          gradientFrom: generatedIndustry.gradientFrom || "from-blue-500/20",
          gradientTo: generatedIndustry.gradientTo || "to-cyan-500/20",
          borderColor: generatedIndustry.borderColor || "border-blue-500/20",
          hoverBorderColor: generatedIndustry.hoverBorderColor || "hover:border-blue-400/40",
          textColor: generatedIndustry.textColor || "text-blue-400",
          hoverTextColor: generatedIndustry.hoverTextColor || "group-hover:text-blue-200",
          buttonGradient: generatedIndustry.buttonGradient || "from-blue-500/80 to-blue-600/80 hover:from-blue-600/90 hover:to-blue-700/90",
          iconBg: generatedIndustry.iconBg || "bg-gradient-to-r from-blue-500/20 to-cyan-500/20",
          iconBorder: generatedIndustry.iconBorder || "border-blue-400/30",
          isActive: generatedIndustry.isActive !== false,
          isFeatured: generatedIndustry.isFeatured || false,
        }

        onCreateIndustry(industryData)
        setPrompt("")
        toast.dismiss(toastId)
        toast.success("AI-generated industry created successfully!")
        onOpenChange(false)
        
      } else {
        toast.dismiss(toastId)
        toast.error(data.message || "Failed to generate industry content")
      }
    } catch (error) {
      console.error("AI Generation Error:", error)
      toast.dismiss()
      toast.error("Failed to generate industry content")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setPrompt("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Create Industry with AI
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Describe the industry solution you want to create</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Create an automotive industry solution focusing on electric vehicle development, advanced manufacturing, crash safety systems, and digital twin technology for GT Tech..."
              rows={4}
              className="resize-none"
              disabled={loading}
            />
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">AI Assistant Tips</p>
                <p className="text-blue-700 dark:text-blue-300 mb-2">
                  Be specific about GT Tech's core focus areas:
                </p>
                <ul className="text-blue-600 dark:text-blue-300 text-xs space-y-1">
                  <li>• <strong>Industries:</strong> Automotive, Aerospace, Construction, Mining, Railways, Shipbuilding</li>
                  <li>• <strong>Technologies:</strong> 3D Printing, AR/VR, AI/ML, Robotics, IoT, Digital Manufacturing</li>
                  <li>• <strong>Solutions:</strong> Digital Twins, Advanced Manufacturing, Electric Vehicles, Smart Cities</li>
                  <li>• <strong>Approach:</strong> Include specific benefits, target outcomes, and technical capabilities</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <h4 className="font-medium mb-2 text-amber-900 dark:text-amber-100">Example Prompts:</h4>
            <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
              <li>• "Automotive industry solution with electric vehicle development and crash safety systems"</li>
              <li>• "Mining technology platform with digital planning and automation capabilities"</li>
              <li>• "Aerospace engineering services for component design and virtual prototyping"</li>
              <li>• "Smart city construction solutions with sustainable infrastructure and IoT integration"</li>
            </ul>
          </div>

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
              disabled={loading || !prompt.trim()}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              {loading ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Industry
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
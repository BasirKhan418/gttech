"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Sparkles, Rocket, Lightbulb } from "lucide-react"
import { toast } from "sonner"

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
}

interface ProjectAIModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateProject: (projectData: Project) => void
}

export function ProjectAIModal({ open, onOpenChange, onCreateProject }: ProjectAIModalProps) {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt")
      return
    }

    setLoading(true)
    
    try {
      const toastId = toast.loading("Generating AI project content...")

      const response = await fetch("/api/generate-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })

      const data = await response.json()

      if (data.success) {
        const generatedProject = JSON.parse(data.content)

        console.log("Generated project data:", generatedProject)
        
        // Transform the AI response to match Project interface
        const projectData: Project = {
          title: generatedProject.title,
          category: generatedProject.category,
          description: generatedProject.description,
          poster: generatedProject.poster || "/placeholder.svg?height=400&width=600",
          images: generatedProject.images || [
            "/placeholder.svg?height=300&width=400",
            "/placeholder.svg?height=300&width=400"
          ],
          icon: generatedProject.icon || "rocket",
          technologies: generatedProject.technologies || [],
          features: generatedProject.features || [],
          isActive: generatedProject.isActive !== false,
          isFeatured: generatedProject.isFeatured || false,
        }

        onCreateProject(projectData)
        setPrompt("")
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
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-purple-600" />
            Create Project with AI
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Describe the project/product you want to create</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Create a 3D printing automation system for automotive parts manufacturing with AI-powered quality control, robotic handling, and real-time monitoring dashboard..."
              rows={4}
              className="resize-none"
              disabled={loading}
            />
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-purple-900 dark:text-purple-100 mb-1">AI Assistant Tips</p>
                <p className="text-purple-700 dark:text-purple-300 mb-2">
                  Be specific about GT Tech's project categories and capabilities:
                </p>
                <ul className="text-purple-600 dark:text-purple-300 text-xs space-y-1">
                  <li>• <strong>Categories:</strong> Digital Manufacturing, 3D Printing, Electric Vehicles, AI/ML Solutions</li>
                  <li>• <strong>Technologies:</strong> Robotics, IoT, AR/VR, Advanced Materials, Automation</li>
                  <li>• <strong>Features:</strong> Include specific functionalities, benefits, and technical capabilities</li>
                  <li>• <strong>Target:</strong> Mention the intended industry or use case for better context</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="font-medium mb-2 text-green-900 dark:text-green-100">Example Prompts:</h4>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
              <li>• "AI-powered 3D printing system with automated quality control for aerospace components"</li>
              <li>• "Electric vehicle battery management system with IoT monitoring and predictive analytics"</li>
              <li>• "Digital twin platform for mining operations with real-time data visualization"</li>
              <li>• "Robotic assembly line for automotive parts with machine learning optimization"</li>
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
                  Generate Project
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Sparkles } from "lucide-react"
import { toast,Toaster } from "sonner"
interface AIGenerateModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (content: any) => void
}

export function AIGenerateModal({ isOpen, onClose, onSuccess }: AIGenerateModalProps) {
  const [prompt, setPrompt] = useState("")
  const [generating, setGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate content")
      return
    }

    try {
      setGenerating(true)

      // Simulate AI generation with mock data
      // In a real implementation, you would call your AI service here
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const generatedContent = {
        sectionName: "AI Generated",
        title: `AI Generated: ${prompt.slice(0, 50)}...`,
        description: `This content was generated based on your prompt: "${prompt}". Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.`,
        poster: "/placeholder.svg?height=400&width=600",
        images: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
        lists: ["AI-generated feature 1", "AI-generated feature 2", "AI-generated feature 3", "AI-generated feature 4"],
        designType: "feature",
      }

      toast.success("Content generated successfully");

      onSuccess(generatedContent)
    } catch (error) {
     toast.error("Error generating content. Please try again later.");
    } finally {
      setGenerating(false)
    }
  }

  const handleClose = () => {
    setPrompt("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
        <Toaster position="top-right" richColors />
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Generate Content with AI
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Describe the content you want to generate</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Create a hero section for a tech startup that focuses on AI solutions, with a modern design and compelling call-to-action..."
              rows={6}
              className="resize-none"
            />
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Tips for better results:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Be specific about the type of content (hero, about, services, etc.)</li>
              <li>Mention your industry or business type</li>
              <li>Include desired tone (professional, friendly, modern, etc.)</li>
              <li>Specify any key features or benefits to highlight</li>
            </ul>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleGenerate} disabled={generating || !prompt.trim()} className="gap-2">
              {generating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Generate Content
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

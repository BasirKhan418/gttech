"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Sparkles, Loader2 } from "lucide-react"

interface AIPromptModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (prompt: string) => void
}

export function AIPromptModal({ isOpen, onClose, onSubmit }: AIPromptModalProps) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!prompt.trim()) {
      return
    }

    setIsGenerating(true)

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    onSubmit(prompt.trim())
    setPrompt("")
    setIsGenerating(false)
  }

  const handleClose = () => {
    if (!isGenerating) {
      setPrompt("")
      onClose()
    }
  }

  const examplePrompts = [
    "Create a hero slider for a modern tech startup",
    "Design a product showcase for eco-friendly products",
    "Make a testimonial slider for a fitness app",
    "Build a feature highlight for a SAAP platform",
  ]

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Slider Generator
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt">Describe your slider</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what kind of slider you want to create..."
              rows={4}
              className="resize-none"
              disabled={isGenerating}
            />
            <p className="text-sm text-muted-foreground">
              Be specific about the purpose, style, and content you want for your slider.
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Example prompts:</Label>
            <div className="grid gap-2">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setPrompt(example)}
                  disabled={isGenerating}
                  className="text-left p-3 text-sm bg-muted/50 hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="w-full sm:w-auto bg-transparent"
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!prompt.trim() || isGenerating} className="w-full sm:w-auto">
              {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isGenerating ? "Generating..." : "Generate Slider"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

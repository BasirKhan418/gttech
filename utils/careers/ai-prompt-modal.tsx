"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Sparkles, Wand2 } from "lucide-react"
import { toast } from "sonner"
import type { CreateCareerData } from "./career"

interface AIPromptModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateCareer: (careerData: CreateCareerData) => void
}

export function AIPromptModal({ open, onOpenChange, onCreateCareer }: AIPromptModalProps) {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt")
      return
    }

    setLoading(true)
    
    try {
      const toastId = toast.loading("Generating AI career posting...")

      const response = await fetch("/api/generate-career", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })

      const data = await response.json()

      

      if (data.success) {
        const generatedCareer = JSON.parse(data.content)

        console.log("data is carerer",generatedCareer);
        
        // Transform the AI response to match CreateCareerData interface
        const careerData: CreateCareerData = {
          role: generatedCareer.role,
          experience: generatedCareer.experience,
          requirements: generatedCareer.requirements,
          description: generatedCareer.description,
          location: generatedCareer.location,
          mode: generatedCareer.mode,
          applyUrl: generatedCareer.applyUrl || "",
          salary: generatedCareer.salary,
          department: generatedCareer.department,
          employmentType: generatedCareer.employmentType,
          skills: generatedCareer.skills || [],
          benefits: generatedCareer.benefits || [],
          isActive: true,
          applicationDeadline: generatedCareer.applicationDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        }

        onCreateCareer(careerData)
        setPrompt("")
        toast.dismiss(toastId)
        toast.success("AI-generated career created successfully!")
        onOpenChange(false)
        
      } else {
        toast.dismiss(toastId)
        toast.error(data.message || "Failed to generate career posting")
      }
    } catch (error) {
      console.error("AI Generation Error:", error)
      toast.dismiss()
      toast.error("Failed to generate career posting")
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Create Career with AI
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Describe the job you want to create</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Create a senior 3D printing engineer position for GT Tech, expertise in additive manufacturing, automotive applications, hybrid work model, competitive package..."
              rows={4}
              className="resize-none"
              disabled={loading}
            />
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-3">
              <Wand2 className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-purple-900 dark:text-purple-100 mb-1">AI Assistant Tips</p>
                <p className="text-purple-700 dark:text-purple-300">
                  Be specific about GT Tech's focus areas: 3D printing, electric vehicles, aerospace, automotive, construction, mining, or training programs. Include experience level, technical requirements, and work preferences.
                </p>
              </div>
            </div>
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
                  Generate Career
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
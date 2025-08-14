"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Wand2, Brain, Zap } from "lucide-react"
import { toast } from "sonner"

interface Content {
  sectionName: string
  title: string
  description: string
  poster: string
  images: string[]
  lists: string[]
  designType: string
}

interface AIGenerateModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (content: Partial<Content>) => void
}

export function AIGenerateModal({ isOpen, onClose, onSuccess }: AIGenerateModalProps) {
  const [prompt, setPrompt] = useState("")
  const [contentType, setContentType] = useState("")
  const [industry, setIndustry] = useState("")
  const [loading, setLoading] = useState(false)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!prompt.trim() || !contentType || !industry) {
      toast.error("Please fill in all fields")
      return
    }

    setLoading(true)

    try {
      // Simulate AI generation (replace with actual AI API call)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const generatedContent: Partial<Content> = {
        sectionName: `${industry} ${contentType}`,
        title: `AI Generated: ${prompt.slice(0, 50)}...`,
        description: `This is an AI-generated description based on your prompt: "${prompt}". The content is designed for ${industry} industry with a focus on ${contentType} layout.`,
        poster: "https://via.placeholder.com/800x400?text=AI+Generated+Content",
        images: [
          "https://via.placeholder.com/400x300?text=Image+1",
          "https://via.placeholder.com/400x300?text=Image+2"
        ],
        lists: [
          "AI-powered feature analysis",
          "Industry-specific optimization",
          "Automated content generation",
          "Smart layout suggestions"
        ],
        designType: contentType
      }

      toast.success("Content generated successfully!")
      onSuccess(generatedContent)
    } catch (error) {
      toast.error("Failed to generate content. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setPrompt("")
    setContentType("")
    setIndustry("")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-slate-900/95 backdrop-blur-xl border border-purple-500/30 text-white">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent rounded-lg"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-purple-500/[0.08] via-transparent to-pink-500/[0.05] rounded-lg"></div>
        
        {/* Animated Background Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 rounded-full animate-float ${
                i % 2 === 0 ? 'bg-purple-400/60' : 'bg-pink-400/40'
              }`}
              style={{
                left: `${10 + (i * 15)}%`,
                top: `${15 + (i * 12)}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + (i % 2)}s`
              }}
            ></div>
          ))}
        </div>
        
        <div className="relative z-10">
          <DialogHeader className="space-y-4 pb-6 border-b border-purple-500/20">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-400/30 backdrop-blur-sm">
              <Sparkles className="w-8 h-8 text-purple-400" />
            </div>
            
            <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent">
              AI Content Generator
            </DialogTitle>
            
            <p className="text-gray-300 text-center text-sm">
              Describe your content needs and let AI create it for you
            </p>
          </DialogHeader>

          <form onSubmit={handleGenerate} className="space-y-6 pt-6">
            {/* Content Prompt */}
            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-white font-medium flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                Content Description
              </Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
                rows={4}
                className="bg-black/20 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400/60 focus:ring-purple-400/30 resize-none"
                placeholder="Describe what kind of content you want to create. Be specific about features, benefits, target audience, etc."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Content Type */}
              <div className="space-y-2">
                <Label className="text-white font-medium flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-pink-400" />
                  Design Type
                </Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger className="bg-black/20 border-purple-500/30 text-white focus:border-purple-400/60 focus:ring-purple-400/30">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-purple-500/30 text-white">
                    <SelectItem value="hero">Hero Section</SelectItem>
                    <SelectItem value="feature">Feature Section</SelectItem>
                    <SelectItem value="card">Card Layout</SelectItem>
                    <SelectItem value="banner">Banner</SelectItem>
                    <SelectItem value="grid">Grid Layout</SelectItem>
                    <SelectItem value="list">List Layout</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Industry */}
              <div className="space-y-2">
                <Label className="text-white font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  Industry Focus
                </Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger className="bg-black/20 border-purple-500/30 text-white focus:border-purple-400/60 focus:ring-purple-400/30">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-purple-500/30 text-white">
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="automotive">Automotive</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="general">General Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* AI Tips */}
            <div className="bg-purple-500/10 border border-purple-400/20 rounded-lg p-4 backdrop-blur-sm">
              <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                AI Tips for Better Results
              </h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Be specific about your target audience and goals</li>
                <li>• Mention key features or benefits you want to highlight</li>
                <li>• Include any specific tone or style preferences</li>
                <li>• Describe the problem your content should solve</li>
              </ul>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-purple-500/20">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="bg-transparent border-gray-500/50 text-gray-300 hover:bg-gray-500/20 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !prompt.trim() || !contentType || !industry}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-500/25 relative overflow-hidden"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Generate Content
                  </div>
                )}
                
                {/* Button Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[300%] transition-transform duration-700"></div>
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
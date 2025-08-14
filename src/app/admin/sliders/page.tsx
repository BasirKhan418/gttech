"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye, Sparkles } from "lucide-react"
import { SliderModal } from "../../../../utils/slider/slider-modal"
import { DeleteConfirmModal } from "../../../../utils/slider/delete-confirm-modal"
import { AIPromptModal } from "../../../../utils/slider/ai-prompt-modal"
import {toast} from "sonner"
import { format } from "date-fns"

interface Slider {
  _id: string
  title: string
  category: string
  description: string
  image?: string
  lastEditedAuthor: {
    _id: string
    name: string
    email: string
  }
  author: {
    _id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export default function SlidersPage() {
  const [sliders, setSliders] = useState<Slider[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAIModalOpen, setIsAIModalOpen] = useState(false)
  const [aiGeneratedSlider, setAiGeneratedSlider] = useState<Partial<Slider> | null>(null)
  const [selectedSlider, setSelectedSlider] = useState<Slider | null>(null)
  const [sliderToDelete, setSliderToDelete] = useState<Slider | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const fetchSliders = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/slider")
      const data = await response.json()

      if (data.success) {
        setSliders(data.data || [])
      } else {
        toast.error(data.message || "Failed to fetch sliders")
      }
    } catch (error) {
      toast.error("Failed to fetch sliders")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSliders()
  }, [])

  const handleCreate = () => {
    setSelectedSlider(null)
    setAiGeneratedSlider(null)
    setIsModalOpen(true)
  }

  const handleAICreate = () => {
    setIsAIModalOpen(true)
  }

  const handleAIPromptSubmit = async (prompt: string) => {
    try {
      setIsGenerating(true)
      toast.loading("Generating AI content...")

      const response = await fetch("/api/generate-slider", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (data.success) {
        const generatedContent = JSON.parse(data.content)
        
        setAiGeneratedSlider({
          title: generatedContent.title,
          category: generatedContent.category,
          description: generatedContent.description,
          image: generatedContent.imageUrl || "",
        })

        setIsAIModalOpen(false)
        setSelectedSlider(null)
        setIsModalOpen(true)
        
        toast.dismiss()
        toast.success("AI Content Generated Successfully")
      } else {
        toast.dismiss()
        toast.error(data.message || "Failed to generate AI content")
      }
    } catch (error) {
      console.error("AI Generation Error:", error)
      toast.dismiss()
      toast.error("Failed to generate AI content")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEdit = (slider: Slider) => {
    setSelectedSlider(slider)
    setAiGeneratedSlider(null)
    setIsModalOpen(true)
  }

  const handleDelete = (slider: Slider) => {
    setSliderToDelete(slider)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!sliderToDelete) return

    try {
      const response = await fetch("/api/slider", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: sliderToDelete._id }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Slider deleted successfully");
        fetchSliders()
      } else {
        toast.error(data.message || "Failed to delete slider");
      }
    } catch (error) {
      toast.error("Failed to delete slider");
    } finally {
      setIsDeleteModalOpen(false)
      setSliderToDelete(null)
    }
  }

  const handleModalSuccess = () => {
    setIsModalOpen(false)
    setSelectedSlider(null)
    setAiGeneratedSlider(null)
    fetchSliders()
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Slider Management</h1>
          <p className="text-muted-foreground mt-2">Manage your website sliders and content</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            onClick={handleAICreate} 
            variant="outline" 
            className="w-full sm:w-auto bg-transparent"
            disabled={isGenerating}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "AI Create"}
          </Button>
          <Button onClick={handleCreate} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Create Slider
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Sliders ({sliders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {sliders.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <Eye className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No sliders found</h3>
              <p className="text-muted-foreground mb-4">Get started by creating your first slider</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button 
                  onClick={handleAICreate} 
                  variant="outline"
                  disabled={isGenerating}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isGenerating ? "Generating..." : "AI Create"}
                </Button>
                <Button onClick={handleCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Slider
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Title</TableHead>
                    <TableHead className="min-w-[120px]">Category</TableHead>
                    <TableHead className="min-w-[250px] hidden md:table-cell">Description</TableHead>
                    <TableHead className="min-w-[100px] hidden lg:table-cell">Image</TableHead>
                    <TableHead className="min-w-[150px] hidden xl:table-cell">Author</TableHead>
                    <TableHead className="min-w-[150px] hidden xl:table-cell">Last Edited By</TableHead>
                    <TableHead className="min-w-[120px] hidden sm:table-cell">Updated</TableHead>
                    <TableHead className="min-w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sliders.map((slider) => (
                    <TableRow key={slider._id}>
                      <TableCell className="font-medium">
                        <div className="max-w-[200px] truncate" title={slider.title}>
                          {slider.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {slider.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div
                          className="max-w-[250px] truncate text-sm text-muted-foreground"
                          title={slider.description}
                        >
                          {slider.description}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {slider.image ? (
                          <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
                            <img
                              src={slider.image || "/placeholder.svg"}
                              alt={slider.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="text-sm">
                          <div className="font-medium">{slider.author?.name || "Unknown"}</div>
                          <div className="text-muted-foreground text-xs">{slider.author?.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="text-sm">
                          <div className="font-medium">{slider.lastEditedAuthor?.name || "Unknown"}</div>
                          <div className="text-muted-foreground text-xs">{slider.lastEditedAuthor?.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(slider.updatedAt), "MMM dd, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(slider)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(slider)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <SliderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        slider={selectedSlider}
        aiGeneratedData={aiGeneratedSlider}
      />

      <AIPromptModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
        onSubmit={handleAIPromptSubmit}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Slider"
        description={`Are you sure you want to delete "${sliderToDelete?.title}"? This action cannot be undone.`}
      />
    </div>
  )
}
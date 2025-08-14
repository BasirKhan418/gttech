"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Plus, Sparkles } from "lucide-react"
import { ContentModal } from "../../../../utils/contents/content-modal"
import { DeleteConfirmDialog } from "../../../../utils/contents/delete-confirm-dialog"
import { AIGenerateModal } from "../../../../utils/contents/ai-generate-modal"
import { toast, Toaster } from "sonner"

interface Content {
  _id: string
  sectionName: string
  title: string
  description: string
  poster: string
  images: string[]
  lists: string[]
  designType: string
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

export default function ContentManagementPage() {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAIModalOpen, setIsAIModalOpen] = useState(false)
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)
  const [deleteContentId, setDeleteContentId] = useState<string | null>(null)

  useEffect(() => {
    fetchContents()
  }, [])

  const fetchContents = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/content")
      const data = await response.json()

      if (data.success) {
        setContents(data.data)
      } else {
        toast.error(data.message || "Failed to fetch contents")
      }
    } catch (error) {
      toast.error("Failed to fetch contents")
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setSelectedContent(null)
    setIsModalOpen(true)
  }

  const handleEdit = (content: Content) => {
    setSelectedContent(content)
    setIsModalOpen(true)
  }

  const handleDelete = (contentId: string) => {
    setDeleteContentId(contentId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteContentId) return

    try {
      const response = await fetch("/api/content", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: deleteContentId }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Content deleted successfully")
        fetchContents()
      } else {
        toast.error(data.message || "Failed to delete content")
      }
    } catch (error) {
      toast.error("Failed to delete content")
    } finally {
      setIsDeleteDialogOpen(false)
      setDeleteContentId(null)
    }
  }

  const handleModalSuccess = () => {
    setIsModalOpen(false)
    setSelectedContent(null)
    fetchContents()
  }

  const handleAIGenerate = () => {
    setIsAIModalOpen(true)
  }

  const handleAISuccess = (generatedContent: Partial<Content>) => {
    setSelectedContent(generatedContent as Content)
    setIsAIModalOpen(false)
    setIsModalOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 relative">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-tl from-sky-900/10 via-slate-800/20 to-cyan-900/10"></div>
        
        <div className="relative z-10 container mx-auto py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-sky-400 border-t-transparent"></div>
              <p className="text-gray-400 font-medium">Loading content...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 relative">
      <Toaster />
      
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        {/* Primary gradient background */}
        <div className="absolute inset-0 bg-gradient-to-tl from-sky-900/10 via-slate-800/20 to-cyan-900/10"></div>
        
        {/* Radial gradient overlays for depth */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-sky-500/5 via-sky-500/2 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-radial from-cyan-500/5 via-cyan-500/2 to-transparent rounded-full blur-3xl"></div>
        
        {/* Glass morphism overlay */}
        <div className="absolute inset-0 backdrop-blur-[0.5px] bg-gradient-to-br from-white/[0.01] via-white/[0.005] to-transparent"></div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(14,165,233,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,233,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-float ${
              i % 3 === 0 ? 'bg-sky-400/30' : i % 3 === 1 ? 'bg-cyan-400/20' : 'bg-white/15'
            }`}
            style={{
              left: `${5 + (i * 8)}%`,
              top: `${10 + (i * 7)}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${4 + (i % 3)}s`
            }}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 container mx-auto py-8 space-y-8">
          
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-sky-200 to-cyan-200 bg-clip-text text-transparent">
                Content Management
              </h1>
              <p className="text-gray-400 text-lg">Manage your content sections and articles</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleAIGenerate} 
                variant="outline" 
                className="gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30 text-purple-300 hover:bg-purple-500/30 hover:text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/10"
              >
                <Sparkles className="h-4 w-4" />
                Generate with AI
              </Button>
              <Button 
                onClick={handleCreate} 
                className="gap-2 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white shadow-lg shadow-sky-500/25 transition-all duration-300 hover:scale-105"
              >
                <Plus className="h-4 w-4" />
                Create Content
              </Button>
            </div>
          </div>

          {/* Content Card */}
          <Card className="glass-card bg-slate-900/40 backdrop-blur-xl border border-sky-500/20 shadow-2xl shadow-sky-500/10 overflow-hidden">
            {/* Glass Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-white/[0.01] to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-sky-500/[0.05] via-transparent to-cyan-500/[0.03]"></div>
            
            <CardHeader className="relative z-10 border-b border-sky-500/20 bg-slate-800/20 backdrop-blur-sm">
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-sky-500/30 to-cyan-500/30 rounded-lg flex items-center justify-center backdrop-blur-sm border border-sky-400/30">
                  <div className="w-4 h-4 bg-sky-400 rounded-sm"></div>
                </div>
                All Content ({contents.length})
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative z-10 p-0">
              {contents.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-sky-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm border border-sky-400/30">
                    <Plus className="w-8 h-8 text-sky-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-300 text-lg font-medium">No content found</p>
                    <p className="text-gray-500">Create your first content item to get started!</p>
                  </div>
                  <Button 
                    onClick={handleCreate}
                    className="mt-4 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Content
                  </Button>
                </div>
              ) : (
                <div className="bg-slate-800/30 backdrop-blur-sm border border-sky-500/10 rounded-lg m-6">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-sky-500/20 hover:bg-sky-500/5">
                        <TableHead className="text-gray-300 font-semibold">Section</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Title</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Design Type</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Last Updated By</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Updated</TableHead>
                        <TableHead className="text-right text-gray-300 font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contents.map((content, index) => (
                        <TableRow 
                          key={content._id} 
                          className="border-sky-500/10 hover:bg-sky-500/5 transition-colors duration-200 group"
                        >
                          <TableCell>
                            <Badge 
                              variant="secondary" 
                              className="bg-sky-500/20 text-sky-200 border border-sky-400/30 hover:bg-sky-500/30 transition-colors duration-200"
                            >
                              {content.sectionName}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-white group-hover:text-sky-200 transition-colors duration-200">
                            {content.title}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className="bg-cyan-500/10 text-cyan-300 border-cyan-400/30 hover:bg-cyan-500/20 transition-colors duration-200"
                            >
                              {content.designType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-white">
                                {content.lastEditedAuthor?.name || content.lastEditedAuthor?.email || "Unknown"}
                              </span>
                              <span className="text-xs text-gray-400">{content.lastEditedAuthor?.email}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-400">{formatDate(content.updatedAt)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleEdit(content)} 
                                className="h-9 w-9 p-0 text-gray-400 hover:text-white hover:bg-sky-500/20 transition-all duration-200 hover:scale-110"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(content._id)}
                                className="h-9 w-9 p-0 text-gray-400 hover:text-red-400 hover:bg-red-500/20 transition-all duration-200 hover:scale-110"
                              >
                                <Trash2 className="h-4 w-4" />
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
        </div>

        {/* Fixed Footer */}
        <footer className="relative z-10 mt-auto border-t border-sky-500/20 bg-slate-900/60 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 to-cyan-500/5"></div>
          <div className="relative z-10 container mx-auto px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <p className="text-gray-400 text-sm">
                  © 2025 GT Technologies. All rights reserved.
                </p>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Admin Panel v2.0</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Status:</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-medium">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <ContentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedContent(null)
        }}
        content={selectedContent}
        onSuccess={handleModalSuccess}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setDeleteContentId(null)
        }}
        onConfirm={confirmDelete}
        title="Delete Content"
        description="Are you sure you want to delete this content? This action cannot be undone."
      />

      <AIGenerateModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
        onSuccess={handleAISuccess} 
      />
    </div>
  )
}
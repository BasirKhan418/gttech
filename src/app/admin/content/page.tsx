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
import { toast,Toaster } from "sonner"

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
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
          <p className="text-muted-foreground">Manage your content sections and articles</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAIGenerate} variant="outline" className="gap-2 bg-transparent">
            <Sparkles className="h-4 w-4" />
            Generate with AI
          </Button>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Content
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Content ({contents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {contents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No content found. Create your first content item!</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Section</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Design Type</TableHead>
                    <TableHead>Last Updated By</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contents.map((content) => (
                    <TableRow key={content._id}>
                      <TableCell>
                        <Badge variant="secondary">{content.sectionName}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{content.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{content.designType}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {content.lastEditedAuthor?.name || content.lastEditedAuthor?.email || "Unknown"}
                          </span>
                          <span className="text-xs text-muted-foreground">{content.lastEditedAuthor?.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(content.updatedAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(content)} className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(content._id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
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

      <AIGenerateModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} onSuccess={handleAISuccess} />
    </div>
  )
}

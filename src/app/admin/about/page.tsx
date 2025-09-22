"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Plus, Eye } from "lucide-react"
import { AboutModal } from "../../../../utils/about/about-modal"
import { ViewAboutModal } from "../../../../utils/about/view-about-modal"
import {toast} from "sonner";

interface Partner {
  name: string
  logo: string
  description: string
  website: string
  partnership_type: string
}

interface AboutData {
  _id: string
  title: string
  ourstory: string
  card1title: string
  card1subtitle: string
  card1desc: string
  card1features: string[]
  card2title: string
  card2subtitle: string
  card2desc: string
  card2features: string[]
  foundationdesc: string[]
  partners: Partner[]
  lastEditedAuthor: string
  author: string
  createdAt: string
  updatedAt: string
}

export default function AboutManagementPage() {
  const [aboutData, setAboutData] = useState<AboutData[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedAbout, setSelectedAbout] = useState<AboutData | null>(null)

  const fetchAboutData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/about")
      const result = await response.json()

      if (result.success) {
        setAboutData(result.data || [])
      } else {
        toast.error(result.message || "Failed to fetch about data")
      }
    } catch (error) {
        toast.error("An error occurred while fetching about data")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this about page?")) return

    try {
      const response = await fetch(`/api/about/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("About page deleted successfully")
        fetchAboutData()
      } else {
        toast.error("Failed to delete about page")
      }
    } catch (error) {
        toast.error("An error occurred while deleting the about page")
    }
  }

  const handleEdit = (about: AboutData) => {
    setSelectedAbout(about)
    setIsEditModalOpen(true)
  }

  const handleView = (about: AboutData) => {
    setSelectedAbout(about)
    setIsViewModalOpen(true)
  }

  const handleModalClose = () => {
    setIsCreateModalOpen(false)
    setIsEditModalOpen(false)
    setIsViewModalOpen(false)
    setSelectedAbout(null)
    fetchAboutData()
  }

  useEffect(() => {
    fetchAboutData()
  }, [])

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
          <h1 className="text-3xl font-bold tracking-tight">About Page Management</h1>
          <p className="text-muted-foreground">Manage your company's about page content</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create About Page
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About Pages</CardTitle>
          <CardDescription>View and manage all about page entries</CardDescription>
        </CardHeader>
        <CardContent>
          {aboutData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No about pages found</p>
              <Button onClick={() => setIsCreateModalOpen(true)} className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Create First About Page
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Mission</TableHead>
                    <TableHead>Vision</TableHead>
                    <TableHead>Partners</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aboutData.map((about) => (
                    <TableRow key={about._id}>
                      <TableCell className="font-medium">{about.title}</TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="truncate">{about.card1title}</p>
                          <p className="text-sm text-muted-foreground truncate">{about.card1subtitle}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="truncate">{about.card2title}</p>
                          <p className="text-sm text-muted-foreground truncate">{about.card2subtitle}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{about.partners?.length || 0} partners</Badge>
                      </TableCell>
                      <TableCell>{new Date(about.updatedAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleView(about)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(about)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(about._id)}>
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

      <AboutModal isOpen={isCreateModalOpen} onClose={handleModalClose} mode="create" />

      <AboutModal isOpen={isEditModalOpen} onClose={handleModalClose} mode="edit" initialData={selectedAbout} />

      <ViewAboutModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} data={selectedAbout} />
    </div>
  )
}

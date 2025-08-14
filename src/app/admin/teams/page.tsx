"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Pencil, Trash2, Plus, ExternalLink, Loader2 } from "lucide-react"
import Image from "next/image"

interface TeamMember {
  _id: string
  name: string
  title: string
  image: string
  linkedinUrl: string
  category: string
  isActive: boolean
  lastEditedAuthor: {
    _id: string
    name?: string
    email?: string
  }
  author: {
    _id: string
    name?: string
    email?: string
  }
  createdAt: string
  updatedAt: string
}

interface TeamFormData {
  name: string
  title: string
  image: string
  linkedinUrl: string
  category: string
  isActive: boolean
}

const categories = ["Leadership", "Engineering", "Design", "Marketing", "Sales", "Operations", "HR", "Finance"]

export default function TeamsPage() {
  const [teams, setTeams] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingTeam, setEditingTeam] = useState<TeamMember | null>(null)
  const [formData, setFormData] = useState<TeamFormData>({
    name: "",
    title: "",
    image: "",
    linkedinUrl: "",
    category: "",
    isActive: true,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchTeams()
  }, [])

const fetchTeams = async () => {
  try {
    const response = await fetch("/api/team")
    const result = await response.json()

    console.log("result js",result)
    if (result.success && Array.isArray(result.data.data)) {
      setTeams(result.data.data)
    } else {
      setTeams([]) // fallback to empty array if not valid
      toast.error(result.message || "Failed to fetch team members")
    }
  } catch (error) {
    setTeams([]) // prevent map error
    console.log("erreor luuu",error)
    toast.error("Failed to fetch team members")
  } finally {
    setLoading(false)
  }
}


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return formData.image

    setUploading(true)
    try {
      // Get signed URL
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: imageFile.name,
          contentType: imageFile.type,
        }),
      })

      const { uploadURL, fileURL } = await uploadResponse.json()

      // Upload file to S3
      await fetch(uploadURL, {
        method: "PUT",
        body: imageFile,
        headers: {
          "Content-Type": imageFile.type,
        },
      })

      return fileURL
    } catch (error) {
      toast.error("Failed to upload image");
      throw error
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      let imageUrl = formData.image
      if (imageFile) {
        imageUrl = await uploadImage()
      }

      const payload = {
        ...formData,
        image: imageUrl,
      }

      const response = await fetch("/api/team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      if (result.success) {
        toast.success("Team member created successfully");
        setIsCreateModalOpen(false)
        resetForm()
        fetchTeams()
      } else {
        toast.error(result.message || "Failed to create team member");
      }
    } catch (error) {
      toast.error("Failed to create team member");
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTeam) return

    setSubmitting(true)

    try {
      let imageUrl = formData.image
      if (imageFile) {
        imageUrl = await uploadImage()
      }

      const payload = {
        id: editingTeam._id,
        ...formData,
        image: imageUrl,
      }

      const response = await fetch("/api/team", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      if (result.success) {
        toast.success("Team member updated successfully");
        setIsEditModalOpen(false)
        resetForm()
        fetchTeams()
      } else {
        toast.error(result.message || "Failed to update team member");
      }
    } catch (error) {
      toast.error("Failed to update team member");
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return

    try {
      const response = await fetch("/api/team", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })

      const result = await response.json()
      if (result.success) {
        toast.success("Team member deleted successfully");
        fetchTeams()
      } else {
        toast.error(result.message || "Failed to delete team member");
      }
    } catch (error) {
      toast.error("Failed to delete team member");
    }
  }

  const openEditModal = (team: TeamMember) => {
    setEditingTeam(team)
    setFormData({
      name: team.name,
      title: team.title,
      image: team.image,
      linkedinUrl: team.linkedinUrl,
      category: team.category,
      isActive: team.isActive,
    })
    setImagePreview(team.image)
    setIsEditModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      title: "",
      image: "",
      linkedinUrl: "",
      category: "",
      isActive: true,
    })
    setImageFile(null)
    setImagePreview("")
    setEditingTeam(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground">Manage your team members and their information</p>
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title/Designation *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn URL *</Label>
                <Input
                  id="linkedinUrl"
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Profile Image</Label>
                <div className="flex items-center gap-4">
                  <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="flex-1" />
                  {imagePreview && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
                      <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Active Status</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting || uploading}>
                  {submitting || uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {uploading ? "Uploading..." : "Creating..."}
                    </>
                  ) : (
                    "Create Team Member"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members ({teams.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams&&teams.map((team) => (
                  <TableRow key={team._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={team.image || "/placeholder.svg"} alt={team.name} />
                          <AvatarFallback>
                            {team.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{team.name}</div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <ExternalLink className="h-3 w-3" />
                            <a
                              href={team.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary"
                            >
                              LinkedIn
                            </a>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{team.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{team.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={team.isActive ? "default" : "secondary"}>
                        {team.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(team.updatedAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(team)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(team._id)}
                          className="text-destructive hover:text-destructive"
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
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title/Designation *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-linkedinUrl">LinkedIn URL *</Label>
              <Input
                id="edit-linkedinUrl"
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-image">Profile Image</Label>
              <div className="flex items-center gap-4">
                <Input id="edit-image" type="file" accept="image/*" onChange={handleImageChange} className="flex-1" />
                {imagePreview && (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
                    <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="edit-isActive">Active Status</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || uploading}>
                {submitting || uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {uploading ? "Uploading..." : "Updating..."}
                  </>
                ) : (
                  "Update Team Member"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

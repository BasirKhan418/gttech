"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Sparkles, Edit, Trash2, MapPin, Clock, Users, DollarSign } from "lucide-react"
import { CreateCareerModal } from "../../../../utils/careers/create-career-modal"
import { EditCareerModal } from "../../../../utils/careers/edit-career-modal"
import { AIPromptModal } from "../../../../utils/careers/ai-prompt-modal"
import { DeleteConfirmModal } from "../../../../utils/careers/delete-confirm-modal"
import { toast } from "sonner"
import type { Career } from "../../../../utils/careers/career"

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([])
  const [aiGeneratedData, setAiGeneratedData] = useState<CreateCareerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [aiModalOpen, setAiModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null)

  useEffect(() => {
    fetchCareers()
  }, [])

  const fetchCareers = async () => {
    try {
      const response = await fetch("/api/career")
      const data = await response.json()
      setCareers(data.data);
    } catch (error) {
     toast.error("Failed to fetch careers: " + (error as Error).message);
    } finally {
      setLoading(false)
    }
  }
  const handleAICreateCareer = (careerData: CreateCareerData) => {
    setAiGeneratedData(careerData)
    setAiModalOpen(false)
    setCreateModalOpen(true)
  }

  const handleCreateModalClose = (open: boolean) => {
    setCreateModalOpen(open)
    if (!open) {
      // Clear AI data when modal closes
      setAiGeneratedData(null)
    }
  }
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch("/api/career", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        toast.success("Career deleted successfully");
        fetchCareers()
      }
    } catch (error) {
      toast.error("Failed to delete career: " + (error as Error).message);
    }
    setDeleteModalOpen(false)
    setSelectedCareer(null)
  }

  const handleEdit = (career: Career) => {
    setSelectedCareer(career)
    setEditModalOpen(true)
  }

  const handleDeleteClick = (career: Career) => {
    setSelectedCareer(career)
    setDeleteModalOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getModeColor = (mode: string) => {
    switch (mode) {
      case "remote":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "hybrid":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "offline":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "part-time":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "contract":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
      case "internship":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
              Career Management
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Manage job postings and career opportunities</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setAiModalOpen(true)}
              variant="outline"
              className="flex items-center gap-2 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950 dark:hover:to-pink-950 transition-all duration-200"
            >
              <Sparkles className="h-4 w-4" />
              Create with AI
            </Button>
            <Button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Create New
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Jobs</p>
                  <p className="text-2xl font-bold">{careers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Active</p>
                  <p className="text-2xl font-bold">{careers.filter((c) => c.isActive).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Remote</p>
                  <p className="text-2xl font-bold">{careers.filter((c) => c.mode === "remote").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <DollarSign className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Full-time</p>
                  <p className="text-2xl font-bold">{careers.filter((c) => c.employmentType === "full-time").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Careers Grid */}
        {careers.length === 0 ? (
          <Card className="border-0 shadow-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No careers found</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Get started by creating your first job posting
                </p>
                <Button
                  onClick={() => setCreateModalOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Job
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {careers.map((career) => (
              <Card
                key={career._id}
                className="border-0 shadow-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm hover:shadow-lg transition-all duration-200 group"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {career.role}
                      </CardTitle>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {career.department || "General"}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(career)}
                        className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(career)}
                        className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getModeColor(career.mode)}>{career.mode}</Badge>
                    <Badge className={getTypeColor(career.employmentType)}>{career.employmentType}</Badge>
                    {!career.isActive && <Badge variant="secondary">Inactive</Badge>}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{career.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Clock className="h-4 w-4" />
                      <span>{career.experience}</span>
                    </div>
                    {career.salary && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <DollarSign className="h-4 w-4" />
                        <span>{career.salary}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{career.description}</p>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-500">Created {formatDate(career.createdAt)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateCareerModal open={createModalOpen} onOpenChange={setCreateModalOpen} onSuccess={fetchCareers} />

       <CreateCareerModal 
        open={createModalOpen} 
        onOpenChange={handleCreateModalClose} 
        onSuccess={fetchCareers}
        initialData={aiGeneratedData} // Pass AI data here
      />

      <AIPromptModal
        open={aiModalOpen}
        onOpenChange={setAiModalOpen}
        onCreateCareer={handleAICreateCareer} // Use new handler
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={() => selectedCareer && handleDelete(selectedCareer._id)}
        title={selectedCareer?.role || ""}
      />
    </div>
  )
}

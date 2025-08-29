"use client"

import { useMemo, useState } from "react"
import useSWR, { mutate } from "swr"
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Star,
  Code,
  Layers,
  Lightbulb,
  Zap,
  Rocket,
  Settings,
  Monitor,
  Smartphone,
  Database,
  Globe,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast, Toaster } from "sonner"
import { ServiceAIModal } from "../../../../utils/services/service-ai-modal"
import { ServiceModal } from "../../../../utils/services/service-modal"
const ICON_MAP = {
  code: Code,
  star: Star,
  layers: Layers,
  lightbulb: Lightbulb,
  zap: Zap,
  rocket: Rocket,
  settings: Settings,
  monitor: Monitor,
  smartphone: Smartphone,
  database: Database,
  globe: Globe,
}

export interface Service {
  _id: string
  slug: string
  sectionName: string
  title: string
  tagline: string
  description: string
  poster: string
  images?: string[]
  lists?: string[]
  designType: string
  icon: string
  isActive: boolean
  isFeatured: boolean
  industries?: string[]
  technologies?: string[]
  capabilities?: string[]
  benefits?: string[]
  pricingModel?: string
  duration?: string
  teamSize?: string
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
  author?: any
  lastEditedAuthor?: any
  createdAt: string
  updatedAt: string
}

const fetcher = (url: string) =>
  fetch(url).then(async (r) => {
    const data = await r.json()
    if (!r.ok || !data?.success) throw new Error(data?.error || "Failed to fetch services")
    return data.data as Service[]
  })

export default function AdminServicesPage() {
  const { data, error, isLoading } = useSWR<Service[]>("/api/services", fetcher)
  const [searchTerm, setSearchTerm] = useState("")
  const [selected, setSelected] = useState<Service | null>(null)
  const [openModal, setOpenModal] = useState(false)
  const [openAIModal, setOpenAIModal] = useState(false)
  const [aiDraft, setAiDraft] = useState<Partial<Service> | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Service | null>(null)

  const services = data || []

  const stats = useMemo(() => {
    return {
      total: services.length,
      active: services.filter((s) => s.isActive).length,
      featured: services.filter((s) => s.isFeatured).length,
      inactive: services.filter((s) => !s.isActive).length,
    }
  }, [services])

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return services
    return services.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.sectionName.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q) ||
        (s.technologies || []).some((t) => t.toLowerCase().includes(q)) ||
        (s.capabilities || []).some((c) => c.toLowerCase().includes(q)),
    )
  }, [services, searchTerm])

  const getIconComponent = (val?: string) => {
    if (!val) return Code
    // @ts-expect-error
    return ICON_MAP[val] || Code
  }

  const handleCreate = () => {
    setSelected(null)
    setAiDraft(null)
    setOpenModal(true)
  }

  const handleEdit = (svc: Service) => {
    setSelected(svc)
    setAiDraft(null)
    setOpenModal(true)
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    const id = pendingDelete._id
    try {
      const t = toast.loading("Deleting service...")
      const res = await fetch("/api/services", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (!res.ok || !data?.success) throw new Error(data?.error || "Failed to delete")
      toast.success("Service deleted")
      mutate("/api/services")
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete")
    } finally {
      setPendingDelete(null)
    }
  }

  const onModalSuccess = () => {
    setOpenModal(false)
    setSelected(null)
    setAiDraft(null)
    mutate("/api/services")
  }

  const handleCreateWithAI = () => setOpenAIModal(true)
  const handleAICreate = (svcDraft: Partial<Service>) => {
    setAiDraft(svcDraft)
    setSelected(null)
    setOpenAIModal(false)
    setOpenModal(true)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Services</h1>
            <p className="text-gray-600 mt-1">Manage your services portfolio</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse overflow-hidden">
              <div className="h-48 bg-muted" />
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-muted rounded w-full mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Toaster position="top-right" richColors />
        <h1 className="text-3xl font-bold">Services</h1>
        <p className="text-muted-foreground">Failed to load services.</p>
        <Button onClick={() => mutate("/api/services")}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Services</h1>
          <p className="text-gray-600 mt-1">Manage your services portfolio</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreateWithAI} variant="outline" className="gap-2 bg-transparent">
            <Sparkles className="w-4 h-4" />
            Create with AI
          </Button>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Service
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Featured</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.featured}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Layers className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{searchTerm ? "No services found" : "No services yet"}</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "Try adjusting your search terms" : "Get started by creating your first service"}
          </p>
          {!searchTerm && (
            <div className="flex justify-center gap-2">
              <Button onClick={handleCreateWithAI} variant="outline" className="gap-2 bg-transparent">
                <Sparkles className="w-4 h-4" />
                Create with AI
              </Button>
              <Button onClick={handleCreate} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Service
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((svc) => {
            const IconComponent = getIconComponent(svc.icon)
            return (
              <Card key={svc._id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative h-48 bg-muted overflow-hidden">
                  {svc.poster ? (
                    <img
                      src={svc.poster || "/placeholder.svg"}
                      alt={svc.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10">
                      <IconComponent className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex gap-2">
                    {svc.isFeatured && (
                      <Badge className="bg-yellow-500/90 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <Badge variant={svc.isActive ? "default" : "secondary"}>
                      {svc.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => window.open(`/services/${svc.slug}`, "_blank")}
                      className="h-8 w-8 p-0"
                      aria-label="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEdit(svc)}
                      className="h-8 w-8 p-0"
                      aria-label="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setPendingDelete(svc)}
                      className="h-8 w-8 p-0"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <IconComponent className="w-4 h-4 text-primary" />
                        <Badge variant="outline" className="text-xs">
                          {svc.sectionName}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {svc.designType}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{svc.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{svc.description}</p>

                  {svc.technologies && svc.technologies.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {svc.technologies.slice(0, 3).map((tech, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {svc.technologies.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{svc.technologies.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Slug: {svc.slug}</span>
                    <span>{new Date(svc.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <ServiceModal
        open={openModal}
        onOpenChange={setOpenModal}
        service={selected}
        onSuccess={onModalSuccess}
        aiDraft={aiDraft}
      />

      {/* AI Modal */}
      <ServiceAIModal open={openAIModal} onOpenChange={setOpenAIModal} onCreateService={handleAICreate} />

      {/* Delete Dialog */}
      <AlertDialog open={!!pendingDelete} onOpenChange={() => setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{pendingDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

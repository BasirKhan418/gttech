"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { ImageUploader } from "./image-uploader";
import { Plus, Trash2 } from "lucide-react"
import type { Service } from "@/app/admin/services/page"

interface SubService {
  title: string
  desc: string
  image: string
}

interface ServiceWithSubServices extends Service {
  subServices?: SubService[]
}

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  service: Service | null
  aiDraft?: Partial<Service> | null
  onSuccess: () => void
}

const ICON_OPTIONS = [
  "code",
  "star",
  "layers",
  "lightbulb",
  "zap",
  "rocket",
  "settings",
  "monitor",
  "smartphone",
  "database",
  "globe",
]

const DESIGN_TYPES = ["classic", "modern", "minimal", "brutalist", "glassmorphism"]

export function ServiceModal({ open, onOpenChange, service, aiDraft, onSuccess }: Props) {
  const isEdit = !!service?._id

  const [form, setForm] = useState<Partial<ServiceWithSubServices>>({
    slug: "",
    sectionName: "",
    title: "",
    tagline: "",
    description: "",
    poster: "",
    images: [],
    lists: [],
    designType: "modern",
    icon: "code",
    isActive: true,
    isFeatured: false,
    subServices: [],
  })

  useEffect(() => {
    if (service) {
      setForm(service)
    } else if (aiDraft) {
      setForm((prev) => ({ ...prev, ...aiDraft }))
    } else {
      setForm({
        slug: "",
        sectionName: "",
        title: "",
        tagline: "",
        description: "",
        poster: "",
        images: [],
        lists: [],
        designType: "modern",
        icon: "code",
        isActive: true,
        isFeatured: false,
        subServices: [],
      })
    }
  }, [service, aiDraft, open])

  const commaString = (arr?: string[]) => (arr && arr.length ? arr.join(", ") : "")

  const addSubService = () => {
    const newSubService: SubService = { title: "", desc: "", image: "" }
    setForm((f) => ({ ...f, subServices: [...(f.subServices || []), newSubService] }))
  }

  const updateSubService = (index: number, field: keyof SubService, value: string) => {
    const subServices = [...(form.subServices || [])]
    subServices[index] = { ...subServices[index], [field]: value }
    setForm((f) => ({ ...f, subServices }))
  }

  const removeSubService = (index: number) => {
    const subServices = [...(form.subServices || [])]
    subServices.splice(index, 1)
    setForm((f) => ({ ...f, subServices }))
  }

  const handleSubmit = async () => {
    try {
      // Basic validation
      if (!form.slug || !form.sectionName || !form.title || !form.tagline || !form.description) {
        toast.error("Please fill slug, section, title, tagline and description")
        return
      }
      const method = isEdit ? "PUT" : "POST"
      const body = isEdit ? { id: service!._id, ...form } : form

      const t = toast.loading(isEdit ? "Updating service..." : "Creating service...")
      const res = await fetch("/api/services", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      toast.dismiss(t)
      if (!res.ok || !data?.success) throw new Error(data?.error || "Request failed")

      toast.success(isEdit ? "Service updated" : "Service created")
      onSuccess()
    } catch (e: any) {
      toast.error(e?.message || "Failed to save service")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-balance">
            {isEdit ? "Edit Service" : aiDraft ? "Review AI Service" : "Create Service"}
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-6">
            {/* Left column - basics */}
            <div className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide border-b pb-2">
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={form.slug || ""}
                      onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.trim() }))}
                      placeholder="e.g. web-development"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="section">Section Name *</Label>
                    <Input
                      id="section"
                      value={form.sectionName || ""}
                      onChange={(e) => setForm((f) => ({ ...f, sectionName: e.target.value }))}
                      placeholder="e.g. Development"
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={form.title || ""}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Full-Stack Web Development"
                    className="h-11"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="tagline">Tagline *</Label>
                  <Input
                    id="tagline"
                    value={form.tagline || ""}
                    onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
                    placeholder="Short compelling tagline"
                    className="h-11"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="desc">Description *</Label>
                  <Textarea
                    id="desc"
                    rows={5}
                    value={form.description || ""}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Describe the service..."
                    className="resize-none min-h-[120px]"
                  />
                </div>
              </div>

              {/* Design & Icon */}
              <div className="space-y-6">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide border-b pb-2">
                  Design & Appearance
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label>Design Type</Label>
                    <Select
                      value={form.designType || "modern"}
                      onValueChange={(v) => setForm((f) => ({ ...f, designType: v }))}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Choose type" />
                      </SelectTrigger>
                      <SelectContent>
                        {DESIGN_TYPES.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Icon</Label>
                    <Select value={form.icon || "code"} onValueChange={(v) => setForm((f) => ({ ...f, icon: v }))}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Choose icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {ICON_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Lists */}
              <div className="space-y-6">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide border-b pb-2">
                  Additional Details
                </h3>
                
                <div className="space-y-3">
                  <Label>Lists (comma separated)</Label>
                  <Input
                    value={commaString(form.lists)}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        lists: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      }))
                    }
                    placeholder="Item 1, Item 2, Item 3"
                    className="h-11"
                  />
                  {(form.lists?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {form.lists!.slice(0, 6).map((l, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {l}
                        </Badge>
                      ))}
                      {(form.lists?.length ?? 0) > 6 && (
                        <Badge variant="secondary" className="text-xs">
                          +{form.lists!.length - 6} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right column - media & settings */}
            <div className="space-y-8">
              {/* Media Section */}
              <div className="space-y-6">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide border-b pb-2">
                  Media
                </h3>
                
                <div className="space-y-4">
                  <Label>Poster</Label>
                  <div className="space-y-4">
                    <ImageUploader
                      label="Upload poster"
                      value={form.poster || ""}
                      onChange={(url) => setForm((f) => ({ ...f, poster: url as string }))}
                    />
                    {form.poster ? (
                      <div className="relative">
                        <img
                          src={form.poster}
                          alt="Service poster"
                          className="w-full h-36 object-cover rounded-md border"
                        />
                      </div>
                    ) : (
                      <img
                        src="/service-poster.png"
                        alt="Placeholder"
                        className="w-full h-36 object-cover rounded-md border opacity-60"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Gallery</Label>
                  <ImageUploader
                    label="Upload images"
                    multiple
                    value={form.images || []}
                    onChange={(urls) => setForm((f) => ({ ...f, images: urls as string[] }))}
                  />
                  {(form.images?.length ?? 0) > 0 && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto border rounded-md p-3">
                        {form.images!.map((img, i) => (
                          <div key={i} className="relative group">
                            <img
                              src={img}
                              alt={`Gallery ${i + 1}`}
                              className="w-full h-20 object-cover rounded border"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = [...(form.images || [])]
                                newImages.splice(i, 1)
                                setForm((f) => ({ ...f, images: newImages }))
                              }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                              title="Remove image"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      {(form.images?.length ?? 0) > 0 && (
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>{form.images!.length} image(s)</span>
                          <button
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, images: [] }))}
                            className="text-red-500 hover:text-red-700 hover:underline"
                          >
                            Clear all
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Settings Section */}
              <div className="space-y-6">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide border-b pb-2">
                  Settings
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-md border p-4">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Active</Label>
                      <p className="text-xs text-muted-foreground">Visible on site</p>
                    </div>
                    <Switch
                      checked={!!form.isActive}
                      onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
                      aria-label="Toggle active"
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-md border p-4">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Featured</Label>
                      <p className="text-xs text-muted-foreground">Highlight card</p>
                    </div>
                    <Switch
                      checked={!!form.isFeatured}
                      onCheckedChange={(v) => setForm((f) => ({ ...f, isFeatured: v }))}
                      aria-label="Toggle featured"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Sub Services Section - Full Width */}
          <div className="space-y-6 mt-8">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Key Sub Services
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSubService}
                className="h-8 gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Sub Service
              </Button>
            </div>

            {(form.subServices?.length ?? 0) === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No sub services added yet. Click "Add Sub Service" to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(form.subServices || []).map((subService, index) => (
                  <Card key={index} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">Sub Service {index + 1}</CardTitle>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSubService(index)}
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-xs">Title</Label>
                        <Input
                          value={subService.title}
                          onChange={(e) => updateSubService(index, 'title', e.target.value)}
                          placeholder="Sub service title"
                          className="h-9 text-sm"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-xs">Description</Label>
                        <Textarea
                          value={subService.desc}
                          onChange={(e) => updateSubService(index, 'desc', e.target.value)}
                          placeholder="Sub service description"
                          rows={3}
                          className="text-sm resize-none"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-xs">Image</Label>
                        <ImageUploader
                          label="Upload image"
                          value={subService.image}
                          onChange={(url) => updateSubService(index, 'image', url as string)}
                        />
                        {subService.image && (
                          <img
                            src={subService.image}
                            alt={`Sub service ${index + 1}`}
                            className="w-full h-20 object-cover rounded border mt-2"
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Fixed footer with actions */}
        <div className="border-t bg-background px-6 py-5 shrink-0">
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="min-w-[100px]">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="min-w-[140px]">
              {isEdit ? "Save Changes" : "Create Service"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
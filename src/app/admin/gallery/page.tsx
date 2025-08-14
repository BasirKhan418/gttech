"use client"

import { useState } from "react"
import { GalleryDisplay } from "../../../../utils/gallery/gallery-display"
import { GalleryAddForm } from "../../../../utils/gallery/gallery-add-form"
import { GalleryEditModal } from "../../../../utils/gallery/gallery-edit-modal"
import { DeleteConfirmationDialog } from "../../../../utils/gallery/delete-confirmation-dialog"
import { Button } from "@/components/ui/button"
import{ toast} from "sonner"
import { Plus } from "lucide-react"

interface GalleryItem {
  _id: string
  type: "image" | "video"
  title: string
  description?: string
  images?: string[]
  videoUrl?: string
  thumbnail?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function GalleryPage() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  

  const handleEdit = (item: GalleryItem) => {
    setSelectedItem(item)
  }

  const handleDeleteClick = (item: GalleryItem) => {
    setItemToDelete(item)
  }

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch("/api/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemToDelete._id }),
      })

      if (response.ok) {
        toast.success(`"${itemToDelete.title}" has been deleted successfully.`)
        setRefreshKey((prev) => prev + 1)
        setItemToDelete(null)
      } else {
        throw new Error("Failed to delete item")
      }
    } catch (error) {
      console.error("Error deleting item:", error)
      toast.error("Failed to delete the gallery item. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setItemToDelete(null)
  }

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gallery Management</h1>
          <p className="text-muted-foreground mt-2">Manage your image albums and video content</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Item
        </Button>
      </div>

      <GalleryDisplay key={refreshKey} onEdit={handleEdit} onDelete={(item) => handleDeleteClick(item)} />

      {showAddForm && <GalleryAddForm onClose={() => setShowAddForm(false)} onSuccess={handleSuccess} />}

      {selectedItem && (
        <GalleryEditModal item={selectedItem} onClose={() => setSelectedItem(null)} onSuccess={handleSuccess} />
      )}

      {itemToDelete && (
        <DeleteConfirmationDialog
          title={itemToDelete.title}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isDeleting={isDeleting}
        />
      )}
    </div>
  )
}

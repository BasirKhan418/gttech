"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Loader2, AlertTriangle } from "lucide-react"

interface Address {
  _id: string
  name: string
  address: string
  phone: string
  email?: string
  city: string
  state: string
  country: string
  pincode: string
  isActive: boolean
  displayOrder: number
}

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  address: Address | null
  isDeleting: boolean
  setIsDeleting: (deleting: boolean) => void
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onSuccess,
  address,
  isDeleting,
  setIsDeleting
}: DeleteConfirmModalProps) {

  const handleDelete = async () => {
    if (!address) return

    setIsDeleting(true)
    try {
      const response = await fetch("/api/address", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: address._id }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Address deleted successfully")
        onSuccess()
        onClose()
      } else {
        toast.error(result.message || "Failed to delete address")
      }
    } catch (error) {
      console.error("Error deleting address:", error)
      toast.error("Failed to delete address")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span>Delete Address</span>
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this address? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {address && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900">{address.name}</h4>
            <p className="text-sm text-gray-600 mt-1">{address.address}</p>
            <p className="text-sm text-gray-600">{address.city}, {address.state} {address.pincode}</p>
            <p className="text-sm text-gray-600">{address.phone}</p>
            {address.email && (
              <p className="text-sm text-gray-600">{address.email}</p>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Delete Address
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

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

interface AddressFormData {
  name: string
  address: string
  phone: string
  email: string
  city: string
  state: string
  country: string
  pincode: string
  isActive: boolean
  displayOrder: number
}

interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editingAddress?: Address | null
  mode: "create" | "edit"
}

export default function AddressModal({
  isOpen,
  onClose,
  onSuccess,
  editingAddress,
  mode
}: AddressModalProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    name: "",
    address: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    isActive: true,
    displayOrder: 0,
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (mode === "edit" && editingAddress) {
      setFormData({
        name: editingAddress.name,
        address: editingAddress.address,
        phone: editingAddress.phone,
        email: editingAddress.email || "",
        city: editingAddress.city,
        state: editingAddress.state,
        country: editingAddress.country,
        pincode: editingAddress.pincode,
        isActive: editingAddress.isActive,
        displayOrder: editingAddress.displayOrder,
      })
    } else {
      setFormData({
        name: "",
        address: "",
        phone: "",
        email: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
        isActive: true,
        displayOrder: 0,
      })
    }
  }, [mode, editingAddress, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const url = "/api/address"
      const method = mode === "create" ? "POST" : "PUT"
      const body = mode === "edit" && editingAddress 
        ? { ...formData, id: editingAddress._id }
        : formData

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(mode === "create" ? "Address created successfully" : "Address updated successfully")
        onSuccess()
        onClose()
      } else {
        toast.error(result.message || "Something went wrong")
      }
    } catch (error) {
      console.error("Error submitting address:", error)
      toast.error("Failed to save address")
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof AddressFormData, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create New Address" : "Edit Address"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Location Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Head Office, Delhi Branch"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                placeholder="e.g., +91 98765 43210"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              placeholder="Complete address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                placeholder="e.g., Mumbai"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                placeholder="e.g., Maharashtra"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                placeholder="e.g., India"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode">PIN Code *</Label>
              <Input
                id="pincode"
                placeholder="e.g., 400001"
                value={formData.pincode}
                onChange={(e) => handleInputChange("pincode", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g., office@gttech.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                placeholder="0"
                value={formData.displayOrder}
                onChange={(e) => handleInputChange("displayOrder", parseInt(e.target.value) || 0)}
                min="0"
              />
              <p className="text-sm text-gray-600">Lower numbers appear first</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange("isActive", checked)}
            />
            <Label htmlFor="isActive">Active (Display in footer)</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {mode === "create" ? "Create Address" : "Update Address"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Pencil, Trash2, Plus, MapPin, Phone, Mail, ArrowUp, ArrowDown } from "lucide-react"
import AddressModal from "../../../../utils/addresses/address-modal"
import DeleteConfirmModal from "../../../../utils/addresses/delete-confirm-modal"

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

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [deletingAddress, setDeletingAddress] = useState<Address | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      const response = await fetch("/api/address?all=true")
      const result = await response.json()

      if (result.success && Array.isArray(result.data.data)) {
        setAddresses(result.data.data)
      } else {
        setAddresses([])
        toast.error(result.message || "Failed to fetch addresses")
      }
    } catch (error) {
      setAddresses([])
      console.error("Error fetching addresses:", error)
      toast.error("Failed to fetch addresses")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setIsEditModalOpen(true)
  }

  const handleDelete = (address: Address) => {
    setDeletingAddress(address)
    setIsDeleteModalOpen(true)
  }

  const handleToggleActive = async (address: Address) => {
    try {
      const response = await fetch("/api/address", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: address._id,
          ...address,
          isActive: !address.isActive,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`Address ${!address.isActive ? "activated" : "deactivated"} successfully`)
        fetchAddresses()
      } else {
        toast.error(result.message || "Failed to update address")
      }
    } catch (error) {
      console.error("Error updating address:", error)
      toast.error("Failed to update address")
    }
  }

  const handleDisplayOrderChange = async (address: Address, direction: "up" | "down") => {
    const currentIndex = addresses.findIndex(a => a._id === address._id)
    const newAddresses = [...addresses]
    
    if (direction === "up" && currentIndex > 0) {
      // Swap with previous item
      [newAddresses[currentIndex], newAddresses[currentIndex - 1]] = 
      [newAddresses[currentIndex - 1], newAddresses[currentIndex]]
    } else if (direction === "down" && currentIndex < addresses.length - 1) {
      // Swap with next item
      [newAddresses[currentIndex], newAddresses[currentIndex + 1]] = 
      [newAddresses[currentIndex + 1], newAddresses[currentIndex]]
    } else {
      return // No change needed
    }

    // Update display orders
    const addressUpdates = newAddresses.map((addr, index) => ({
      id: addr._id,
      displayOrder: index
    }))

    try {
      const response = await fetch("/api/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "updateDisplayOrder",
          addressUpdates
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Display order updated successfully")
        fetchAddresses()
      } else {
        toast.error(result.message || "Failed to update display order")
      }
    } catch (error) {
      console.error("Error updating display order:", error)
      toast.error("Failed to update display order")
    }
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
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading addresses...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Address Management</h1>
          <p className="text-gray-600 mt-1">Manage company locations and contact information</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Address
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Company Addresses ({addresses.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {addresses.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses found</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first company address.</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Address
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {addresses.map((address, index) => (
                  <TableRow key={address._id}>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm font-medium">{index + 1}</span>
                        <div className="flex flex-col">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDisplayOrderChange(address, "up")}
                            disabled={index === 0}
                            className="h-6 w-6 p-0"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDisplayOrderChange(address, "down")}
                            disabled={index === addresses.length - 1}
                            className="h-6 w-6 p-0"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{address.name}</div>
                        <div className="text-sm text-gray-600">
                          {address.city}, {address.state}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm max-w-xs">
                        {address.address}
                        <br />
                        <span className="text-gray-600">
                          {address.pincode}, {address.country}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-sm">
                          <Phone className="w-3 h-3" />
                          <span>{address.phone}</span>
                        </div>
                        {address.email && (
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <Mail className="w-3 h-3" />
                            <span>{address.email}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={address.isActive}
                          onCheckedChange={() => handleToggleActive(address)}
                        />
                        <Badge variant={address.isActive ? "default" : "secondary"}>
                          {address.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(address.createdAt)}
                        <div className="text-xs text-gray-500">
                          by {address.author.name || address.author.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(address)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(address)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      <AddressModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchAddresses}
        mode="create"
      />

      {/* Edit Modal */}
      <AddressModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingAddress(null)
        }}
        onSuccess={fetchAddresses}
        editingAddress={editingAddress}
        mode="edit"
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setDeletingAddress(null)
        }}
        onSuccess={fetchAddresses}
        address={deletingAddress}
        isDeleting={isDeleting}
        setIsDeleting={setIsDeleting}
      />
    </div>
  )
}
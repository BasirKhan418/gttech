"use client"

import { useState, useEffect } from "react"
import { AdminTable } from "../../../../utils/account/admin-table"
import { CreateAdminModal } from "../../../../utils/account/create-admin-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Users, Search, Filter, Download, RefreshCw } from "lucide-react"

interface Admin {
  _id: string
  name: string
  username?: string
  email: string
  img?: string
  bio: string
  phone: string
  iscentraladmin: boolean
  twofactor: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminManagementPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [admins, setAdmins] = useState<Admin[]>([])
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "central" | "regular">("all")

  const fetchAdmins = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/all")
      if (response.ok) {
        const data = await response.json()
        const adminList = data.admins || []
        setAdmins(adminList)
        setFilteredAdmins(adminList)
      }
    } catch (error) {
      console.error("Failed to fetch admins:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAdmin = async (adminId: string) => {
    try {
      const response = await fetch(`/api/admin/${adminId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        const updatedAdmins = admins.filter((admin) => admin._id !== adminId)
        setAdmins(updatedAdmins)
        applyFilters(updatedAdmins, searchTerm, filterType)
      } else {
        throw new Error("Failed to delete admin")
      }
    } catch (error) {
      console.error("Delete error:", error)
      throw error
    }
  }

  const handleAccountCreated = (newAdmin: Admin) => {
    const updatedAdmins = [newAdmin, ...admins]
    setAdmins(updatedAdmins)
    applyFilters(updatedAdmins, searchTerm, filterType)
    setShowCreateModal(false)
  }

  const applyFilters = (adminList: Admin[], search: string, filter: string) => {
    let filtered = adminList

    // Apply search filter
    if (search) {
      filtered = filtered.filter(
        (admin) =>
          admin.name.toLowerCase().includes(search.toLowerCase()) ||
          admin.email.toLowerCase().includes(search.toLowerCase()) ||
          admin.username?.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Apply type filter
    if (filter === "central") {
      filtered = filtered.filter((admin) => admin.iscentraladmin)
    } else if (filter === "regular") {
      filtered = filtered.filter((admin) => !admin.iscentraladmin)
    }

    setFilteredAdmins(filtered)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    applyFilters(admins, value, filterType)
  }

  const handleFilterChange = (filter: "all" | "central" | "regular") => {
    setFilterType(filter)
    applyFilters(admins, searchTerm, filter)
  }

  const exportAdmins = () => {
    const csvContent = [
      ["Name", "Email", "Username", "Phone", "Central Admin", "2FA", "Created"],
      ...filteredAdmins.map((admin) => [
        admin.name,
        admin.email,
        admin.username || "",
        admin.phone || "",
        admin.iscentraladmin ? "Yes" : "No",
        admin.twofactor ? "Yes" : "No",
        new Date(admin.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "admins.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const centralAdmins = admins.filter((admin) => admin.iscentraladmin).length
  const regularAdmins = admins.length - centralAdmins

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <div className="max-w-7xl mx-auto pt-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-3">
            Admin Management Portal
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">Manage administrator accounts and permissions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Admins</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{admins.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Central Admins</p>
                  <p className="text-3xl font-bold text-emerald-600">{centralAdmins}</p>
                </div>
                <div className="h-8 w-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-emerald-500 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Regular Admins</p>
                  <p className="text-3xl font-bold text-blue-600">{regularAdmins}</p>
                </div>
                <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-blue-500 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 items-center flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search admins..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 bg-white dark:bg-slate-700"
                  />
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant={filterType === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange("all")}
                    className="text-xs"
                  >
                    All
                  </Button>
                  <Button
                    variant={filterType === "central" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange("central")}
                    className="text-xs"
                  >
                    <Filter className="h-3 w-3 mr-1" />
                    Central
                  </Button>
                  <Button
                    variant={filterType === "regular" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange("regular")}
                    className="text-xs"
                  >
                    Regular
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchAdmins}
                  disabled={isLoading}
                  className="text-xs bg-transparent"
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button variant="outline" size="sm" onClick={exportAdmins} className="text-xs bg-transparent">
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Create New Admin
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Table */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Administrators ({filteredAdmins.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <AdminTable admins={filteredAdmins} onDeleteAdmin={handleDeleteAdmin} isLoading={isLoading} />
          </CardContent>
        </Card>

        {/* Create Admin Modal */}
        <CreateAdminModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onAccountCreated={handleAccountCreated}
        />
      </div>
    </div>
  )
}

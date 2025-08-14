"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, Shield, Key, Phone, Mail } from "lucide-react"
import {toast} from "sonner"

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

interface AdminTableProps {
  admins: Admin[]
  onDeleteAdmin: (adminId: string) => Promise<void>
  isLoading: boolean
}

export function AdminTable({ admins, onDeleteAdmin, isLoading }: AdminTableProps) {
 
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (adminId: string, adminName: string) => {
    try {
      setDeletingId(adminId)
      await onDeleteAdmin(adminId)
      toast.success(`"${adminName}" has been deleted successfully.`)
    } catch (error) {
      toast.error("Failed to delete admin. Please try again.")
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-slate-100"></div>
      </div>
    )
  }

  if (admins.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600 dark:text-slate-400">No administrators found.</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border border-slate-200 dark:border-slate-700">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Admin</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => (
            <TableRow key={admin._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={admin.img || "/placeholder.svg"} alt={admin.name} />
                    <AvatarFallback className="bg-slate-100 dark:bg-slate-800">
                      {admin.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">{admin.name}</div>
                    {admin.username && (
                      <div className="text-sm text-slate-600 dark:text-slate-400">@{admin.username}</div>
                    )}
                    {admin.bio && (
                      <div className="text-xs text-slate-500 dark:text-slate-500 mt-1 max-w-xs truncate">
                        {admin.bio}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-3 w-3 text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-400">{admin.email}</span>
                  </div>
                  {admin.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3 text-slate-400" />
                      <span className="text-slate-600 dark:text-slate-400">{admin.phone}</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-2">
                  {admin.iscentraladmin && (
                    <Badge
                      variant="default"
                      className="w-fit bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      Central Admin
                    </Badge>
                  )}
                  {admin.twofactor && (
                    <Badge
                      variant="secondary"
                      className="w-fit bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      <Key className="h-3 w-3 mr-1" />
                      2FA Enabled
                    </Badge>
                  )}
                  {!admin.iscentraladmin && !admin.twofactor && (
                    <Badge variant="outline" className="w-fit">
                      Standard User
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-slate-600 dark:text-slate-400">{formatDate(admin.createdAt)}</span>
              </TableCell>
              <TableCell className="text-right">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950 bg-transparent"
                      disabled={deletingId === admin._id}
                    >
                      {deletingId === admin._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Administrator</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete <strong>{admin.name}</strong>? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(admin._id, admin.name)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

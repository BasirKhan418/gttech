"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreateAccountForm } from "./create-account-form"

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

interface CreateAdminModalProps {
  isOpen: boolean
  onClose: () => void
  onAccountCreated: (admin: Admin) => void
}

export function CreateAdminModal({ isOpen, onClose, onAccountCreated }: CreateAdminModalProps) {
  const handleAccountCreated = (admin: Admin) => {
    onAccountCreated(admin)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Create New Admin Account
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6">
          <CreateAccountForm onAccountCreated={handleAccountCreated} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

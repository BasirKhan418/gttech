"use client"

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
import { AlertTriangle } from "lucide-react"

interface DeleteConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-slate-900/95 backdrop-blur-xl border border-red-500/30 text-white max-w-md">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent rounded-lg"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-red-500/[0.08] via-transparent to-orange-500/[0.05] rounded-lg"></div>
        
        <div className="relative z-10">
          <AlertDialogHeader className="space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-500/20 rounded-full border border-red-400/30 backdrop-blur-sm">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            
            <AlertDialogTitle className="text-xl font-bold text-center bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              {title}
            </AlertDialogTitle>
            
            <AlertDialogDescription className="text-gray-300 text-center leading-relaxed">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex gap-4 pt-6 border-t border-red-500/20">
            <AlertDialogCancel 
              onClick={onClose}
              className="bg-transparent border-gray-500/50 text-gray-300 hover:bg-gray-500/20 hover:text-white flex-1"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={onConfirm}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-lg shadow-red-500/25 flex-1"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
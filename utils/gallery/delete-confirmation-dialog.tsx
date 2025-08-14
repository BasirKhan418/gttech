"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Loader2 } from "lucide-react"

interface DeleteConfirmationDialogProps {
  title: string
  onConfirm: () => Promise<void>
  onCancel: () => void
  isDeleting: boolean
}

export function DeleteConfirmationDialog({ title, onConfirm, onCancel, isDeleting }: DeleteConfirmationDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">Delete Gallery Item</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Are you sure you want to delete <strong>"{title}"</strong>? This action cannot be undone.
          </p>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

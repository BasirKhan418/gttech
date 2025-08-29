"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Upload, Loader2 } from "lucide-react"

interface ImageUploaderProps {
  label?: string
  value?: string | string[]
  onChange: (urlOrUrls: string | string[]) => void
  multiple?: boolean
}

export function ImageUploader({ label = "Upload image", value, onChange, multiple }: ImageUploaderProps) {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)

  const handlePick = () => fileRef.current?.click()

  const current = Array.isArray(value) ? value : value ? [value] : []

  const handleFiles = async (files?: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      const uploaded: string[] = []
      for (const file of Array.from(files)) {
        const t = toast.loading(`Requesting upload URL for ${file.name}...`)
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, contentType: file.type || "image/*" }),
        })
        const data = await res.json()
        if (!res.ok || !data?.uploadURL || !data?.fileURL) {
          toast.error("Failed to get upload URL")
          continue
        }
        toast.dismiss(t)

        const t2 = toast.loading(`Uploading ${file.name}...`)
        const putRes = await fetch(data.uploadURL, { method: "PUT", body: file })
        if (!putRes.ok) {
          toast.dismiss(t2)
          toast.error(`Upload failed for ${file.name}`)
          continue
        }
        toast.dismiss(t2)
        uploaded.push(data.fileURL as string)
        toast.success(`${file.name} uploaded`)
      }

      if (uploaded.length) {
        if (multiple) {
          onChange([...(Array.isArray(value) ? value : []), ...uploaded])
        } else {
          onChange(uploaded[0])
        }
      }
    } catch (e: any) {
      toast.error(e?.message || "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handlePick}
          disabled={uploading}
          className="gap-2 bg-transparent"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? "Uploading..." : "Choose file"}
        </Button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple={!!multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {current.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {current.map((url, i) => (
            <div key={i} className="relative aspect-[4/3] rounded-md overflow-hidden border">
              <img src={url || "/placeholder.svg"} alt="Uploaded" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

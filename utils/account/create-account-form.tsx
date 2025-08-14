"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { User, Mail, Lock, Phone, FileText, Shield, Key } from "lucide-react"
import { toast } from "sonner"

interface FormData {
  name: string
  username: string
  email: string
  password: string
  confirmPassword: string
  img: string
  bio: string
  phone: string
  iscentraladmin: boolean
  twofactor: boolean
}

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

interface CreateAccountFormProps {
  onAccountCreated?: (admin: Admin) => void
}

export function CreateAccountForm({ onAccountCreated }: CreateAccountFormProps) {
  
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    img: "",
    bio: "",
    phone: "",
    iscentraladmin: false,
    twofactor: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    try {
      // Get presigned URL
      const response = await fetch("/api/s3-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      })

      if (!response.ok) throw new Error("Failed to get upload URL")

      const { url, fields } = await response.json()

      // Upload to S3
      const formData = new FormData()
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string)
      })
      formData.append("file", file)

      const uploadResponse = await fetch(url, {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) throw new Error("Failed to upload image")

      return `${url}${fields.key}`
    } catch (error) {
      console.error("Image upload error:", error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long")
      return
    }

    setIsLoading(true)

    try {
      let imageUrl = ""
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }

      const accountData = {
        name: formData.name,
        username: formData.username || undefined,
        email: formData.email,
        password: formData.password,
        img: imageUrl || undefined,
        bio: formData.bio || "",
        phone: formData.phone || "",
        iscentraladmin: formData.iscentraladmin,
        twofactor: formData.twofactor,
      }

      const response = await fetch("/api/admin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(accountData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create account")
      }

      const result = await response.json()
      const newAdmin = result.admin || result

      toast.success("Account created successfully!")

      // Reset form
      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        img: "",
        bio: "",
        phone: "",
        iscentraladmin: false,
        twofactor: false,
      })
      setImageFile(null)
      setImagePreview("")

      if (onAccountCreated && newAdmin) {
        onAccountCreated(newAdmin)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Required Fields */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <User className="h-5 w-5 text-blue-500" />
          Required Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter full name"
              className="focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter username (optional)"
              className="focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              className="pl-10 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                className="pl-10 focus:ring-2 focus:ring-blue-500"
                minLength={6}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm password"
                className="pl-10 focus:ring-2 focus:ring-blue-500"
                minLength={6}
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Optional Fields */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800/50 dark:to-slate-700/50 border-blue-200 dark:border-slate-600">
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <FileText className="h-4 w-4 text-blue-500" />
            Optional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Profile Image */}
          <div className="space-y-2">
            <Label htmlFor="image">Profile Image</Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {imagePreview && (
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-200 dark:border-blue-700 shadow-lg">
                  <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                className="pl-10 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Enter a brief bio"
              rows={3}
              className="resize-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Admin Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Shield className="h-5 w-5 text-emerald-500" />
          Admin Settings
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
            <div className="space-y-1">
              <Label htmlFor="iscentraladmin" className="text-sm font-medium">
                Central Admin Access
              </Label>
              <p className="text-xs text-slate-600 dark:text-slate-400">Grant full administrative privileges</p>
            </div>
            <Switch
              id="iscentraladmin"
              checked={formData.iscentraladmin}
              onCheckedChange={(checked) => handleSwitchChange("iscentraladmin", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="space-y-1">
              <Label htmlFor="twofactor" className="text-sm font-medium flex items-center gap-2">
                <Key className="h-4 w-4" />
                Two-Factor Authentication
              </Label>
              <p className="text-xs text-slate-600 dark:text-slate-400">Enable 2FA for enhanced security</p>
            </div>
            <Switch
              id="twofactor"
              checked={formData.twofactor}
              onCheckedChange={(checked) => handleSwitchChange("twofactor", checked)}
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3"
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  )
}

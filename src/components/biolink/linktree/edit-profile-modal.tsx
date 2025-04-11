/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Pencil, X, Upload, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { useSettingsStore } from "@/storage/settings-store"

interface EditProfileModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave?: () => void
}

export function EditProfileModal({ isOpen, onOpenChange, onSave }: EditProfileModalProps) {
  const { displayName, bio, profileImage, setDisplayName, setBio, setProfileImage, isSaving, username, setUsername } =
    useSettingsStore()
  
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: displayName,
    bio: bio,
    username: username
  })
  const [imagePreview, setImagePreview] = useState<string | null>(profileImage)
  const [errors, setErrors] = useState({
    name: "",
    bio: "",
    username:""
  })

  // Update form data when props change
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: displayName,
        bio: bio,
        username:username
      })
      setImagePreview(profileImage)
    }
  }, [displayName, bio, profileImage, isOpen])

  const validateForm = () => {
    const newErrors = {
      name: "",
      bio: "",
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.length > 50) {
      newErrors.name = "Name must be less than 50 characters"
    }

    if (formData.bio.length > 160) {
      newErrors.bio = "Bio must be less than 160 characters"
    }

    setErrors(newErrors as any)
    return !newErrors.name && !newErrors.bio
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Convert to base64 for preview and storage
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setImagePreview(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      // Update context values first
      setDisplayName(formData.name)
      setBio(formData.bio)
      setUsername(formData.username)
      setProfileImage(imagePreview)


      // No need to call saveSettings() here - changes will be saved when user exits the site
      // We only update the store, which marks hasChanges as true

      // Close the modal after successful update
      onOpenChange(false)
      if (onSave) onSave()
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  // Get initials for avatar fallback
  const getInitials = () => {
    return formData.name
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your profile information. Changes will be saved automatically.</DialogDescription>
        </DialogHeader>
        <DialogPrimitive.Close
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                {imagePreview ? (
                  <div className="h-20 w-20 overflow-hidden rounded-full">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-lg font-semibold text-white">{getInitials()}</span>
                  </div>
                )}
                <button
                  type="button"
                  className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-white hover:bg-gray-700"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Pencil className="h-3 w-3" />
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1"
                >
                  <Upload className="h-3 w-3" />
                  Upload
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveImage}
                  disabled={!imagePreview}
                  className="flex items-center gap-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name" className="flex items-center">
                Display Name
                <span className="ml-1 text-xs text-muted-foreground">{formData.name.length}/50</span>
              </Label>

              <Input
                id="displayName"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className={errors.name ? "border-red-500" : ""}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-xs text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name" className="flex items-center">
                Username
                <span className="ml-1 text-xs text-muted-foreground">{formData.username.length}/50</span>
              </Label>

              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                className={errors.name ? "border-red-500" : ""}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-xs text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio" className="flex items-center">
                Bio
                <span className="ml-1 text-xs text-muted-foreground">{formData.bio.length}/160</span>
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Write a short bio about yourself"
                className={errors.bio ? "border-red-500" : ""}
                rows={3}
                aria-invalid={!!errors.bio}
                aria-describedby={errors.bio ? "bio-error" : undefined}
              />
              {errors.bio && (
                <p id="bio-error" className="text-xs text-red-500">
                  {errors.bio}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving} className="bg-purple-600 hover:bg-purple-700">
              {isSaving ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Saving...
                </>
              ) : (
                "Apply Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function EditButton({ onClick, className = "" }: { onClick: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${className}`}
      aria-label="Edit profile"
    >
      <Pencil className="h-3 w-3" />
    </button>
  )
}


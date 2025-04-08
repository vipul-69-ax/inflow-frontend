"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ImageIcon, Upload, X } from "lucide-react"

interface ThumbnailUploadDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (thumbnailUrl: string) => void
  initialThumbnail?: string
  linkTitle?: string
}

export function ThumbnailUploadDialog({
  isOpen,
  onOpenChange,
  onSave,
  initialThumbnail,
}: ThumbnailUploadDialogProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(initialThumbnail || null)
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  // Process the file
  const handleFile = (file: File) => {
    if (!file.type.match("image.*")) {
      alert("Please select an image file")
      return
    }

    setIsUploading(true)

    // In a real app, you would upload the file to a server here
    // For this demo, we'll just use a local URL
    const reader = new FileReader()
    reader.onload = (e) => {
      setThumbnail(e.target?.result as string)
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  // Handle save
  const handleSave = () => {
    if (thumbnail) {
      onSave(thumbnail)
      onOpenChange(false)
    }
  }

  // Handle remove thumbnail
  const handleRemove = () => {
    setThumbnail(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Thumbnail</DialogTitle>
        </DialogHeader>

        <div className="py-4">

          {thumbnail ? (
            <div className="relative w-full h-48 mb-4">
              <img
                src={thumbnail || "/placeholder.svg"}
                alt="Thumbnail preview"
                className="w-full h-full rounded-md"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center mb-4 transition-colors
                ${dragActive ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-purple-400"}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center justify-center cursor-pointer">
                <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-1">Drag and drop an image here, or click to select</p>
                <p className="text-xs text-gray-400">PNG, JPG, GIF up to 2MB</p>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <Button
              onClick={handleSave}
              disabled={!thumbnail || isUploading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8"
            >
              {isUploading ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Set Thumbnail"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


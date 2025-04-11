"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { z } from "zod"

interface LinkData {
  title: string
  url: string
}

interface LinkDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (data: LinkData, id?: number) => void // <== Add optional `id`
  initialData?: LinkData & { id?: number } // <== So we can pass the id
}

const linkSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  url: z.string().url({ message: "Please enter a valid URL" }),
})


export function LinkDialog({ isOpen, onOpenChange, onSave, initialData }: LinkDialogProps) {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [errors, setErrors] = useState<{ title?: string; url?: string }>({})

  // Reset form when dialog opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title)
        setUrl(initialData.url)
      } else {
        setTitle("")
        setUrl("")
      }
      setErrors({})
    }
  }, [isOpen, initialData])


  
  const validateForm = (): boolean => {
    const result = linkSchema.safeParse({ title, url })
  
    if (!result.success) {
      const newErrors: { title?: string; url?: string } = {}
      result.error.errors.forEach((err) => {
        if (err.path[0] === "title") newErrors.title = err.message
        if (err.path[0] === "url") newErrors.url = err.message
      })
      setErrors(newErrors)
      return false
    }
  
    setErrors({})
    return true
  }
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      if (onSave) {
        onSave({ title, url }, initialData?.id) // <== include the id when editing
      }
      // if (onSave) {
      //   onSave({ title, url })
      // }
      onOpenChange(false)
    }
  }

  // Helper to add https:// if missing
  const formatUrl = (input: string) => {
    if (input && !input.startsWith("http://") && !input.startsWith("https://")) {
      return `https://${input}`
    }
    return input
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Link" : "Add New Link"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter link title"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className={errors.url ? "border-red-500" : ""}
              onBlur={(e) => setUrl(formatUrl(e.target.value))}
            />
            {errors.url && <p className="text-xs text-red-500">{errors.url}</p>}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              {initialData ? "Save Changes" : "Add Link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
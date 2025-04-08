"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SocialIconData {
  name: string
  url: string
}

interface SocialIconDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: SocialIconData) => void
  onDelete?: () => void
  initialData?: SocialIconData
  availablePlatforms: string[]
}

export function SocialIconDialog({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
  availablePlatforms,
}: SocialIconDialogProps) {
  const [platform, setPlatform] = useState("")
  const [url, setUrl] = useState("")
  const [errors, setErrors] = useState<{ platform?: string; url?: string }>({})

  // Reset form when dialog opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setPlatform(initialData.name)
        setUrl(initialData.url)
      } else {
        setPlatform("")
        setUrl("")
      }
      setErrors({})
    }
  }, [isOpen, initialData])

  // Update the validateForm function to better handle various URL formats
  const validateForm = (): boolean => {
    const newErrors: { platform?: string; url?: string } = {}

    if (!platform) {
      newErrors.platform = "Platform is required"
    }

    if (!url.trim()) {
      newErrors.url = "URL is required"
    } else {
      // For email addresses
      if (platform === "Email") {
        // Remove mailto: prefix for validation if present
        const emailToCheck = url.startsWith("mailto:") ? url.substring(7) : url

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToCheck)) {
          newErrors.url = "Please enter a valid email address"
        }
      } else {
        // For all other platforms, extract domain for validation
        // This allows URLs with or without protocol
        let urlToCheck = url

        // Remove protocol if present for validation
        if (urlToCheck.startsWith("http://") || urlToCheck.startsWith("https://")) {
          urlToCheck = urlToCheck.replace(/^https?:\/\//, "")
        }

        // Remove www. if present
        if (urlToCheck.startsWith("www.")) {
          urlToCheck = urlToCheck.replace(/^www\./, "")
        }

        // Platform-specific validation
        if (platform === "Instagram") {
          if (!/^instagram\.com\/[a-zA-Z0-9_.]+\/?$/.test(urlToCheck)) {
            newErrors.url = "Please enter a valid Instagram URL (e.g., instagram.com/username)"
          }
        } else if (platform === "Facebook") {
          if (!/^facebook\.com\/[a-zA-Z0-9.]+\/?$/.test(urlToCheck)) {
            newErrors.url = "Please enter a valid Facebook URL (e.g., facebook.com/username)"
          }
        } else if (platform === "Twitter") {
          if (!/^twitter\.com\/[a-zA-Z0-9_]+\/?$/.test(urlToCheck)) {
            newErrors.url = "Please enter a valid Twitter URL (e.g., twitter.com/username)"
          }
        } else if (platform === "LinkedIn") {
          if (!/^linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/.test(urlToCheck)) {
            newErrors.url = "Please enter a valid LinkedIn URL (e.g., linkedin.com/in/username)"
          }
        } else if (platform === "GitHub") {
          if (!/^github\.com\/[a-zA-Z0-9-]+\/?$/.test(urlToCheck)) {
            newErrors.url = "Please enter a valid GitHub URL (e.g., github.com/username)"
          }
        } else if (platform === "YouTube") {
          if (!/^youtube\.com\/(channel|c|user|@)\/[a-zA-Z0-9\-_]+\/?$/.test(urlToCheck)) {
            newErrors.url = "Please enter a valid YouTube URL (e.g., youtube.com/@username)"
          }
        } else if (platform === "TikTok") {
          if (!/^tiktok\.com\/@[a-zA-Z0-9_.]+\/?$/.test(urlToCheck)) {
            newErrors.url = "Please enter a valid TikTok URL (e.g., tiktok.com/@username)"
          }
        } else {
          // General URL validation for other platforms
          if (!/^([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(urlToCheck)) {
            newErrors.url = "Please enter a valid URL"
          }
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSave({ name: platform, url: formatUrl(url, platform) })
    }
  }

  // Update the formatUrl function to better handle various URL formats
  const formatUrl = (input: string, platform: string): string => {
    if (!input.trim()) return input

    // Handle email addresses
    if (platform === "Email") {
      return input.startsWith("mailto:") ? input : `mailto:${input}`
    }

    // Handle all other URLs
    if (!input.startsWith("http://") && !input.startsWith("https://")) {
      return `https://${input}`
    }

    return input
  }

  // Helper to get URL placeholder based on platform
  const getUrlPlaceholder = (): string => {
    switch (platform) {
      case "Instagram":
        return "instagram.com/username"
      case "Email":
        return "your.email@example.com"
      case "Facebook":
        return "facebook.com/username"
      case "YouTube":
        return "youtube.com/@channel"
      case "Twitter":
        return "twitter.com/username"
      case "LinkedIn":
        return "linkedin.com/in/username"
      case "GitHub":
        return "github.com/username"
      case "TikTok":
        return "tiktok.com/@username"
      case "Website":
        return "yourwebsite.com"
      case "Spotify":
        return "open.spotify.com/artist/id"
      case "Twitch":
        return "twitch.tv/username"
      default:
        return "https://example.com"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Social Link" : "Add Social Link"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger id="platform" className={errors.platform ? "border-red-500" : ""}>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {availablePlatforms.map((platform) => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.platform && <p className="text-xs text-red-500">{errors.platform}</p>}
          </div>

          {/* Update the URL input field to add a helpful message */}
          <div className="space-y-2">
            <Label htmlFor="url">{platform === "Email" ? "Email Address" : "Profile URL"}</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                // Clear error when user types
                if (errors.url) {
                  setErrors({ ...errors, url: undefined })
                }
              }}
              placeholder={getUrlPlaceholder()}
              className={errors.url ? "border-red-500" : ""}
            />
            {errors.url && <p className="text-xs text-red-500">{errors.url}</p>}
            <p className="text-sm text-gray-500">
              {platform === "Email" ? "Example: your.email@example.com" : `Example: ${getUrlPlaceholder()}`}
              <br />
              You can paste full URLs with or without https:// - we'll handle it for you.
            </p>
          </div>

          <DialogFooter className="pt-4 flex justify-between">
            <div>
              {onDelete && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onDelete}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                {initialData ? "Save Changes" : "Add Link"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


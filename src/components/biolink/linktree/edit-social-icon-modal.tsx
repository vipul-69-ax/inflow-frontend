"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { AlertCircle } from "lucide-react"
import { useLinksStore } from "@/storage/links-store"
import { useUserLinks } from "@/hooks/api/biolink/useUserLinks"

interface EditSocialIconModalProps {
  isOpen: boolean
  onClose: () => void
  socialName: string
  socialUrl?: string
}

export function EditSocialIconModal({ isOpen, onClose, socialName, socialUrl }: EditSocialIconModalProps) {
  const { socialLinks, addSocialLink, removeSocialLink } = useLinksStore()
  const [url, setUrl] = useState(socialUrl || "")
  const [error, setError] = useState<string | null>(null)
  const {updateSocialLinks} = useUserLinks()
  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setUrl(socialUrl || "")
      setError(null)
    }
  }, [isOpen, socialUrl])

  // Get platform-specific placeholder
  const getUrlPlaceholder = (): string => {
    switch (socialName) {
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
      case "Website":
        return "yourwebsite.com"
      default:
        return "https://example.com"
    }
  }

  // Platform-specific validation
  const validateUrl = (input: string): boolean => {
    if (!input.trim()) {
      setError("URL is required")
      return false
    }

    if (socialName === "Email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
        setError("Please enter a valid email address")
        return false
      }
    } else if (socialName === "Instagram") {
      if (!/^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/.test(input)) {
        setError("Please enter a valid Instagram URL (e.g., instagram.com/username)")
        return false
      }
    } else if (socialName === "Facebook") {
      if (!/^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9.]+\/?$/.test(input)) {
        setError("Please enter a valid Facebook URL (e.g., facebook.com/username)")
        return false
      }
    } else if (!/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(input)) {
      setError("Please enter a valid URL")
      return false
    }

    setError(null)
    return true
  }

  // Format URL based on platform
  const formatUrl = (input: string): string => {
    if (socialName === "Email") {
      return input.startsWith("mailto:") ? input : `mailto:${input}`
    } else if (input && !input.startsWith("http://") && !input.startsWith("https://")) {
      return `https://${input}`
    }
    return input
  }

  const handleSave = () => {
    if (validateUrl(url)) {
      const formatted = formatUrl(url)
  
      // Clone current socialLinks
      const updatedLinks = [...socialLinks]
  
      // Find existing and replace or push new
      const existingIndex = updatedLinks.findIndex((link) => link.name === socialName)
  
      if (existingIndex !== -1) {
        updatedLinks[existingIndex] = {
          ...updatedLinks[existingIndex],
          url: formatted,
        }
      } else {
        updatedLinks.push({
          name: socialName,
          icon: "", // Optional: fill if needed
          url: formatted,
        })
      }
  
      // Update Zustand and backend
      removeSocialLink(socialName)
      addSocialLink({ name: socialName, icon: "", url: formatted })
      updateSocialLinks(updatedLinks)
  
      onClose()
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit {socialName} URL</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="social-url">{socialName === "Email" ? "Email Address" : "Profile URL"}</Label>
            <Input
              id="social-url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                setError(null) // Clear error when typing
              }}
              placeholder={getUrlPlaceholder()}
              className={error ? "border-red-500" : ""}
              onBlur={(e) => setUrl(formatUrl(e.target.value))}
            />
            {error && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {error}
              </div>
            )}
            <p className="text-sm text-gray-500">Example: {getUrlPlaceholder()}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


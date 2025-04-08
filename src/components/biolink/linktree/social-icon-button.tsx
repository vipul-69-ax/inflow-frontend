"use client"

import type React from "react"

import { useState } from "react"
import { EditSocialIconModal } from "@/components/biolink/linktree/edit-social-icon-modal"
import { useLinks } from "@/context/biolink/links-context"
import { X } from "lucide-react"

interface SocialIconButtonProps {
  name: string
  icon: React.ReactNode
  url?: string
  editable?: boolean
}

export function SocialIconButton({ name, icon, url, editable = true }: SocialIconButtonProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { removeSocialLink } = useLinks()

  // Handle click on the social icon
  const handleIconClick = () => {
    if (editable) {
      setIsEditModalOpen(true)
    } else if (url) {
      // For non-editable mode, open the URL in a new tab
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div className="relative group">
      {/* If editable, make the icon clickable to edit */}
      {editable ? (
        <button
          onClick={handleIconClick}
          className="rounded-full bg-gray-100 dark:bg-gray-700 p-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          aria-label={`Edit ${name}`}
        >
          {icon}
        </button>
      ) : (
        <button
          onClick={handleIconClick}
          className="rounded-full bg-gray-100 dark:bg-gray-700 p-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 inline-flex"
          aria-label={name}
        >
          {icon}
        </button>
      )}

      {/* Remove button */}
      {editable && (
        <button
          onClick={() => removeSocialLink(name)}
          className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          aria-label={`Remove ${name}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}

      {/* Edit modal */}
      <EditSocialIconModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        socialName={name}
        socialUrl={url}
      />
    </div>
  )
}


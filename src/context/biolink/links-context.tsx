"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Define types for our links
export interface RegularLink {
  id: number
  title: string
  url: string
  active: boolean
  clicks?: number
  favorite?: boolean
  thumbnail?: string
  layout?: string
  scheduledDate?: string
  scheduleStart?: string
  scheduleEnd?: string
  timezone?: string
}

export interface SocialLink {
  name: string
  icon: React.ReactNode
  url: string
}

// Define the context shape
interface LinksContextType {
  regularLinks: RegularLink[]
  socialLinks: SocialLink[]
  addRegularLink: (link: RegularLink) => void
  updateRegularLink: (id: number, link: Partial<RegularLink>) => void
  deleteLink: (id: number) => void
  toggleLinkActive: (id: number) => void
  toggleLinkFavorite: (id: number) => void
  incrementLinkClicks: (id: number) => void
  updateLinkThumbnail: (id: number, thumbnailUrl: string) => void
  scheduleLinkPublication: (id: number, date: string) => void
  updateLinkSchedule: (id: number, scheduleStart?: string, scheduleEnd?: string, timezone?: string) => void
  addSocialLink: (link: SocialLink) => void
  updateSocialLink: (index: number, link: SocialLink) => void
  removeSocialLink: (index: number) => void
}

// Create the context with default values
const LinksContext = createContext<LinksContextType>({
  regularLinks: [],
  socialLinks: [],
  addRegularLink: () => {},
  updateRegularLink: () => {},
  deleteLink: () => {},
  toggleLinkActive: () => {},
  toggleLinkFavorite: () => {},
  incrementLinkClicks: () => {},
  updateLinkThumbnail: () => {},
  scheduleLinkPublication: () => {},
  updateLinkSchedule: () => {},
  addSocialLink: () => {},
  updateSocialLink: () => {},
  removeSocialLink: () => {},
})

// Sample initial data for demonstration
const initialRegularLinks: RegularLink[] = []

// Provider component
export function LinksProvider({ children }: { children: React.ReactNode }) {
  // State for regular links
  const [regularLinks, setRegularLinks] = useState<RegularLink[]>(initialRegularLinks)

  // State for social links
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])

  // Load links from localStorage on component mount
  useEffect(() => {
    const savedRegularLinks = localStorage.getItem("regularLinks")
    const savedSocialLinks = localStorage.getItem("socialLinks")

    if (savedRegularLinks) {
      try {
        setRegularLinks(JSON.parse(savedRegularLinks))
      } catch (error) {
        console.error("Failed to parse regular links from localStorage:", error)
      }
    }

    if (savedSocialLinks) {
      try {
        // We can't directly parse the social links because they contain React elements
        // Instead, we'll handle this in a real app with a proper serialization approach
        // For this demo, we'll just use the initial state
      } catch (error) {
        console.error("Failed to parse social links from localStorage:", error)
      }
    }
  }, [])

  // Save links to localStorage whenever they change
  useEffect(() => {
    try {
      // Create a version of regularLinks that doesn't include large thumbnail data
      const storageLinks = regularLinks.map((link) => {
        // If the link has a thumbnail that's a data URL (very large), store a flag instead
        if (link.thumbnail && link.thumbnail.startsWith("data:")) {
          return {
            ...link,
            thumbnail: "[thumbnail-data]", // Just store a placeholder
          }
        }
        return link
      })

      localStorage.setItem("regularLinks", JSON.stringify(storageLinks))
    } catch (error) {
      console.error("Failed to save links to localStorage:", error)
      // If we hit quota, we can try to clear some space or just continue without saving
      if (error instanceof DOMException && error.name === "QuotaExceededError") {
        // Try to clear old data or notify user
        console.warn("Storage quota exceeded. Some link data may not be saved.")
      }
    }
  }, [regularLinks])

  // Function to add a new regular link
  const addRegularLink = (link: RegularLink) => {
    setRegularLinks((prevLinks) => [...prevLinks, link])
  }

  // Function to update an existing regular link
  const updateRegularLink = (id: number, updatedFields: Partial<RegularLink>) => {
    setRegularLinks((prevLinks) => prevLinks.map((link) => (link.id === id ? { ...link, ...updatedFields } : link)))
  }

  // Function to delete a link
  const deleteLink = (id: number) => {
    setRegularLinks((prevLinks) => prevLinks.filter((link) => link.id !== id))
  }

  // Function to toggle a link's active state
  const toggleLinkActive = (id: number) => {
    setRegularLinks((prevLinks) => prevLinks.map((link) => (link.id === id ? { ...link, active: !link.active } : link)))
  }

  // Function to toggle a link's favorite state
  const toggleLinkFavorite = (id: number) => {
    setRegularLinks((prevLinks) =>
      prevLinks.map((link) => (link.id === id ? { ...link, favorite: !link.favorite } : link)),
    )
  }

  // Function to increment a link's click count
  const incrementLinkClicks = (id: number) => {
    setRegularLinks((prevLinks) =>
      prevLinks.map((link) => (link.id === id ? { ...link, clicks: (link.clicks || 0) + 1 } : link)),
    )
  }

  // Function to update a link's thumbnail
  const updateLinkThumbnail = (id: number, thumbnailUrl: string) => {
    // If the thumbnail is a data URL and very large, consider compressing or handling differently
    const storageUrl = thumbnailUrl

    // If it's a data URL and very large, we might want to handle it differently in a real app
    // For this demo, we'll just use it directly but be aware of storage limitations

    setRegularLinks((prevLinks) =>
      prevLinks.map((link) => (link.id === id ? { ...link, thumbnail: storageUrl } : link)),
    )
  }

  // Function to schedule a link's publication
  const scheduleLinkPublication = (id: number, date: string) => {
    setRegularLinks((prevLinks) => prevLinks.map((link) => (link.id === id ? { ...link, scheduledDate: date } : link)))
  }

  const updateLinkSchedule = (id: number, scheduleStart?: string, scheduleEnd?: string, timezone?: string) => {
    setRegularLinks((prevLinks) =>
      prevLinks.map((link) =>
        link.id === id
          ? {
              ...link,
              scheduleStart,
              scheduleEnd,
              timezone,
            }
          : link,
      ),
    )
  }

  // Function to add a new social link
  const addSocialLink = (link: SocialLink) => {
    setSocialLinks((prevLinks) => [...prevLinks, link])
  }

  // Function to update an existing social link
  const updateSocialLink = (index: number, updatedLink: SocialLink) => {
    setSocialLinks((prevLinks) => {
      const newLinks = [...prevLinks]
      newLinks[index] = updatedLink
      return newLinks
    })
  }

  // Function to remove a social link
  const removeSocialLink = (index: number) => {
    setSocialLinks((prevLinks) => {
      const newLinks = [...prevLinks]
      newLinks.splice(index, 1)
      return newLinks
    })
  }

  return (
    <LinksContext.Provider
      value={{
        regularLinks,
        socialLinks,
        addRegularLink,
        updateRegularLink,
        deleteLink,
        toggleLinkActive,
        toggleLinkFavorite,
        incrementLinkClicks,
        updateLinkThumbnail,
        scheduleLinkPublication,
        updateLinkSchedule,
        addSocialLink,
        updateSocialLink,
        removeSocialLink,
      }}
    >
      {children}
    </LinksContext.Provider>
  )
}

// Custom hook to use the links context
export const useLinks = () => useContext(LinksContext)


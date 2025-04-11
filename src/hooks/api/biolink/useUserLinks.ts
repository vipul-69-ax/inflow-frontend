/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react"
import { api } from "../auth/useAuth"
import { useAuthStore } from "@/storage/auth"

export interface RegularLink {
  id?: number
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
  icon: string
  url: string
}

interface UseUserLinksReturn {
  regularLinks: RegularLink[]
  socialLinks: SocialLink[]
  loading: boolean
  error: string | null
  fetchLinks: () => void
  updateRegularLinks: (links: RegularLink[]) => Promise<void>
  updateSocialLinks: (links: SocialLink[]) => Promise<void>
}

export const useUserLinks = (): UseUserLinksReturn => {
  const [regularLinks, setRegularLinks] = useState<RegularLink[]>([])
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const userId = useAuthStore((state) => state.userId)
  const fetchLinks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [regularRes, socialRes] = await Promise.all([
        api.get<RegularLink[]>("/regular-links", {
            headers:{
                "Authorization": `Bearer ${userId}`
              }
        }),
        api.get<SocialLink[]>("/social-links", {
            headers:{
                "Authorization": `Bearer ${userId}`
              }
        }),
      ])
      setRegularLinks(regularRes.data)
      setSocialLinks(socialRes.data)
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch links")
    } finally {
      setLoading(false)
    }
  }, [])

  const updateRegularLinks = useCallback(async (links: RegularLink[]) => {
    try {
      await api.post("/regular-links", { links }, {
        headers:{
          "Authorization": `Bearer ${userId}`
        }
      })
      setRegularLinks(links)
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update regular links")
    }
  }, [])

  const updateSocialLinks = useCallback(async (links: SocialLink[]) => {
    try {
      await api.post("/social-links", { links }, {
        headers:{
          "Authorization": `Bearer ${userId}`
        }
      })
      console.log(links)
      setSocialLinks(links)
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update social links")
    }
  }, [])

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  return {
    regularLinks,
    socialLinks,
    loading,
    error,
    fetchLinks,
    updateRegularLinks,
    updateSocialLinks,
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useCallback } from "react"
import { api } from "../auth/useAuth"
import { useAuthStore } from "@/storage/auth"
import type { UserSettings, UpdateSettingsRequest } from "@/types/biolink/settings"

/**
 * Hook for interacting with the settings API
 */

export function useSettingsHook() {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const userId = useAuthStore((state) => state.userId)

  /**
   * Fetch settings from the API
   */
  const fetchSettings = useCallback(async () => {
    if (!isAuthenticated || !userId) {
      return null
    }

    setIsLoading(true)
    setError(null)
    try {
      const response = await api.get<UserSettings>("/profile", {
        headers:{
          "Authorization": `Bearer ${userId}`
        }
      })
      setSettings(response.data)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch settings")
      console.error("Error fetching settings:", err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, userId])

  /**
   * Update settings via the API
   */
  const updateSettings = useCallback(
    async (updates: UpdateSettingsRequest) => {
      if (!isAuthenticated || !userId) {
        throw new Error("User not authenticated")
      }


      setIsLoading(true)
      setError(null)

      try {
        const response = await api.post<UserSettings>("/profile", updates, {
          headers:{
            "Authorization": `Bearer ${userId}`
          }
        })

        setSettings(response.data)
        return response.data
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to update settings")
        console.error("Error updating settings:", err)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [isAuthenticated, userId],
  )

  return {
    settings,
    isLoading,
    error,
    fetchSettings,
    updateSettings,
  }
}


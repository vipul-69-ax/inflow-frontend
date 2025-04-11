/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"

const API_BASE = "https://api.inflow.chat/api/scheduling/youtube" // Update this to match your backend

export function useYouTubeScheduler() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 1. Exchange OAuth2 code for tokens
  const setOAuthToken = async (code: string) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/set-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()
      setLoading(false)
      return data
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  // 2. Schedule a video
  const scheduleVideo = async (formData: FormData) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/schedule/video`, {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      setLoading(false)
      return data
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  // 3. Schedule a live stream
  const scheduleLive = async (payload: any) => {
    
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/schedule/live`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      setLoading(false)
      return data
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  // 4. Fetch all scheduled media
  const fetchScheduledMedia = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/scheduled`)
      const data = await res.json()
      setLoading(false)
      return data
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    setOAuthToken,
    scheduleVideo,
    scheduleLive,
    fetchScheduledMedia,
  }
}

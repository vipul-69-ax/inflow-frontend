/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useCallback, useMemo } from "react"
import axios from "axios"
import { useAuthStore } from "@/storage/auth"

// Base API URL - change this to match your backend URL
const API_BASE_URL = "https://api.inflow.chat/api/monitoring/tiktok"

// Types for API responses
interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
  users?: string[]
  updates?: string[]
}

export interface TiktokVideo {
  caption: string
  video_id: string
  video_url: string
  video_cover: string
  likes: number
  comments: number
  shares: number
  views: number
  timestamp: number
}

export interface TiktokUserData {
  username: string
  full_name: string
  profile_pic_url: string
  bio: string
  followers: number
  following: number
  likes: number
  videos: number
  is_verified: boolean
  recent_videos: TiktokVideo[]
  total_likes: number
  total_comments: number
  total_shares: number
  total_views: number
  engagement_rate: number
  timestamp: string
}

interface TiktokUserResponse {
  error: string
  data: TiktokUserData[]
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests

export function useTiktokApi() {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  
  const {userId:token} = useAuthStore()
  api.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })
  /**
   * Fetch all monitored TikTok users
   */
  const getAllTiktokUsers = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.get<ApiResponse<never>>("/get_all_users_tiktok")

      if (!response.data.users) {
        throw new Error("Failed to fetch users")
      }

      return response.data.users || []
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)

      return []
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Add a new TikTok user to monitor
   */
  const addTiktokUser = useCallback(async (username: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.post<ApiResponse<never>>("/add_user_tiktok", { username })

      if (!response.data) {
        throw new Error("Failed to add user")
      }

      return true
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : "An unknown error occurred"
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Remove a TikTok user from monitoring
   */
  const removeTiktokUser = useCallback(async (username: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.delete<ApiResponse<never>>("/remove_user_tiktok", {
        data: { username },
      })

      if (!response.data) {
        throw new Error("Failed to remove user")
      }

      return true
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : "An unknown error occurred"
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Refresh TikTok data for all monitored users
   */
  const refreshTiktokData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.post<ApiResponse<never>>("/refresh_data_tiktok")

      if (!response.data) {
        throw new Error("Failed to refresh data")
      }

      return response.data.updates || []
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : "An unknown error occurred"
      setError(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Fetch TikTok data for a specific user
   */
  const getTiktokUserData = useCallback(async (username: string): Promise<TiktokUserData[] | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.get<TiktokUserResponse>("/get_data_tiktok", {
        params: { username },
      })

      if (!response.data || !response.data.data) {
        throw new Error("Failed to fetch user data")
      }

      // Sort data by timestamp (newest first)
      const sortedData = response.data.data.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )

      return sortedData
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : "An unknown error occurred"
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Process TikTok user data for charts and visualizations
   */
  const useTiktokChartData = (userData: TiktokUserData[] | TiktokUserData | null) => {
    // Convert single object to array if needed
    const userDataArray = useMemo(
      () => (userData ? (Array.isArray(userData) ? userData : [userData]) : null),
      [userData],
    )

    // Generate engagement history data based on all available snapshots
    const generateEngagementHistory = useCallback(() => {
      if (!userDataArray || userDataArray.length === 0) return []

      function calcEng(data: any) {
        return ((Math.abs(data.likes) + data.following) / data.followers) * 100
      }

      // Sort by timestamp (oldest to newest)
      const sortedData = [...userDataArray].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      )

      // Create data points for each snapshot
      return sortedData.map((data) => {
        return {
          date: data.timestamp ? formatDate(new Date(data.timestamp)) : "Invalid Date",
          rate: calcEng(data),
          timestamp: data.timestamp,
        }
      })
    }, [userDataArray])

    // Generate follower history based on all available snapshots
    const generateFollowerHistory = useCallback(() => {
      if (!userDataArray || userDataArray.length === 0) return []

      // Sort by timestamp (oldest to newest)
      const sortedData = [...userDataArray].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      )

      // Create data points for each snapshot
      return sortedData.map((data) => {
        return {
          date: data.timestamp ? formatDate(new Date(data.timestamp)) : "Invalid Date",
          count: data.followers,
          timestamp: data.timestamp,
        }
      })
    }, [userDataArray])

    // Generate likes, comments, shares history based on total values
    const generateInteractionHistory = useCallback(() => {
      if (!userDataArray || userDataArray.length === 0) return []

      // Sort by timestamp (oldest to newest)
      const sortedData = [...userDataArray].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      )

      function helper(data: any) {
        const res = data.recent_videos.reduce(
          (acc: any, video: any) => {
            acc.likes += video.likes
            acc.comments += video.comments
            acc.shares += video.shares
            acc.views += video.views
            return acc
          },
          { likes: 0, comments: 0, shares: 0, views: 0 },
        )
        return res
      }

      // Create data points for each snapshot
      return sortedData.map((data) => {
        const interactions = helper(data)
        return {
          date: data.timestamp ? formatDate(new Date(data.timestamp)) : "Invalid Date",
          likes: interactions.likes || 0,
          comments: interactions.comments || 0,
          shares: interactions.shares || 0,
          views: interactions.views || 0,
          timestamp: data.timestamp,
        }
      })
    }, [userDataArray])

    // Generate video performance metrics
    const generateVideoPerformance = useCallback(() => {
      if (!userDataArray || userDataArray.length === 0) {
        return []
      }

      // Get the latest data entry
      const latestData = userDataArray[0]

      if (!latestData.recent_videos || latestData.recent_videos.length === 0) {
        return []
      }

      // Return video performance data
      return latestData.recent_videos.map((video, index) => ({
        name: `Video ${index + 1}`,
        likes: video.likes,
        comments: video.comments,
        shares: video.shares,
        views: video.views,
        engagement: ((video.likes + video.comments + video.shares) / video.views) * 100,
      }))
    }, [userDataArray])

    // Generate business insights for competitor analysis
    const generateBusinessInsights = useCallback(() => {
      if (!userDataArray || userDataArray.length === 0) {
        return null
      }

      // Get the latest data entry
      const latestData = userDataArray[0]

      if (!latestData.recent_videos || latestData.recent_videos.length === 0) {
        return null
      }

      // Calculate average metrics
      const avgLikes = latestData.total_likes / latestData.recent_videos.length
      const avgComments = latestData.total_comments / latestData.recent_videos.length
      const avgShares = latestData.total_shares / latestData.recent_videos.length
      const avgViews = latestData.total_views / latestData.recent_videos.length

      // Find best performing video
      const bestVideo = [...latestData.recent_videos].sort(
        (a, b) => b.likes + b.comments + b.shares - (a.likes + a.comments + a.shares),
      )[0]

      // Calculate growth metrics if we have multiple data points
      const followerGrowth =
        userDataArray.length > 1
          ? ((latestData.followers - userDataArray[userDataArray.length - 1].followers) /
              userDataArray[userDataArray.length - 1].followers) *
            100
          : 0

      const engagementGrowth =
        userDataArray.length > 1
          ? ((latestData.engagement_rate - userDataArray[userDataArray.length - 1].engagement_rate) /
              userDataArray[userDataArray.length - 1].engagement_rate) *
            100
          : 0

      return {
        avgLikes,
        avgComments,
        avgShares,
        avgViews,
        totalEngagement: latestData.total_likes + latestData.total_comments + latestData.total_shares,
        engagementRate: latestData.engagement_rate,
        followerGrowth,
        engagementGrowth,
        bestPerformingVideo: bestVideo,
        videoFrequency: latestData.recent_videos.length / 7, // Videos per day (assuming 7 days of data)
      }
    }, [userDataArray])

    return {
      engagementHistory: generateEngagementHistory(),
      followerHistory: generateFollowerHistory(),
      interactionHistory: generateInteractionHistory(),
      videoPerformance: generateVideoPerformance(),
      businessInsights: generateBusinessInsights(),
    }
  }

  // Helper function to format dates
  function formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return {
    loading,
    error,
    getAllTiktokUsers,
    addTiktokUser,
    removeTiktokUser,
    refreshTiktokData,
    getTiktokUserData,
    useTiktokChartData,
  }
}


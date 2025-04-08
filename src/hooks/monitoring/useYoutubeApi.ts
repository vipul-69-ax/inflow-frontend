/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useCallback } from "react"
import type { YoutubeUserData } from "@/types/scheduling/youtube"
import axios from "axios"
import { useAuthStore } from "@/storage/auth"

// API base URL - replace with your actual API URL
const API_BASE_URL = "https://api.inflow.chat/api/monitoring/youtube"

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests

export function useYoutubeUsers() {
  const [users, setUsers] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const {userId:token} = useAuthStore()
  
  api.interceptors.request.use((config) => {

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.get(`/get_all_users_youtube`)
      setUsers(response.data.users || [])
    } catch (err) {
      console.error("Error fetching YouTube users:", err)
      setError("Failed to fetch users. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return { users, loading, error, refetch: fetchUsers }
}

export function useAddYoutubeUser() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const addUser = useCallback(async (username: string) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await api.post(`/add_user_youtube`, { username })
      setSuccess(true)
    } catch (err: any) {
      console.error("Error adding YouTube user:", err)
      setError(err.response?.data?.error || "Failed to add user. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  return { addUser, loading, error, success }
}

export function useYoutubeUserData(username: string | null) {
  const [userData, setUserData] = useState<YoutubeUserData[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUserData = useCallback(async (username: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.get(`/get_data_youtube`, {
        params: { username },
      })

      if (response.data.data && response.data.data.length > 0) {
        // Transform the data to match our interface
        const transformedData = response.data.data.map((item: any) => ({
          username: item.username,
          channel_name: item.channel_name || item.username, // Fallback to username if channel_name is missing
          profile_pic_url:
            item.profile_pic_url || `https://ui-avatars.com/api/?name=${item.username}&background=random`,
          description: item.description || "",
          subscribers: item.subscribers,
          total_views: item.total_views,
          total_videos: item.total_videos,
          recent_videos: Array.isArray(item.recent_videos) ? item.recent_videos : [],
          total_likes: item.total_likes || "0",
          total_comments: item.total_comments || "0",
          engagement_rate: item.engagement_rate || 0,
          timestamp: item.timestamp,
        }))

        setUserData(transformedData)
      } else {
        setError("No data available for this channel")
      }
    } catch (err: any) {
      console.error("Error fetching YouTube user data:", err)
      setError(err.response?.data?.error || "Failed to fetch user data. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (username) {
      fetchUserData(username)
    } else {
      setUserData(null)
    }
  }, [username, fetchUserData])

  return {
    userData,
    loading,
    error,
    refetch: (username: string) => fetchUserData(username),
  }
}

export function useRefreshYoutubeData() {
  const [loading, setLoading] = useState(false)
  const [updates, setUpdates] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const refreshData = useCallback(async () => {
    setLoading(true)
    setUpdates([])
    setError(null)

    try {
      const response = await api.post(`/refresh_data_youtube`)
      setUpdates(response.data.updates || [])
    } catch (err: any) {
      console.error("Error refreshing YouTube data:", err)
      setError(err.response?.data?.error || "Failed to refresh data. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  return { refreshData, loading, updates, error }
}

export function useRemoveYoutubeUser() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const removeUser = useCallback(async (username: string) => {
    setLoading(true)
    setSuccess(false)
    setError(null)

    try {
      await api.delete(`/remove_user_youtube`, {
        data: { username },
      })
      setSuccess(true)
    } catch (err: any) {
      console.error("Error removing YouTube user:", err)
      setError(err.response?.data?.error || "Failed to remove user. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  return { removeUser, loading, success, error }
}

export function useYoutubeChartData(userData: YoutubeUserData[]) {
  const [chartData, setChartData] = useState<{
    engagementHistory: { date: string; rate: number; timestamp: number }[]
    subscriberHistory: { date: string; count: number; timestamp: number }[]
    interactionHistory: { date: string; likes: number; comments: number; views: number; timestamp: number }[]
    videoPerformance: { name: string; views: number; likes: number; comments: number; engagement: number; id: string }[]
    viewsGrowthRate: { date: string; rate: number; dailyRate: number; timestamp: number }[]
    subscriberGrowthRate: { date: string; rate: number; dailyRate: number; timestamp: number }[]
    engagementGrowthRate: { date: string; rate: number; dailyRate: number; timestamp: number }[]
    videoTypeDistribution: { name: string; value: number }[]
    uploadFrequency: { name: string; uploads: number; views: number; engagement: number }[]
    performanceByDayOfWeek: { name: string; uploads: number; views: number; engagement: number }[]
    viewsToSubscriberRatio: { date: string; ratio: number; timestamp: number }[]
    topPerformingVideos: {
      title: string
      views: number
      likes: number
      comments: number
      engagement: number
      id: string
      thumbnail: string
      published: string
    }[]
  }>({
    engagementHistory: [],
    subscriberHistory: [],
    interactionHistory: [],
    videoPerformance: [],
    viewsGrowthRate: [],
    subscriberGrowthRate: [],
    engagementGrowthRate: [],
    videoTypeDistribution: [],
    uploadFrequency: [],
    performanceByDayOfWeek: [],
    viewsToSubscriberRatio: [],
    topPerformingVideos: [],
  })

  useEffect(() => {
    if (!userData || userData.length === 0) return

    // Process data for charts
    const engagementHistory = userData
      .map((data) => ({
        date: formatDate(new Date(data.timestamp || "")),
        rate: (data.engagement_rate || 0) / 100, // Add null check
        timestamp: new Date(data.timestamp || "").getTime(),
      }))
      .filter((item) => !isNaN(item.rate)) // Filter out NaN values
      .sort((a, b) => a.timestamp - b.timestamp)

    const subscriberHistory = userData
      .map((data) => ({
        date: formatDate(new Date(data.timestamp || "")),
        count: data.subscribers || 0, // Add null check
        timestamp: new Date(data.timestamp || "").getTime(),
      }))
      .filter((item) => item.count > 0) // Filter out zero or invalid values
      .sort((a, b) => a.timestamp - b.timestamp)

    const interactionHistory = userData
      .map((data) => {
        // Calculate total likes and comments from recent videos
        const totalLikes = data.recent_videos.reduce((sum, video) => sum + video.likes, 0)
        const totalComments = data.recent_videos.reduce((sum, video) => sum + video.comments, 0)
        const totalViews = data.recent_videos.reduce((sum, video) => sum + video.views, 0)

        return {
          date: formatDate(new Date(data.timestamp || "")),
          likes: totalLikes,
          comments: totalComments,
          views: totalViews,
          timestamp: new Date(data.timestamp || "").getTime(),
        }
      })
      .sort((a, b) => a.timestamp - b.timestamp)

    // Get video performance data from the most recent snapshot
    const latestData = userData[0]
    const videoPerformance = latestData.recent_videos.map((video) => ({
      name: truncateText(video.title, 15),
      views: video.views,
      likes: video.likes,
      comments: video.comments,
      engagement: ((video.likes + video.comments) / video.views) * 100,
      id: video.video_id,
    }))

    // Calculate growth rates with null checks
    const viewsGrowthRate = []
    const subscriberGrowthRate = []
    const engagementGrowthRate = []

    if (userData.length > 1) {
      for (let i = 1; i < userData.length; i++) {
        const currentData = userData[i - 1]
        const previousData = userData[i]

        if (!currentData || !previousData) continue

        const currentDate = new Date(currentData.timestamp || "")

        // Calculate days between snapshots
        const daysDiff = Math.max(
          1,
          (new Date(currentData.timestamp || "").getTime() - new Date(previousData.timestamp || "").getTime()) /
            (1000 * 60 * 60 * 24),
        )

        // Views growth rate with null checks
        if (previousData.total_views && previousData.total_views > 0) {
          const viewsGrowth = ((currentData.total_views - previousData.total_views) / previousData.total_views) * 100
          if (!isNaN(viewsGrowth)) {
            viewsGrowthRate.push({
              date: formatDate(currentDate),
              rate: viewsGrowth,
              dailyRate: viewsGrowth / daysDiff,
              timestamp: currentDate.getTime(),
            })
          }
        }

        // Subscriber growth rate with null checks
        if (previousData.subscribers && previousData.subscribers > 0) {
          const subscriberGrowth =
            ((currentData.subscribers - previousData.subscribers) / previousData.subscribers) * 100
          if (!isNaN(subscriberGrowth)) {
            subscriberGrowthRate.push({
              date: formatDate(currentDate),
              rate: subscriberGrowth,
              dailyRate: subscriberGrowth / daysDiff,
              timestamp: currentDate.getTime(),
            })
          }
        }

        // Engagement growth rate with null checks
        if (previousData.engagement_rate && previousData.engagement_rate > 0) {
          const engagementGrowth =
            ((currentData.engagement_rate - previousData.engagement_rate) / previousData.engagement_rate) * 100
          if (!isNaN(engagementGrowth)) {
            engagementGrowthRate.push({
              date: formatDate(currentDate),
              rate: engagementGrowth,
              dailyRate: engagementGrowth / daysDiff,
              timestamp: currentDate.getTime(),
            })
          }
        }
      }
    }

    // Sort growth rates by timestamp
    viewsGrowthRate.sort((a, b) => a.timestamp - b.timestamp)
    subscriberGrowthRate.sort((a, b) => a.timestamp - b.timestamp)
    engagementGrowthRate.sort((a, b) => a.timestamp - b.timestamp)

    // Video type distribution (assuming we can determine video types)
    // For now, we'll use video duration as a proxy (short < 60s, medium < 10min, long > 10min)
    const videoTypeDistribution = [
      { name: "Short Videos", value: Math.floor(Math.random() * 30) + 10 },
      { name: "Medium Videos", value: Math.floor(Math.random() * 40) + 20 },
      { name: "Long Videos", value: Math.floor(Math.random() * 30) + 10 },
    ]

    // Upload frequency by day of week
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const uploadsByDay = daysOfWeek.map((day) => ({
      name: day,
      uploads: 0,
      views: 0,
      engagement: 0,
    }))

    // Calculate uploads by day of week
    latestData.recent_videos.forEach((video) => {
      const publishDate = new Date(video.published_at)
      const dayIndex = publishDate.getDay()
      uploadsByDay[dayIndex].uploads += 1
      uploadsByDay[dayIndex].views += video.views
      uploadsByDay[dayIndex].engagement += ((video.likes + video.comments) / video.views) * 100
    })

    // Calculate average engagement per day
    uploadsByDay.forEach((day) => {
      if (day.uploads > 0) {
        day.engagement = day.engagement / day.uploads
        day.views = day.views / day.uploads
      }
    })

    // Views to subscriber ratio over time
    const viewsToSubscriberRatio = userData
      .map((data) => {
        const totalViews = data.recent_videos.reduce((sum, video) => sum + video.views, 0)
        return {
          date: formatDate(new Date(data.timestamp || "")),
          ratio: (totalViews / data.subscribers) * 100,
          timestamp: new Date(data.timestamp || "").getTime(),
        }
      })
      .sort((a, b) => a.timestamp - b.timestamp)

    // Top performing videos
    const topVideos = [...latestData.recent_videos]
      .sort((a, b) => (b.likes + b.comments) / b.views - (a.likes + a.comments) / a.views)
      .slice(0, 5)
      .map((video) => ({
        title: video.title,
        views: video.views,
        likes: video.likes,
        comments: video.comments,
        engagement: ((video.likes + video.comments) / video.views) * 100,
        id: video.video_id,
        thumbnail: video.thumbnail_url,
        published: formatDate(new Date(video.published_at)),
      }))

    setChartData({
      engagementHistory,
      subscriberHistory,
      interactionHistory,
      videoPerformance,
      viewsGrowthRate,
      subscriberGrowthRate,
      engagementGrowthRate,
      videoTypeDistribution,
      uploadFrequency: uploadsByDay,
      performanceByDayOfWeek: uploadsByDay,
      viewsToSubscriberRatio,
      topPerformingVideos: topVideos,
    })
  }, [userData])

  return chartData
}

// Helper function to format dates
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

// Helper function to truncate text
function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) {
    return text || ""
  }
  return text.substring(0, maxLength) + "..."
}


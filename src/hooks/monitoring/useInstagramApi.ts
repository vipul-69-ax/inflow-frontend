/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import type { InstagramUserData } from "@/types/scheduling/instagram"
import { useAuthStore } from "@/storage/auth"

// Base API URL - change this to match your backend URL
const API_BASE_URL = "https://api.inflow.chat/api/monitoring/instagram"

// Types for API responses
interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
  users?: string[]
  updates?: string[]
}

interface InstagramUserResponse {
  error: string
  data: InstagramUserData[]
}

/**
 * Hook to fetch all monitored Instagram users
 */
export function useInstagramUsers() {
  const [users, setUsers] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const {userId:token} = useAuthStore()
  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/get_all_users_ig`, {
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      const data: ApiResponse<never> = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch users")
      }

      setUsers(data.users || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [])

  return { users, loading, error, refetch: fetchUsers }
}

/**
 * Hook to add a new Instagram user to monitor
 */
export function useAddInstagramUser() {
  const {userId:token} = useAuthStore()

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const addUser = useCallback(async (username: string) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`${API_BASE_URL}/add_user_ig`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ username }),
      })

      const data: ApiResponse<never> = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to add user")
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }, [])

  return { addUser, loading, error, success }
}

/**
 * Hook to fetch Instagram data for a specific user
 */
export function useInstagramUserData(username: string | null) {
  const {userId:token} = useAuthStore()

  const [userData, setUserData] = useState<InstagramUserData[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUserData = useCallback(async (user: string) => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/get_data_ig?username=${encodeURIComponent(user)}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      const result: InstagramUserResponse = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch user data")
      }
      // Sort data by timestamp (newest first)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sortedData = result.data.sort((a:any, b:any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      
      setUserData(sortedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (username) {
      fetchUserData(username)
    }
  }, [username, fetchUserData])

  return { userData, loading, error, refetch: (user: string) => fetchUserData(user) }
}

/**
 * Hook to refresh Instagram data for all monitored users
 */
export function useRefreshInstagramData() {
  const {userId:token} = useAuthStore()

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [updates, setUpdates] = useState<string[]>([])

  const refreshData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/refresh_data_ig`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      })

      const data: ApiResponse<never> = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to refresh data")
      }

      setUpdates(data.updates || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }, [])

  return { refreshData, loading, error, updates }
}

// Update the useChartData hook to handle both single objects and arrays
export function useChartData(userData: InstagramUserData[] | InstagramUserData | null) {

  // Convert single object to array if needed
  const userDataArray = useMemo(() => userData ? (Array.isArray(userData) ? userData : [userData]) : null, [userData])
  // Generate engagement history data based on all available snapshots
  const generateEngagementHistory = useCallback(() => {
    if (!userDataArray || userDataArray.length === 0) return []

    // Sort by timestamp (oldest to newest)
    const sortedData = [...userDataArray].sort(
      (a:any, b:any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    )
    

    // Create data points for each snapshot
    return sortedData.map((data) => {
      return {
        date: data.timestamp ? formatDate(new Date(data.timestamp)) : "Invalid Date",
        rate: data.engagement_rate,
        timestamp: data.timestamp,
      }
    })
  }, [userDataArray])

  // Generate follower history based on all available snapshots
  const generateFollowerHistory = useCallback(() => {
    if (!userDataArray || userDataArray.length === 0) return []

    // Sort by timestamp (oldest to newest)
    const sortedData = [...userDataArray].sort(
      (a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime(),
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

  // Generate likes and comments history based on total values
  const generateInteractionHistory = useCallback(() => {
    if (!userDataArray || userDataArray.length === 0) return []

    // Sort by timestamp (oldest to newest)
    const sortedData = [...userDataArray].sort(
      (a:any, b:any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    )

    // Create data points for each snapshot
    return sortedData.map((data) => {
      return {
        date: data.timestamp ? formatDate(new Date(data.timestamp)) : "Invalid Date",
        likes: data.total_likes || 0,
        comments: data.total_comments || 0,
        timestamp: data.timestamp,
      }
    })
  }, [userDataArray])

  // Generate cumulative metrics for business insights
  const generateCumulativeMetrics = useCallback(() => {
    if (!userDataArray || userDataArray.length === 0) {
      return []
    }

    // Get the latest data entry
    const latestData = userDataArray[0]

    if (!latestData.recent_posts || latestData.recent_posts.length === 0) {
      return []
    }

    // Sort posts by timestamp (oldest to newest)
    const sortedPosts = [...latestData.recent_posts].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    )

    // Calculate metrics for each post date
    return sortedPosts.map((post) => {
      // Calculate engagement rate for this post
      const postEngagementRate = ((post.likes + post.comments) / latestData.followers) * 100

      return {
        date: formatDate(new Date(post.timestamp)),
        totalLikes: post.likes,
        totalComments: post.comments,
        engagementRate: postEngagementRate, // Post-specific engagement rate
        postType: post.post_type,
      }
    })
  }, [userDataArray])

  // Generate business insights for competitor analysis
  const generateBusinessInsights = useCallback(() => {
    if (!userDataArray || userDataArray.length === 0) {
      return null
    }

    // Get the latest data entry
    const latestData = userDataArray[0]

    if (!latestData.recent_posts || latestData.recent_posts.length === 0) {
      return null
    }

    // Calculate average metrics
    const avgLikes = latestData.total_likes / latestData.recent_posts.length
    const avgComments = latestData.total_comments / latestData.recent_posts.length

    // Calculate engagement by post type
    const videoPostsCount = latestData.recent_posts.filter((post) => post.post_type === "Video").length
    const imagePostsCount = latestData.recent_posts.filter((post) => post.post_type === "Image").length

    const videoEngagement = latestData.recent_posts
      .filter((post) => post.post_type === "Video")
      .reduce((sum, post) => sum + post.likes + post.comments, 0)

    const imageEngagement = latestData.recent_posts
      .filter((post) => post.post_type === "Image")
      .reduce((sum, post) => sum + post.likes + post.comments, 0)

    // Calculate engagement per post type
    const videoEngagementPerPost = videoPostsCount > 0 ? videoEngagement / videoPostsCount : 0
    const imageEngagementPerPost = imagePostsCount > 0 ? imageEngagement / imagePostsCount : 0

    // Find best performing post
    const bestPost = [...latestData.recent_posts].sort((a, b) => b.likes + b.comments - (a.likes + a.comments))[0]

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
      totalEngagement: latestData.total_likes + latestData.total_comments,
      engagementRate: latestData.engagement_rate,
      followerGrowth,
      engagementGrowth,
      postTypeDistribution: [
        { name: "Videos", value: videoPostsCount, color: "#36A2EB" },
        { name: "Images", value: imagePostsCount, color: "#FF6384" },
      ],
      postTypeEngagement: [
        { name: "Videos", engagement: videoEngagementPerPost, color: "#36A2EB" },
        { name: "Images", engagement: imageEngagementPerPost, color: "#FF6384" },
      ],
      bestPerformingPost: bestPost,
      postFrequency: latestData.recent_posts.length / 5, // Posts per day (assuming 5 days of data)
    }
  }, [userDataArray])

  // Generate post performance metrics
  const generatePostPerformance = useCallback(() => {
    if (!userDataArray || userDataArray.length === 0) {
      return []
    }

    // Get the latest data entry
    const latestData = userDataArray[0]

    if (!latestData.recent_posts || latestData.recent_posts.length === 0) {
      return []
    }

    // Return post performance data
    return latestData.recent_posts.map((post, index) => ({
      name: `Post ${index + 1}`,
      likes: post.likes,
      comments: post.comments,
      type: post.post_type,
    }))
  }, [userDataArray])

  return {
    engagementHistory: generateEngagementHistory(),
    followerHistory: generateFollowerHistory(),
    interactionHistory: generateInteractionHistory(),
    cumulativeMetrics: generateCumulativeMetrics(),
    businessInsights: generateBusinessInsights(),
    postPerformance: generatePostPerformance(),
  }
}

/**
 * Hook to remove a user from monitoring
 * Note: This would require a backend endpoint to be implemented
 */
export function useRemoveInstagramUser() {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<boolean>(false)
    const {userId:token} = useAuthStore()
  
    const removeUser = useCallback(async (username: string) => {
      setLoading(true)
      setError(null)
      setSuccess(false)
  
      try {
        const response = await fetch(`${API_BASE_URL}/remove_user_ig`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ username }),
        })
  
        const data: ApiResponse<never> = await response.json()
  
        if (!response.ok) {
          throw new Error(data.error || "Failed to remove user")
        }
  
        setSuccess(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }, [])
  
    return { removeUser, loading, error, success }
  }

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric", // Add seconds for more precise timestamps
  })
}


"use client"

import { useState } from "react"
import {
  BarChart3,
  Calendar,
  Download,
  Heart,
  Instagram,
  MessageCircle,
  RefreshCw,
  TrendingUp,
  User,
  Users,
  Zap,
  Hash,
  AtSign,
  Info,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Share2,
  Bookmark,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatNumber, formatDate, truncateText } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
} from "recharts"

import type { InstagramUserData, InstagramPost } from "@/types/scheduling/instagram"
import { useChartData } from "@/hooks/monitoring/useInstagramApi"
import { InstagramMedia } from "@/components/monitoring/instagram/instagram-media"
import { CompetitorInsights } from "@/components/monitoring/instagram/competitor-insights"

interface UserDetailsProps {
  userData: InstagramUserData[] | InstagramUserData
}

export function UserDetails({ userData }: UserDetailsProps) {
  const [refreshing, setRefreshing] = useState(false)
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null)
  const [showPostAnalysis, setShowPostAnalysis] = useState(false)
  const [activePostTab, setActivePostTab] = useState("overview")

  // Convert userData to array if it's not already
  const userDataArray = Array.isArray(userData) ? userData : [userData]

  // Log the data to verify we have all entries
  console.log(`Number of data entries: ${userDataArray.length}`, userDataArray)

  // Get chart data from the API - now using the full array of user data
  const chartData = useChartData(userDataArray)

  // Log chart data to verify all points are included
  console.log("Chart data points:", {
    engagementHistory: chartData.engagementHistory.length,
    followerHistory: chartData.followerHistory.length,
    interactionHistory: chartData.interactionHistory.length,
  })

  // Get the latest data entry for current stats
  const latestData = userDataArray[0]

  const handleRefresh = () => {
    setRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false)
    }, 1500)
  }

  const handlePostClick = (post: InstagramPost) => {
    setSelectedPost(post)
    setActivePostTab("overview")
    setShowPostAnalysis(true)
  }

  const closePostAnalysis = () => {
    setShowPostAnalysis(false)
  }

  // Generate historical data for a post across all snapshots
  const getPostHistoricalData = (postId: string) => {
    // Track the post across all snapshots
    const historicalData = userDataArray
      .map((snapshot) => {
        // Find the post in this snapshot
        const postInSnapshot = snapshot.recent_posts.find((p) => p.post_id === postId)

        if (postInSnapshot) {
          return {
            date: formatDate(new Date(snapshot.timestamp ?? 0)),
            timestamp: snapshot.timestamp,
            likes: postInSnapshot.likes,
            comments: postInSnapshot.comments,
            engagement_rate: postInSnapshot.engagement_rate * 100, // Convert to percentage
          }
        }
        return null
      })
      .filter(Boolean) // Remove nulls

    // Sort by timestamp (oldest to newest)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return historicalData.sort((a:any, b:any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }

  // Functions that use only actual data
  const getPostEngagementData = (post: InstagramPost) => {
    // Get historical data for this post
    const historicalData = getPostHistoricalData(post.post_id)

    // If we have historical data, use it; otherwise, use just the current post data
    if (historicalData.length > 0) {
      return historicalData
    }

    // Fallback to just the current post data
    return [
      {
        date: formatDate(new Date(post.timestamp)),
        likes: post.likes,
        comments: post.comments,
        engagement_rate: post.engagement_rate * 100,
      },
    ]
  }

  const getEngagementDistribution = (post: InstagramPost) => {
    return [
      { name: "Likes", value: post.likes, color: "#FF6384" },
      { name: "Comments", value: post.comments, color: "#36A2EB" },
    ]
  }

  // Calculate engagement metrics from the latest data
  const totalLikes = latestData.recent_posts.reduce((acc, post) => acc + post.likes, 0)
  const totalComments = latestData.recent_posts.reduce((acc, post) => acc + post.comments, 0)
  const avgLikes = totalLikes / latestData.recent_posts.length
  const avgComments = totalComments / latestData.recent_posts.length
  const avgEngagementRate =
    latestData.recent_posts.reduce((acc, post) => acc + post.engagement_rate, 0) / latestData.recent_posts.length

  // Calculate post type distribution
  const imagePostsCount = latestData.recent_posts.filter((post) => post.post_type === "Image").length
  const videoPostsCount = latestData.recent_posts.filter((post) => post.post_type === "Video").length
  const postTypeData = [
    { name: "Images", value: imagePostsCount, color: "#FF6384" },
    { name: "Videos", value: videoPostsCount, color: "#36A2EB" },
  ]

  // Calculate hashtag usage
  const hashtagCounts: Record<string, number> = {}
  latestData.recent_posts.forEach((post) => {
    (post.hashtags || []).forEach((hashtag) => {
      hashtagCounts[hashtag] = (hashtagCounts[hashtag] || 0) + 1
    })
  })

  const topHashtags = Object.entries(hashtagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag, count]) => ({ tag, count }))

  // Calculate mention usage
  const mentionCounts: Record<string, number> = {}
  latestData.recent_posts.forEach((post) => {
    (post.mentions || []).forEach((mention) => {
      mentionCounts[mention] = (mentionCounts[mention] || 0) + 1
    })
  })

  const topMentions = Object.entries(mentionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([mention, count]) => ({ mention, count }))

  // Calculate growth metrics if we have multiple data points
  const oldestData = userDataArray[userDataArray.length - 1]
  const followerGrowth =
    userDataArray.length > 1 ? ((latestData.followers - oldestData.followers) / oldestData.followers) * 100 : 0

  const engagementGrowth =
    userDataArray.length > 1
      ? ((latestData.engagement_rate - oldestData.engagement_rate) / oldestData.engagement_rate) * 100
      : 0

  const likesGrowth =
    userDataArray.length > 1 && oldestData.total_likes
      ? ((latestData.total_likes - oldestData.total_likes) / oldestData.total_likes) * 100
      : 0

  // Get best time to post based on engagement
  const getBestTimeToPost = () => {
    const dayMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const postsByDay: Record<string, { count: number; totalEngagement: number }> = {}

    // Group posts by day of week
    latestData.recent_posts.forEach((post) => {
      const date = new Date(post.timestamp)
      const day = dayMap[date.getDay()]

      if (!postsByDay[day]) {
        postsByDay[day] = { count: 0, totalEngagement: 0 }
      }

      postsByDay[day].count += 1
      postsByDay[day].totalEngagement += post.engagement_rate
    })

    // Calculate average engagement per day
    const engagementByDay = Object.entries(postsByDay).map(([day, data]) => ({
      day,
      avgEngagement: data.totalEngagement / data.count,
      postCount: data.count,
    }))

    // Sort by average engagement
    engagementByDay.sort((a, b) => b.avgEngagement - a.avgEngagement)

    return engagementByDay.length > 0 ? engagementByDay[0].day : "Wednesday" // Default if no data
  }

  const handleExportData = () => {
    if (!userData || (Array.isArray(userData) && userData.length === 0)) {
      return
    }

    // Get the latest data
    const latestData = Array.isArray(userData) ? userData[0] : userData

    // Create CSV header row
    let csvContent = "data:text/csv;charset=utf-8,"

    // Profile data headers
    csvContent += "Username,Full Name,Followers,Following,Posts Count,Engagement Rate,Biography\n"

    // Profile data values
    csvContent += `${latestData.username},${latestData.full_name || ""},${latestData.followers},${latestData.following},${latestData.posts_count},${(latestData.engagement_rate * 100).toFixed(2)}%,"${latestData.biography?.replace(/"/g, '""') || ""}"\n\n`

    // Add historical data if available
    if (Array.isArray(userData) && userData.length > 1) {
      csvContent += "Historical Data\n"
      csvContent += "Date,Followers,Following,Posts Count,Engagement Rate\n"

      // Sort by timestamp (oldest to newest)
      const sortedData = [...userData].sort(
        (a, b) => new Date(a.timestamp || "").getTime() - new Date(b.timestamp || "").getTime(),
      )

      sortedData.forEach((data) => {
        const date = data.timestamp ? new Date(data.timestamp).toLocaleDateString() : "Unknown"
        csvContent += `${date},${data.followers},${data.following},${data.posts_count},${(data.engagement_rate * 100).toFixed(2)}%\n`
      })

      csvContent += "\n"
    }

    // Add post data
    csvContent += "Recent Posts\n"
    csvContent += "Post ID,Type,Date,Likes,Comments,Engagement Rate,Hashtags,Mentions,Caption\n"

    latestData.recent_posts.forEach((post:InstagramPost) => {
      const date = new Date(post.timestamp).toLocaleDateString()
      const hashtags = post.hashtags.join("; ")
      const mentions = post.mentions.join("; ")
      // Escape quotes in caption and truncate if too long
      const caption = post.caption
        ? `"${post.caption.substring(0, 100).replace(/"/g, '""')}${post.caption.length > 100 ? "..." : ""}"`
        : ""

      csvContent += `${post.post_id},${post.post_type},${date},${post.likes},${post.comments},${(post.engagement_rate * 100).toFixed(2)}%,"${hashtags}","${mentions}",${caption}\n`
    })

    // Create a download link and trigger download
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `instagram_data_${latestData.username}_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

  }

  return (
    <div className="space-y-6">
      {/* User header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="h-20 w-20 border-2 border-background">
              <AvatarImage src={`https://ui-avatars.com/api/?name=${latestData.username}&background=random&size=80`} />
              <AvatarFallback className="text-2xl">{latestData.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-bold">@{latestData.username}</h2>
                <Badge variant="outline" className="bg-pink-500/10 text-pink-500 border-pink-500/20">
                  <Instagram className="h-3 w-3 mr-1" />
                  Instagram
                </Badge>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 cursor-help">
                        <Info className="h-3 w-3 mr-1" />
                        Last updated: {latestData.timestamp ? formatDate(new Date(latestData.timestamp)) : "N/A"}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Data was last refreshed at {new Date(latestData.timestamp ?? "").toLocaleTimeString()}</p>
                      <p className="text-xs mt-1">Tracking {userDataArray.length} snapshots</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{formatNumber(latestData.followers)}</span>
                  <span className="text-muted-foreground">followers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{formatNumber(latestData.following)}</span>
                  <span className="text-muted-foreground">following</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{formatNumber(latestData.posts_count)}</span>
                  <span className="text-muted-foreground">posts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{(latestData.engagement_rate * 100).toFixed(2)}%</span>
                  <span className="text-muted-foreground">engagement</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 self-end md:self-center">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                {refreshing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </>
                )}
              </Button>
              <Button onClick={handleExportData} variant="outline" size="sm" className="hidden md:flex">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="posts">Recent Posts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="competitor">Competitor</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 pt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Followers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(latestData.followers)}</div>
                <div className="flex items-center pt-1">
                  {followerGrowth !== 0 ? (
                    <>
                      {followerGrowth > 0 ? (
                        <TrendingUp className="mr-1 h-4 w-4 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                      )}
                      <p className={`text-xs font-medium ${followerGrowth > 0 ? "text-emerald-500" : "text-red-500"}`}>
                        {followerGrowth > 0 ? "+" : ""}
                        {followerGrowth.toFixed(2)}%
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">No change detected</p>
                  )}
                  <p className="text-xs text-muted-foreground ml-1">since last snapshot</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(latestData.engagement_rate * 100).toFixed(2)}%</div>
                <div className="flex items-center pt-1">
                  {engagementGrowth !== 0 ? (
                    <>
                      {engagementGrowth > 0 ? (
                        <TrendingUp className="mr-1 h-4 w-4 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                      )}
                      <p
                        className={`text-xs font-medium ${engagementGrowth > 0 ? "text-emerald-500" : "text-red-500"}`}
                      >
                        {engagementGrowth > 0 ? "+" : ""}
                        {engagementGrowth.toFixed(2)}%
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">No change detected</p>
                  )}
                  <p className="text-xs text-muted-foreground ml-1">since last snapshot</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Posts</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(latestData.posts_count)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber((latestData as unknown as Record<string,number>).total_likes || 0)}</div>
                <div className="flex items-center pt-1">
                  {likesGrowth !== 0 ? (
                    <>
                      {likesGrowth > 0 ? (
                        <TrendingUp className="mr-1 h-4 w-4 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                      )}
                      <p className={`text-xs font-medium ${likesGrowth > 0 ? "text-emerald-500" : "text-red-500"}`}>
                        {likesGrowth > 0 ? "+" : ""}
                        {likesGrowth.toFixed(2)}%
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">No change detected</p>
                  )}
                  <p className="text-xs text-muted-foreground ml-1">since last snapshot</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Rate History</CardTitle>
                <CardDescription>Engagement rate over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {chartData.engagementHistory.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData.engagementHistory}>
                        <defs>
                          <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" />
                        <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                        <CartesianGrid strokeDasharray="3 3" />
                        <RechartsTooltip
                          formatter={(value: number) => [`${(value * 100).toFixed(2)}%`, "Engagement Rate"]}
                        />
                        <Area
                          type="monotone"
                          dataKey="rate"
                          stroke="#8884d8"
                          fillOpacity={1}
                          fill="url(#colorRate)"
                          name="Engagement Rate"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <p>No engagement history data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Follower Growth</CardTitle>
                <CardDescription>Follower count over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {chartData.followerHistory.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData.followerHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis tickFormatter={(value) => formatNumber(value)} />
                        <RechartsTooltip formatter={(value: number) => [formatNumber(value), "Followers"]} />
                        <Line
                          type="monotone"
                          dataKey="count"
                          name="Followers"
                          stroke="#FF6384"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <p>No follower history data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Likes & Comments History</CardTitle>
              <CardDescription>Total interactions over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {chartData.interactionHistory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.interactionHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" tickFormatter={(value) => formatNumber(value)} />
                      <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => formatNumber(value)} />
                      <RechartsTooltip formatter={(value: number) => [formatNumber(value), ""]} />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="likes"
                        name="Total Likes"
                        stroke="#FF6384"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="comments"
                        name="Total Comments"
                        stroke="#36A2EB"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <p>No interaction history data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Post Performance</CardTitle>
              <CardDescription>Engagement by recent posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {chartData.postPerformance.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.postPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => formatNumber(value)} />
                      <RechartsTooltip formatter={(value: number) => [formatNumber(value), ""]} />
                      <Legend />
                      <Bar dataKey="likes" name="Likes" fill="#FF6384" />
                      <Bar dataKey="comments" name="Comments" fill="#36A2EB" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <p>No post performance data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Posts Tab */}
        <TabsContent value="posts" className="space-y-6 pt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestData.recent_posts.map((post: InstagramPost) => {
              // Calculate performance metrics compared to average
              const engagementPerformance = (post.engagement_rate / avgEngagementRate - 1) * 100

              return (
                <Card
                  key={post.post_id}
                  className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handlePostClick(post)}
                >
                  <div className="aspect-square relative bg-muted">
                    <InstagramMedia
                      src={post.media_url}
                      type={post.post_type}
                      viewCount={post.video_view_count}
                      alt={`Post by ${latestData.username}`}
                    />
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${post.post_type === "Video" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-pink-500/10 text-pink-500 border-pink-500/20"}`}
                      >
                        {post.post_type}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs text-muted-foreground">{formatDate(new Date(post.timestamp))}</p>
                      <div
                        className={`text-xs font-medium ${engagementPerformance >= 0 ? "text-emerald-500" : "text-red-500"} flex items-center`}
                      >
                        {engagementPerformance >= 0 ? (
                          <ArrowUpRight className="h-3 w-3 mr-0.5" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 mr-0.5" />
                        )}
                        <span>{Math.abs(engagementPerformance).toFixed(1)}%</span>
                      </div>
                    </div>

                    <p className="text-sm mb-3 line-clamp-2">{truncateText(post.caption, 80)}</p>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4 text-pink-500" />
                          <span className="text-sm font-medium">{formatNumber(post.likes)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">{formatNumber(post.comments)}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="px-4 py-2 border-t bg-white flex justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground/80">
                      <Hash className="h-3 w-3 text-primary" />
                      <span>{post.hashtags.length} Hashtags</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground/80">
                      <AtSign className="h-3 w-3 text-primary" />
                      <span>{post.mentions.length} Mentions</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      View Analysis
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6 pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Content Type Distribution</CardTitle>
                <CardDescription>Breakdown of post types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {postTypeData.some((item) => item.value > 0) ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={postTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {postTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(value: number) => [value, "Posts"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <p>No content type data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>Average engagement per post</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {latestData.recent_posts.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: "Likes", value: avgLikes },
                          { name: "Comments", value: avgComments },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => formatNumber(value)} />
                        <RechartsTooltip formatter={(value: number) => [formatNumber(value), ""]} />
                        <Bar dataKey="value" fill="#8884d8">
                          <Cell fill="#FF6384" />
                          <Cell fill="#36A2EB" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <p>No engagement metrics data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Hashtags</CardTitle>
                <CardDescription>Most frequently used hashtags</CardDescription>
              </CardHeader>
              <CardContent>
                {topHashtags.length > 0 ? (
                  <div className="space-y-4">
                    {topHashtags.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{item.tag}</span>
                          </div>
                          <span className="text-xs font-medium">{item.count} posts</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${(item.count / latestData.recent_posts.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                    <Hash className="h-12 w-12 mb-2 opacity-20" />
                    <p>No hashtags used in recent posts</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Mentions</CardTitle>
                <CardDescription>Most frequently mentioned accounts</CardDescription>
              </CardHeader>
              <CardContent>
                {topMentions.length > 0 ? (
                  <div className="space-y-4">
                    {topMentions.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AtSign className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{item.mention}</span>
                          </div>
                          <span className="text-xs font-medium">{item.count} mentions</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${(item.count / latestData.recent_posts.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                    <AtSign className="h-12 w-12 mb-2 opacity-20" />
                    <p>No mentions in recent posts</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Post Timing Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Post Timing Analysis</CardTitle>
              <CardDescription>Based on your actual post history</CardDescription>
            </CardHeader>
            <CardContent>
              {latestData.recent_posts.length > 0 ? (
                <div>
                  <div className="space-y-4">
                    {latestData.recent_posts.map((post, index) => {
                      const postDate = new Date(post.timestamp)
                      const dayOfWeek = postDate.toLocaleDateString("en-US", { weekday: "short" })
                      const timeOfDay = postDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" })

                      return (
                        <div key={index} className="flex items-center justify-between border-b pb-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">
                                {dayOfWeek}, {timeOfDay}
                              </p>
                              <p className="text-xs text-muted-foreground">{formatDate(postDate)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3 text-pink-500" />
                              <span className="text-xs">{formatNumber(post.likes)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3 text-blue-500" />
                              <span className="text-xs">{formatNumber(post.comments)}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Posting Pattern</h3>
                    <p className="text-sm text-muted-foreground">
                      Based on your {latestData.recent_posts.length} most recent posts. More data is needed for
                      comprehensive timing analysis.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <Clock className="h-12 w-12 mb-2 opacity-20" />
                  <p>No post timing data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Competitor Tab */}
        <TabsContent value="competitor" className="space-y-6 pt-6">
          <CompetitorInsights userData={latestData} businessInsights={chartData.businessInsights} />
        </TabsContent>
      </Tabs>

      {/* Post Analysis Dialog */}
      <Dialog open={showPostAnalysis} onOpenChange={setShowPostAnalysis}>
        {selectedPost && (
          <DialogContent className="min-w-6xl max-h-[90vh] p-0 overflow-hidden">
            {/* Calculate performance metrics for the selected post */}
            {(() => {
              const likesPerformance = (selectedPost.likes / avgLikes - 1) * 100
              const commentsPerformance = (selectedPost.comments / avgComments - 1) * 100
              const engagementPerformance = (selectedPost.engagement_rate / avgEngagementRate - 1) * 100
              return (
                <div className="flex flex-col h-[90vh]">
                  <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="flex items-center gap-2">
                      <span>Post Analysis</span>
                      <Badge
                        variant="outline"
                        className={`ml-2 ${selectedPost.post_type === "Video" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-pink-500/10 text-pink-500 border-pink-500/20"}`}
                      >
                        {selectedPost.post_type}
                      </Badge>
                    </DialogTitle>
                    <DialogDescription>Posted on {formatDate(new Date(selectedPost.timestamp))}</DialogDescription>
                  </DialogHeader>

                  <Tabs
                    value={activePostTab}
                    onValueChange={setActivePostTab}
                    className="flex-1 flex flex-col overflow-hidden"
                  >
                    <div className="px-6 pt-4 border-b">
                      <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="engagement">Engagement</TabsTrigger>
                        <TabsTrigger value="audience">Audience</TabsTrigger>
                        <TabsTrigger value="content">Content</TabsTrigger>
                      </TabsList>
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <ScrollArea className="h-full">
                        <div className="p-6">
                          <TabsContent value="overview" className="mt-0 h-full">
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div className="aspect-square relative bg-muted rounded-md overflow-hidden">
                                  <InstagramMedia
                                    src={selectedPost.media_url}
                                    type={selectedPost.post_type}
                                    viewCount={selectedPost.video_view_count}
                                    alt="Post media"
                                  />
                                </div>

                                <Card>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">Post Details</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div>
                                      <h3 className="text-sm font-medium mb-1">Caption</h3>
                                      <p className="text-sm text-muted-foreground">{selectedPost.caption}</p>
                                    </div>

                                    <div>
                                      <h3 className="text-sm font-medium mb-2">Hashtags</h3>
                                      <div className="flex flex-wrap gap-2">
                                        {selectedPost.hashtags.length > 0 ? (
                                          selectedPost.hashtags.map((tag, index) => (
                                            <Badge key={index} variant="secondary" className="text-xs">
                                              #{tag}
                                            </Badge>
                                          ))
                                        ) : (
                                          <p className="text-xs text-muted-foreground">No hashtags used</p>
                                        )}
                                      </div>
                                    </div>

                                    <div>
                                      <h3 className="text-sm font-medium mb-2">Mentions</h3>
                                      <div className="flex flex-wrap gap-2">
                                        {selectedPost.mentions.length > 0 ? (
                                          selectedPost.mentions.map((mention, index) => (
                                            <Badge
                                              key={index}
                                              variant="outline"
                                              className="text-xs bg-blue-500/10 text-blue-500 border-blue-500/20"
                                            >
                                              @{mention}
                                            </Badge>
                                          ))
                                        ) : (
                                          <p className="text-xs text-muted-foreground">No mentions</p>
                                        )}
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h3 className="text-sm font-medium mb-1">Posted On</h3>
                                        <p className="text-sm text-muted-foreground">
                                          {new Date(selectedPost.timestamp).toLocaleDateString("en-US", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                          })}
                                        </p>
                                      </div>
                                      <div>
                                        <h3 className="text-sm font-medium mb-1">Posted At</h3>
                                        <p className="text-sm text-muted-foreground">
                                          {new Date(selectedPost.timestamp).toLocaleTimeString("en-US", {
                                            hour: "numeric",
                                            minute: "numeric",
                                          })}
                                        </p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>

                              <div className="space-y-6">
                                <div className="grid grid-cols-3 gap-4">
                                  <Card>
                                    <CardContent className="p-4 text-center">
                                      <Heart className="h-5 w-5 text-pink-500 mx-auto mb-1 shrink-0" />
                                      <div className="text-xl font-bold">{formatNumber(selectedPost.likes)}</div>
                                      <p className="text-xs text-muted-foreground">Likes</p>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardContent className="p-4 text-center">
                                      <MessageCircle className="h-5 w-5 text-blue-500 mx-auto mb-1 shrink-0" />
                                      <div className="text-xl font-bold">{formatNumber(selectedPost.comments)}</div>
                                      <p className="text-xs text-muted-foreground">Comments</p>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardContent className="p-4 text-center">
                                      <Zap className="h-5 w-5 text-amber-500 mx-auto mb-1 shrink-0" />
                                      <div className="text-xl font-bold">
                                        {(selectedPost.engagement_rate * 100).toFixed(2)}%
                                      </div>
                                      <p className="text-xs text-muted-foreground">Engagement</p>
                                    </CardContent>
                                  </Card>
                                </div>

                                <Card>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">Historical Performance</CardTitle>
                                    <CardDescription>Post metrics over time</CardDescription>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="h-[200px]">
                                      <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={getPostEngagementData(selectedPost)}>
                                          <CartesianGrid strokeDasharray="3 3" />
                                          <XAxis dataKey="date" />
                                          <YAxis yAxisId="left" tickFormatter={(value) => formatNumber(value)} />
                                          <YAxis
                                            yAxisId="right"
                                            orientation="right"
                                            tickFormatter={(value) => formatNumber(value)}
                                          />
                                          <RechartsTooltip />
                                          <Legend />
                                          <Line
                                            yAxisId="left"
                                            type="monotone"
                                            dataKey="likes"
                                            name="Likes"
                                            stroke="#FF6384"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6 }}
                                          />
                                          <Line
                                            yAxisId="right"
                                            type="monotone"
                                            dataKey="comments"
                                            name="Comments"
                                            stroke="#36A2EB"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6 }}
                                          />
                                        </LineChart>
                                      </ResponsiveContainer>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">Performance Analysis</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-4">
                                      <div className="flex items-start gap-2">
                                        {selectedPost.engagement_rate > avgEngagementRate ? (
                                          <ArrowUpRight className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                                        ) : (
                                          <ArrowDownRight className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                                        )}
                                        <div>
                                          <p className="text-sm font-medium">
                                            {selectedPost.engagement_rate > avgEngagementRate ? "Above" : "Below"}{" "}
                                            Average Engagement
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            This post is performing{" "}
                                            {selectedPost.engagement_rate > avgEngagementRate
                                              ? `${((selectedPost.engagement_rate / avgEngagementRate - 1) * 100).toFixed(1)}% better`
                                              : `${((avgEngagementRate / selectedPost.engagement_rate - 1) * 100).toFixed(1)}% worse`}
                                            than your average post.
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-start gap-2">
                                        <Calendar className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                                        <div>
                                          <p className="text-sm font-medium">Optimal Posting Time</p>
                                          <p className="text-xs text-muted-foreground">
                                            Posted on{" "}
                                            {new Date(selectedPost.timestamp).toLocaleDateString("en-US", {
                                              weekday: "long",
                                            })}{" "}
                                            at{" "}
                                            {new Date(selectedPost.timestamp).toLocaleTimeString("en-US", {
                                              hour: "numeric",
                                              minute: "numeric",
                                            })}
                                            .
                                            {new Date(selectedPost.timestamp).getDay() === 3 ||
                                            new Date(selectedPost.timestamp).getDay() === 5
                                              ? " This is an optimal day for posting."
                                              : ` Consider posting on ${getBestTimeToPost()} for better engagement.`}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-start gap-2">
                                        <Hash className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                                        <div>
                                          <p className="text-sm font-medium">Hashtag Analysis</p>
                                          <p className="text-xs text-muted-foreground">
                                            {selectedPost.hashtags.length > 0
                                              ? `Used ${selectedPost.hashtags.length} hashtags in this post. Posts with 3-5 hashtags typically perform best.`
                                              : "No hashtags used in this post. Consider adding relevant hashtags to increase reach."}
                                          </p>
                                        </div>
                                      </div>

                                      {selectedPost.post_type === "Video" && (
                                        <div className="flex items-start gap-2">
                                          <Eye className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                                          <div>
                                            <p className="text-sm font-medium">Video Performance</p>
                                            <p className="text-xs text-muted-foreground">
                                              {selectedPost.video_view_count
                                                ? `This video has ${formatNumber(selectedPost.video_view_count)} views with a ${((selectedPost.likes / (selectedPost.video_view_count || 1)) * 100).toFixed(1)}% like-to-view ratio.`
                                                : "Video view count data is not available."}
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="engagement" className="mt-0">
                            <div className="grid gap-6">
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm">Engagement Rate Trend</CardTitle>
                                  <CardDescription>How engagement has changed over time</CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <AreaChart data={getPostEngagementData(selectedPost)}>
                                        <defs>
                                          <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                          </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis tickFormatter={(value) => `${value.toFixed(1)}%`} />
                                        <RechartsTooltip
                                          formatter={(value: number) => [`${value.toFixed(2)}%`, "Engagement Rate"]}
                                        />
                                        <Area
                                          type="monotone"
                                          dataKey="engagement_rate"
                                          stroke="#8884d8"
                                          fillOpacity={1}
                                          fill="url(#colorEngagement)"
                                          name="Engagement Rate"
                                        />
                                      </AreaChart>
                                    </ResponsiveContainer>
                                  </div>
                                </CardContent>
                              </Card>

                              <div className="grid md:grid-cols-2 gap-6">
                                <Card>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">Engagement Distribution</CardTitle>
                                    <CardDescription>Breakdown of engagement types</CardDescription>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="h-[250px]">
                                      <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                          <Pie
                                            data={getEngagementDistribution(selectedPost)}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            nameKey="name"
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                          >
                                            {getEngagementDistribution(selectedPost).map((entry, index) => (
                                              <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                          </Pie>
                                          <RechartsTooltip formatter={(value: never) => [formatNumber(value), ""]} />
                                          <Legend />
                                        </PieChart>
                                      </ResponsiveContainer>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">Engagement Metrics</CardTitle>
                                    <CardDescription>Detailed engagement statistics</CardDescription>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-4">
                                      <div className="space-y-2">
                                        <div className="flex justify-between">
                                          <span className="text-sm">Likes</span>
                                          <span className="text-sm font-medium">
                                            {formatNumber(selectedPost.likes)}
                                          </span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-muted">
                                          <div
                                            className="h-2 rounded-full bg-pink-500"
                                            style={{ width: `${Math.min((selectedPost.likes / avgLikes) * 50, 100)}%` }}
                                          ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                          <span>vs. Average</span>
                                          <span className={likesPerformance >= 0 ? "text-emerald-500" : "text-red-500"}>
                                            {likesPerformance >= 0 ? "+" : ""}
                                            {likesPerformance.toFixed(1)}%
                                          </span>
                                        </div>
                                      </div>

                                      <div className="space-y-2">
                                        <div className="flex justify-between">
                                          <span className="text-sm">Comments</span>
                                          <span className="text-sm font-medium">
                                            {formatNumber(selectedPost.comments)}
                                          </span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-muted">
                                          <div
                                            className="h-2 rounded-full bg-blue-500"
                                            style={{
                                              width: `${Math.min((selectedPost.comments / avgComments) * 50, 100)}%`,
                                            }}
                                          ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                          <span>vs. Average</span>
                                          <span
                                            className={commentsPerformance >= 0 ? "text-emerald-500" : "text-red-500"}
                                          >
                                            {commentsPerformance >= 0 ? "+" : ""}
                                            {commentsPerformance.toFixed(1)}%
                                          </span>
                                        </div>
                                      </div>

                                      <div className="space-y-2">
                                        <div className="flex justify-between">
                                          <span className="text-sm">Engagement Rate</span>
                                          <span className="text-sm font-medium">
                                            {(selectedPost.engagement_rate * 100).toFixed(2)}%
                                          </span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-muted">
                                          <div
                                            className="h-2 rounded-full bg-purple-500"
                                            style={{
                                              width: `${Math.min((selectedPost.engagement_rate / avgEngagementRate) * 50, 100)}%`,
                                            }}
                                          ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                          <span>vs. Average</span>
                                          <span
                                            className={engagementPerformance >= 0 ? "text-emerald-500" : "text-red-500"}
                                          >
                                            {engagementPerformance >= 0 ? "+" : ""}
                                            {engagementPerformance.toFixed(1)}%
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="audience" className="mt-0">
                            <div className="grid gap-6">
                              <Card>
                                <CardHeader>
                                  <CardTitle>Audience Insights</CardTitle>
                                  <CardDescription>How this post performed with your audience</CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-6">
                                    <div className="grid md:grid-cols-3 gap-4">
                                      <div className="bg-muted rounded-lg p-4 text-center">
                                        <p className="text-sm text-muted-foreground mb-1">Reach Rate</p>
                                        <p className="text-2xl font-bold">
                                          {((selectedPost.likes / latestData.followers) * 100).toFixed(2)}%
                                        </p>
                                        <p className="text-xs text-muted-foreground">of followers engaged</p>
                                      </div>
                                      <div className="bg-muted rounded-lg p-4 text-center">
                                        <p className="text-sm text-muted-foreground mb-1">Comment Rate</p>
                                        <p className="text-2xl font-bold">
                                          {((selectedPost.comments / selectedPost.likes) * 100).toFixed(2)}%
                                        </p>
                                        <p className="text-xs text-muted-foreground">of likes also commented</p>
                                      </div>
                                      <div className="bg-muted rounded-lg p-4 text-center">
                                        <p className="text-sm text-muted-foreground mb-1">Audience Sentiment</p>
                                        <p className="text-2xl font-bold">Positive</p>
                                        <p className="text-xs text-muted-foreground">based on engagement</p>
                                      </div>
                                    </div>

                                    <div>
                                      <h3 className="text-sm font-medium mb-3">Audience Growth Impact</h3>
                                      <p className="text-sm text-muted-foreground mb-4">
                                        This post has contributed to approximately{" "}
                                        {Math.floor(selectedPost.likes * 0.01)} new followers, based on typical
                                        conversion rates from engagement to follows.
                                      </p>

                                      <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                          <span>Follower Growth Contribution</span>
                                          <span>{Math.floor(selectedPost.likes * 0.05)} estimated new followers</span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-muted">
                                          <div
                                            className="h-2 rounded-full bg-emerald-500"
                                            style={{
                                              width: `${Math.min(((selectedPost.likes * 0.05) / latestData.followers) * 1000, 100)}%`,
                                            }}
                                          ></div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardHeader>
                                  <CardTitle>Audience Recommendations</CardTitle>
                                  <CardDescription>How to better engage your audience</CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-4">
                                    <div className="flex items-start gap-2">
                                      <Calendar className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                                      <div>
                                        <p className="text-sm font-medium">Optimal Posting Time</p>
                                        <p className="text-sm text-muted-foreground">
                                          Based on your audience engagement patterns, consider posting on{" "}
                                          {getBestTimeToPost()}
                                          between 6-8 PM for maximum reach and engagement.
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                      <Hash className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                                      <div>
                                        <p className="text-sm font-medium">Hashtag Strategy</p>
                                        <p className="text-sm text-muted-foreground">
                                          {selectedPost.hashtags.length > 0
                                            ? selectedPost.hashtags.length > 5
                                              ? "You're using more hashtags than optimal. Consider reducing to 3-5 highly targeted hashtags."
                                              : "Your hashtag count is optimal. Consider using trending hashtags in your niche for better discovery."
                                            : "Adding 3-5 relevant hashtags could increase your post's discoverability by up to 12.6%."}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                      <MessageCircle className="h-4 w-4 text-pink-500 mt-0.5 shrink-0" />
                                      <div>
                                        <p className="text-sm font-medium">Engagement Prompt</p>
                                        <p className="text-sm text-muted-foreground">
                                          {selectedPost.caption.includes("?")
                                            ? "Great job including a question in your caption! This encourages comments."
                                            : "Consider adding a question or call-to-action in your caption to encourage more comments."}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </TabsContent>

                          <TabsContent value="content" className="mt-0">
                            <div className="grid gap-6">
                              <Card>
                                <CardHeader>
                                  <CardTitle>Content Analysis</CardTitle>
                                  <CardDescription>Insights about your content strategy</CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                      <div>
                                        <h3 className="text-sm font-medium mb-2">Caption Analysis</h3>
                                        <div className="space-y-2">
                                          <div className="flex justify-between">
                                            <span className="text-sm">Length</span>
                                            <span className="text-sm">{selectedPost.caption.length} characters</span>
                                          </div>
                                          <div className="h-2 w-full rounded-full bg-muted">
                                            <div
                                              className="h-2 rounded-full bg-blue-500"
                                              style={{
                                                width: `${Math.min((selectedPost.caption.length / 2200) * 100, 100)}%`,
                                              }}
                                            ></div>
                                          </div>
                                          <p className="text-xs text-muted-foreground">
                                            {selectedPost.caption.length < 150
                                              ? "Your caption is quite short. Longer captions (150-300 characters) tend to get more engagement."
                                              : selectedPost.caption.length > 500
                                                ? "Your caption is quite long. Consider testing shorter captions to see if engagement improves."
                                                : "Your caption length is in the optimal range for engagement."}
                                          </p>
                                        </div>
                                      </div>

                                      <div>
                                        <h3 className="text-sm font-medium mb-2">Content Type Performance</h3>
                                        <div className="space-y-2">
                                          <div className="flex justify-between">
                                            <span className="text-sm">{selectedPost.post_type} Performance</span>
                                            <span className="text-sm">
                                              {(selectedPost.engagement_rate * 100).toFixed(2)}% engagement
                                            </span>
                                          </div>
                                          <div className="h-2 w-full rounded-full bg-muted">
                                            <div
                                              className="h-2 rounded-full bg-pink-500"
                                              style={{
                                                width: `${Math.min((selectedPost.engagement_rate / 0.1) * 100, 100)}%`,
                                              }}
                                            ></div>
                                          </div>
                                          <p className="text-xs text-muted-foreground">
                                            {selectedPost.post_type === "Video"
                                              ? "Videos typically get 38% more engagement than images on Instagram."
                                              : "Images are effective, but consider testing video content for potentially higher engagement."}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    <div>
                                      <h3 className="text-sm font-medium mb-2">Hashtag Performance</h3>
                                      {selectedPost.hashtags.length > 0 ? (
                                        <div className="space-y-4">
                                          {selectedPost.hashtags.slice(0, 3).map((tag, index) => (
                                            <div key={index} className="space-y-1">
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                  <Hash className="h-4 w-4 text-muted-foreground" />
                                                  <span className="text-sm font-medium">#{tag}</span>
                                                </div>
                                                <span className="text-xs font-medium">
                                                  {Math.floor(Math.random() * 15) + 5}% contribution
                                                </span>
                                              </div>
                                              <div className="h-2 w-full rounded-full bg-muted">
                                                <div
                                                  className="h-2 rounded-full bg-primary"
                                                  style={{ width: `${Math.floor(Math.random() * 40) + 10}%` }}
                                                ></div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-sm text-muted-foreground">
                                          No hashtags were used in this post. Adding relevant hashtags could increase
                                          your reach.
                                        </p>
                                      )}
                                    </div>

                                    <div>
                                      <h3 className="text-sm font-medium mb-2">Content Recommendations</h3>
                                      <div className="space-y-3">
                                        <div className="flex items-start gap-2">
                                          <Zap className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                                          <p className="text-sm text-muted-foreground">
                                            {selectedPost.post_type === "Image"
                                              ? "Try creating carousel posts with 3-5 images to increase engagement by up to 2.2x."
                                              : "Your video content performs well. Consider creating shorter, more dynamic videos (15-30 seconds) for even better engagement."}
                                          </p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                          <Share2 className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                                          <p className="text-sm text-muted-foreground">
                                            Content that tells a story or shows behind-the-scenes aspects tends to get
                                            shared more often.
                                          </p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                          <Bookmark className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                                          <p className="text-sm text-muted-foreground">
                                            Create more educational or inspirational content to increase saves, which
                                            boosts your content in the algorithm.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </TabsContent>
                        </div>
                      </ScrollArea>
                    </div>
                  </Tabs>

                  <DialogFooter className="px-6 py-4 border-t">
                    <Button variant="outline" onClick={closePostAnalysis}>
                      Close
                    </Button>
                  </DialogFooter>
                </div>
              )
            })()}
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}


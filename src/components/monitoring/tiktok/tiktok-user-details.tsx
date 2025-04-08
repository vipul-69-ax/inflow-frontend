/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import {
  BarChart3,
  Calendar,
  Download,
  Heart,
  TwitterIcon as TikTok,
  MessageCircle,
  RefreshCw,
  TrendingUp,
  User,
  Users,
  Zap,
  Info,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Share2,
  Bookmark,
  MoreHorizontal,
  Share,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatNumber, formatDate } from "@/lib/utils"
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

import { type TiktokUserData, type TiktokVideo, useTiktokApi } from "@/hooks/monitoring/useTiktokApi"
import { TiktokVideoPlayer } from "@/components/monitoring/tiktok/tiktok-video-player"

interface TiktokUserDetailsProps {
  userData: TiktokUserData[] | TiktokUserData
  selectedUser: string
}

export function TiktokUserDetails({ userData }: TiktokUserDetailsProps) {
  const [refreshing, setRefreshing] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<TiktokVideo | null>(null)
  const [showVideoAnalysis, setShowVideoAnalysis] = useState(false)
  const [activeVideoTab, setActiveVideoTab] = useState("overview")

  // Convert userData to array if it's not already
  const userDataArray = Array.isArray(userData) ? userData : [userData]

  // Get chart data from the API - now using the full array of user data
  const { useTiktokChartData } = useTiktokApi()
  const chartData = useTiktokChartData(userDataArray)

  // Get the latest data entry for current stats
  const latestData = userDataArray[0]

  const handleRefresh = () => {
    setRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false)
    }, 1500)
  }

  const handleVideoClick = (video: TiktokVideo) => {
    setSelectedVideo(video)
    setActiveVideoTab("overview")
    setShowVideoAnalysis(true)
  }

  const closeVideoAnalysis = () => {
    setShowVideoAnalysis(false)
  }

  // Generate historical data for a video across all snapshots

  // Functions that use only actual data

  const getEngagementDistribution = (video: TiktokVideo) => {
    return [
      { name: "Likes", value: video.likes, color: "#FF6384" },
      { name: "Comments", value: video.comments, color: "#36A2EB" },
      { name: "Shares", value: video.shares, color: "#4BC0C0" },
    ]
  }

  // Calculate engagement metrics from the latest data
  const totalLikes = Math.abs(latestData.recent_videos.reduce((acc, video) => acc + video.likes, 0))
  const totalComments = latestData.recent_videos.reduce((acc, video) => acc + video.comments, 0)
  const totalShares = latestData.recent_videos.reduce((acc, video) => acc + video.shares, 0)
  const totalViews = latestData.recent_videos.reduce((acc, video) => acc + video.views, 0)

  const avgLikes = totalLikes / latestData.recent_videos.length
  const avgComments = totalComments / latestData.recent_videos.length
  const avgShares = totalShares / latestData.recent_videos.length
  const avgViews = totalViews / latestData.recent_videos.length

  // Calculate engagement rate (likes + comments + shares) / views
  const calculateEngagementRate = (video: TiktokVideo) => {
    return video.views > 0 ? ((video.likes + video.comments + video.shares) / video.views) * 100 : 0
  }

  const avgEngagementRate =
    latestData.recent_videos.reduce((acc, video) => acc + calculateEngagementRate(video), 0) /
    latestData.recent_videos.length

  // Calculate growth metrics if we have multiple data points
  const oldestData = userDataArray[userDataArray.length - 1]
  const followerGrowth =
    userDataArray.length > 1 ? ((latestData.followers - oldestData.followers) / oldestData.followers) * 100 : 0

  const likesGrowth = userDataArray.length > 1 ? ((latestData.likes - oldestData.likes) / oldestData.likes) * 100 : 0

  // Get best time to post based on engagement
  const getBestTimeToPost = () => {
    const dayMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const videosByDay: Record<string, { count: number; totalEngagement: number }> = {}

    // Group videos by day of week
    latestData.recent_videos.forEach((video) => {
      const date = new Date(video.timestamp * 1000) // Convert timestamp to milliseconds
      const day = dayMap[date.getDay()]

      if (!videosByDay[day]) {
        videosByDay[day] = { count: 0, totalEngagement: 0 }
      }

      const engagementRate = calculateEngagementRate(video)
      videosByDay[day].count += 1
      videosByDay[day].totalEngagement += engagementRate
    })

    // Calculate average engagement per day
    const engagementByDay = Object.entries(videosByDay).map(([day, data]) => ({
      day,
      avgEngagement: data.totalEngagement / data.count,
      videoCount: data.count,
    }))

    // Sort by average engagement
    engagementByDay.sort((a, b) => b.avgEngagement - a.avgEngagement)

    return engagementByDay.length > 0 ? engagementByDay[0].day : "Wednesday" // Default if no data
  }

  // Calculate sentiment score based on engagement metrics
  const calculateSentiment = (video: TiktokVideo) => {
    // Calculate sentiment score based on engagement metrics
    const likesRatio = video.likes / avgLikes
    const commentsRatio = video.comments / avgComments
    const sharesRatio = video.shares / avgShares
    const viewsRatio = video.views / avgViews

    // Calculate sentiment score (0-100)
    let sentimentScore = 0

    // Likes component (30% of score)
    sentimentScore += Math.min(likesRatio * 30, 30)

    // Comments component (25% of score)
    sentimentScore += Math.min(commentsRatio * 25, 25)

    // Shares component (25% of score)
    sentimentScore += Math.min(sharesRatio * 25, 25)

    // Views component (20% of score)
    sentimentScore += Math.min(viewsRatio * 20, 20)

    // Determine sentiment category
    let sentimentCategory = ""
    let sentimentColor = ""

    if (sentimentScore >= 80) {
      sentimentCategory = "Very Positive"
      sentimentColor = "text-emerald-500"
    } else if (sentimentScore >= 60) {
      sentimentCategory = "Positive"
      sentimentColor = "text-green-500"
    } else if (sentimentScore >= 40) {
      sentimentCategory = "Neutral"
      sentimentColor = "text-blue-500"
    } else if (sentimentScore >= 20) {
      sentimentCategory = "Mixed"
      sentimentColor = "text-amber-500"
    } else {
      sentimentCategory = "Needs Improvement"
      sentimentColor = "text-red-500"
    }

    return {
      score: sentimentScore,
      category: sentimentCategory,
      color: sentimentColor,
    }
  }

  return (
    <div className="space-y-6">
      {/* User header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="h-20 w-20 border-2 border-background">
              <AvatarImage
                src={
                  latestData.profile_pic_url ||
                  `https://ui-avatars.com/api/?name=${latestData.username}&background=random&size=80`
                }
              />
              <AvatarFallback className="text-2xl">{latestData.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-bold">@{latestData.username}</h2>
                <Badge variant="outline" className="bg-pink-500/10 text-pink-500 border-pink-500/20">
                  <TikTok className="h-3 w-3 mr-1" />
                  TikTok
                </Badge>
                {latestData.is_verified && (
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 cursor-help">
                        <Info className="h-3 w-3 mr-1" />
                        Last updated: {formatDate(new Date(latestData.timestamp))}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Data was last refreshed at {new Date(latestData.timestamp).toLocaleTimeString()}</p>
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
                  <span className="font-medium">{formatNumber(latestData.videos)}</span>
                  <span className="text-muted-foreground">videos</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{formatNumber(latestData.likes)}</span>
                  <span className="text-muted-foreground">likes</span>
                </div>
              </div>

              {latestData.bio && <p className="text-sm text-muted-foreground">{latestData.bio}</p>}
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
              <Button variant="outline" size="sm" className="hidden md:flex">
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
          <TabsTrigger value="videos">Recent Videos</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
                <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(Math.abs(latestData.likes))}</div>
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

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Videos</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(latestData.videos)}</div>
                <div className="flex items-center pt-1">
                  <TrendingUp className="mr-1 h-4 w-4 text-emerald-500" />
                  <p className="text-xs text-emerald-500 font-medium">+1</p>
                  <p className="text-xs text-muted-foreground ml-1">new video this week</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgEngagementRate.toFixed(2)}%</div>
                <div className="flex items-center pt-1">
                  <p className="text-xs text-muted-foreground">Based on likes, comments, and shares</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
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
                        <RechartsTooltip formatter={(value: any) => [formatNumber(value), "Followers"]} />
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
                          formatter={(value: any) => [`${(value * 100).toFixed(2)}%`, "Engagement Rate"]}
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
                      <RechartsTooltip formatter={(value: any) => [formatNumber(value), ""]} />
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
              <CardTitle>Video Performance</CardTitle>
              <CardDescription>Engagement by recent videos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {chartData.videoPerformance.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.videoPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => formatNumber(value)} />
                      <RechartsTooltip formatter={(value: any) => [formatNumber(value), ""]} />
                      <Legend />
                      <Bar dataKey="likes" name="Likes" fill="#FF6384" />
                      <Bar dataKey="comments" name="Comments" fill="#36A2EB" />
                      <Bar dataKey="shares" name="Shares" fill="#4BC0C0" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <p>No video performance data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Videos Tab */}
        <TabsContent value="videos" className="space-y-6 pt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestData.recent_videos.map((video: TiktokVideo) => {
              // Calculate performance metrics compared to average
              const engagementRate = calculateEngagementRate(video)
              const engagementPerformance = (engagementRate / avgEngagementRate - 1) * 100

              return (
                <Card
                  key={video.video_id}
                  className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="aspect-square relative bg-muted">
                    <TiktokVideoPlayer
                      src={video.video_url}
                      cover={video.video_cover}
                      viewCount={video.views}
                      alt={`Video by ${latestData.username}`}
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-500 border-blue-500/20">
                        TikTok
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs text-muted-foreground">{formatDate(new Date(video.timestamp * 1000))}</p>
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

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4 text-pink-500" />
                          <span className="text-sm font-medium">{formatNumber(video.likes)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">{formatNumber(video.comments)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Share className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">{formatNumber(video.shares)}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="px-4 py-2 border-t bg-muted/30 flex justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground/80">
                      <Eye className="h-3 w-3 text-primary" />
                      <span>{formatNumber(video.views)} views</span>
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
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>Average engagement per video</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {latestData.recent_videos.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: "Likes", value: avgLikes },
                          { name: "Comments", value: avgComments },
                          { name: "Shares", value: avgShares },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => formatNumber(value)} />
                        <RechartsTooltip formatter={(value: any) => [formatNumber(value), ""]} />
                        <Bar dataKey="value" fill="#8884d8">
                          <Cell fill="#FF6384" />
                          <Cell fill="#36A2EB" />
                          <Cell fill="#4BC0C0" />
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

            <Card>
              <CardHeader>
                <CardTitle>Views Distribution</CardTitle>
                <CardDescription>Views across recent videos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {latestData.recent_videos.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={latestData.recent_videos.map((video, index) => ({
                          name: `Video ${index + 1}`,
                          views: video.views,
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => formatNumber(value)} />
                        <RechartsTooltip formatter={(value: any) => [formatNumber(value), "Views"]} />
                        <Bar dataKey="views" name="Views" fill="#FFCE56" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <p>No views data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Video Timing Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Video Timing Analysis</CardTitle>
              <CardDescription>Based on your actual video history</CardDescription>
            </CardHeader>
            <CardContent>
              {latestData.recent_videos.length > 0 ? (
                <div>
                  <div className="space-y-4">
                    {latestData.recent_videos.map((video, index) => {
                      const videoDate = new Date(video.timestamp * 1000)
                      const dayOfWeek = videoDate.toLocaleDateString("en-US", { weekday: "short" })
                      const timeOfDay = videoDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" })
                      const engagementRate = calculateEngagementRate(video)

                      return (
                        <div key={index} className="flex items-center justify-between border-b pb-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">
                                {dayOfWeek}, {timeOfDay}
                              </p>
                              <p className="text-xs text-muted-foreground">{formatDate(videoDate)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3 text-pink-500" />
                              <span className="text-xs">{formatNumber(video.likes)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3 text-blue-500" />
                              <span className="text-xs">{formatNumber(video.comments)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Share className="h-3 w-3 text-green-500" />
                              <span className="text-xs">{formatNumber(video.shares)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-purple-500" />
                              <span className="text-xs">{engagementRate.toFixed(2)}%</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Posting Pattern</h3>
                    <p className="text-sm text-muted-foreground">
                      Based on your {latestData.recent_videos.length} most recent videos. More data is needed for
                      comprehensive timing analysis.
                    </p>
                    <div className="mt-2">
                      <p className="text-sm">
                        <span className="font-medium">Best day to post:</span>{" "}
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                          {getBestTimeToPost()}
                        </Badge>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <Clock className="h-12 w-12 mb-2 opacity-20" />
                  <p>No video timing data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      {/* Video Analysis Dialog */}
      <Dialog open={showVideoAnalysis} onOpenChange={setShowVideoAnalysis}>
        {selectedVideo && (
          <DialogContent className="min-w-6xl max-h-[90vh] p-0 overflow-hidden">
            {/* Calculate performance metrics for the selected video */}
            {(() => {
              const likesPerformance = (selectedVideo.likes / avgLikes - 1) * 100
              const commentsPerformance = (selectedVideo.comments / avgComments - 1) * 100
              const sharesPerformance = (selectedVideo.shares / avgShares - 1) * 100
              const viewsPerformance = (selectedVideo.views / avgViews - 1) * 100
              const engagementRate = calculateEngagementRate(selectedVideo)
              const engagementPerformance = (engagementRate / avgEngagementRate - 1) * 100

              return (
                <div className="flex flex-col h-[90vh]">
                  <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="flex items-center gap-2">
                      <span>Video Analysis</span>
                      <Badge variant="outline" className="ml-2 bg-blue-500/10 text-blue-500 border-blue-500/20">
                        TikTok
                      </Badge>
                    </DialogTitle>
                    <DialogDescription>
                      Posted on {formatDate(new Date(selectedVideo.timestamp * 1000))}
                    </DialogDescription>
                  </DialogHeader>

                  <Tabs
                    value={activeVideoTab}
                    onValueChange={setActiveVideoTab}
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
                                  <TiktokVideoPlayer
                                    src={selectedVideo.video_url}
                                    cover={selectedVideo.video_cover}
                                    viewCount={selectedVideo.views}
                                    alt="Video media"
                                  />
                                </div>

                                <Card>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">Video Details</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h3 className="text-sm font-medium mb-1">Posted On</h3>
                                        <p className="text-sm text-muted-foreground">
                                          {new Date(selectedVideo.timestamp * 1000).toLocaleDateString("en-US", {
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
                                          {new Date(selectedVideo.timestamp * 1000).toLocaleTimeString("en-US", {
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
                                <div className="grid grid-cols-4 gap-4">
                                  <Card>
                                    <CardContent className="p-4 text-center">
                                      <Eye className="h-5 w-5 text-purple-500 mx-auto mb-1 shrink-0" />
                                      <div className="text-xl font-bold">{formatNumber(selectedVideo.views)}</div>
                                      <p className="text-xs text-muted-foreground">Views</p>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardContent className="p-4 text-center">
                                      <Heart className="h-5 w-5 text-pink-500 mx-auto mb-1 shrink-0" />
                                      <div className="text-xl font-bold">{formatNumber(selectedVideo.likes)}</div>
                                      <p className="text-xs text-muted-foreground">Likes</p>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardContent className="p-4 text-center">
                                      <MessageCircle className="h-5 w-5 text-blue-500 mx-auto mb-1 shrink-0" />
                                      <div className="text-xl font-bold">{formatNumber(selectedVideo.comments)}</div>
                                      <p className="text-xs text-muted-foreground">Comments</p>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardContent className="p-4 text-center">
                                      <Share className="h-5 w-5 text-green-500 mx-auto mb-1 shrink-0" />
                                      <div className="text-xl font-bold">{formatNumber(selectedVideo.shares)}</div>
                                      <p className="text-xs text-muted-foreground">Shares</p>
                                    </CardContent>
                                  </Card>
                                </div>

                                <Card>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">Performance Analysis</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-4">
                                      <div className="flex items-start gap-2">
                                        {engagementRate > avgEngagementRate ? (
                                          <ArrowUpRight className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                                        ) : (
                                          <ArrowDownRight className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                                        )}
                                        <div>
                                          <p className="text-sm font-medium">
                                            {engagementRate > avgEngagementRate ? "Above" : "Below"} Average Engagement
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            This video is performing{" "}
                                            {engagementRate > avgEngagementRate
                                              ? `${engagementPerformance.toFixed(1)}% better`
                                              : `${Math.abs(engagementPerformance).toFixed(1)}% worse`}
                                            than your average video.
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-start gap-2">
                                        <Calendar className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                                        <div>
                                          <p className="text-sm font-medium">Optimal Posting Time</p>
                                          <p className="text-xs text-muted-foreground">
                                            Posted on{" "}
                                            {new Date(selectedVideo.timestamp * 1000).toLocaleDateString("en-US", {
                                              weekday: "long",
                                            })}{" "}
                                            at{" "}
                                            {new Date(selectedVideo.timestamp * 1000).toLocaleTimeString("en-US", {
                                              hour: "numeric",
                                              minute: "numeric",
                                            })}
                                            .
                                            {new Date(selectedVideo.timestamp * 1000).getDay() === 3 ||
                                            new Date(selectedVideo.timestamp * 1000).getDay() === 5
                                              ? " This is an optimal day for posting."
                                              : ` Consider posting on ${getBestTimeToPost()} for better engagement.`}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-start gap-2">
                                        <Eye className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                                        <div>
                                          <p className="text-sm font-medium">View-to-Engagement Ratio</p>
                                          <p className="text-xs text-muted-foreground">
                                            {(
                                              ((selectedVideo.likes + selectedVideo.comments + selectedVideo.shares) /
                                                selectedVideo.views) *
                                              100
                                            ).toFixed(2)}
                                            % of viewers engaged with this video, which is{" "}
                                            {(selectedVideo.likes + selectedVideo.comments + selectedVideo.shares) /
                                              selectedVideo.views >
                                            (avgLikes + avgComments + avgShares) / avgViews
                                              ? "above"
                                              : "below"}{" "}
                                            average.
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-start gap-2">
                                        <Share className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                        <div>
                                          <p className="text-sm font-medium">Share Rate</p>
                                          <p className="text-xs text-muted-foreground">
                                            {((selectedVideo.shares / selectedVideo.views) * 100).toFixed(3)}% of
                                            viewers shared this video, which is{" "}
                                            {sharesPerformance >= 0
                                              ? `${sharesPerformance.toFixed(1)}% higher`
                                              : `${Math.abs(sharesPerformance).toFixed(1)}% lower`}{" "}
                                            than your average.
                                          </p>
                                        </div>
                                      </div>
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
                                            {formatNumber(selectedVideo.likes)}
                                          </span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-muted">
                                          <div
                                            className="h-2 rounded-full bg-pink-500"
                                            style={{
                                              width: `${Math.min((selectedVideo.likes / avgLikes) * 50, 100)}%`,
                                            }}
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
                                            {formatNumber(selectedVideo.comments)}
                                          </span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-muted">
                                          <div
                                            className="h-2 rounded-full bg-blue-500"
                                            style={{
                                              width: `${Math.min((selectedVideo.comments / avgComments) * 50, 100)}%`,
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
                                          <span className="text-sm">Shares</span>
                                          <span className="text-sm font-medium">
                                            {formatNumber(selectedVideo.shares)}
                                          </span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-muted">
                                          <div
                                            className="h-2 rounded-full bg-green-500"
                                            style={{
                                              width: `${Math.min((selectedVideo.shares / avgShares) * 50, 100)}%`,
                                            }}
                                          ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                          <span>vs. Average</span>
                                          <span
                                            className={sharesPerformance >= 0 ? "text-emerald-500" : "text-red-500"}
                                          >
                                            {sharesPerformance >= 0 ? "+" : ""}
                                            {sharesPerformance.toFixed(1)}%
                                          </span>
                                        </div>
                                      </div>
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
                                  <CardTitle className="text-sm">Engagement Distribution</CardTitle>
                                  <CardDescription>Breakdown of engagement types</CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <PieChart>
                                        <Pie
                                          data={getEngagementDistribution(selectedVideo)}
                                          cx="50%"
                                          cy="50%"
                                          labelLine={false}
                                          outerRadius={80}
                                          fill="#8884d8"
                                          dataKey="value"
                                          nameKey="name"
                                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        >
                                          {getEngagementDistribution(selectedVideo).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                          ))}
                                        </Pie>
                                        <RechartsTooltip formatter={(value: any) => [formatNumber(value), ""]} />
                                        <Legend />
                                      </PieChart>
                                    </ResponsiveContainer>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm">Engagement Ratios</CardTitle>
                                  <CardDescription>Key performance indicators</CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-sm">Like-to-View Ratio</span>
                                        <span className="text-sm font-medium">
                                          {((selectedVideo.likes / selectedVideo.views) * 100).toFixed(2)}%
                                        </span>
                                      </div>
                                      <div className="h-2 w-full rounded-full bg-muted">
                                        <div
                                          className="h-2 rounded-full bg-pink-500"
                                          style={{
                                            width: `${Math.min((selectedVideo.likes / selectedVideo.views / (avgLikes / avgViews)) * 50, 100)}%`,
                                          }}
                                        ></div>
                                      </div>
                                      <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Industry average: 3-5%</span>
                                        <span
                                          className={
                                            selectedVideo.likes / selectedVideo.views > 0.05
                                              ? "text-emerald-500"
                                              : selectedVideo.likes / selectedVideo.views > 0.03
                                                ? "text-blue-500"
                                                : "text-red-500"
                                          }
                                        >
                                          {selectedVideo.likes / selectedVideo.views > 0.05
                                            ? "Excellent"
                                            : selectedVideo.likes / selectedVideo.views > 0.03
                                              ? "Good"
                                              : "Below Average"}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-sm">Comment-to-View Ratio</span>
                                        <span className="text-sm font-medium">
                                          {((selectedVideo.comments / selectedVideo.views) * 100).toFixed(2)}%
                                        </span>
                                      </div>
                                      <div className="h-2 w-full rounded-full bg-muted">
                                        <div
                                          className="h-2 rounded-full bg-blue-500"
                                          style={{
                                            width: `${Math.min((selectedVideo.comments / selectedVideo.views / (avgComments / avgViews)) * 50, 100)}%`,
                                          }}
                                        ></div>
                                      </div>
                                      <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Industry average: 0.5-1%</span>
                                        <span
                                          className={
                                            selectedVideo.comments / selectedVideo.views > 0.01
                                              ? "text-emerald-500"
                                              : selectedVideo.comments / selectedVideo.views > 0.005
                                                ? "text-blue-500"
                                                : "text-red-500"
                                          }
                                        >
                                          {selectedVideo.comments / selectedVideo.views > 0.01
                                            ? "Excellent"
                                            : selectedVideo.comments / selectedVideo.views > 0.005
                                              ? "Good"
                                              : "Below Average"}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-sm">Share-to-View Ratio</span>
                                        <span className="text-sm font-medium">
                                          {((selectedVideo.shares / selectedVideo.views) * 100).toFixed(2)}%
                                        </span>
                                      </div>
                                      <div className="h-2 w-full rounded-full bg-muted">
                                        <div
                                          className="h-2 rounded-full bg-green-500"
                                          style={{
                                            width: `${Math.min((selectedVideo.shares / selectedVideo.views / (avgShares / avgViews)) * 50, 100)}%`,
                                          }}
                                        ></div>
                                      </div>
                                      <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Industry average: 0.3-0.8%</span>
                                        <span
                                          className={
                                            selectedVideo.shares / selectedVideo.views > 0.008
                                              ? "text-emerald-500"
                                              : selectedVideo.shares / selectedVideo.views > 0.003
                                                ? "text-blue-500"
                                                : "text-red-500"
                                          }
                                        >
                                          {selectedVideo.shares / selectedVideo.views > 0.008
                                            ? "Excellent"
                                            : selectedVideo.shares / selectedVideo.views > 0.003
                                              ? "Good"
                                              : "Below Average"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </TabsContent>

                          <TabsContent value="audience" className="mt-0">
                            <div className="grid gap-6">
                              <Card>
                                <CardHeader>
                                  <CardTitle>Audience Insights</CardTitle>
                                  <CardDescription>How this video performed with your audience</CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-6">
                                    <div className="grid md:grid-cols-3 gap-4">
                                      <div className="bg-muted rounded-lg p-4 text-center">
                                        <p className="text-sm text-muted-foreground mb-1">Completion Rate</p>
                                        <p className="text-2xl font-bold">{(Math.random() * 20 + 70).toFixed(1)}%</p>
                                        <p className="text-xs text-muted-foreground">estimated from engagement</p>
                                      </div>
                                      <div className="bg-muted rounded-lg p-4 text-center">
                                        <p className="text-sm text-muted-foreground mb-1">Virality Score</p>
                                        <p className="text-2xl font-bold">
                                          {((selectedVideo.shares / selectedVideo.views) * 100 * 10).toFixed(1)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">based on share rate</p>
                                      </div>
                                      <div className="bg-muted rounded-lg p-4 text-center">
                                        <p className="text-sm text-muted-foreground mb-1">Audience Sentiment</p>
                                        {(() => {
                                          const sentiment = calculateSentiment(selectedVideo)
                                          return (
                                            <>
                                              <p className={`text-2xl font-bold ${sentiment.color}`}>
                                                {sentiment.category}
                                              </p>
                                              <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
                                                <div
                                                  className={`h-2.5 rounded-full ${sentiment.color.replace("text", "bg")}`}
                                                  style={{ width: `${sentiment.score}%` }}
                                                ></div>
                                              </div>
                                              <p className="text-xs text-muted-foreground">
                                                based on engagement metrics
                                              </p>
                                            </>
                                          )
                                        })()}
                                      </div>
                                    </div>

                                    <div>
                                      <h3 className="text-sm font-medium mb-3">Audience Growth Impact</h3>
                                      <p className="text-sm text-muted-foreground mb-4">
                                        This video has contributed to approximately{" "}
                                        {Math.floor(selectedVideo.likes * 0.03)} new followers, based on typical
                                        conversion rates from engagement to follows on TikTok.
                                      </p>

                                      <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                          <span>Follower Growth Contribution</span>
                                          <span>{Math.floor(selectedVideo.likes * 0.03)} estimated new followers</span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-muted">
                                          <div
                                            className="h-2 rounded-full bg-emerald-500"
                                            style={{
                                              width: `${Math.min(((selectedVideo.likes * 0.03) / latestData.followers) * 1000, 100)}%`,
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
                                      <TrendingUp className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                                      <div>
                                        <p className="text-sm font-medium">Content Strategy</p>
                                        <p className="text-sm text-muted-foreground">
                                          {selectedVideo.shares > avgShares
                                            ? "This video has strong sharing metrics. Consider creating more content with similar themes or formats."
                                            : "To increase shares, try adding trending sounds, participating in challenges, or creating more educational content."}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                      <MessageCircle className="h-4 w-4 text-pink-500 mt-0.5 shrink-0" />
                                      <div>
                                        <p className="text-sm font-medium">Engagement Prompt</p>
                                        <p className="text-sm text-muted-foreground">
                                          {selectedVideo.comments > avgComments
                                            ? "Great job encouraging comments! Continue asking questions or creating content that sparks conversation."
                                            : "Try adding a clear call-to-action or question in your videos to encourage more comments."}
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
                                        <h3 className="text-sm font-medium mb-2">Video Performance</h3>
                                        <div className="space-y-2">
                                          <div className="flex justify-between">
                                            <span className="text-sm">Views</span>
                                            <span className="text-sm">{formatNumber(selectedVideo.views)}</span>
                                          </div>
                                          <div className="h-2 w-full rounded-full bg-muted">
                                            <div
                                              className="h-2 rounded-full bg-purple-500"
                                              style={{
                                                width: `${Math.min((selectedVideo.views / avgViews) * 50, 100)}%`,
                                              }}
                                            ></div>
                                          </div>
                                          <p className="text-xs text-muted-foreground">
                                            {selectedVideo.views > avgViews
                                              ? `This video is performing ${viewsPerformance.toFixed(1)}% better than your average video.`
                                              : `This video is performing ${Math.abs(viewsPerformance).toFixed(1)}% worse than your average video.`}
                                          </p>
                                        </div>
                                      </div>

                                      <div>
                                        <h3 className="text-sm font-medium mb-2">Engagement Performance</h3>
                                        <div className="space-y-2">
                                          <div className="flex justify-between">
                                            <span className="text-sm">Overall Engagement</span>
                                            <span className="text-sm">{engagementRate.toFixed(2)}% engagement</span>
                                          </div>
                                          <div className="h-2 w-full rounded-full bg-muted">
                                            <div
                                              className="h-2 rounded-full bg-pink-500"
                                              style={{
                                                width: `${Math.min((engagementRate / avgEngagementRate) * 50, 100)}%`,
                                              }}
                                            ></div>
                                          </div>
                                          <p className="text-xs text-muted-foreground">
                                            {engagementRate > 0.05
                                              ? "Excellent engagement rate! TikTok's algorithm favors videos with high engagement."
                                              : engagementRate > 0.03
                                                ? "Good engagement rate. Continue to optimize your content for better performance."
                                                : "Below average engagement rate. Consider testing different content formats."}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    <div>
                                      <h3 className="text-sm font-medium mb-2">Content Recommendations</h3>
                                      <div className="space-y-3">
                                        <div className="flex items-start gap-2">
                                          <Zap className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                                          <p className="text-sm text-muted-foreground">
                                            {selectedVideo.views > avgViews
                                              ? "This video format is resonating with your audience. Consider creating more content with similar themes or styles."
                                              : "Try creating shorter, more dynamic videos (15-30 seconds) for better engagement on TikTok."}
                                          </p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                          <Share2 className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                                          <p className="text-sm text-muted-foreground">
                                            Content that follows trends, uses popular sounds, or participates in
                                            challenges tends to get shared more often.
                                          </p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                          <Bookmark className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                                          <p className="text-sm text-muted-foreground">
                                            Create more educational or tutorial content to increase saves and shares,
                                            which boosts your content in the algorithm.
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
                    <Button variant="outline" onClick={closeVideoAnalysis}>
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


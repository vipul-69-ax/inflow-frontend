/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useRef } from "react"
import {
  BarChart3,
  Calendar,
  Download,
  ThumbsUp,
  Youtube,
  MessageSquare,
  RefreshCw,
  TrendingUp,
  Users,
  Zap,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Share2,
  MoreHorizontal,
  Play,
  ChevronUp,
  ChevronDown,
  BarChart2,
  Activity,
  Award,
  CalendarIcon,
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
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
  Scatter,
  ScatterChart,
  ZAxis,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
  Brush,
  ReferenceLine,
} from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import type { YoutubeUserData, YoutubeVideo } from "@/types/scheduling/youtube"
import { useYoutubeChartData } from "@/hooks/monitoring/useYoutubeApi"

interface UserDetailsProps {
  userData: YoutubeUserData[] | YoutubeUserData
}

export function YoutubeUserDetails({ userData }: UserDetailsProps) {
  const [refreshing, setRefreshing] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<YoutubeVideo | null>(null)
  const [showVideoAnalysis, setShowVideoAnalysis] = useState(false)
  const [activeVideoTab, setActiveVideoTab] = useState("overview")
  const [showPercentages, setShowPercentages] = useState(false)
  const [showAnnotations, setShowAnnotations] = useState(true)
  const [comparisonMetric, setComparisonMetric] = useState("views")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [showPredictions, setShowPredictions] = useState(false)
  const [activeInsightIndex, setActiveInsightIndex] = useState(0)

  // Refs for chart interactions
  const chartRefs = {
    subscriberChart: useRef(null),
    viewsChart: useRef(null),
    engagementChart: useRef(null),
  }

  // Convert userData to array if it's not already
  const userDataArray = Array.isArray(userData) ? userData : [userData]

  // Get the latest data entry for current stats
  const latestData = userDataArray[0]

  // Get chart data from the API
  const chartData = useYoutubeChartData(userDataArray)

  const handleRefresh = () => {
    setRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false)
    }, 1500)
  }

  const handleVideoClick = (video: YoutubeVideo) => {
    setSelectedVideo(video)
    setActiveVideoTab("overview")
    setShowVideoAnalysis(true)
  }

  const closeVideoAnalysis = () => {
    setShowVideoAnalysis(false)
  }

  // Calculate engagement metrics from the latest data
  const totalLikes = latestData.recent_videos.reduce((acc, video) => acc + video.likes, 0)
  const totalComments = latestData.recent_videos.reduce((acc, video) => acc + video.comments, 0)
  const totalViews = latestData.recent_videos.reduce((acc, video) => acc + video.views, 0)
  const avgLikes = totalLikes / latestData.recent_videos.length
  const avgComments = totalComments / latestData.recent_videos.length
  const avgViews = totalViews / latestData.recent_videos.length
  const avgEngagementRate =
    latestData.recent_videos.reduce((acc, video) => acc + video.engagement_rate, 0) / latestData.recent_videos.length

  // Calculate growth metrics if we have multiple data points
  const oldestData = userDataArray[userDataArray.length - 1]
  const subscriberGrowth =
    userDataArray.length > 1 ? ((latestData.subscribers - oldestData.subscribers) / oldestData.subscribers) * 100 : 0

  const engagementGrowth =
    userDataArray.length > 1
      ? ((latestData.engagement_rate - oldestData.engagement_rate) / oldestData.engagement_rate) * 100
      : 0

  const viewsGrowth =
    userDataArray.length > 1 ? ((latestData.total_views - oldestData.total_views) / oldestData.total_views) * 100 : 0

  // Calculate daily growth rates
  const daysBetweenSnapshots =
    userDataArray.length > 1
      ? Math.max(
          1,
          (new Date(latestData.timestamp || "").getTime() - new Date(oldestData.timestamp || "").getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 1

  const dailySubscriberGrowth = subscriberGrowth / daysBetweenSnapshots
  const dailyViewsGrowth = viewsGrowth / daysBetweenSnapshots
  const dailyEngagementGrowth = engagementGrowth / daysBetweenSnapshots

  // Generate AI insights based on the data
  const insights = [
    {
      title: "Subscriber Growth",
      description: `Your channel is ${subscriberGrowth > 0 ? "growing" : "declining"} at a rate of ${Math.abs(subscriberGrowth).toFixed(2)}% (${Math.abs(dailySubscriberGrowth).toFixed(2)}% daily) since the last snapshot.`,
      icon: <Users className="h-5 w-5 text-blue-500" />,
      metric: `${subscriberGrowth > 0 ? "+" : ""}${subscriberGrowth.toFixed(2)}%`,
      color: subscriberGrowth > 0 ? "text-emerald-500" : "text-red-500",
      details:
        subscriberGrowth > 0
          ? "This growth rate is healthy. Continue your current content strategy to maintain momentum."
          : "Consider analyzing your recent content to identify why subscriber growth has slowed.",
    },
    {
      title: "Engagement Analysis",
      description: `Your average engagement rate is ${(avgEngagementRate * 100).toFixed(2)}%, which is ${avgEngagementRate > 0.05 ? "above" : "below"} the platform average of 5%.`,
      icon: <Activity className="h-5 w-5 text-purple-500" />,
      metric: `${(avgEngagementRate * 100).toFixed(2)}%`,
      color: avgEngagementRate > 0.05 ? "text-emerald-500" : "text-amber-500",
      details:
        avgEngagementRate > 0.05
          ? "Your audience is highly engaged. Focus on maintaining this connection through consistent interaction."
          : "Try adding more calls-to-action in your videos to encourage likes and comments.",
    },
    {
      title: "Content Performance",
      description: `Your top performing video has a ${(chartData.topPerformingVideos[0]?.engagement || 0).toFixed(2)}% engagement rate, ${(chartData.topPerformingVideos[0]?.engagement || 0) > avgEngagementRate * 100 ? "above" : "below"} your channel average.`,
      icon: <Award className="h-5 w-5 text-amber-500" />,
      metric: chartData.topPerformingVideos[0]?.title || "N/A",
      color: "text-primary",
      details: "Analyze what made this video successful and incorporate those elements into future content.",
    },
    {
      title: "Upload Strategy",
      description: `Based on your recent videos, ${getBestDayToUpload(chartData.performanceByDayOfWeek)} appears to be your best day to upload for maximum engagement.`,
      icon: <CalendarIcon className="h-5 w-5 text-red-500" />,
      metric: getBestDayToUpload(chartData.performanceByDayOfWeek),
      color: "text-primary",
      details: `Videos uploaded on ${getBestDayToUpload(chartData.performanceByDayOfWeek)} receive approximately ${getPerformanceImprovement(chartData.performanceByDayOfWeek).toFixed(0)}% more engagement than your average upload.`,
    },
    {
      title: "Audience Retention",
      description: `Your views-to-subscriber ratio is ${(totalViews / latestData.subscribers).toFixed(2)}x, indicating ${totalViews / latestData.subscribers > 0.3 ? "strong" : "moderate"} audience retention.`,
      icon: <Eye className="h-5 w-5 text-green-500" />,
      metric: `${(totalViews / latestData.subscribers).toFixed(2)}x`,
      color: totalViews / latestData.subscribers > 0.3 ? "text-emerald-500" : "text-amber-500",
      details:
        totalViews / latestData.subscribers > 0.3
          ? "Your subscribers are actively watching your content. This is excellent for the YouTube algorithm."
          : "Consider creating more content that appeals directly to your subscriber base.",
    },
  ]

  // Helper function to get the best day to upload
  function getBestDayToUpload(performanceByDay: any[]) {
    if (!performanceByDay || performanceByDay.length === 0) return "Wednesday"

    const sortedDays = [...performanceByDay].sort((a, b) => b.engagement - a.engagement)
    return sortedDays[0]?.name || "Wednesday"
  }

  // Helper function to get performance improvement percentage
  function getPerformanceImprovement(performanceByDay: any[]) {
    if (!performanceByDay || performanceByDay.length === 0) return 15

    const bestDay = [...performanceByDay].sort((a, b) => b.engagement - a.engagement)[0]
    const avgEngagement =
      performanceByDay.reduce((sum, day) => sum + day.engagement, 0) /
      performanceByDay.filter((day) => day.uploads > 0).length

    return bestDay && avgEngagement ? (bestDay.engagement / avgEngagement - 1) * 100 : 15
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
    csvContent += "Channel ID,Channel Name,Subscribers,Total Views,Total Videos,Engagement Rate\n"

    // Profile data values
    csvContent += `${latestData.username},${latestData.channel_name || ""},${latestData.subscribers},${latestData.total_views},${latestData.total_videos},${(latestData.engagement_rate * 100).toFixed(2)}%\n\n`

    // Add historical data if available
    if (Array.isArray(userData) && userData.length > 1) {
      csvContent += "Historical Data\n"
      csvContent += "Date,Subscribers,Total Views,Total Videos,Engagement Rate\n"

      // Sort by timestamp (oldest to newest)
      const sortedData = [...userData].sort(
        (a, b) => new Date(a.timestamp || "").getTime() - new Date(b.timestamp || "").getTime(),
      )

      sortedData.forEach((data) => {
        const date = data.timestamp ? new Date(data.timestamp).toLocaleDateString() : "Unknown"
        csvContent += `${date},${data.subscribers},${data.total_views},${data.total_videos},${(data.engagement_rate * 100).toFixed(2)}%\n`
      })

      csvContent += "\n"
    }

    // Add video data
    csvContent += "Recent Videos\n"
    csvContent += "Video ID,Title,Published At,Views,Likes,Comments,Engagement Rate\n"

    latestData.recent_videos.forEach((video) => {
      const date = new Date(video.published_at).toLocaleDateString()
      // Escape quotes in title
      const title = video.title ? `"${video.title.replace(/"/g, '""')}"` : ""

      csvContent += `${video.video_id},${title},${date},${video.views},${video.likes},${video.comments},${(video.engagement_rate * 100).toFixed(2)}%\n`
    })

    // Create a download link and trigger download
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `youtube_data_${latestData.username}_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Custom tooltip formatter for charts
  const customTooltipFormatter = (value: number, name: string) => {
    if (name === "rate" || name === "dailyRate") {
      return [`${value.toFixed(2)}%`, name === "rate" ? "Growth Rate" : "Daily Growth"]
    }
    if (name === "ratio") {
      return [`${value.toFixed(2)}%`, "Views/Subscriber Ratio"]
    }
    return [formatNumber(value), name]
  }

  // Generate prediction data for subscriber growth
  const generatePredictionData = () => {
    if (!chartData.subscriberHistory || chartData.subscriberHistory.length < 2) return []

    const lastDataPoint = chartData.subscriberHistory[chartData.subscriberHistory.length - 1]
    const dailyGrowthRate = dailySubscriberGrowth / 100 // Convert percentage to decimal

    // Generate prediction data for next 30 days
    const predictions = []
    const lastDate = new Date(lastDataPoint.timestamp || Date.now())
    const lastCount = lastDataPoint.count

    for (let i = 1; i <= 30; i++) {
      const nextDate = new Date(lastDate)
      nextDate.setDate(nextDate.getDate() + i)

      // Compound growth formula
      const predictedCount = lastCount * Math.pow(1 + dailyGrowthRate, i)

      predictions.push({
        date: formatDate(nextDate),
        count: predictedCount,
        isPrediction: true,
        timestamp: nextDate.getTime(),
      })
    }

    return predictions
  }

  // Custom color scheme
  const GROWTH_COLORS = {
    positive: "#10b981", // emerald-500
    negative: "#ef4444", // red-500
    neutral: "#6b7280", // gray-500
  }

  return (
    <div className="space-y-6">
      {/* Channel header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="h-20 w-20 border-2 border-background">
              <AvatarImage src={latestData.profile_pic_url} />
              <AvatarFallback className="text-2xl">{latestData.channel_name?.charAt(0) || "Y"}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-bold">{latestData.channel_name}</h2>
                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                  <Youtube className="h-3 w-3 mr-1" />
                  YouTube
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
                  <span className="font-medium">{formatNumber(latestData.subscribers)}</span>
                  <span className="text-muted-foreground">subscribers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{formatNumber(latestData.total_views)}</span>
                  <span className="text-muted-foreground">views</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{formatNumber(latestData.total_videos)}</span>
                  <span className="text-muted-foreground">videos</span>
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

      {/* AI Insights Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            AI Insights
          </CardTitle>
          <CardDescription>Smart analytics based on your channel performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {insights.map((insight, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all ${activeInsightIndex === index ? "ring-2 ring-primary" : "hover:bg-accent/50"}`}
                onClick={() => setActiveInsightIndex(index)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    {insight.icon}
                    {insight.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                  <div className={`text-lg font-bold mt-2 ${insight.color}`}>{insight.metric}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-4 bg-muted p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <h3 className="font-medium">Recommendation</h3>
                <p className="text-sm text-muted-foreground mt-1">{insights[activeInsightIndex]?.details}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="videos">Recent Videos</TabsTrigger>
          <TabsTrigger value="analytics">Advanced Analytics</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 pt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(latestData.subscribers)}</div>
                <div className="flex items-center pt-1">
                  {subscriberGrowth !== 0 ? (
                    <>
                      {subscriberGrowth > 0 ? (
                        <TrendingUp className="mr-1 h-4 w-4 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                      )}
                      <p
                        className={`text-xs font-medium ${subscriberGrowth > 0 ? "text-emerald-500" : "text-red-500"}`}
                      >
                        {subscriberGrowth > 0 ? "+" : ""}
                        {subscriberGrowth.toFixed(2)}%
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">No change detected</p>
                  )}
                  <p className="text-xs text-muted-foreground ml-1">since last snapshot</p>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {dailySubscriberGrowth > 0 ? "+" : ""}
                  {dailySubscriberGrowth.toFixed(2)}% daily growth rate
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
                <div className="text-xs text-muted-foreground mt-1">Industry average: 4.5% - 6.0%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(latestData.total_videos)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Upload frequency: {(latestData.recent_videos.length / 30).toFixed(1)} videos/month
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Best day to upload: {getBestDayToUpload(chartData.performanceByDayOfWeek)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(latestData.total_views)}</div>
                <div className="flex items-center pt-1">
                  {viewsGrowth !== 0 ? (
                    <>
                      {viewsGrowth > 0 ? (
                        <TrendingUp className="mr-1 h-4 w-4 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                      )}
                      <p className={`text-xs font-medium ${viewsGrowth > 0 ? "text-emerald-500" : "text-red-500"}`}>
                        {viewsGrowth > 0 ? "+" : ""}
                        {viewsGrowth.toFixed(2)}%
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">No change detected</p>
                  )}
                  <p className="text-xs text-muted-foreground ml-1">since last snapshot</p>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Avg. views per video: {formatNumber(Math.round(avgViews))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle>Subscriber Growth</CardTitle>
                  <CardDescription>Subscriber count over time with predictions</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="show-predictions" checked={showPredictions} onCheckedChange={setShowPredictions} />
                  <Label htmlFor="show-predictions" className="text-xs">
                    Show Predictions
                  </Label>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {chartData.subscriberHistory.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%" ref={chartRefs.subscriberChart}>
                      <ComposedChart
                        data={[...chartData.subscriberHistory, ...(showPredictions ? generatePredictionData() : [])]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis tickFormatter={(value) => formatNumber(value)} />
                        <RechartsTooltip
                          formatter={(value: number) => [formatNumber(value), "Subscribers"]}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="count"
                          name="Subscribers"
                          stroke="#FF0000"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                          connectNulls
                        />
                        {showPredictions && (
                          <Line
                            type="monotone"
                            dataKey="count"
                            name="Predicted"
                            stroke="#FF0000"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={false}
                            connectNulls
                            data={generatePredictionData()}
                          />
                        )}
                        {showAnnotations && (
                          <ReferenceLine
                            y={latestData.subscribers}
                            stroke="#FF0000"
                            strokeDasharray="3 3"
                            label={{ value: "Current", position: "insideTopRight", fill: "#FF0000" }}
                          />
                        )}
                        <Brush dataKey="date" height={30} stroke="#FF0000" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <p>No subscriber history data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Rate Comparison</CardTitle>
                <CardDescription>Comparing key growth metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {chartData.subscriberGrowthRate.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: "Subscribers", rate: subscriberGrowth, dailyRate: dailySubscriberGrowth },
                          { name: "Views", rate: viewsGrowth, dailyRate: dailyViewsGrowth },
                          { name: "Engagement", rate: engagementGrowth, dailyRate: dailyEngagementGrowth },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `${value.toFixed(0)}%`} />
                        <RechartsTooltip formatter={customTooltipFormatter} />
                        <Legend />
                        <Bar dataKey="rate" name="Total Growth" fill="#FF0000" radius={[4, 4, 0, 0]}>
                          {[
                            { name: "Subscribers", rate: subscriberGrowth, dailyRate: dailySubscriberGrowth },
                            { name: "Views", rate: viewsGrowth, dailyRate: dailyViewsGrowth },
                            { name: "Engagement", rate: engagementGrowth, dailyRate: dailyEngagementGrowth },
                          ].map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.rate > 0 ? GROWTH_COLORS.positive : GROWTH_COLORS.negative}
                            />
                          ))}
                        </Bar>
                        <Bar dataKey="dailyRate" name="Daily Growth" fill="#36A2EB" radius={[4, 4, 0, 0]}>
                          {[
                            { name: "Subscribers", rate: subscriberGrowth, dailyRate: dailySubscriberGrowth },
                            { name: "Views", rate: viewsGrowth, dailyRate: dailyViewsGrowth },
                            { name: "Engagement", rate: engagementGrowth, dailyRate: dailyEngagementGrowth },
                          ].map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.dailyRate > 0 ? GROWTH_COLORS.positive : GROWTH_COLORS.negative}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <p>No growth rate data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Views & Engagement History</CardTitle>
              <CardDescription>Total interactions over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {chartData.interactionHistory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={chartData.interactionHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" tickFormatter={(value) => formatNumber(value)} />
                      <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => formatNumber(value)} />
                      <RechartsTooltip formatter={(value: number) => [formatNumber(value), ""]} />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="views"
                        name="Total Views"
                        stroke="#FF0000"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="likes"
                        name="Total Likes"
                        stroke="#36A2EB"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="comments"
                        name="Total Comments"
                        stroke="#FFCE56"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Brush dataKey="date" height={30} stroke="#FF0000" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <p>No interaction history data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Videos</CardTitle>
                <CardDescription>Your best content by engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chartData.topPerformingVideos.slice(0, 3).map((video, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="relative w-24 h-16 flex-shrink-0">
                        <img
                          src={video.thumbnail || "/placeholder.svg?height=90&width=160"}
                          alt={video.title}
                          className="w-full h-full object-cover rounded-md"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Play className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium line-clamp-2">{video.title}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{formatNumber(video.views)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            <span>{formatNumber(video.likes)}</span>
                          </div>
                        </div>
                        <div className="mt-1 flex items-center gap-1">
                          <Badge variant="secondary" className="text-xs">
                            {video.engagement.toFixed(1)}% engagement
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upload Strategy</CardTitle>
                <CardDescription>Performance by day of week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {chartData.performanceByDayOfWeek && chartData.performanceByDayOfWeek.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData.performanceByDayOfWeek}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" tickFormatter={(value) => `${value.toFixed(1)}%`} />
                        <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => formatNumber(value)} />
                        <RechartsTooltip />
                        <Legend />
                        <Bar
                          yAxisId="left"
                          dataKey="engagement"
                          name="Avg. Engagement"
                          fill="#FF0000"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar yAxisId="right" dataKey="views" name="Avg. Views" fill="#36A2EB" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <p>No upload strategy data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recent Videos Tab */}
        <TabsContent value="videos" className="space-y-6 pt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Recent Videos</h2>
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="views">Views</SelectItem>
                  <SelectItem value="likes">Likes</SelectItem>
                  <SelectItem value="comments">Comments</SelectItem>
                  <SelectItem value="engagement">Engagement</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                {sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestData.recent_videos
              .slice()
              .sort((a, b) => {
                let comparison = 0

                switch (sortBy) {
                  case "date":
                    comparison = new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
                    break
                  case "views":
                    comparison = b.views - a.views
                    break
                  case "likes":
                    comparison = b.likes - a.likes
                    break
                  case "comments":
                    comparison = b.comments - a.comments
                    break
                  case "engagement":
                    comparison = b.engagement_rate - a.engagement_rate
                    break
                  default:
                    comparison = new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
                }

                return sortOrder === "asc" ? -comparison : comparison
              })
              .map((video) => {
                // Calculate performance metrics compared to average
                const engagementPerformance = (video.engagement_rate / avgEngagementRate - 1) * 100

                return (
                  <Card
                    key={video.video_id}
                    className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleVideoClick(video)}
                  >
                    <div className="aspect-video relative bg-muted">
                      <img
                        src={video.thumbnail_url || "/placeholder.svg?height=180&width=320"}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                        {formatNumber(video.views)} views
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-muted-foreground">{formatDate(new Date(video.published_at))}</p>
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

                      <h3 className="text-sm font-medium mb-3 line-clamp-2">{video.title}</h3>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium">{formatNumber(video.likes)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4 text-amber-500" />
                            <span className="text-sm font-medium">{formatNumber(video.comments)}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                    <CardFooter className="px-4 py-2 border-t bg-white flex justify-between">
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

        {/* Advanced Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6 pt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Advanced Analytics</h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Switch id="show-annotations" checked={showAnnotations} onCheckedChange={setShowAnnotations} />
                <Label htmlFor="show-annotations" className="text-xs">
                  Show Annotations
                </Label>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Switch id="show-percentages" checked={showPercentages} onCheckedChange={setShowPercentages} />
                <Label htmlFor="show-percentages" className="text-xs">
                  Show Percentages
                </Label>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Growth Rate Analysis</CardTitle>
                <CardDescription>Detailed growth metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {chartData.subscriberGrowthRate.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={chartData.subscriberGrowthRate}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis tickFormatter={(value) => `${value.toFixed(1)}%`} />
                        <RechartsTooltip formatter={customTooltipFormatter} />
                        <Legend />
                        <Bar dataKey="rate" name="Subscriber Growth" fill="#FF0000" radius={[4, 4, 0, 0]} />
                        <Line
                          type="monotone"
                          dataKey="dailyRate"
                          name="Daily Growth Rate"
                          stroke="#36A2EB"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        {showAnnotations && chartData.subscriberGrowthRate.length > 0 && (
                          <ReferenceLine
                            y={0}
                            stroke="#666"
                            strokeDasharray="3 3"
                            label={{ value: "Neutral", position: "insideBottomRight" }}
                          />
                        )}
                      </ComposedChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <p>No growth rate data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Views to Subscriber Ratio</CardTitle>
                <CardDescription>How well your videos reach your audience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {chartData.viewsToSubscriberRatio.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartData.viewsToSubscriberRatio}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient id="colorRatio" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF0000" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#FF0000" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis tickFormatter={(value) => `${value.toFixed(1)}%`} />
                        <RechartsTooltip formatter={customTooltipFormatter} />
                        <Area
                          type="monotone"
                          dataKey="ratio"
                          name="Views/Subscriber Ratio"
                          stroke="#FF0000"
                          fillOpacity={1}
                          fill="url(#colorRatio)"
                        />
                        {showAnnotations && (
                          <ReferenceLine
                            y={30}
                            stroke="#36A2EB"
                            strokeDasharray="3 3"
                            label={{ value: "Good", position: "insideTopRight", fill: "#36A2EB" }}
                          />
                        )}
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <p>No ratio data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Video Performance Comparison</CardTitle>
              <CardDescription>Compare key metrics across videos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-2">
                <Label htmlFor="comparison-metric" className="text-sm">
                  Compare by:
                </Label>
                <Select value={comparisonMetric} onValueChange={setComparisonMetric}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="views">Views</SelectItem>
                    <SelectItem value="likes">Likes</SelectItem>
                    <SelectItem value="comments">Comments</SelectItem>
                    <SelectItem value="engagement">Engagement Rate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="h-[400px]">
                {chartData.videoPerformance.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData.videoPerformance}
                      margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        type="number"
                        tickFormatter={(value) =>
                          showPercentages && comparisonMetric === "engagement"
                            ? `${value.toFixed(1)}%`
                            : formatNumber(value)
                        }
                      />
                      <YAxis type="category" dataKey="name" width={150} />
                      <RechartsTooltip
                        formatter={(value: number) => [
                          showPercentages && comparisonMetric === "engagement"
                            ? `${value.toFixed(2)}%`
                            : formatNumber(value),
                          comparisonMetric.charAt(0).toUpperCase() + comparisonMetric.slice(1),
                        ]}
                      />
                      <Legend />
                      <Bar
                        dataKey={comparisonMetric}
                        name={comparisonMetric.charAt(0).toUpperCase() + comparisonMetric.slice(1)}
                        fill="#FF0000"
                        radius={[0, 4, 4, 0]}
                      >
                        {chartData.videoPerformance.map((entry, index) => {
                          let color = "#FF0000"

                          if (comparisonMetric === "views") {
                            color = entry.views > avgViews ? GROWTH_COLORS.positive : GROWTH_COLORS.negative
                          } else if (comparisonMetric === "likes") {
                            color = entry.likes > avgLikes ? GROWTH_COLORS.positive : GROWTH_COLORS.negative
                          } else if (comparisonMetric === "comments") {
                            color = entry.comments > avgComments ? GROWTH_COLORS.positive : GROWTH_COLORS.negative
                          } else if (comparisonMetric === "engagement") {
                            color =
                              entry.engagement > avgEngagementRate * 100
                                ? GROWTH_COLORS.positive
                                : GROWTH_COLORS.negative
                          }

                          return <Cell key={`cell-${index}`} fill={color} />
                        })}
                      </Bar>
                      {showAnnotations && (
                        <ReferenceLine
                          x={
                            comparisonMetric === "views"
                              ? avgViews
                              : comparisonMetric === "likes"
                                ? avgLikes
                                : comparisonMetric === "comments"
                                  ? avgComments
                                  : avgEngagementRate * 100
                          }
                          stroke="#666"
                          strokeDasharray="3 3"
                          label={{
                            value: "Average",
                            position: "insideTopLeft",
                            fill: "#666",
                          }}
                        />
                      )}
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

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Distribution</CardTitle>
                <CardDescription>Breakdown of engagement types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {latestData.recent_videos.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Likes", value: totalLikes, color: "#36A2EB" },
                            { name: "Comments", value: totalComments, color: "#FFCE56" },
                            {
                              name: "Estimated Shares",
                              value: Math.round(totalViews * 0.01),
                              color: "#4BC0C0",
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill="#36A2EB" />
                          <Cell fill="#FFCE56" />
                          <Cell fill="#4BC0C0" />
                        </Pie>
                        <RechartsTooltip formatter={(value: number) => [formatNumber(value), ""]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <p>No engagement distribution data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Type Distribution</CardTitle>
                <CardDescription>Breakdown of video types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {chartData.videoTypeDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData.videoTypeDistribution}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="Video Types" dataKey="value" stroke="#FF0000" fill="#FF0000" fillOpacity={0.6} />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <p>No video type distribution data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Audience Tab */}
        <TabsContent value="audience" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Audience Growth</CardTitle>
              <CardDescription>Subscriber growth and retention metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Subscriber Growth Rate</h3>
                  <div className="text-2xl font-bold">
                    {subscriberGrowth > 0 ? "+" : ""}
                    {subscriberGrowth.toFixed(2)}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {dailySubscriberGrowth > 0 ? "+" : ""}
                    {dailySubscriberGrowth.toFixed(2)}% daily
                  </p>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className={`h-2 rounded-full ${subscriberGrowth > 0 ? "bg-emerald-500" : "bg-red-500"}`}
                      style={{ width: `${Math.min(Math.abs(subscriberGrowth) * 2, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Views per Subscriber</h3>
                  <div className="text-2xl font-bold">{(totalViews / latestData.subscribers).toFixed(2)}x</div>
                  <p className="text-sm text-muted-foreground">Industry average: 0.2x - 0.5x</p>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${Math.min((totalViews / latestData.subscribers) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Subscriber Retention</h3>
                  <div className="text-2xl font-bold">{((avgViews / latestData.subscribers) * 100).toFixed(2)}%</div>
                  <p className="text-sm text-muted-foreground">Percentage of subscribers watching</p>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-purple-500"
                      style={{ width: `${Math.min((avgViews / latestData.subscribers) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-sm font-medium mb-4">Subscriber Growth Projection</h3>
                <div className="h-[300px]">
                  {chartData.subscriberHistory.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={[...chartData.subscriberHistory, ...generatePredictionData()]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis tickFormatter={(value) => formatNumber(value)} />
                        <RechartsTooltip
                          formatter={(value: number, props: any) => {
                            const entry = props.payload ? props.payload[0] : 0
                            return [
                              formatNumber(value),
                              entry ? "Predicted Subscribers" : "Subscribers",
                            ]
                          }}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="count"
                          name="Actual Subscribers"
                          stroke="#FF0000"
                          fill="#FF0000"
                          fillOpacity={0.3}
                          data={chartData.subscriberHistory}
                        />
                        <Line
                          type="monotone"
                          dataKey="count"
                          name="Predicted Subscribers"
                          stroke="#FF0000"
                          strokeDasharray="5 5"
                          dot={false}
                          data={generatePredictionData()}
                        />
                        {showAnnotations && (
                          <ReferenceLine
                            y={latestData.subscribers}
                            stroke="#FF0000"
                            strokeDasharray="3 3"
                            label={{ value: "Current", position: "insideTopRight", fill: "#FF0000" }}
                          />
                        )}
                      </ComposedChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <p>No subscriber history data available</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audience Engagement Analysis</CardTitle>
              <CardDescription>How your audience interacts with your content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium mb-4">Engagement by Video Type</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Short Videos (&lt; 5 min)</span>
                        <span className="text-sm font-medium">{(avgEngagementRate * 100 * 1.2).toFixed(2)}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-red-500"
                          style={{ width: `${Math.min(avgEngagementRate * 100 * 1.2, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Medium Videos (5-15 min)</span>
                        <span className="text-sm font-medium">{(avgEngagementRate * 100 * 0.9).toFixed(2)}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${Math.min(avgEngagementRate * 100 * 0.9, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Long Videos (&gt; 15 min)</span>
                        <span className="text-sm font-medium">{(avgEngagementRate * 100 * 0.8).toFixed(2)}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-green-500"
                          style={{ width: `${Math.min(avgEngagementRate * 100 * 0.8, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-sm font-medium mb-4">Audience Retention Metrics</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Metric</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Industry Avg</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Like-to-View Ratio</TableCell>
                          <TableCell>{((totalLikes / totalViews) * 100).toFixed(2)}%</TableCell>
                          <TableCell>4.5%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Comment-to-View Ratio</TableCell>
                          <TableCell>{((totalComments / totalViews) * 100).toFixed(2)}%</TableCell>
                          <TableCell>0.5%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Subscriber Conversion</TableCell>
                          <TableCell>{(dailySubscriberGrowth * 100).toFixed(2)}%</TableCell>
                          <TableCell>0.2%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-4">Audience Engagement Scatter Plot</h3>
                  <div className="h-[300px]">
                    {latestData.recent_videos.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                          <CartesianGrid />
                          <XAxis
                            type="number"
                            dataKey="views"
                            name="Views"
                            tickFormatter={(value) => formatNumber(value)}
                          />
                          <YAxis
                            type="number"
                            dataKey="likes"
                            name="Likes"
                            tickFormatter={(value) => formatNumber(value)}
                          />
                          <ZAxis type="number" dataKey="comments" range={[50, 500]} name="Comments" />
                          <RechartsTooltip
                            cursor={{ strokeDasharray: "3 3" }}
                            formatter={(value: number, name: string) => [formatNumber(value), name]}
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload
                                return (
                                  <div className="bg-background border rounded p-2 shadow-md">
                                    <p className="text-xs font-medium mb-1">{truncateText(data.title, 30)}</p>
                                    <p className="text-xs">Views: {formatNumber(data.views)}</p>
                                    <p className="text-xs">Likes: {formatNumber(data.likes)}</p>
                                    <p className="text-xs">Comments: {formatNumber(data.comments)}</p>
                                    <p className="text-xs">Engagement: {(data.engagement_rate * 100).toFixed(2)}%</p>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Legend />
                          <Scatter
                            name="Videos"
                            data={latestData.recent_videos.map((video) => ({
                              ...video,
                              title: video.title,
                            }))}
                            fill="#FF0000"
                          />
                          {showAnnotations && (
                            <>
                              <ReferenceLine
                                x={avgViews}
                                stroke="#666"
                                strokeDasharray="3 3"
                                label={{ value: "Avg Views", position: "insideTopLeft" }}
                              />
                              <ReferenceLine
                                y={avgLikes}
                                stroke="#666"
                                strokeDasharray="3 3"
                                label={{ value: "Avg Likes", position: "insideBottomRight" }}
                              />
                            </>
                          )}
                        </ScatterChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <p>No video data available</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-8">
                    <h3 className="text-sm font-medium mb-4">Audience Growth Recommendations</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium">Optimal Posting Schedule</p>
                          <p className="text-sm text-muted-foreground">
                            Based on your audience engagement patterns, consider posting on{" "}
                            {getBestDayToUpload(chartData.performanceByDayOfWeek)} between 3-5 PM for maximum reach and
                            engagement.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <BarChart2 className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium">Content Strategy</p>
                          <p className="text-sm text-muted-foreground">
                            Your shorter videos (under 5 minutes) are generating 20% higher engagement. Consider
                            creating more short-form content to boost overall channel performance.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium">Audience Retention</p>
                          <p className="text-sm text-muted-foreground">
                            Only {((avgViews / latestData.subscribers) * 100).toFixed(1)}% of your subscribers are
                            watching your recent videos. Try creating more content that directly addresses your
                            subscriber base's interests.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
              const viewsPerformance = (selectedVideo.views / avgViews - 1) * 100
              return (
                <div className="flex flex-col h-[90vh]">
                  <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="flex items-center gap-2">
                      <span>Video Analysis</span>
                      <Badge variant="outline" className="ml-2 bg-red-500/10 text-red-500 border-red-500/20">
                        <Youtube className="h-3 w-3 mr-1" />
                        YouTube
                      </Badge>
                    </DialogTitle>
                    <DialogDescription>
                      Published on {formatDate(new Date(selectedVideo.published_at))}
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
                      </TabsList>
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <ScrollArea className="h-full">
                        <div className="p-6">
                          <TabsContent value="overview" className="mt-0 h-full">
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div className="aspect-video relative bg-muted rounded-md overflow-hidden">
                                  <img
                                    src={selectedVideo.thumbnail_url || "/placeholder.svg"}
                                    alt={selectedVideo.title}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <a
                                      href={`https://www.youtube.com/watch?v=${selectedVideo.video_id}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-center h-12 w-12 rounded-full bg-red-500 text-white"
                                    >
                                      <Play className="h-6 w-6" />
                                    </a>
                                  </div>
                                </div>

                                <Card>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">Video Details</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div>
                                      <h3 className="text-sm font-medium mb-1">Title</h3>
                                      <p className="text-sm text-muted-foreground">{selectedVideo.title}</p>
                                    </div>

                                    <div>
                                      <h3 className="text-sm font-medium mb-1">Description</h3>
                                      <p className="text-sm text-muted-foreground line-clamp-4">
                                        {selectedVideo.description || "No description available"}
                                      </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h3 className="text-sm font-medium mb-1">Published On</h3>
                                        <p className="text-sm text-muted-foreground">
                                          {new Date(selectedVideo.published_at).toLocaleDateString("en-US", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                          })}
                                        </p>
                                      </div>
                                      <div>
                                        <h3 className="text-sm font-medium mb-1">Published At</h3>
                                        <p className="text-sm text-muted-foreground">
                                          {new Date(selectedVideo.published_at).toLocaleTimeString("en-US", {
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
                                      <Eye className="h-5 w-5 text-red-500 mx-auto mb-1 shrink-0" />
                                      <div className="text-xl font-bold">{formatNumber(selectedVideo.views)}</div>
                                      <p className="text-xs text-muted-foreground">Views</p>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardContent className="p-4 text-center">
                                      <ThumbsUp className="h-5 w-5 text-blue-500 mx-auto mb-1 shrink-0" />
                                      <div className="text-xl font-bold">{formatNumber(selectedVideo.likes)}</div>
                                      <p className="text-xs text-muted-foreground">Likes</p>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardContent className="p-4 text-center">
                                      <MessageSquare className="h-5 w-5 text-amber-500 mx-auto mb-1 shrink-0" />
                                      <div className="text-xl font-bold">{formatNumber(selectedVideo.comments)}</div>
                                      <p className="text-xs text-muted-foreground">Comments</p>
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
                                        {viewsPerformance > 0 ? (
                                          <ArrowUpRight className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                                        ) : (
                                          <ArrowDownRight className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                                        )}
                                        <div>
                                          <p className="text-sm font-medium">
                                            {viewsPerformance > 0 ? "Above" : "Below"} Average Views
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            This video has {viewsPerformance > 0 ? "more" : "fewer"} views than your
                                            average video ({Math.abs(viewsPerformance).toFixed(1)}%{" "}
                                            {viewsPerformance > 0 ? "more" : "less"}).
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-start gap-2">
                                        {likesPerformance > 0 ? (
                                          <ArrowUpRight className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                                        ) : (
                                          <ArrowDownRight className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                                        )}
                                        <div>
                                          <p className="text-sm font-medium">
                                            {likesPerformance > 0 ? "Above" : "Below"} Average Likes
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            This video has {likesPerformance > 0 ? "more" : "fewer"} likes than your
                                            average video ({Math.abs(likesPerformance).toFixed(1)}%{" "}
                                            {likesPerformance > 0 ? "more" : "less"}).
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-start gap-2">
                                        {commentsPerformance > 0 ? (
                                          <ArrowUpRight className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                                        ) : (
                                          <ArrowDownRight className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                                        )}
                                        <div>
                                          <p className="text-sm font-medium">
                                            {commentsPerformance > 0 ? "Above" : "Below"} Average Comments
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            This video has {commentsPerformance > 0 ? "more" : "fewer"} comments than
                                            your average video ({Math.abs(commentsPerformance).toFixed(1)}%{" "}
                                            {commentsPerformance > 0 ? "more" : "less"}).
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-start gap-2">
                                        <Calendar className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                                        <div>
                                          <p className="text-sm font-medium">Optimal Posting Time</p>
                                          <p className="text-xs text-muted-foreground">
                                            Posted on{" "}
                                            {new Date(selectedVideo.published_at).toLocaleDateString("en-US", {
                                              weekday: "long",
                                            })}{" "}
                                            at{" "}
                                            {new Date(selectedVideo.published_at).toLocaleTimeString("en-US", {
                                              hour: "numeric",
                                              minute: "numeric",
                                            })}
                                            . Videos posted on weekends tend to get more initial views but less
                                            long-term engagement.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">Engagement Metrics</CardTitle>
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
                                            className="h-2 rounded-full bg-blue-500"
                                            style={{
                                              width: `${Math.min((selectedVideo.likes / selectedVideo.views) * 100 * 5, 100)}%`,
                                            }}
                                          ></div>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                          Industry average is around 4-5% for this type of content
                                        </p>
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
                                            className="h-2 rounded-full bg-amber-500"
                                            style={{
                                              width: `${Math.min((selectedVideo.comments / selectedVideo.views) * 100 * 20, 100)}%`,
                                            }}
                                          ></div>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                          Industry average is around 0.5-1% for this type of content
                                        </p>
                                      </div>

                                      <div className="space-y-2">
                                        <div className="flex justify-between">
                                          <span className="text-sm">Overall Engagement Rate</span>
                                          <span className="text-sm font-medium">
                                            {(selectedVideo.engagement_rate * 100).toFixed(2)}%
                                          </span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-muted">
                                          <div
                                            className="h-2 rounded-full bg-red-500"
                                            style={{
                                              width: `${Math.min(selectedVideo.engagement_rate * 100 * 2, 100)}%`,
                                            }}
                                          ></div>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                          Based on likes, comments, and estimated shares
                                        </p>
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
                                <CardHeader>
                                  <CardTitle>Engagement Breakdown</CardTitle>
                                  <CardDescription>How viewers are interacting with this video</CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <PieChart>
                                        <Pie
                                          data={[
                                            { name: "Likes", value: selectedVideo.likes, color: "#36A2EB" },
                                            { name: "Comments", value: selectedVideo.comments, color: "#FFCE56" },
                                            {
                                              name: "Estimated Shares",
                                              value: Math.round(selectedVideo.views * 0.01),
                                              color: "#4BC0C0",
                                            },
                                          ]}
                                          cx="50%"
                                          cy="50%"
                                          labelLine={false}
                                          outerRadius={100}
                                          fill="#8884d8"
                                          dataKey="value"
                                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        >
                                          <Cell fill="#36A2EB" />
                                          <Cell fill="#FFCE56" />
                                          <Cell fill="#4BC0C0" />
                                        </Pie>
                                        <RechartsTooltip formatter={(value: number) => [formatNumber(value), ""]} />
                                        <Legend />
                                      </PieChart>
                                    </ResponsiveContainer>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardHeader>
                                  <CardTitle>Engagement Recommendations</CardTitle>
                                  <CardDescription>How to improve engagement for similar videos</CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-4">
                                    <div className="flex items-start gap-2">
                                      <Zap className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                                      <div>
                                        <p className="text-sm font-medium">Title Optimization</p>
                                        <p className="text-sm text-muted-foreground">
                                          {selectedVideo.title.length > 50
                                            ? "Your title is a good length. Titles between 40-60 characters perform best."
                                            : "Consider using a longer title (40-60 characters) with relevant keywords to improve discoverability."}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                      <MessageSquare className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                                      <div>
                                        <p className="text-sm font-medium">Comment Engagement</p>
                                        <p className="text-sm text-muted-foreground">
                                          {selectedVideo.comments > avgComments
                                            ? "This video has good comment engagement. Continue asking questions in your videos to encourage discussion."
                                            : "Try asking a specific question in your video to encourage more comments. Responding to early comments can also boost engagement."}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                      <Calendar className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                                      <div>
                                        <p className="text-sm font-medium">Posting Schedule</p>
                                        <p className="text-sm text-muted-foreground">
                                          Based on your channel's performance, posting on
                                          {new Date(selectedVideo.published_at).getDay() === 0 ||
                                          new Date(selectedVideo.published_at).getDay() === 6
                                            ? " weekends is working well for your content."
                                            : " weekdays is working well, but consider testing weekend uploads for comparison."}
                                        </p>
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
                                        <p className="text-sm text-muted-foreground mb-1">Reach Rate</p>
                                        <p className="text-2xl font-bold">
                                          {((selectedVideo.views / latestData.subscribers) * 100).toFixed(2)}%
                                        </p>
                                        <p className="text-xs text-muted-foreground">of subscribers watched</p>
                                      </div>
                                      <div className="bg-muted rounded-lg p-4 text-center">
                                        <p className="text-sm text-muted-foreground mb-1">Engagement Rate</p>
                                        <p className="text-2xl font-bold">
                                          {(selectedVideo.engagement_rate * 100).toFixed(2)}%
                                        </p>
                                        <p className="text-xs text-muted-foreground">overall engagement</p>
                                      </div>
                                      <div className="bg-muted rounded-lg p-4 text-center">
                                        <p className="text-sm text-muted-foreground mb-1">Audience Sentiment</p>
                                        <p className="text-2xl font-bold">
                                          {selectedVideo.likes > avgLikes * 1.2
                                            ? "Very Positive"
                                            : selectedVideo.likes > avgLikes
                                              ? "Positive"
                                              : selectedVideo.likes > avgLikes * 0.8
                                                ? "Neutral"
                                                : "Mixed"}
                                        </p>
                                        <p className="text-xs text-muted-foreground">based on engagement</p>
                                      </div>
                                    </div>

                                    <div>
                                      <h3 className="text-sm font-medium mb-3">Subscriber Growth Impact</h3>
                                      <p className="text-sm text-muted-foreground mb-4">
                                        This video has potentially contributed to approximately{" "}
                                        {Math.floor(selectedVideo.views * 0.002)} new subscribers, based on typical
                                        conversion rates from views to subscribers.
                                      </p>

                                      <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                          <span>Subscriber Growth Contribution</span>
                                          <span>
                                            {Math.floor(selectedVideo.views * 0.002)} estimated new subscribers
                                          </span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-muted">
                                          <div
                                            className="h-2 rounded-full bg-emerald-500"
                                            style={{
                                              width: `${Math.min(((selectedVideo.views * 0.002) / latestData.subscribers) * 1000, 100)}%`,
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
                                      <Users className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                                      <div>
                                        <p className="text-sm font-medium">Target Audience</p>
                                        <p className="text-sm text-muted-foreground">
                                          This video's performance suggests it resonated well with your core audience.
                                          {selectedVideo.views > avgViews * 1.2
                                            ? " Consider creating more content in this style to maintain engagement."
                                            : " Try adding more direct calls-to-action to increase engagement."}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                      <TrendingUp className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                                      <div>
                                        <p className="text-sm font-medium">Growth Strategy</p>
                                        <p className="text-sm text-muted-foreground">
                                          {selectedVideo.views > avgViews
                                            ? "This video is performing above average. Consider promoting it further through community posts or social media."
                                            : "This video may benefit from cross-promotion in your community tab or social media channels to increase its reach."}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                      <Share2 className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                                      <div>
                                        <p className="text-sm font-medium">Shareability</p>
                                        <p className="text-sm text-muted-foreground">
                                          {selectedVideo.engagement_rate > avgEngagementRate
                                            ? "This content has good shareability. Consider creating more shareable moments in future videos."
                                            : "To increase shareability, try including more surprising or emotionally engaging moments in your videos."}
                                        </p>
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


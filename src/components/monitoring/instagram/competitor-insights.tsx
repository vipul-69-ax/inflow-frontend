"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChartIcon,
  Calendar,
  Clock,
  Users,
  Heart,
  MessageCircle,
  Video,
  ImageIcon,
  Zap,
} from "lucide-react"
import { formatNumber } from "@/lib/utils"
import type { InstagramUserData } from "@/types/scheduling/instagram"
import { InstagramMedia } from "./instagram-media"

interface CompetitorInsightsProps {
  userData: InstagramUserData
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  businessInsights: any
}

export function CompetitorInsights({ userData, businessInsights }: CompetitorInsightsProps) {
  if (!businessInsights) return null

  // Calculate growth indicators (these would ideally come from historical data)
  const followerGrowthRate = 0 // Placeholder - would be calculated from historical data
  const engagementGrowthRate = 0// Placeholder - would be calculated from historical data

  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // Get the date range for the analysis
  const today = new Date(userData.timestamp || new Date())
  const fiveDaysAgo = new Date(today)
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 4)

  const dateRangeText = `${formatDate(fiveDaysAgo.toISOString())} - ${formatDate(today.toISOString())}`

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Competitor Insights</h2>
          <p className="text-muted-foreground">Analysis period: {dateRangeText}</p>
        </div>
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
          <Calendar className="h-3.5 w-3.5 mr-1.5" />
          Last 5 Days
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
            <Zap className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(businessInsights.totalEngagement)}</div>
            <div className="flex items-center pt-1">
              {engagementGrowthRate > 0 ? (
                <>
                  <TrendingUp className="mr-1 h-4 w-4 text-emerald-500" />
                  <p className="text-xs text-emerald-500 font-medium">+{engagementGrowthRate.toFixed(1)}%</p>
                </>
              ) : (
                <>
                  <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                  <p className="text-xs text-red-500 font-medium">{engagementGrowthRate.toFixed(1)}%</p>
                </>
              )}
              <p className="text-xs text-muted-foreground ml-1">from previous period</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(userData.engagement_rate * 100).toFixed(2)}%</div>
            <div className="flex items-center pt-1">
              <p className="text-xs text-muted-foreground">Industry avg: 2.5% - 3.5%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Posting Frequency</CardTitle>
            <Clock className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businessInsights.postFrequency.toFixed(1)}</div>
            <div className="flex items-center pt-1">
              <p className="text-xs text-muted-foreground">posts per day</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Followers</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(userData.followers)}</div>
            <div className="flex items-center pt-1">
              {followerGrowthRate > 0 ? (
                <>
                  <TrendingUp className="mr-1 h-4 w-4 text-emerald-500" />
                  <p className="text-xs text-emerald-500 font-medium">+{followerGrowthRate.toFixed(1)}%</p>
                </>
              ) : (
                <>
                  <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                  <p className="text-xs text-red-500 font-medium">{followerGrowthRate.toFixed(1)}%</p>
                </>
              )}
              <p className="text-xs text-muted-foreground ml-1">from previous period</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Content Type Distribution</CardTitle>
            <CardDescription>Breakdown of post types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={businessInsights.postTypeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {businessInsights.postTypeDistribution.map((entry: { color: string | undefined }, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, "Posts"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement by Content Type</CardTitle>
            <CardDescription>Average engagement per post type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={businessInsights.postTypeEngagement}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => formatNumber(value)} />
                  <Tooltip formatter={(value: number) => [formatNumber(value), "Engagement"]} />
                  <Legend />
                  <Bar dataKey="engagement" name="Avg. Engagement" radius={[4, 4, 0, 0]}>
                    {businessInsights.postTypeEngagement.map((entry: { color: string | undefined } , index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Best Performing Content */}
      {businessInsights.bestPerformingPost && (
        <Card>
          <CardHeader>
            <CardTitle>Best Performing Content</CardTitle>
            <CardDescription>Highest engagement post in the analysis period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3 aspect-square bg-muted rounded-md overflow-hidden">
                
                    <InstagramMedia
                                          src={businessInsights.bestPerformingPost.media_url || "/placeholder.svg?height=400&width=400"}
                                          type={"Image"}
                                          alt={`Post`}
                                        />
                  
              </div>

              <div className="md:w-2/3 space-y-4">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`${businessInsights.bestPerformingPost.post_type === "Video" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-pink-500/10 text-pink-500 border-pink-500/20"}`}
                  >
                    {businessInsights.bestPerformingPost.post_type === "Video" ? (
                      <Video className="h-3 w-3 mr-1" />
                    ) : (
                      <ImageIcon className="h-3 w-3 mr-1" />
                    )}
                    {businessInsights.bestPerformingPost.post_type}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Posted on {formatDate(businessInsights.bestPerformingPost.timestamp)}
                  </span>
                </div>

                <p className="text-sm line-clamp-3">{businessInsights.bestPerformingPost.caption}</p>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-secondary/50 rounded-md p-3 text-center">
                    <Heart className="h-4 w-4 mx-auto mb-1 text-pink-500" />
                    <p className="text-sm font-bold">{formatNumber(businessInsights.bestPerformingPost.likes)}</p>
                    <p className="text-xs text-muted-foreground">Likes</p>
                  </div>

                  <div className="bg-secondary/50 rounded-md p-3 text-center">
                    <MessageCircle className="h-4 w-4 mx-auto mb-1 text-blue-500" />
                    <p className="text-sm font-bold">{formatNumber(businessInsights.bestPerformingPost.comments)}</p>
                    <p className="text-xs text-muted-foreground">Comments</p>
                  </div>

                  <div className="bg-secondary/50 rounded-md p-3 text-center">
                    <Zap className="h-4 w-4 mx-auto mb-1 text-amber-500" />
                    <p className="text-sm font-bold">
                      {(businessInsights.bestPerformingPost.engagement_rate * 100).toFixed(2)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Engagement</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Why this post performed well:</h4>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-start gap-2">
                      <div className="rounded-full h-1.5 w-1.5 bg-primary mt-1.5"></div>
                      <span>
                        {businessInsights.bestPerformingPost.post_type === "Video"
                          ? "Video content typically generates higher engagement than images"
                          : "High-quality visual content that resonates with the audience"}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full h-1.5 w-1.5 bg-primary mt-1.5"></div>
                      <span>
                        {businessInsights.bestPerformingPost.hashtags.length > 0
                          ? `Effective use of ${businessInsights.bestPerformingPost.hashtags.length} hashtags to increase reach`
                          : "Clear messaging without relying on hashtags"}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full h-1.5 w-1.5 bg-primary mt-1.5"></div>
                      <span>
                        {businessInsights.bestPerformingPost.mentions.length > 0
                          ? `Strategic mentions of ${businessInsights.bestPerformingPost.mentions.length} accounts to expand audience`
                          : "Focused content without diluting message with mentions"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Competitive Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Competitive Analysis Recommendations</CardTitle>
          <CardDescription>Strategic insights based on competitor performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-medium">Content Strategy</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {businessInsights.postTypeEngagement[0].engagement > businessInsights.postTypeEngagement[1].engagement
                    ? `This account sees higher engagement with ${businessInsights.postTypeEngagement[0].name}. Consider increasing your ${businessInsights.postTypeEngagement[0].name.toLowerCase()} content to compete effectively.`
                    : `This account sees higher engagement with ${businessInsights.postTypeEngagement[1].name}. Consider increasing your ${businessInsights.postTypeEngagement[1].name.toLowerCase()} content to compete effectively.`}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-medium">Posting Frequency</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This competitor posts approximately {businessInsights.postFrequency.toFixed(1)} times per day.
                  {businessInsights.postFrequency > 1
                    ? " Consider matching this frequency to maintain competitive visibility."
                    : " This is a moderate posting schedule that balances engagement without overwhelming followers."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-medium">Engagement Strategy</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  With an engagement rate of {(userData.engagement_rate * 100).toFixed(2)}%, this account
                  {userData.engagement_rate > 0.03
                    ? " is performing above industry average. Analyze their content style and community management approach."
                    : " is performing within industry norms. Look for opportunities to differentiate your content approach."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <PieChartIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-medium">Audience Insights</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  With {formatNumber(userData.followers)} followers, this account has
                  {userData.followers > 1000000
                    ? " significant market influence. Focus on quality over quantity to compete effectively."
                    : userData.followers > 100000
                      ? " a substantial audience. Identify niche segments where you can build stronger engagement."
                      : " a focused audience. Consider targeting similar demographics with more personalized content."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


"use client"
import {
  Mail,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  AtSign,
  TrendingUp,
  Users,
  Eye,
  ThumbsUp,
  MessageSquare,
  Share2,
  Award,
  Zap,
  BarChart3,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useSettingsStore } from "@/storage/settings-store"
import { useLinksStore } from "@/storage/links-store"
import { EditProfileModal } from "@/components/biolink/linktree/edit-profile-modal"
// import { useSettingsStore } from "@/storage/settings-store"
import { useSettingsHook } from "@/hooks/api/biolink/useSettings"
import { useState } from "react"


export default function ProfilePage() {
  // Fetch data from the same stores used in the mobile preview
  const { displayName, bio, profileImage, themeSettings } = useSettingsStore()
  const { socialLinks, regularLinks } = useLinksStore()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const {updateSettings} = useSettingsHook()

  // Helper function to render social icons
  const renderIcon = (name: string) => {
    switch (name) {
      case "Instagram":
        return <Instagram className="h-5 w-5" />
      case "Twitter":
        return <Twitter className="h-5 w-5" />
      case "Facebook":
        return <Facebook className="h-5 w-5" />
      case "LinkedIn":
        return <Linkedin className="h-5 w-5" />
      case "YouTube":
        return <Youtube className="h-5 w-5" />
      case "TikTok":
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
          </svg>
        )
      case "Email":
        return <Mail className="h-5 w-5" />
      case "Github":
        return <Github className="h-5 w-5" />
      default:
        return <AtSign className="h-5 w-5" />
    }
  }

  // Get background style based on theme settings
  const getBackgroundStyle = () => {
    if (themeSettings?.themeColor === "custom" && themeSettings?.customBackground) {
      if (themeSettings.backgroundType === "gradient") {
        return {
          background: `linear-gradient(135deg, ${themeSettings.customBackground}, ${themeSettings.customBackground})`,
        }
      }
      return { backgroundColor: themeSettings.customBackground }
    }

    // Default gradient if no theme is set
    return {
      background: "linear-gradient(135deg, #9333ea, #e11d48)",
    }
  }

  // Get text color based on theme settings
  const getTextColor = () => {
    if (themeSettings?.customTextColor) {
      return { color: themeSettings.customTextColor }
    }

    // Default text color
    return { color: "#ffffff" }
  }

  // Get font family based on theme settings
  const getFontFamily = () => {
    if (!themeSettings?.fontFamily || themeSettings.fontFamily === "default") {
      return {}
    }

    return {
      fontFamily: `"${themeSettings.fontFamily}", sans-serif`,
    }
  }

  // Dummy data for social media analytics
  const socialMediaStats = {
    totalFollowers: "1.2M",
    engagement: "4.8%",
    averageLikes: "45.3K",
    averageComments: "2.1K",
    growthRate: "+3.2%",
    platforms: [
      { name: "Instagram", followers: "650K", engagement: "5.2%", color: "#E1306C" },
      { name: "TikTok", followers: "420K", engagement: "6.8%", color: "#000000" },
      { name: "YouTube", followers: "130K", engagement: "3.5%", color: "#FF0000" },
    ],
    topPosts: [
      {
        platform: "Instagram",
        thumbnail: "/placeholder.svg?height=300&width=300&text=Post%201",
        title: "Summer Fashion Haul 2023",
        views: "1.2M",
        likes: "152K",
        comments: "4.3K",
      },
      {
        platform: "TikTok",
        thumbnail: "/placeholder.svg?height=300&width=300&text=Post%202",
        title: "Morning Routine Challenge",
        views: "3.5M",
        likes: "420K",
        comments: "12.8K",
      },
      {
        platform: "YouTube",
        thumbnail: "/placeholder.svg?height=300&width=300&text=Post%203",
        title: "Day In My Life: Fashion Week",
        views: "890K",
        likes: "76K",
        comments: "3.2K",
      },
      {
        platform: "Instagram",
        thumbnail: "/placeholder.svg?height=300&width=300&text=Post%204",
        title: "Travel Vlog: Bali Edition",
        views: "950K",
        likes: "105K",
        comments: "3.8K",
      },
    ],
    brandDeals: [
      {
        brand: "FashionNova",
        logo: "/placeholder.svg?height=60&width=60&text=FN",
        type: "Ongoing Partnership",
        description: "Monthly fashion hauls and dedicated posts",
      },
      {
        brand: "GlamBeauty",
        logo: "/placeholder.svg?height=60&width=60&text=GB",
        type: "Product Launch",
        description: "Limited edition makeup collection collaboration",
      },
      {
        brand: "FitLife",
        logo: "/placeholder.svg?height=60&width=60&text=FL",
        type: "Ambassador",
        description: "Fitness apparel and supplement promotion",
      },
    ],
    contentCategories: [
      { name: "Fashion", percentage: 45 },
      { name: "Lifestyle", percentage: 30 },
      { name: "Beauty", percentage: 15 },
      { name: "Travel", percentage: 10 },
    ],
  }

  // Get platform color
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "Instagram":
        return "bg-[#E1306C]"
      case "TikTok":
        return "bg-black"
      case "YouTube":
        return "bg-[#FF0000]"
      case "Twitter":
        return "bg-[#1DA1F2]"
      case "Facebook":
        return "bg-[#1877F2]"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  {profileImage ? (
                    <AvatarImage src={profileImage || "/placeholder.svg"} alt={displayName} />
                  ) : (
                    <AvatarFallback style={getTextColor()}>
                      {displayName
                        .split(" ")
                        .map((name) => name[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <EditProfileModal isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen} onSave={()=>{
                       updateSettings(useSettingsStore.getState())
                      }}  />
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">{displayName || "Your Name"}</h2>
                  <p className="text-muted-foreground">{bio || "Your bio..."}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 w-full">
                  <Button className="flex-1" onClick={() => setIsEditModalOpen(true)}>Edit Profile</Button>
                  <Button variant="outline" className="flex-1">
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audience Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>Total Followers</span>
                </div>
                <span className="font-bold">{socialMediaStats.totalFollowers}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  <span>Growth Rate</span>
                </div>
                <span className="font-bold text-emerald-500">{socialMediaStats.growthRate}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-muted-foreground" />
                  <span>Engagement Rate</span>
                </div>
                <span className="font-bold">{socialMediaStats.engagement}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Platforms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {socialLinks.length > 0 ? (
                socialLinks.map((social, index) => {
                  // Find matching platform in stats if available
                  const platformStats = socialMediaStats.platforms.find((p) => p.name === social.name)

                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-md ${getPlatformColor(social.name)}`}>
                          {renderIcon(social.name)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <a href={social.url || "#"} className="font-medium hover:underline">
                              {social.name}
                            </a>
                            {platformStats && (
                              <span className="text-sm text-muted-foreground">{platformStats.followers} followers</span>
                            )}
                          </div>
                          {platformStats && (
                            <div className="mt-1">
                              <div className="flex justify-between text-xs mb-1">
                                <span>Engagement</span>
                                <span>{platformStats.engagement}</span>
                              </div>
                              <Progress value={Number.parseFloat(platformStats.engagement)} max={10} className="h-1" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-muted-foreground">No social profiles added yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {socialMediaStats.contentCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span>{category.name}</span>
                    <span>{category.percentage}%</span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="about">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{bio || "Add your bio to tell people more about yourself..."}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Theme Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32 rounded-lg flex items-center justify-center mb-4" style={getBackgroundStyle()}>
                    <span className="text-lg font-bold" style={getTextColor()}>
                      {themeSettings?.themeColor || "Default"} Theme
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium mb-1">Theme Color</p>
                      <p className="text-muted-foreground">{themeSettings?.themeColor || "Default"}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Font</p>
                      <p className="text-muted-foreground" style={getFontFamily()}>
                        {themeSettings?.fontFamily || "Default"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Niche & Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Fashion</Badge>
                    <Badge variant="secondary">Beauty</Badge>
                    <Badge variant="secondary">Lifestyle</Badge>
                    <Badge variant="secondary">Travel</Badge>
                    <Badge variant="secondary">Fitness</Badge>
                    <Badge variant="secondary">Wellness</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Content</CardTitle>
                  <CardDescription>Your most viewed and engaged posts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {socialMediaStats.topPosts.map((post, index) => (
                      <Card key={index} className="overflow-hidden border-0 shadow-sm">
                        <div className="aspect-square bg-muted relative">
                          <img
                            src={post.thumbnail || "/placeholder.svg"}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                          <div
                            className={`absolute top-2 left-2 px-2 py-1 rounded text-xs text-white ${getPlatformColor(post.platform)}`}
                          >
                            {post.platform}
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium line-clamp-1">{post.title}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{post.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              <span>{post.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>{post.comments}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Audience Demographics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-3">Age Distribution</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>18-24</span>
                          <span>35%</span>
                        </div>
                        <Progress value={35} className="h-2" />

                        <div className="flex justify-between">
                          <span>25-34</span>
                          <span>42%</span>
                        </div>
                        <Progress value={42} className="h-2" />

                        <div className="flex justify-between">
                          <span>35-44</span>
                          <span>15%</span>
                        </div>
                        <Progress value={15} className="h-2" />

                        <div className="flex justify-between">
                          <span>45+</span>
                          <span>8%</span>
                        </div>
                        <Progress value={8} className="h-2" />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">Gender</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Female</span>
                          <span>68%</span>
                        </div>
                        <Progress value={68} className="h-2" />

                        <div className="flex justify-between">
                          <span>Male</span>
                          <span>30%</span>
                        </div>
                        <Progress value={30} className="h-2" />

                        <div className="flex justify-between">
                          <span>Other</span>
                          <span>2%</span>
                        </div>
                        <Progress value={2} className="h-2" />
                      </div>

                      <h3 className="font-medium mb-3 mt-6">Top Locations</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>United States</span>
                          <span>42%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>United Kingdom</span>
                          <span>18%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Canada</span>
                          <span>12%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Australia</span>
                          <span>8%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Growth Trends</CardTitle>
                  <CardDescription>Your audience growth over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Growth chart visualization would appear here</p>
                    <p className="text-sm">+32% followers in the last 6 months</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="partnerships" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Collaborations</CardTitle>
                  <CardDescription>Current and past brand partnerships</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {socialMediaStats.brandDeals.map((deal, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                        <img
                          src={deal.logo || "/placeholder.svg"}
                          alt={deal.brand}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{deal.brand}</h3>
                            <p className="text-sm text-muted-foreground">{deal.type}</p>
                          </div>
                          <Badge variant="outline">Active</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{deal.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Partnerships
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Campaigns</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Summer Collection Launch</h3>
                        <p className="text-sm text-muted-foreground">FashionNova</p>
                      </div>
                      <Badge>June 15</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Exclusive preview of the summer collection with dedicated posts and stories.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Beauty Box Unboxing</h3>
                        <p className="text-sm text-muted-foreground">GlamBeauty</p>
                      </div>
                      <Badge>June 22</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Live unboxing of the limited edition summer beauty box with exclusive discount code.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Creator Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
                      <Award className="h-8 w-8 mb-2 text-amber-500" />
                      <h3 className="font-medium">Top Fashion Creator</h3>
                      <p className="text-xs text-muted-foreground">Instagram 2023</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
                      <Users className="h-8 w-8 mb-2 text-emerald-500" />
                      <h3 className="font-medium">1M Followers</h3>
                      <p className="text-xs text-muted-foreground">Milestone Reached</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
                      <Share2 className="h-8 w-8 mb-2 text-purple-500" />
                      <h3 className="font-medium">Viral Creator</h3>
                      <p className="text-xs text-muted-foreground">TikTok 2023</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

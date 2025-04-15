/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { Calendar, ImageIcon, Instagram, LogIn, MessageCircle, Video, X } from 'lucide-react'
import { format } from "date-fns"
import { useS3Upload } from "@/hooks/api/storage/useS3Uploads"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import axios from "axios"
import { useAuthStore } from "@/storage/auth"

export default function InstagramScheduler() {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [businessAccountId, setBusinessAccountId] = useState<string | null>(null)
  const [businessAccountName, setBusinessAccountName] = useState<string | null>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState<string>("12:00")
  const [caption, setCaption] = useState<string>("")
  const [selectedTab, setSelectedTab] = useState<string>("post")
  const [isAdvancedOptions, setIsAdvancedOptions] = useState<boolean>(false)
  const [mediaUrl, setMediaUrl] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { uploadToS3, uploading, progress } = useS3Upload()
  const userId = useAuthStore(s=>s.userId)

  useEffect(() => {
    const storedId = localStorage.getItem("ig_business_id")
    const storedName = localStorage.getItem("ig_business_name")
    const storedToken = localStorage.getItem("ig_access_token")
    if (storedId && storedToken) {
      setBusinessAccountId(storedId)
      setBusinessAccountName(storedName)
      setAccessToken(storedToken)
    }

    const hash = window.location.hash
    if (hash.includes("access_token")) {
      const params = new URLSearchParams(hash.substring(1))
      const token = params.get("access_token")
      setAccessToken(token)

      if (token) {
        setIsLoading(true)
        fetch(
          `https://graph.facebook.com/v22.0/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${token}`,
        )
          .then((res) => res.json())
          .then(async (data) => {
            const params = {
              grant_type: 'fb_exchange_token',
              client_id: '1865655630505019',
              client_secret: 'd51aae6479789da2623a86a1cf31c627',
              fb_exchange_token: token
            }
            try {
              const long_token_req = await axios.get('https://graph.facebook.com/v19.0/oauth/access_token', { params })
              const long_token = long_token_req.data.access_token

              if (data.data && data.data.length > 0 && data.data[0].instagram_business_account) {
                const igBusinessId = data.data[0].instagram_business_account.id
                const pageName = data.data[0].name

                localStorage.setItem("ig_page_access", long_token)
                localStorage.setItem("ig_business_id", igBusinessId)
                localStorage.setItem("ig_business_name", pageName)
                localStorage.setItem("ig_access_token", token)

                setBusinessAccountId(igBusinessId)
                setBusinessAccountName(pageName)
                window.history.replaceState({}, document.title, window.location.pathname)
                toast.success("Successfully connected to Instagram", {
                  description: `Connected to ${pageName}`,
                  icon: <Instagram className="h-5 w-5 text-pink-500" />
                })
              }
            } catch (err) {
              toast.error("Authentication failed", {
                description: "Could not connect to Instagram. Please try again.",
              })
              console.error("API Error:", err)
            } finally {
              setIsLoading(false)
            }
          })
          .catch((err) => {
            console.error("API Error:", err)
            toast.error("Authentication failed", {
              description: "Could not connect to Instagram. Please try again.",
            })
            setIsLoading(false)
          })
      }
    }
  }, [])

  const authUrl = `https://www.facebook.com/dialog/oauth?client_id=1865655630505019&display=page&extras=${encodeURIComponent(
    JSON.stringify({ setup: { channel: "IG_API_ONBOARDING" } }),
  )}&redirect_uri=${encodeURIComponent("https://inflow.chat/scheduling/instagram")}&response_type=token&scope=instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,pages_show_list,pages_read_engagement`

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      toast.error("File too large", {
        description: "Maximum file size is 50MB",
      })
      return
    }

    try {
      const result = await uploadToS3(file)
      if (result.success && result.url) {
        setMediaUrl(result.url)
        setMediaType(file.type.startsWith("video") ? "video" : "image")
        toast.success("Upload complete", {
          description: file.name,
        })
      } else {
        toast.error("Upload failed", {
          description: result.error || "Please try again",
        })
      }
    } catch (error) {
      toast.error("Upload failed", {
        description: "An unexpected error occurred",
      })
      console.error("Upload error:", error)
    }
  }

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab)
    setMediaUrl(null)
    setMediaType(null)
  }

  const handleSchedule = async () => {
    if (!mediaUrl) {
      toast.error("Media required", {
        description: "Please upload media first",
      })
      return
    }
    
    const token = localStorage.getItem("ig_page_access")
    setIsLoading(true)

    try {
      const [hours, minutes] = time.split(":")
      const scheduledDate = new Date(date || new Date())
      scheduledDate.setHours(Number(hours), Number(minutes), 0, 0)
      const unixTime = Math.floor(scheduledDate.getTime() / 1000)

      const payload: any = {
        ig_user_id: businessAccountId,
        access_token: token,
        caption,
        type: selectedTab,
        user_id:userId
      }

      if (mediaType === "video") payload.video_url = mediaUrl
      else payload.image_url = mediaUrl

      if (selectedTab !== "story") {
        payload.scheduled_publish_time = unixTime
      }

      await axios.post("https://api.inflow.chat/api/scheduling/instagram/schedule/post", payload)
      
      toast.success(`${selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} scheduled`, {
        description: `Scheduled for ${format(scheduledDate, "PPP 'at' p")}`,
        icon: selectedTab === "post" ? <ImageIcon className="h-5 w-5" /> : 
              selectedTab === "reel" ? <Video className="h-5 w-5" /> : 
              <MessageCircle className="h-5 w-5" />
      })
      
      setCaption("")
      setMediaUrl(null)
    } catch (err: any) {
      console.error("Error:", err.response?.data || err.message)
      toast.error("Scheduling failed", {
        description: err.response?.data?.message || "Please try again later",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("ig_business_id")
    localStorage.removeItem("ig_business_name")
    localStorage.removeItem("ig_access_token")
    localStorage.removeItem("ig_page_access")
    setBusinessAccountId(null)
    setBusinessAccountName(null)
    setAccessToken(null)
    toast.info("Disconnected from Instagram")
  }

  if (!accessToken || !businessAccountId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 bg-gradient-to-b from-[#f9f9f9] to-[#f3f3f3] dark:from-gray-900 dark:to-gray-950">
        <Card className="w-full max-w-md backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-800/50 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Instagram Scheduler</CardTitle>
            <CardDescription>
              Connect your Instagram Business account to schedule posts, reels, and stories
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-gradient-to-br from-pink-500/10 to-purple-600/10">
                <Instagram className="h-16 w-16 text-pink-500" />
              </div>
            </div>
            {isLoading && (
              <div className="space-y-2">
                <p className="text-sm text-center text-muted-foreground">Connecting to Instagram...</p>
                <Progress value={80} className="h-1" />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-md transition-all duration-300 hover:shadow-lg disabled:opacity-70"
              size="lg"
              onClick={() => (window.location.href = authUrl)}
              disabled={isLoading}
            >
              <LogIn className="h-4 w-4 mr-2" />
              Connect with Instagram
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Instagram Scheduler</h1>
          <p className="text-muted-foreground flex items-center gap-1.5">
            <Instagram className="h-4 w-4 text-pink-500" />
            Connected to: <span className="font-medium">{businessAccountName}</span>
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="border-gray-200 hover:bg-gray-100/50 dark:border-gray-800 dark:hover:bg-gray-800/50"
        >
          <X className="h-4 w-4 mr-2" />
          Disconnect
        </Button>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-3">
          <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-800/50 shadow-md">
            <CardHeader>
              <CardTitle>Schedule Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="post" className="w-full" onValueChange={handleTabChange}>
                <TabsList className="grid grid-cols-3 mb-6 bg-gray-100/80 dark:bg-gray-800/80">
                  <TabsTrigger value="post" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
                    <ImageIcon className="h-4 w-4 mr-1" />Post
                  </TabsTrigger>
                  <TabsTrigger value="reel" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
                    <Video className="h-4 w-4 mr-1" />Reel
                  </TabsTrigger>
                  <TabsTrigger value="story" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
                    <MessageCircle className="h-4 w-4 mr-1" />Story
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="post" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Upload Media</Label>
                    <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer relative">
                      {mediaUrl ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-green-500" />
                          </div>
                          <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                            {mediaUrl.split('/').pop()}
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setMediaUrl(null)}
                            className="mt-2"
                          >
                            Change
                          </Button>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="h-8 w-8 mx-auto text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Drag and drop an image, or click to browse
                          </p>
                          <Input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileUpload} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                          />
                        </>
                      )}
                    </div>
                    {uploading && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>Uploading...</span>
                          <span>{progress || 0}%</span>
                        </div>
                        <Progress value={progress || 0} className="h-1" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Caption</Label>
                    <Textarea 
                      value={caption} 
                      onChange={(e) => setCaption(e.target.value)} 
                      placeholder="Write your caption..." 
                      className="min-h-[120px] resize-y bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm"
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {caption.length}/2200 characters
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="reel" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Upload Reel (Video)</Label>
                    <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer relative">
                      {mediaUrl ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center">
                            <Video className="h-8 w-8 text-green-500" />
                          </div>
                          <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                            {mediaUrl.split('/').pop()}
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setMediaUrl(null)}
                            className="mt-2"
                          >
                            Change
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Video className="h-8 w-8 mx-auto text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Drag and drop a video, or click to browse
                          </p>
                          <Input 
                            type="file" 
                            accept="video/*" 
                            onChange={handleFileUpload} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                          />
                        </>
                      )}
                    </div>
                    {uploading && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>Uploading...</span>
                          <span>{progress || 0}%</span>
                        </div>
                        <Progress value={progress || 0} className="h-1" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Caption</Label>
                    <Textarea 
                      value={caption} 
                      onChange={(e) => setCaption(e.target.value)} 
                      placeholder="Write your caption..." 
                      className="min-h-[120px] resize-y bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm"
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {caption.length}/2200 characters
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="story" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Upload Story</Label>
                    <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer relative">
                      {mediaUrl ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center">
                            {mediaType === "video" ? (
                              <Video className="h-8 w-8 text-green-500" />
                            ) : (
                              <ImageIcon className="h-8 w-8 text-green-500" />
                            )}
                          </div>
                          <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                            {mediaUrl.split('/').pop()}
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setMediaUrl(null)}
                            className="mt-2"
                          >
                            Change
                          </Button>
                        </div>
                      ) : (
                        <>
                          <MessageCircle className="h-8 w-8 mx-auto text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Drag and drop an image or video, or click to browse
                          </p>
                          <Input 
                            type="file" 
                            accept="image/*,video/*" 
                            onChange={handleFileUpload} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                          />
                        </>
                      )}
                    </div>
                    {uploading && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>Uploading...</span>
                          <span>{progress || 0}%</span>
                        </div>
                        <Progress value={progress || 0} className="h-1" />
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-800/50 shadow-md">
            <CardHeader>
              <CardTitle>Schedule Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left font-normal bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-medium">Time</Label>
                <Input 
                  id="time" 
                  type="time" 
                  value={time} 
                  onChange={(e) => setTime(e.target.value)} 
                  className="bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm"
                />
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="advanced-options" className="text-sm font-medium">Advanced Options</Label>
                  <Switch 
                    id="advanced-options" 
                    checked={isAdvancedOptions} 
                    onCheckedChange={setIsAdvancedOptions} 
                  />
                </div>
              </div>

              {isAdvancedOptions && (
                <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Location</Label>
                    <Input 
                      placeholder="Add a location" 
                      className="bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Hashtags</Label>
                    <Input 
                      placeholder="Add hashtags" 
                      className="bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm"
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-md transition-all duration-300 hover:shadow-lg disabled:opacity-70"
                onClick={handleSchedule}
                disabled={!mediaUrl || uploading || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

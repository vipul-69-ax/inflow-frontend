/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CalendarIcon, Facebook, Plus, Trash2, VideoIcon, ImageIcon, AlertCircle, FacebookIcon, ChevronLeft, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { useFacebookPages, useFacebookScheduler } from "@/hooks/scheduling/useFacebookScheduler"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { FacebookPageData } from "@/types/instagram"
import CreateFacebookPostModal from "@/components/scheduling/fb/CreatePostModal"
import EmptyState from "@/components/scheduling/fb/EmptyState"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"
import { useSettingsStore } from "@/storage/settings-store"


export default function ScheduleFB() {
  // Facebook hooks
  const {
    schedulePost,
    scheduleReel,
    postStory,
    post,
    reel,
    story,
    getScheduledJobs,
    cancelScheduledJob,
    scheduledJobs,
  } = useFacebookScheduler()
  // State for Facebook data
  const [facebookPageData, setFacebookPageData] = useState<FacebookPageData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // UI state
  const [tabValue, setTabValue] = useState("all")
  const [openPostModal, setOpenPostModal] = useState(false)
  const [postType, setPostType] = useState<"post" | "reel" | "story">("post")
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [selectedPage, setSelectedPage] = useState<string | null>(null)
  const [showPageSelectionModal, setShowPageSelectionModal] = useState(false)
  const [facebookPages, setFacebookPages] = useState<any[]>([])
  const [jobsScheduled, setJobsScheduled] = useState([])
  
  const { getFacebookPages } = useFacebookPages()
  

  const fetchFacebookPages = async () => {
    const token = localStorage.getItem("fb_access_token")
    if (token) {
      const { data } = await getFacebookPages(token)
      setFacebookPages(data || [])

      // Show the modal when pages are fetched
    }
  }

  const handleConfirmPageSelection = () => {
    if (selectedPage) {
      // Find the selected page data
      const selectedPageData = facebookPages.find((page) => page.id === selectedPage)

      // Store the selected page data in localStorage
      if (selectedPageData) {
        localStorage.setItem("fb_page_data", JSON.stringify(selectedPageData))
        window.location.reload() // Reload the page to apply changes
        // Navigate to the scheduling page
      }
    }

    setShowPageSelectionModal(false)
  }

  useEffect(()=>{
    fetchFacebookPages()
  },[])

  // Load Facebook page data from localStorage
  useEffect(() => {
    const fbAccessToken = localStorage.getItem("fb_access_token")
    const fbPageDataStr = localStorage.getItem("fb_page_data")
    console.log(fbAccessToken, fbPageDataStr)
    if (fbAccessToken && fbPageDataStr) {
      try {
        const pageData = JSON.parse(fbPageDataStr)
        setFacebookPageData(pageData)
      } catch (error) {
        console.error("Error parsing Facebook page data:", error)
        setError("Error loading Facebook page data")
      }
    } else {
      setError("Facebook not connected. Please connect your Facebook account first.")
    }
  }, [])

  // Fetch posts and reels when page data is available
  useEffect(() => {
    const fetchFacebookContent = async () => {
      if (!facebookPageData) return

      setLoading(true)
      setError(null)

      try {
        // Fetch scheduled jobs
        const jobs = await getScheduledJobs()
        setJobsScheduled(jobs.jobs.length)
      } catch (err) {
        console.error("Error fetching Facebook content:", err)
        setError("Failed to load Facebook content")
      } finally {
        setLoading(false)
      }
    }

    fetchFacebookContent()
  }, [facebookPageData, getScheduledJobs, refreshTrigger])

  // Monitor Facebook post scheduling states
  useEffect(() => {
    if (post.data && !post.loading) {
      toast("Post scheduled successfully!")
      setOpenPostModal(false)
      setRefreshTrigger((prev) => prev + 1) // Trigger refresh
    } else if (post.error) {
      toast("Error")
    }
  }, [post, toast])

  useEffect(() => {
    if (reel.data && !reel.loading) {
      toast("Reel scheduled")
      setOpenPostModal(false)
      setRefreshTrigger((prev) => prev + 1) // Trigger refresh
    } else if (reel.error) {
      toast("Error")
    }
  }, [reel, toast])

  useEffect(() => {
    if (story.data && !story.loading) {
      toast("Story posted!")
      setOpenPostModal(false)
      setRefreshTrigger((prev) => prev + 1) // Trigger refresh
    } else if (story.error) {
      toast("Error")
    }
  }, [story, toast])

  const is_paid = useSettingsStore().is_paid

  const handleCreateNewPost = (type: "post" | "reel" | "story") => {
    if(!is_paid && jobsScheduled && jobsScheduled.length>=2){
      toast("You can schedule only 2 jobs at atime")
      return
    }
    console.log("This is my user id ", localStorage.getItem("ig_user_id"))
    setPostType(type)
    setOpenPostModal(true)
  }


  const handleCancelScheduledJob = async (jobId: string) => {
    if (window.confirm("Are you sure you want to cancel this scheduled job?")) {
      try {
        await cancelScheduledJob(jobId)
        toast("Post deleted")
        setRefreshTrigger((prev) => prev + 1) // Trigger refresh
      } catch (error) {
        console.error("Error cancelling job:", error)
        toast("Error")
      }
    }
  }

  const handleScheduleFacebookContent = (data: {
    message: string
    scheduledTime?: string
    media?: File
    description?: string
    type: "post" | "reel" | "story"
  }) => {
    if (!facebookPageData) {
        toast("Error")
      return
    }

    const { id: pageId, access_token: pageAccessToken } = facebookPageData

    switch (data.type) {
      case "post":
        console.log(pageAccessToken, pageId)
        schedulePost(pageAccessToken, pageId, data.message, data.scheduledTime, data.media)
        break
      case "reel":
        if (!data.media) {
          toast("Video is required")
          return
        }
        scheduleReel(pageAccessToken, pageId, data.message || data.description || "", data.media, data.scheduledTime)
        break
      case "story":
        if (!data.media) {
          toast("Video is required")
          return
        }
        postStory(pageAccessToken, pageId, data.media, data.scheduledTime)
        break
    }
  }

  // Filter posts based on tab
  const getFilteredPosts = () => {
    // Get scheduled jobs from the state
    const scheduledJobsData = scheduledJobs?.data?.jobs || []

    switch (tabValue) {
      case "all": // All scheduled content
        return scheduledJobsData
      case "posts": // Posts only
        return scheduledJobsData.filter((job: any) => job.type === "post")
      case "reels": // Reels only
        return scheduledJobsData.filter((job: any) => job.type === "reel")
      default:
        return []
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center my-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      )
    }

    if (error) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )
    }

    const filteredContent = getFilteredPosts()

    if (filteredContent.length === 0) {
      return (
        <EmptyState
          icon={<CalendarIcon className="h-12 w-12 text-primary" />}
          title="No scheduled content found"
          description="Schedule Facebook content to see it here."
          actionButton={
            <Button onClick={() => handleCreateNewPost("post")}>
              <Plus className="mr-2 h-4 w-4" /> Schedule Content
            </Button>
          }
        />
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((job: any) => (
          <motion.div
            key={job.job_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Facebook className="h-4 w-4 text-[#1877F2] mr-2" />
                    <span className="text-sm font-medium">
                      {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
                    </span>
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {new Date(job.next_run).toLocaleString()}
                  </div>
                </div>
                <p className="line-clamp-3 text-slate-600 dark:text-slate-300 text-sm mb-2">
                  {job.details?.message || job.details?.description || "No caption"}
                </p>
                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  <p>Time remaining: {job.time_remaining.formatted}</p>
                  <p>Has media: {job.has_media ? "Yes" : "No"}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleCancelScheduledJob(job.job_id)}
                  className="h-8 rounded-md"
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Cancel
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    )
  }
  const navigate = useNavigate()
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex"><ChevronLeft
            className="h-6 w-6 mr-2 mt-1" 
            onClick={() => navigate("/scheduling")}
          /> Facebook Scheduler</h1>
          <div className="flex items-center space-x-2">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-1 flex">
              <Button
                variant={"secondary"}
                size="icon"
                className="h-8 w-8 rounded-md"
                onClick={() => {
                  localStorage.removeItem("fb_access_token")
                  localStorage.removeItem("fb_page_data")
                  navigate("/scheduling")
                }}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-1 flex">
              <Button
                variant={"secondary"}
                size="icon"
                className="h-8 w-8 rounded-md"
                onClick={() => setShowPageSelectionModal(true)}
              >
                <FacebookIcon className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              onClick={() => handleCreateNewPost("post")} 
              disabled={!facebookPageData}
            >
              <Plus className="mr-2 h-4 w-4" /> New Post
            </Button>
          </div>
        </div>

        {facebookPageData && (
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <Facebook className="h-5 w-5 text-[#1877F2] mr-2" />
              <h2 className="text-lg font-medium">{facebookPageData.name}</h2>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Connected Facebook Page
            </p>
            <div className="h-px bg-slate-200 dark:bg-slate-800 my-4" />
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => handleCreateNewPost("post")}>
                <Facebook className="mr-2 h-4 w-4" /> Create Post
              </Button>
              <Button variant="outline" onClick={() => handleCreateNewPost("reel")}>
                <VideoIcon className="mr-2 h-4 w-4" /> Create Reel
              </Button>
              <Button variant="outline" onClick={() => handleCreateNewPost("story")}>
                <ImageIcon className="mr-2 h-4 w-4" /> Create Story
              </Button>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <Tabs defaultValue="all" value={tabValue} onValueChange={setTabValue}>
            <div className="border-b border-slate-200 dark:border-slate-800 px-4">
              <TabsList className="h-12">
                <TabsTrigger value="all" className="data-[state=active]:bg-transparent">All Content</TabsTrigger>
                <TabsTrigger value="posts" className="data-[state=active]:bg-transparent">Posts</TabsTrigger>
                <TabsTrigger value="reels" className="data-[state=active]:bg-transparent">Reels</TabsTrigger>
              </TabsList>
            </div>
            <div className="p-6">
              <TabsContent value="all" className="mt-0 p-0">
                {renderContent()}
              </TabsContent>
              <TabsContent value="posts" className="mt-0 p-0">
                {renderContent()}
              </TabsContent>
              <TabsContent value="reels" className="mt-0 p-0">
                {renderContent()}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Facebook Post Creation Modal */}
      <CreateFacebookPostModal
        open={openPostModal}
        onClose={() => setOpenPostModal(false)}
        onSubmit={handleScheduleFacebookContent}
        type={postType}
        loading={post.loading || reel.loading || story.loading}
      />

<Dialog open={showPageSelectionModal} onOpenChange={setShowPageSelectionModal}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center">
              <Facebook className="h-5 w-5 text-[#1877F2] mr-2" />
              Select a Facebook Page
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Choose the Facebook page you want to manage and schedule content for:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {facebookPages.map((page) => (
                <Card
                  key={page.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    selectedPage === page.id
                      ? "border-2 border-primary"
                      : "border border-slate-200 dark:border-slate-800",
                  )}
                  onClick={() => setSelectedPage(page.id)}
                >
                  {page.picture && (
                    <div className="w-full h-[140px] overflow-hidden">
                      <img
                        src={page.picture.data.url || "/placeholder.svg"}
                        alt={page.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium truncate">{page.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Category: {page.category || "Not specified"}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button size="sm" variant={selectedPage === page.id ? "default" : "outline"} className="w-full">
                      {selectedPage === page.id ? "Selected" : "Select"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPageSelectionModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmPageSelection} disabled={!selectedPage}>
              Continue with Selected Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

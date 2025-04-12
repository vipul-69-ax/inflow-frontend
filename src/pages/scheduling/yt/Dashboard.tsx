/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from "react"
import { useYouTubeScheduler } from "@/hooks/scheduling/useYoutubeScheduler"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { useAuthStore } from "@/storage/auth"
import { useS3Upload } from "@/hooks/api/storage/useS3Uploads"

export default function YouTubeScheduler() {
  const [searchParams] = useSearchParams()
  const videoInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authInProgress, setAuthInProgress] = useState(false)

  // Active section state
  const [activeSection, setActiveSection] = useState<"video" | "live" | "scheduled">("video")

  // Video upload state
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoTitle, setVideoTitle] = useState("")
  const [videoDescription, setVideoDescription] = useState("")
  const [videoTags, setVideoTags] = useState("")
  const [videoScheduledTime, setVideoScheduledTime] = useState("")
  const [videoPreview, setVideoPreview] = useState<string | null>(null)

  // Live stream state
  const [liveTitle, setLiveTitle] = useState("")
  const [liveDescription, setLiveDescription] = useState("")
  const [liveStartTime, setLiveStartTime] = useState("")
  const [liveEndTime, setLiveEndTime] = useState("")

  const {userId} = useAuthStore()
  // Scheduled media state
  const [scheduledMedia, setScheduledMedia] = useState<any[]>([])
  const [streamDetails, setStreamDetails] = useState<any>(null)
    const { uploadToS3, uploading } = useS3Upload()


  // Notification state
  const [notification, setNotification] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  // Use the YouTube scheduler hook
  const { loading, setOAuthToken, scheduleVideo, scheduleLive, fetchScheduledMedia } = useYouTubeScheduler()

  // OAuth configuration
  const oauthUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?client_id=473227188517-n690ie9aq3q0n1d6usmnel4mldn0amqb.apps.googleusercontent.com&redirect_uri=https://inflow.chat/scheduling/youtube&response_type=code&scope=https://www.googleapis.com/auth/youtube&access_type=offline&prompt=consent"

  // Check for auth token and handle OAuth code on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("yt_auth_token")

    if (storedToken) {
      setIsAuthenticated(true)
      loadScheduledMedia()
    } else {
      // Check if we have a code from OAuth redirect
      const code = searchParams.get("code")

      if (code) {
        handleOAuthCode(code)
      }
    }
  }, [searchParams])

  // Handle OAuth code exchange
  const handleOAuthCode = async (code: string) => {
    setAuthInProgress(true)

    try {
      const response = await setOAuthToken(code)

      if (response?.success && response.tokens) {
        localStorage.setItem("yt_auth_token", JSON.stringify(response.tokens))
        setIsAuthenticated(true)
        showNotification("success", "Successfully authenticated with YouTube")

        // Remove code from URL
        window.history.replaceState({}, document.title, window.location.pathname)

        // Load scheduled media
        loadScheduledMedia()
      } else {
        throw new Error("Authentication failed")
      }
    } catch (err) {
      showNotification("error", "Authentication failed. Please try again.")
    } finally {
      setAuthInProgress(false)
    }
  }

  // Load scheduled media
  const loadScheduledMedia = async () => {
    try {
      const response = await fetchScheduledMedia()

      if (response?.success && response.media) {
        setScheduledMedia(response.media)
      } else {
        showNotification("error", "Failed to load scheduled media")
      }
    } catch (err) {
      showNotification("error", "Failed to load scheduled media")
    }
  }

  // Handle video file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setVideoFile(file)

      // Create video preview
      const objectUrl = URL.createObjectURL(file)
      setVideoPreview(objectUrl)

      // Auto-fill title from filename
      if (!videoTitle) {
        const fileName = file.name.replace(/\.[^/.]+$/, "") // Remove extension
        setVideoTitle(fileName.replace(/-|_/g, " ")) // Replace dashes and underscores with spaces
      }
    }
  }

  // Handle video scheduling
  const handleScheduleVideo = async (e: FormEvent) => {
    e.preventDefault()

    if (!videoFile) {
      showNotification("error", "Please select a video file")
      return
    }

    if (!videoTitle.trim()) {
      showNotification("error", "Please enter a video title")
      return
    }

      const result = await uploadToS3(videoFile)
      if(!result.success || !result.url){
        showNotification("error", result.error || "")
        return
      }
    try {
      const formData = new FormData()
      formData.append("video", result.url)
      formData.append("title", videoTitle)
      formData.append("description", videoDescription)
      formData.append("tags", videoTags)
      formData.append("user_id", userId || "")
      console.log(userId,"jwowdo")

      if (videoScheduledTime) {
        formData.append("scheduledTime", new Date(videoScheduledTime).toISOString())
      }

      const response = await scheduleVideo(formData)

      if (response?.success) {
        showNotification("success", `Video "${videoTitle}" scheduled successfully!`)
        resetVideoForm()
        loadScheduledMedia()
      } else {
        throw new Error(response?.error || "Failed to schedule video")
      }
    } catch (err: any) {
      showNotification("error", err.message || "Failed to schedule video")
    }
  }

  // Handle live stream scheduling
  const handleScheduleLive = async (e: FormEvent) => {
    e.preventDefault()

    if (!liveTitle.trim()) {
      showNotification("error", "Please enter a live stream title")
      return
    }

    if (!liveStartTime) {
      showNotification("error", "Please select a start time")
      return
    }

    if (!liveEndTime) {
      showNotification("error", "Please select an end time")
      return
    }

    try {
      const startDate = new Date(liveStartTime)
      const endDate = new Date(liveEndTime)

      if (endDate <= startDate) {
        showNotification("error", "End time must be after start time")
        return
      }

      const payload = {
        title: liveTitle,
        description: liveDescription,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        userId:userId||""
      }
      
      const response = await scheduleLive(payload)

      if (response?.success) {
        showNotification("success", `Live stream "${liveTitle}" scheduled successfully!`)
        setStreamDetails(response)
        resetLiveForm()
        loadScheduledMedia()
      } else {
        throw new Error(response?.error || "Failed to schedule live stream")
      }
    } catch (err: any) {
      showNotification("error", err.message || "Failed to schedule live stream")
    }
  }

  // Reset video form
  const resetVideoForm = () => {
    setVideoFile(null)
    setVideoTitle("")
    setVideoDescription("")
    setVideoTags("")
    setVideoScheduledTime("")
    setVideoPreview(null)

    // Reset file input
    if (videoInputRef.current) {
      videoInputRef.current.value = ""
    }
  }

  // Reset live form
  const resetLiveForm = () => {
    setLiveTitle("")
    setLiveDescription("")
    setLiveStartTime("")
    setLiveEndTime("")
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("yt_auth_token")
    setIsAuthenticated(false)
    setScheduledMedia([])
  }

  // Show notification
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })

    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString()
    } catch (e) {
      return dateString
    }
  }

  // If not authenticated, redirect to OAuth
  const handleAuth = () => {
    window.location.href = oauthUrl
  }

  // Render authentication screen
  if (!isAuthenticated && !authInProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-white/70 shadow-xl border border-white/20">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </div>
            <h1 className="text-2xl font-medium text-gray-800">
            <ChevronLeft className="h-5 w-5"/>
              
              YouTube Content Scheduler</h1>
            <p className="text-gray-500 mt-2 text-center">Schedule and manage your YouTube videos and live streams</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white/50 p-4 rounded-xl border border-gray-100">
              <h2 className="font-medium text-gray-700 mb-2">Authentication Required</h2>
              <p className="text-sm text-gray-600 mb-4">
                You need to authenticate with your YouTube account to use this application.
              </p>
              <button
                onClick={handleAuth}
                className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
                Sign in with YouTube
              </button>
            </div>

            <div className="text-xs text-gray-500 text-center">
              This application requires access to your YouTube account to schedule content.
              <br />
              Your credentials are securely stored in your browser.
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render loading screen during authentication
  if (authInProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-white/70 shadow-xl border border-white/20 flex flex-col items-center">
          <div className="w-16 h-16 mb-4 relative">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-red-600 border-t-transparent animate-spin"></div>
          </div>
          <h1 className="text-xl font-medium text-gray-800">Authenticating...</h1>
          <p className="text-gray-500 mt-2">Please wait while we complete the authentication process.</p>
        </div>
      </div>
    )
  }

  // Main application UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center">
        <ChevronLeft className="h-8 w-8 mr-2" onClick={()=>{
          navigate("/scheduling")
        }}/>

          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
          </div>
          <h1 className="text-2xl font-medium text-gray-800">
            
            YouTube Content Scheduler</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => loadScheduledMedia()}
            className="py-2 px-4 bg-white/70 hover:bg-white/90 text-gray-700 font-medium rounded-lg backdrop-blur-md border border-white/20 shadow-sm transition duration-200 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>

          <button
            onClick={handleLogout}
            className="py-2 px-4 bg-white/70 hover:bg-white/90 text-gray-700 font-medium rounded-lg backdrop-blur-md border border-white/20 shadow-sm transition duration-200"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div
          className={`max-w-6xl mx-auto mb-6 p-4 rounded-xl backdrop-blur-md border shadow-sm transition-all ${
            notification.type === "success"
              ? "bg-green-50/70 border-green-100 text-green-800"
              : "bg-red-50/70 border-red-100 text-red-800"
          }`}
        >
          <div className="flex items-center">
            {notification.type === "success" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {notification.message}
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/90 p-6 rounded-2xl shadow-xl border border-white/20 flex flex-col items-center">
            <div className="w-12 h-12 mb-4 relative">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-red-600 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-800 font-medium">Processing...</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex overflow-x-auto p-1 bg-white/50 backdrop-blur-md rounded-xl border border-white/20 shadow-sm">
          <button
            onClick={() => setActiveSection("video")}
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all ${
              activeSection === "video" ? "bg-white text-gray-800 shadow-sm" : "text-gray-600 hover:bg-white/50"
            }`}
          >
            Schedule Video
          </button>
          <button
            onClick={() => setActiveSection("live")}
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all ${
              activeSection === "live" ? "bg-white text-gray-800 shadow-sm" : "text-gray-600 hover:bg-white/50"
            }`}
          >
            Schedule Live Stream
          </button>
          <button
            onClick={() => setActiveSection("scheduled")}
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all ${
              activeSection === "scheduled" ? "bg-white text-gray-800 shadow-sm" : "text-gray-600 hover:bg-white/50"
            }`}
          >
            Scheduled Content
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {/* Video Upload Section */}
        {activeSection === "video" && (
          <div className="backdrop-blur-xl bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6 md:p-8">
            <h2 className="text-xl font-medium text-gray-800 mb-6">Schedule a Video</h2>

            <form onSubmit={handleScheduleVideo} className="space-y-6">
              {/* Video Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Video File</label>
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center ${
                    videoPreview ? "border-gray-200" : "border-gray-300 hover:border-gray-400"
                  } transition-colors`}
                >
                  {videoPreview ? (
                    <div className="space-y-4">
                      <video src={videoPreview} controls className="max-h-64 mx-auto rounded-lg shadow-sm" />
                      <div className="flex justify-center gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            if (videoInputRef.current) {
                              videoInputRef.current.click()
                            }
                          }}
                          className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                        >
                          Change Video
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setVideoFile(null)
                            setVideoPreview(null)
                            if (videoInputRef.current) {
                              videoInputRef.current.value = ""
                            }
                          }}
                          className="py-2 px-4 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        if (videoInputRef.current) {
                          videoInputRef.current.click()
                        }
                      }}
                      className="cursor-pointer py-8"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-gray-400 mx-auto mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-gray-500">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-400 mt-1">MP4, MOV, or AVI (max 2GB)</p>
                    </div>
                  )}
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Video Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="videoTitle" className="block text-sm font-medium text-gray-700">
                    Title *
                  </label>
                  <input
                    id="videoTitle"
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Enter video title"
                    className="w-full px-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="videoTags" className="block text-sm font-medium text-gray-700">
                    Tags (comma separated)
                  </label>
                  <input
                    id="videoTags"
                    type="text"
                    value={videoTags}
                    onChange={(e) => setVideoTags(e.target.value)}
                    placeholder="tag1, tag2, tag3"
                    className="w-full px-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="videoDescription" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="videoDescription"
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  placeholder="Enter video description"
                  rows={4}
                  className="w-full px-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="videoScheduledTime" className="block text-sm font-medium text-gray-700">
                  Scheduled Time (leave empty to publish immediately)
                </label>
                <input
                  id="videoScheduledTime"
                  type="datetime-local"
                  value={videoScheduledTime}
                  onChange={(e) => setVideoScheduledTime(e.target.value)}
                  className="w-full px-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={!videoFile || !videoTitle.trim()}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                    !videoFile || !videoTitle.trim()
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  Schedule Video
                </button>

                <button
                  type="button"
                  onClick={resetVideoForm}
                  className="py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Live Stream Section */}
        {activeSection === "live" && (
          <div className="backdrop-blur-xl bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6 md:p-8">
            <h2 className="text-xl font-medium text-gray-800 mb-6">Schedule a Live Stream</h2>

            {streamDetails ? (
              <div className="space-y-6">
                <div className="bg-green-50/70 border border-green-100 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-600 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-green-800">Live Stream Scheduled Successfully</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Broadcast ID:</p>
                      <p className="text-sm text-gray-600 bg-white/50 p-2 rounded-lg">{streamDetails.broadcastId}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Stream ID:</p>
                      <p className="text-sm text-gray-600 bg-white/50 p-2 rounded-lg">{streamDetails.streamId}</p>
                    </div>

                    {streamDetails.ingestionInfo && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Stream Name:</p>
                          <p className="text-sm text-gray-600 bg-white/50 p-2 rounded-lg">
                            {streamDetails.ingestionInfo.streamName}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700">Primary Ingestion URL:</p>
                          <p className="text-sm text-gray-600 bg-white/50 p-2 rounded-lg break-all">
                            {streamDetails.ingestionInfo.ingestionAddress}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700">Backup Ingestion URL:</p>
                          <p className="text-sm text-gray-600 bg-white/50 p-2 rounded-lg break-all">
                            {streamDetails.ingestionInfo.backupIngestionAddress}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setStreamDetails(null)}
                    className="py-2 px-4 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-200 transition-colors"
                  >
                    Schedule Another Live Stream
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleScheduleLive} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="liveTitle" className="block text-sm font-medium text-gray-700">
                      Title *
                    </label>
                    <input
                      id="liveTitle"
                      type="text"
                      value={liveTitle}
                      onChange={(e) => setLiveTitle(e.target.value)}
                      placeholder="Enter live stream title"
                      className="w-full px-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="liveDescription" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="liveDescription"
                    value={liveDescription}
                    onChange={(e) => setLiveDescription(e.target.value)}
                    placeholder="Enter live stream description"
                    rows={4}
                    className="w-full px-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="liveStartTime" className="block text-sm font-medium text-gray-700">
                      Start Time *
                    </label>
                    <input
                      id="liveStartTime"
                      type="datetime-local"
                      value={liveStartTime}
                      onChange={(e) => setLiveStartTime(e.target.value)}
                      className="w-full px-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="liveEndTime" className="block text-sm font-medium text-gray-700">
                      End Time *
                    </label>
                    <input
                      id="liveEndTime"
                      type="datetime-local"
                      value={liveEndTime}
                      onChange={(e) => setLiveEndTime(e.target.value)}
                      className="w-full px-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={!liveTitle.trim() || !liveStartTime || !liveEndTime}
                    className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                      !liveTitle.trim() || !liveStartTime || !liveEndTime
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                  >
                    Schedule Live Stream
                  </button>

                  <button
                    type="button"
                    onClick={resetLiveForm}
                    className="py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Scheduled Media Section */}
        {activeSection === "scheduled" && (
          <div className="backdrop-blur-xl bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6 md:p-8">
            <h2 className="text-xl font-medium text-gray-800 mb-6">Scheduled Content</h2>

            {scheduledMedia.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <p className="text-gray-500">No scheduled content found</p>
                <button
                  onClick={loadScheduledMedia}
                  className="mt-4 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                >
                  Refresh
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {scheduledMedia.map((media) => (
                  <div
                    key={media.id}
                    className="bg-white/50 border border-gray-100 rounded-xl p-4 flex flex-col md:flex-row gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {media.type === "video" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-red-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        <h3 className="font-medium text-gray-800">{media.title}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            media.type === "video" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {media.type === "video" ? "Video" : "Live Stream"}
                        </span>
                      </div>

                      {media.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{media.description}</p>
                      )}

                      <div className="flex items-center text-sm text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {formatDate(media.scheduled_time)}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <a
                        href={`https://youtube.com/watch?v=${media.youtube_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        View on YouTube
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

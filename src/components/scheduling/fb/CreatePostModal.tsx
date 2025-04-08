"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock, Info, X, ImageIcon, Video } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface CreateFacebookPostModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    message: string
    scheduledTime?: string
    media?: File
    description?: string
    type: "post" | "reel" | "story"
  }) => void
  type: "post" | "reel" | "story"
  loading: boolean
}

export default function CreateFacebookPostModal({
  open,
  onClose,
  onSubmit,
  type,
  loading,
}: CreateFacebookPostModalProps) {
  const [message, setMessage] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string>("")
  const [media, setMedia] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [videoDimensions, setVideoDimensions] = useState<{ width: number; height: number } | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Reset form when modal opens or type changes
  useEffect(() => {
    if (open) {
      setMessage("")
      setDate(undefined)
      setTime("")
      setMedia(null)
      setMediaPreview(null)
      setError(null)
      setVideoDimensions(null)
    }
  }, [open, type])

  // Check video dimensions when video is loaded
  const handleVideoLoad = () => {
    if (videoRef.current) {
      const width = videoRef.current.videoWidth
      const height = videoRef.current.videoHeight
      setVideoDimensions({ width, height })

      // For reels, check if dimensions meet requirements
      if (type === "reel") {
        // Facebook Reels should ideally be 9:16 ratio with height at least 960px
        if (height < 960) {
          setError(`Video height (${height}px) is less than the recommended 960px for reels. This may affect quality.`)
        } else if (width / height > 0.6) {
          // Not close to 9:16 ratio
          setError(
            `Video aspect ratio (${(width / height).toFixed(2)}) is not optimal for reels. Recommended ratio is 9:16 (0.56).`,
          )
        } else {
          setError(null)
        }
      }
    }
  }

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]

      // Validate file type based on content type
      if (type === "reel" && !file.type.includes("video")) {
        setError("Please select a video file for reels")
        return
      }

      if (type === "story" && !file.type.includes("image") && !file.type.includes("video")) {
        setError("Please select an image or video file for stories")
        return
      }

      setMedia(file)
      setMediaPreview(URL.createObjectURL(file))

      // Reset error and dimensions until we can check the video
      if (file.type.includes("video")) {
        setError(null)
        setVideoDimensions(null)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form based on content type
    if (type === "post" && !message.trim()) {
      setError("Message is required for posts")
      return
    }

    if (type === "reel" && !media) {
      setError("Video is required for reels")
      return
    }

    if (type === "story" && !media) {
      setError("Media is required for stories")
      return
    }

    // For reels, warn about dimensions but allow submission
    if (type === "reel" && videoDimensions && videoDimensions.height < 960) {
      if (
        !window.confirm(
          "The video height is less than the recommended 960px for reels. This may affect quality. Do you want to continue?",
        )
      ) {
        return
      }
    }

    // Combine date and time if both are provided
    let scheduledTime: string | undefined = undefined
    if (date && time) {
      const [hours, minutes] = time.split(":").map(Number)
      const scheduledDate = new Date(date)
      scheduledDate.setHours(hours, minutes)
      scheduledTime = scheduledDate.toISOString()
    }

    onSubmit({
      message,
      scheduledTime,
      media: media || undefined,
      type,
    })
  }

  const getModalTitle = () => {
    switch (type) {
      case "post":
        return "Create Facebook Post"
      case "reel":
        return "Create Facebook Reel"
      case "story":
        return "Create Facebook Story"
      default:
        return "Create Content"
    }
  }

  const getMediaRequirements = () => {
    switch (type) {
      case "post":
        return "Recommended image size: 1200 x 630 pixels"
      case "reel":
        return "Recommended video: 9:16 ratio, minimum height 960px (1080x1920 ideal)"
      case "story":
        return "Recommended size: 1080 x 1920 pixels (9:16 ratio)"
      default:
        return ""
    }
  }

  return (
    <Dialog open={open} onOpenChange={loading ? undefined : onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 bg-white dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">{getModalTitle()}</DialogTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose} disabled={loading}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>Create and schedule content for your Facebook page</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Message/Caption Field - Not shown for stories */}
            {type !== "story" && (
              <div className="space-y-2">
                <Label htmlFor="message">{type === "post" ? "Message" : "Caption"}</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={type === "post" ? "What's on your mind?" : "Add a caption to your reel"}
                  className="min-h-[120px] resize-none"
                  disabled={loading}
                  required={type === "post"}
                />
              </div>
            )}

            {/* Media Upload Section */}
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="media-upload">
                  {type === "reel" ? "Upload Video" : "Upload Media"}
                  {(type === "reel" || type === "story") && " *"}
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{getMediaRequirements()}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">{getMediaRequirements()}</p>

              <div
                className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-3 bg-slate-50 dark:bg-slate-900 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={() => document.getElementById("media-upload")?.click()}
              >
                {mediaPreview ? (
                  media?.type.includes("video") ? (
                    <div className="flex flex-col items-center">
                      <video
                        ref={videoRef}
                        src={mediaPreview}
                        controls
                        className="max-h-[200px] max-w-full rounded"
                        onLoadedMetadata={handleVideoLoad}
                      />
                      {videoDimensions && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                          Dimensions: {videoDimensions.width}x{videoDimensions.height}px
                        </p>
                      )}
                    </div>
                  ) : (
                    <img
                      src={mediaPreview || "/placeholder.svg"}
                      alt="Preview"
                      className="max-h-[200px] max-w-full rounded object-contain"
                    />
                  )
                ) : (
                  <div className="flex flex-col items-center">
                    {type === "reel" ? (
                      <Video className="h-12 w-12 text-slate-400" />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-slate-400" />
                    )}
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {type === "reel" ? "Click to upload a video" : "Click to upload an image or video"}
                    </p>
                  </div>
                )}
                <Input
                  id="media-upload"
                  type="file"
                  accept={type === "reel" ? "video/*" : "image/*,video/*"}
                  onChange={handleMediaChange}
                  className="hidden"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Schedule Time Picker - Only for posts and reels */}
            {type !== "story" && (
              <div className="space-y-2">
                <Label>Schedule Time (Optional)</Label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                          disabled={loading}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        type="time"
                        className="pl-10"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Leave empty to post immediately</p>
              </div>
            )}
          </form>
        </ScrollArea>

        <DialogFooter className="p-6 border-t border-slate-200 dark:border-slate-800 sticky bottom-0 bg-white dark:bg-slate-950">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                {type === "post" ? "Scheduling Post..." : type === "reel" ? "Scheduling Reel..." : "Posting Story..."}
              </>
            ) : (
              <>{date && time ? "Schedule" : type === "story" ? "Post Now" : "Post"}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


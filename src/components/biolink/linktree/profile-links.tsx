/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useLinks } from "@/context/biolink/links-context"
import { Button } from "@/components/ui/button"
import { LinkDialog } from "@/components/biolink/linktree/link-dialog"
import { ThumbnailUploadDialog } from "@/components/biolink/linktree/thumbnail-upload-dialog"
import { Switch } from "@/components/ui/switch"
import {
  LayoutGrid,
  ImageIcon,
  Star,
  BarChart2,
  Calendar,
  Trash2,
  MoreVertical,
  Share2,
  TrendingUp,
  ChevronDown,
  Eye,
  EyeOff,
  Clock,
  CalendarRange,
  Pencil,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { format, addDays, subDays, isValid, differenceInDays, isBefore, isAfter } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScheduleDialog } from "@/components/biolink/linktree/schedule-dialog"
// import { useLinksStore } from "@/storage/links-store"
// import { useUserLinks } from "@/hooks/api/biolink/useUserLinks"
import { useLinksStore } from "@/storage/links-store"
import { useUserLinks } from "@/hooks/api/biolink/useUserLinks"

export function ProfileLinks() {
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false)
  const [isEditLinkOpen, setIsEditLinkOpen] = useState(false)
  const [isThumbnailDialogOpen, setIsThumbnailDialogOpen] = useState(false)
  const [activeLinkForThumbnail, setActiveLinkForThumbnail] = useState<number | null>(null)
  const [clickAnalyticsOpen, setClickAnalyticsOpen] = useState(false)
  const [selectedLinkForAnalytics, setSelectedLinkForAnalytics] = useState<number | null>(null)
  const [dateRange] = useState({
    from: subDays(new Date(), 7),
    to: new Date(),
  })
  const [showHiddenLinks, setShowHiddenLinks] = useState(false)
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [activeLinkForSchedule, setActiveLinkForSchedule] = useState<number | null>(null)

  const { updateRegularLinks } = useUserLinks()


  const {
    regularLinks,
    toggleActive:toggleLinkActive,
    deleteLink,
    toggleFavorite:toggleLinkFavorite,
    incrementClicks:incrementLinkClicks,
    updateThumbnail:updateLinkThumbnail,
    updateRegularLink,
    addRegularLink,
  } = useLinksStore()

  const updateLinkSchedule =(id:any, scheduleStart:any, scheduleEnd:any, timezone:any) =>
    updateRegularLink(id, { scheduleStart, scheduleEnd, timezone })
  
  const handleLinkClick = (id: number) => {
    incrementLinkClicks(id)
  }


  const handleAddLink = (data: { title: string; url: string }) => {
    const newLink = {
      id: Date.now(),
      title: data.title,
      url: data.url,
      active: true,
      clicks: 0,
      favorite: false,
    }
    addRegularLink(newLink)
    updateRegularLinks([...regularLinks, newLink])
  }

  const handleUpdateLink = (data: { title: string; url: string }, id?: number) => {
    if (id !== undefined) {
      updateRegularLink(id, data)
    }
  }
  
  const handleShareLink = (url: string) => {
    // Skip Web Share API entirely and go straight to clipboard
    copyToClipboard(url)
  }

  // Helper function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    // Use the Clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          alert("Link copied to clipboard!")
        })
        .catch((err) => {
          console.error("Clipboard API failed:", err)
          fallbackCopyToClipboard(text)
        })
    } else {
      fallbackCopyToClipboard(text)
    }
  }

  // Fallback method for clipboard copy
  const fallbackCopyToClipboard = (text: string) => {
    try {
      const textArea = document.createElement("textarea")
      textArea.value = text
      // Make the textarea out of viewport
      textArea.style.position = "fixed"
      textArea.style.left = "-999999px"
      textArea.style.top = "-999999px"
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      const successful = document.execCommand("copy")
      document.body.removeChild(textArea)

      if (successful) {
        alert("Link copied to clipboard!")
      } else {
        // If copy command fails, just open in new tab
        window.open(text, "_blank", "noopener,noreferrer")
      }
    } catch (err) {
      console.error("Fallback clipboard method failed:", err)
      // Last resort: open in new tab
      window.open(text, "_blank", "noopener,noreferrer")
    }
  }

  // Open thumbnail dialog
  const openThumbnailDialog = (linkId: number) => {
    const link = regularLinks.find((l) => l.id === linkId)
    if (link) {
      setActiveLinkForThumbnail(linkId)
      setIsThumbnailDialogOpen(true)
    }
  }

  // Handle thumbnail save
  const handleThumbnailSave = (thumbnailUrl: string) => {
    if (activeLinkForThumbnail !== null) {
      updateLinkThumbnail(activeLinkForThumbnail, thumbnailUrl)
      updateRegularLinks(
        regularLinks.map((l) =>
          l.id === activeLinkForThumbnail ? { ...l, thumbnail: thumbnailUrl } : l
        )
      )
      setActiveLinkForThumbnail(null)
    }
  }

  // Generate mock analytics data for demonstration
  const generateAnalyticsData = (linkId: number | null) => {
    if (linkId === null) return null

    const link = regularLinks.find((l) => l.id === linkId)
    if (!link) return null

    const totalClicks = link.clicks || 0

    // Generate daily click data for the last 7 days
    const dailyClicks = Array.from({ length: 7 }, (_, i) => {
      const day = format(addDays(new Date(), -i), "MMM dd")
      // Generate a random number of clicks for each day, weighted to be higher for more recent days
      const clicks = Math.floor(Math.random() * (totalClicks / 2) * (1 - i / 10))
      return { day, clicks }
    }).reverse()

    // Calculate CTR (Click-Through Rate) - mock data
    const impressions = totalClicks * (2 + Math.random() * 3) // Random number of impressions (2-5x clicks)
    const ctr = impressions > 0 ? (totalClicks / impressions) * 100 : 0

    // Calculate unique visitors - mock data (60-90% of total clicks)
    const uniqueVisitors = Math.floor(totalClicks * (0.6 + Math.random() * 0.3))

    return {
      totalClicks,
      dailyClicks,
      ctr: ctr.toFixed(1),
      uniqueVisitors,
      totalViews: Math.floor(impressions),
      hasClicks: totalClicks > 0,
    }
  }

  const openClickAnalytics = (linkId: number) => {
    setSelectedLinkForAnalytics(linkId)
    setClickAnalyticsOpen(true)
  }

  const selectedLink =
    selectedLinkForAnalytics !== null ? regularLinks.find((link) => link.id === selectedLinkForAnalytics) : null

  const analyticsData = generateAnalyticsData(selectedLinkForAnalytics)

  const openScheduleDialog = (linkId: number) => {
    const link = regularLinks.find((l) => l.id === linkId)
    if (link) {
      setActiveLinkForSchedule(linkId)
      setIsScheduleDialogOpen(true)
    }
  }

  const handleScheduleSave = (scheduleStart?: string, scheduleEnd?: string, timezone?: string) => {
    if (activeLinkForSchedule !== null) {
      updateLinkSchedule(activeLinkForSchedule, scheduleStart, scheduleEnd, timezone)
      updateRegularLinks(
        regularLinks.map((l) =>
          l.id === activeLinkForSchedule
            ? { ...l, scheduleStart, scheduleEnd, timezone }
            : l
        )
      )
    }
  }

  const isLinkCurrentlyActive = (link: (typeof regularLinks)[0]): boolean => {
    // If the link is not active by toggle, it's not active regardless of schedule
    if (!link.active) return false

    // If there's no schedule, the link is active
    if (!link.scheduleStart && !link.scheduleEnd) return true

    try {
      const now = new Date()

      // Check start date
      if (link.scheduleStart) {
        const startDate = new Date(link.scheduleStart)
        if (!isValid(startDate)) {
          console.error("Invalid start date:", link.scheduleStart)
          return true // Default to showing if date is invalid
        }

        if (now < startDate) {
          return false
        }
      }

      // Check end date
      if (link.scheduleEnd) {
        const endDate = new Date(link.scheduleEnd)
        if (!isValid(endDate)) {
          console.error("Invalid end date:", link.scheduleEnd)
          return true // Default to showing if date is invalid
        }

        if (now > endDate) {
          return false
        }
      }

      return true
    } catch (error) {
      console.error("Error checking link active status:", error)
      // Default to showing the link if there's an error
      return true
    }
  }

  // Filter links based on active status and showHiddenLinks toggle
  const visibleLinks = regularLinks.filter((link) => {
    // If showing hidden links, show all links
    if (showHiddenLinks) return true

    // Only show links that are active both by toggle and by schedule
    return isLinkCurrentlyActive(link)
  })

  // Format a date for display, handling invalid dates gracefully
  const formatScheduleDate = (dateString?: string): string => {
    if (!dateString) return "Not set"

    try {
      const date = new Date(dateString)
      if (!isValid(date)) return "Invalid date"
      return format(date, "MMM d, yyyy 'at' h:mm a")
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid date"
    }
  }

  // Get schedule status for a link
  const getScheduleStatus = (link: (typeof regularLinks)[0]): { status: string; color: string } => {
    if (!link.scheduleStart && !link.scheduleEnd) {
      return { status: "No schedule", color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200" }
    }

    const now = new Date()

    try {
      // Check if link is scheduled for the future
      if (link.scheduleStart) {
        const startDate = new Date(link.scheduleStart)
        if (isValid(startDate) && isAfter(startDate, now)) {
          const days = differenceInDays(startDate, now)
          return {
            status: days === 0 ? "Starting today" : `Starting in ${days} day${days !== 1 ? "s" : ""}`,
            color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
          }
        }
      }

      // Check if link is scheduled to end soon
      if (link.scheduleEnd) {
        const endDate = new Date(link.scheduleEnd)
        if (isValid(endDate) && isAfter(endDate, now)) {
          const days = differenceInDays(endDate, now)
          return {
            status: days === 0 ? "Ending today" : `Ending in ${days} day${days !== 1 ? "s" : ""}`,
            color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
          }
        }

        // Check if link has ended
        if (isValid(endDate) && isBefore(endDate, now)) {
          return {
            status: "Schedule ended",
            color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
          }
        }
      }

      // Link is currently active within schedule
      if (link.scheduleStart && isLinkCurrentlyActive(link)) {
        return {
          status: "Active schedule",
          color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        }
      }

      return { status: "Scheduled", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" }
    } catch (error) {
      console.error("Error determining schedule status:", error)
      return { status: "Schedule error", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" }
    }
  }

  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 p-4 shadow-sm transition-colors duration-300">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium dark:text-white transition-colors duration-300">Links</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHiddenLinks(!showHiddenLinks)}
            className="flex items-center gap-1 h-9 px-3 text-sm rounded-full"
          >
            {showHiddenLinks ? (
              <>
                <EyeOff className="h-4 w-4 mr-1" />
                Hide inactive
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-1" />
                Show all
              </>
            )}
          </Button>
          <Button
            onClick={() => setIsAddLinkOpen(true)}
            className="rounded-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm font-medium h-9"
          >
            Add new link
          </Button>
        </div>
      </div>

      {regularLinks.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
            You haven&apos;t added any links yet. Click the button above to add your first link.
          </p>
        </div>
      ) : visibleLinks.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
            No active links to display. Click &quot;Show all&quot; to view inactive links.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleLinks.map((link) => {
            const scheduleStatus = getScheduleStatus(link)

            return (
              <div
                key={link.id}
                className="flex flex-col md:flex-row md:items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-3 transition-colors duration-300"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {link.thumbnail ? (
                      <div className="h-10 w-10 rounded-md overflow-hidden relative">
                        <img
                          src={link.thumbnail || "/placeholder.svg"}
                          alt={link.title}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <MoreVertical className="h-5 w-5 text-gray-400 dark:text-gray-500 transition-colors duration-300 hidden" />
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium dark:text-white transition-colors duration-300">{link.title}</h3>
                      {link.scheduleStart || link.scheduleEnd ? (
                        <Badge
                          variant="outline"
                          className={`${scheduleStatus.color} flex items-center gap-1 px-2 py-0.5`}
                        >
                          <Clock className="h-3 w-3" />
                          <span>{scheduleStatus.status}</span>
                        </Badge>
                      ) : null}
                    </div>
                    <p
                      className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300 truncate max-w-[200px] md:max-w-[300px] cursor-pointer hover:text-purple-600 dark:hover:text-purple-400"
                      onClick={() => {
                        handleLinkClick(link.id as number)
                        window.open(link.url, "_blank", "noopener,noreferrer")
                      }}
                    >
                      {link.url}
                    </p>
                    {link.scheduleStart || link.scheduleEnd ? (
                      <div className="mt-1 text-xs text-gray-500 flex flex-col sm:flex-row sm:gap-3">
                        {link.scheduleStart && (
                          <div className="flex items-center">
                            <CalendarRange className="h-3 w-3 mr-1 text-green-500" />
                            <span>Start: {formatScheduleDate(link.scheduleStart)}</span>
                          </div>
                        )}
                        {link.scheduleEnd && (
                          <div className="flex items-center">
                            <CalendarRange className="h-3 w-3 mr-1 text-red-500" />
                            <span>End: {formatScheduleDate(link.scheduleEnd)}</span>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-3 md:mt-0">
                  {/* Link options toolbar */}
                  <div className="hidden md:flex items-center space-x-2 mr-3 border-r pr-3 dark:border-gray-700">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <LayoutGrid className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuItem>Classic</DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openThumbnailDialog(link.id as number)}
                                className="text-purple-600 font-medium"
                              >
                                Featured
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Change layout</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleShareLink(link.url)}
                          >
                            <Share2 className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Share link</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>




                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-7 w-7 ${link.thumbnail ? "bg-purple-100 text-purple-600" : ""}`}
                            onClick={() => openThumbnailDialog(link.id as number)}
                          >
                            <ImageIcon
                              className={`h-3.5 w-3.5 ${link.thumbnail ? "text-purple-600" : "text-gray-500 dark:text-gray-400"}`}
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{link.thumbnail ? "Change thumbnail" : "Add thumbnail"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>





                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => {toggleLinkFavorite(link.id as number)
updateRegularLinks(
  regularLinks.map((l) =>
    l.id === link.id ? { ...l, favorite: !l.favorite } : l
  )
)
                            }}
                          >
                            <Star
                              className={`h-3.5 w-3.5 ${link.favorite ? "text-yellow-400 fill-yellow-400" : "text-gray-500 dark:text-gray-400"}`}
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{link.favorite ? "Remove from favorites" : "Add to favorites"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>





                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-7 w-7 ${link.scheduleStart || link.scheduleEnd ? "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300" : ""}`}
                            onClick={() => openScheduleDialog(link.id as number)}
                          >
                            <Calendar
                              className={`h-3.5 w-3.5 ${
                                link.scheduleStart || link.scheduleEnd
                                  ? "text-purple-600 dark:text-purple-300"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{link.scheduleStart || link.scheduleEnd ? "Edit schedule" : "Schedule link visibility"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Button
                      variant="ghost"
                      className={`flex items-center h-7 px-2 rounded-full text-xs ${link.clicks ? "bg-purple-600 text-white hover:bg-purple-700" : ""}`}
                      onClick={() => openClickAnalytics(link.id as number)}
                    >
                      <BarChart2
                        className={`h-3.5 w-3.5 mr-1 ${link.clicks ? "text-white" : "text-gray-500 dark:text-gray-400"}`}
                      />
                      <span>{link.clicks || 0} clicks</span>
                    </Button>
                  </div>

                  {/* Mobile dropdown for options */}
                  <div className="md:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => openScheduleDialog(link.id as number)}
                          className={
                            link.scheduleStart || link.scheduleEnd
                              ? "text-purple-600 dark:text-purple-400 font-medium"
                              : ""
                          }
                        >
                          <Calendar
                            className={`mr-2 h-4 w-4 ${link.scheduleStart || link.scheduleEnd ? "text-purple-600 dark:text-purple-400" : ""}`}
                          />
                          <span>
                            {link.scheduleStart || link.scheduleEnd ? "Edit schedule" : "Schedule visibility"}
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Classic</DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openThumbnailDialog(link.id as number)}
                          className="text-purple-600 font-medium"
                        >
                          Featured
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleShareLink(link.url)}>
                          <Share2 className="mr-2 h-4 w-4" />
                          <span>Share</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {toggleLinkFavorite(link.id as number)

updateRegularLinks(
  regularLinks.map((l) =>
    l.id === link.id ? { ...l, favorite: !l.favorite } : l
  )
)

                        }}>
                          <Star className={`mr-2 h-4 w-4 ${link.favorite ? "text-yellow-400" : ""}`} />
                          <span>{link.favorite ? "Unfavorite" : "Favorite"}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openThumbnailDialog(link.id as number)}>
                          <ImageIcon className="mr-2 h-4 w-4" />
                          <span>{link.thumbnail ? "Change thumbnail" : "Add thumbnail"}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openClickAnalytics(link.id as number)}>
                          <BarChart2 className="mr-2 h-4 w-4" />
                          <span>View Analytics ({link.clicks || 0} clicks)</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {deleteLink(link.id as number)
                          updateRegularLinks(regularLinks.filter((l) => l.id !== link.id))

                        }} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>




                  {/* Delete buttons (desktop only) */}
                  <div className="hidden md:flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {deleteLink(link.id as number)
                        updateRegularLinks(regularLinks.filter((l) => l.id !== link.id))


                      }}
                      className="h-7 w-7 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-300"
                      aria-label="Delete link"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>


                  {/* Edit button (desktop only) */}
                  <div className="hidden md:flex items-center space-x-2">
                   <Button
                     variant="ghost"
                     size="icon"
                    //  onClick={() =>updateRegularLink(link.id,)} // 👈 update this with your actual edit logic
                     className="h-7 w-7 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-300"
                     aria-label="Edit link"
                     onClick={() => setIsEditLinkOpen(true)}
                   >
                     <Pencil className="h-3.5 w-3.5" />
                   </Button>
                   <LinkDialog isOpen={isEditLinkOpen} onOpenChange={setIsEditLinkOpen} onSave={handleUpdateLink} initialData ={link}/>
                  </div>



                  {/* Toggle switch */}
                  <Switch
                    checked={link.active}
                    onCheckedChange={() => {toggleLinkActive(link.id as number)
                      updateRegularLinks(
                        regularLinks.map((l) =>
                          l.id === link.id ? { ...l, active: !l.active } : l
                        )
                      )
                    }}
                    className="ml-1"
                    aria-label={link.active ? "Disable link" : "Enable link"}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}

      <LinkDialog isOpen={isAddLinkOpen} onOpenChange={setIsAddLinkOpen} onSave={handleAddLink} />

      {/* Thumbnail Upload Dialog */}
      <ThumbnailUploadDialog
        isOpen={isThumbnailDialogOpen}
        onOpenChange={setIsThumbnailDialogOpen}
        onSave={handleThumbnailSave}
        initialThumbnail={
          activeLinkForThumbnail !== null
            ? regularLinks.find((l) => l.id === activeLinkForThumbnail)?.thumbnail
            : undefined
        }
        linkTitle={
          activeLinkForThumbnail !== null ? regularLinks.find((l) => l.id === activeLinkForThumbnail)?.title : undefined
        }
      />

      {/* Click Analytics Dialog */}
      <Dialog open={clickAnalyticsOpen} onOpenChange={setClickAnalyticsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Link Analytics</DialogTitle>
          </DialogHeader>

          <div className="flex justify-between items-center mb-4">
            <div>
              {selectedLink && (
                <div>
                  <h3 className="font-medium">{selectedLink.title}</h3>
                  <p className="text-sm text-gray-500 truncate">{selectedLink.url}</p>
                </div>
              )}
            </div>
            <div className="border rounded-md px-3 py-2 flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                {format(dateRange.from, "MMM do, yyyy")} to {format(dateRange.to, "MMM do, yyyy")}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>

          <Tabs defaultValue="insights">
            <TabsList className="mb-4">
              <TabsTrigger value="insights" className="text-sm">
                Insights
              </TabsTrigger>
              <TabsTrigger value="overview" className="text-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="subscribers" className="text-sm">
                Subscribers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="insights">
              {analyticsData ? (
                <>
                  {analyticsData.hasClicks ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <Card className="p-4 bg-red-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">Total views</p>
                              <p className="text-2xl font-semibold">{analyticsData.totalViews}</p>
                            </div>
                            <div className="text-red-500">
                              <TrendingUp className="h-5 w-5 rotate-180" />
                            </div>
                          </div>
                          <p className="text-sm text-red-600 mt-2">100%</p>
                        </Card>

                        <Card className="p-4 bg-red-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">Link CTR</p>
                              <p className="text-2xl font-semibold">{analyticsData.ctr}%</p>
                            </div>
                            <div className="text-red-500">
                              <TrendingUp className="h-5 w-5 rotate-180" />
                            </div>
                          </div>
                          <p className="text-sm text-red-600 mt-2">100%</p>
                        </Card>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Daily Clicks</h4>
                        <div className="space-y-2">
                          {analyticsData.dailyClicks.map((day, i) => (
                            <div key={i} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>{day.day}</span>
                                <span>{day.clicks} clicks</span>
                              </div>
                              <Progress value={(day.clicks / analyticsData.totalClicks) * 100} className="h-1" />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-sm text-gray-500">
                        <p>Difference between last 7 days</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <h3 className="text-xl font-medium mb-2">
                        Looks like you had no clicks on this link in the last 7 days.
                      </h3>
                      <p className="text-gray-500 mb-6">Share your link to start getting clicks!</p>
                      <div className="grid grid-cols-2 gap-4">
                        <Card className="p-4 bg-red-50">
                          <p className="text-sm text-gray-500">Total views</p>
                          <p className="text-2xl font-semibold">0</p>
                          <p className="text-sm text-red-600 mt-2">100%</p>
                        </Card>

                        <Card className="p-4 bg-red-50">
                          <p className="text-sm text-gray-500">Link CTR</p>
                          <p className="text-2xl font-semibold">0%</p>
                          <p className="text-sm text-red-600 mt-2">100%</p>
                        </Card>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-10">
                  <p>No analytics data available</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="overview">
              <div className="text-center py-10">
                <p className="text-gray-500">Overview data will be available soon.</p>
              </div>
            </TabsContent>

            <TabsContent value="subscribers">
              <div className="text-center py-10">
                <p className="text-gray-500">Subscriber data will be available soon.</p>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      <ScheduleDialog
        isOpen={isScheduleDialogOpen}
        onOpenChange={setIsScheduleDialogOpen}
        onSave={handleScheduleSave}
        initialStartDate={
          activeLinkForSchedule !== null && regularLinks.find((l) => l.id === activeLinkForSchedule)?.scheduleStart
            ? regularLinks.find((l) => l.id === activeLinkForSchedule)?.scheduleStart
            : undefined
        }
        initialEndDate={
          activeLinkForSchedule !== null && regularLinks.find((l) => l.id === activeLinkForSchedule)?.scheduleEnd
            ? regularLinks.find((l) => l.id === activeLinkForSchedule)?.scheduleEnd
            : undefined
        }
        initialTimezone={
          activeLinkForSchedule !== null && regularLinks.find((l) => l.id === activeLinkForSchedule)?.timezone
            ? regularLinks.find((l) => l.id === activeLinkForSchedule)?.timezone
            : undefined
        }
        linkTitle={
          activeLinkForSchedule !== null ? regularLinks.find((l) => l.id === activeLinkForSchedule)?.title || "" : ""
        }
      />
    </div>
  )
}


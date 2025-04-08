"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { format, isValid, isBefore, startOfDay, addDays, addWeeks, addMonths } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CalendarIcon, Clock, X, AlertCircle, CalendarClock, Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ScheduleDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (scheduleStart?: string, scheduleEnd?: string, timezone?: string) => void
  initialStartDate?: string
  initialEndDate?: string
  initialTimezone?: string
  linkTitle: string
}

// List of common timezones
const TIMEZONES = [
  { value: "UTC", label: "(GMT+0:00) Universal Time Coordinated" },
  { value: "America/New_York", label: "(GMT-5:00) Eastern Time" },
  { value: "America/Chicago", label: "(GMT-6:00) Central Time" },
  { value: "America/Denver", label: "(GMT-7:00) Mountain Time" },
  { value: "America/Los_Angeles", label: "(GMT-8:00) Pacific Time" },
  { value: "Europe/London", label: "(GMT+0:00) London, Edinburgh" },
  { value: "Europe/Paris", label: "(GMT+1:00) Paris, Berlin, Rome, Madrid" },
  { value: "Asia/Tokyo", label: "(GMT+9:00) Tokyo, Osaka" },
  { value: "Asia/Shanghai", label: "(GMT+8:00) Beijing, Shanghai" },
  { value: "Asia/Kolkata", label: "(GMT+5:30) Chennai, Kolkata, Mumbai, New Delhi" },
  { value: "Australia/Sydney", label: "(GMT+10:00) Sydney, Melbourne" },
]

// Quick date options
const QUICK_DATE_OPTIONS = [
  { id: "tomorrow", label: "Tomorrow", getValue: () => addDays(new Date(), 1) },
  { id: "next-week", label: "Next week", getValue: () => addWeeks(new Date(), 1) },
  { id: "next-month", label: "Next month", getValue: () => addMonths(new Date(), 1) },
  { id: "custom", label: "Custom date", getValue: () => undefined },
]

export function ScheduleDialog({
  isOpen,
  onOpenChange,
  onSave,
  initialStartDate,
  initialEndDate,
  initialTimezone,
  linkTitle,
}: ScheduleDialogProps) {
  // State for active tab
  const [activeTab, setActiveTab] = useState<string>("schedule")

  // State for start date and time
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [startTime, setStartTime] = useState("09:00")

  // State for end date and time
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [endTime, setEndTime] = useState("17:00")

  // State for timezone
  const [timezone, setTimezone] = useState("")

  // State for validation errors
  const [error, setError] = useState<string | null>(null)

  // State for popover open status
  const [startDatePopoverOpen, setStartDatePopoverOpen] = useState(false)
  const [endDatePopoverOpen, setEndDatePopoverOpen] = useState(false)

  // State for quick date selection
  const [quickStartOption, setQuickStartOption] = useState<string | null>(null)
  const [quickEndOption, setQuickEndOption] = useState<string | null>(null)

  // Refs for the date input containers
  const startDateContainerRef = useRef<HTMLDivElement>(null)
  const endDateContainerRef = useRef<HTMLDivElement>(null)

  // Refs for the calendar popovers
  const startCalendarRef = useRef<HTMLDivElement>(null)
  const endCalendarRef = useRef<HTMLDivElement>(null)

  // Parse a date string safely
  const safeParseDate = useCallback((dateString?: string): Date | undefined => {
    if (!dateString) return undefined

    try {
      const date = new Date(dateString)
      return isValid(date) ? date : undefined
    } catch (e) {
      console.error("Error parsing date:", e)
      return undefined
    }
  }, [])

  // Extract time from a date object safely
  const extractTimeFromDate = useCallback((date?: Date): string => {
    if (!date || !isValid(date)) return "09:00"

    try {
      return format(date, "HH:mm")
    } catch (e) {
      console.error("Error extracting time:", e)
      return "09:00"
    }
  }, [])

  // Format date for display
  const formatDateForDisplay = useCallback((date?: Date | string): string => {
    if (!date) return "Not set"

    try {
      const dateObj = typeof date === "string" ? new Date(date) : date
      if (!isValid(dateObj)) return "Invalid date"
      return format(dateObj, "MMM d, yyyy 'at' h:mm a")
    } catch (e) {
      console.error("Error formatting date:", e)
      return "Invalid date"
    }
  }, [])

  // Initialize form when dialog opens
  useEffect(() => {
    if (isOpen) {
      // Reset error state
      setError(null)

      // Initialize timezone
      setTimezone(initialTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone)

      // Initialize start date and time
      const parsedStartDate = safeParseDate(initialStartDate)
      setStartDate(parsedStartDate)
      setStartTime(parsedStartDate ? extractTimeFromDate(parsedStartDate) : "09:00")

      // Initialize end date and time
      const parsedEndDate = safeParseDate(initialEndDate)
      setEndDate(parsedEndDate)
      setEndTime(parsedEndDate ? extractTimeFromDate(parsedEndDate) : "17:00")

      // Reset popover states
      setStartDatePopoverOpen(false)
      setEndDatePopoverOpen(false)

      // Reset quick options
      setQuickStartOption(null)
      setQuickEndOption(null)

      // Set active tab based on whether there's already a schedule
      setActiveTab(initialStartDate || initialEndDate ? "reschedule" : "schedule")
    }
  }, [isOpen, initialStartDate, initialEndDate, initialTimezone, safeParseDate, extractTimeFromDate])

  // Validate dates before submission
  const validateDates = useCallback((): boolean => {
    // Clear previous errors
    setError(null)

    // If no dates are selected, that's valid (clears the schedule)
    if (!startDate && !endDate) return true

    // If end date is set but start date is not, that's invalid
    if (!startDate && endDate) {
      setError("Please select a start date if you want to set an end date")
      return false
    }

    // If both dates are set, ensure end date is after start date
    if (startDate && endDate) {
      const startDateTime = new Date(startDate)
      const endDateTime = new Date(endDate)

      // Parse times
      const [startHours, startMinutes] = startTime.split(":").map(Number)
      const [endHours, endMinutes] = endTime.split(":").map(Number)

      // Set times on date objects
      startDateTime.setHours(startHours, startMinutes, 0, 0)
      endDateTime.setHours(endHours, endMinutes, 0, 0)

      if (isBefore(endDateTime, startDateTime)) {
        setError("End date and time must be after start date and time")
        return false
      }
    }

    return true
  }, [startDate, endDate, startTime, endTime])

  // Handle form submission
  const handleSubmit = () => {
    // Validate dates before proceeding
    if (!validateDates()) {
        alert("failed")
        return
    }

    let formattedStartDate: string | undefined
    let formattedEndDate: string | undefined

    // Format start date and time if set
    if (startDate) {
      try {
        const startDateTime = new Date(startDate)
        const [hours, minutes] = startTime.split(":").map(Number)

        if (!isNaN(hours) && !isNaN(minutes)) {
          startDateTime.setHours(hours, minutes, 0, 0)
          formattedStartDate = startDateTime.toISOString()
        } else {
          console.error("Invalid time format:", startTime)
          startDateTime.setHours(9, 0, 0, 0)
          formattedStartDate = startDateTime.toISOString()
        }
      } catch (error) {

        console.error("Error formatting start date:", error)
        setError("There was a problem with the start date. Please try again.")
        return
      }
    }

    // Format end date and time if set
    if (endDate) {
      try {
        const endDateTime = new Date(endDate)
        const [hours, minutes] = endTime.split(":").map(Number)

        if (!isNaN(hours) && !isNaN(minutes)) {
          endDateTime.setHours(hours, minutes, 0, 0)
          formattedEndDate = endDateTime.toISOString()
        } else {
          console.error("Invalid time format:", endTime)
          endDateTime.setHours(17, 0, 0, 0)
          formattedEndDate = endDateTime.toISOString()
        }
      } catch (error) {
        console.error("Error formatting end date:", error)
        setError("There was a problem with the end date. Please try again.")
        return
      }
    }

    // Call the onSave callback with the formatted dates
    onSave(formattedStartDate, formattedEndDate, timezone)
    onOpenChange(false)
  }

  // Handle clearing the schedule
  const handleClearSchedule = () => {
    onSave(undefined, undefined, undefined)
    onOpenChange(false)
  }

  // Find full timezone label
  const getTimezoneLabel = (value: string) => {
    const timezone = TIMEZONES.find((tz) => tz.value === value)
    return timezone ? timezone.label : value
  }

  // Get today's date at midnight for date constraints
  const today = startOfDay(new Date())

  // Handle click outside of date containers to close popovers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside start date container and calendar
      if (
        startDatePopoverOpen &&
        startDateContainerRef.current &&
        !startDateContainerRef.current.contains(event.target as Node) &&
        startCalendarRef.current &&
        !startCalendarRef.current.contains(event.target as Node)
      ) {
        setStartDatePopoverOpen(false)
      }

      // Check if click is outside end date container and calendar
      if (
        endDatePopoverOpen &&
        endDateContainerRef.current &&
        !endDateContainerRef.current.contains(event.target as Node) &&
        endCalendarRef.current &&
        !endCalendarRef.current.contains(event.target as Node)
      ) {
        setEndDatePopoverOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [startDatePopoverOpen, endDatePopoverOpen])

  // Add this effect to handle mutual exclusivity between date pickers
  useEffect(() => {
    if (startDatePopoverOpen) {
      setEndDatePopoverOpen(false)
    }
  }, [startDatePopoverOpen])

  useEffect(() => {
    if (endDatePopoverOpen) {
      setStartDatePopoverOpen(false)
    }
  }, [endDatePopoverOpen])

  // Handle quick date selection for start date
  const handleQuickStartDateSelect = (optionId: string) => {
    setQuickStartOption(optionId)

    if (optionId === "custom") {
      setStartDatePopoverOpen(true)
      return
    }

    const option = QUICK_DATE_OPTIONS.find((opt) => opt.id === optionId)
    if (option) {
      const newDate = option.getValue()
      setStartDate(newDate)

      // If end date is before the new start date, clear it
      if (newDate && endDate && isBefore(endDate, newDate)) {
        setEndDate(undefined)
        setQuickEndOption(null)
      }

      // Clear error when user makes a selection
      setError(null)
    }
  }

  // Handle quick date selection for end date
  const handleQuickEndDateSelect = (optionId: string) => {
    setQuickEndOption(optionId)

    if (optionId === "custom") {
      setEndDatePopoverOpen(true)
      return
    }

    const option = QUICK_DATE_OPTIONS.find((opt) => opt.id === optionId)
    if (option) {
      const newDate = option.getValue()
      setEndDate(newDate)

      // Clear error when user makes a selection
      setError(null)
    }
  }

  // Handle keyboard navigation for date inputs

  // Enhanced click handling for date inputs
  useEffect(() => {
    const handleDateInputClick = (e: MouseEvent) => {
      // Check if click is on or within the start date container
      if (startDateContainerRef.current?.contains(e.target as Node)) {
        setStartDatePopoverOpen(true)
        setQuickStartOption("custom")
      }

      // Check if click is on or within the end date container
      if (endDateContainerRef.current?.contains(e.target as Node)) {
        setEndDatePopoverOpen(true)
        setQuickEndOption("custom")
      }
    }

    document.addEventListener("click", handleDateInputClick)
    return () => {
      document.removeEventListener("click", handleDateInputClick)
    }
  }, [startDateContainerRef, endDateContainerRef])

  const [, setIsSmallScreen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640)
    }

    handleResize()

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setStartDatePopoverOpen(false)
        setEndDatePopoverOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscapeKey)
    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [])

  // Add this effect to handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        // On small screens, ensure only one popover is open at a time
        if (startDatePopoverOpen && endDatePopoverOpen) {
          setEndDatePopoverOpen(false)
        }
      }
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [startDatePopoverOpen, endDatePopoverOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <CalendarClock className="mr-2 h-5 w-5 text-primary" />
            Schedule Link
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="schedule" className="text-sm">
              {initialStartDate || initialEndDate ? "Update Schedule" : "Schedule Link"}
            </TabsTrigger>
            <TabsTrigger value="reschedule" className="text-sm" disabled={!initialStartDate && !initialEndDate}>
              Current Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-6 py-2">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">
                {initialStartDate || initialEndDate ? "Update schedule for" : "Schedule"}
                <span className="ml-1 bg-blue-100 px-1.5 py-0.5 rounded dark:bg-blue-900">{linkTitle}</span>
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Set when this link should be visible on your profile.
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              {/* Start Date Section */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Start Date</Label>

                {/* Quick Date Options */}
                <RadioGroup
                  value={quickStartOption || ""}
                  onValueChange={handleQuickStartDateSelect}
                  className="flex flex-wrap gap-2"
                >
                  {QUICK_DATE_OPTIONS.map((option) => (
                    <div key={option.id} className="flex items-center">
                      <RadioGroupItem value={option.id} id={`start-${option.id}`} className="sr-only" />
                      <Label
                        htmlFor={`start-${option.id}`}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm cursor-pointer border transition-colors",
                          quickStartOption === option.id
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-input hover:bg-accent/50",
                        )}
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {/* Custom Date Selector */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative" ref={startDateContainerRef}>
                    <Popover open={startDatePopoverOpen} onOpenChange={setStartDatePopoverOpen}>
                      <PopoverTrigger asChild>
                        <div
                          className="cursor-pointer relative group"
                          onClick={() => {
                            setStartDatePopoverOpen(true)
                            setQuickStartOption("custom")
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              setStartDatePopoverOpen(true)
                              setQuickStartOption("custom")
                            }
                          }}
                          tabIndex={0}
                          role="button"
                          aria-haspopup="dialog"
                          aria-expanded={startDatePopoverOpen}
                          aria-label="Select start date"
                        >
                          <div
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-3 border rounded-md transition-all duration-200",
                              "bg-background border-input hover:border-accent",
                            )}
                          >
                            <div className="flex items-center">
                              <CalendarIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                              <span className={startDate ? "text-foreground" : "text-muted-foreground"}>
                                {startDate ? format(startDate, "MMM d, yyyy") : "Select date"}
                              </span>
                            </div>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent
                        ref={startCalendarRef}
                        className="w-auto p-0 z-50"
                        align="start"
                        side="bottom"
                        sideOffset={5}
                        alignOffset={0}
                        avoidCollisions
                      >
                        <div className="p-0 bg-background border border-border rounded-md shadow-lg overflow-hidden">
                          <div className="p-2 border-b border-border">
                            <h4 className="text-base font-medium">Select date</h4>
                          </div>
                          <div className="p-3 max-h-[350px] overflow-y-auto">
                            <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={(date) => {
                                setStartDate(date)
                                // If end date is before the new start date, clear it
                                if (date && endDate && isBefore(endDate, date)) {
                                  setEndDate(undefined)
                                  setQuickEndOption(null)
                                }
                                // Clear error when user makes a selection
                                setError(null)
                                // Close the popover after selection
                                setTimeout(() => setStartDatePopoverOpen(false), 100)
                              }}
                              disabled={(date) => isBefore(date, today)}
                              initialFocus
                              className="border-none shadow-none"
                            />
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex items-center">
                    <div className="relative flex items-center w-full">
                      <Input
                        type="time"
                        value={startTime}
                        onChange={(e) => {
                          setStartTime(e.target.value)
                          setError(null)
                        }}
                        className="px-4 py-3 h-auto"
                        aria-label="Start time"
                      />
                      <Clock className="absolute right-3 h-5 w-5 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* End Date Section */}
              <div className="space-y-3">
                <Label className="text-base font-medium">End Date (Optional)</Label>

                {/* Quick Date Options */}
                <RadioGroup
                  value={quickEndOption || ""}
                  onValueChange={handleQuickEndDateSelect}
                  className="flex flex-wrap gap-2"
                >
                  {QUICK_DATE_OPTIONS.map((option) => (
                    <div key={option.id} className="flex items-center">
                      <RadioGroupItem value={option.id} id={`end-${option.id}`} className="sr-only" />
                      <Label
                        htmlFor={`end-${option.id}`}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm cursor-pointer border transition-colors",
                          quickEndOption === option.id
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-input hover:bg-accent/50",
                        )}
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {/* Custom Date Selector */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative" ref={endDateContainerRef}>
                    <Popover open={endDatePopoverOpen} onOpenChange={setEndDatePopoverOpen}>
                      <PopoverTrigger asChild>
                        <div
                          className="cursor-pointer relative group"
                          onClick={() => {
                            setEndDatePopoverOpen(true)
                            setQuickEndOption("custom")
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              setEndDatePopoverOpen(true)
                              setQuickEndOption("custom")
                            }
                          }}
                          tabIndex={0}
                          role="button"
                          aria-haspopup="dialog"
                          aria-expanded={endDatePopoverOpen}
                          aria-label="Select end date"
                        >
                          <div
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-3 border rounded-md transition-all duration-200",
                              "bg-background border-input hover:border-accent",
                            )}
                          >
                            <div className="flex items-center">
                              <CalendarIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                              <span className={endDate ? "text-foreground" : "text-muted-foreground"}>
                                {endDate ? format(endDate, "MMM d, yyyy") : "Select date"}
                              </span>
                            </div>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent
                        ref={endCalendarRef}
                        className="w-auto p-0 z-50"
                        align="start"
                        side="bottom"
                        sideOffset={5}
                        alignOffset={0}
                        avoidCollisions
                      >
                        <div className="p-0 bg-background border border-border rounded-md shadow-lg overflow-hidden">
                          <div className="p-2 border-b border-border">
                            <h4 className="text-base font-medium">Select date</h4>
                          </div>
                          <div className="p-3 max-h-[350px] overflow-y-auto">
                            <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={(date) => {
                                setEndDate(date)
                                // Clear error when user makes a selection
                                setError(null)
                                // Close the popover after selection
                                setTimeout(() => setEndDatePopoverOpen(false), 100)
                              }}
                              disabled={(date) => {
                                // Disable dates before today
                                if (isBefore(date, today)) return true
                                // Disable dates before start date if start date is set
                                if (startDate && isBefore(date, startDate)) return true
                                return false
                              }}
                              initialFocus
                              className="border-none shadow-none"
                            />
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex items-center">
                    <div className="relative flex items-center w-full">
                      <Input
                        type="time"
                        value={endTime}
                        onChange={(e) => {
                          setEndTime(e.target.value)
                          setError(null)
                        }}
                        className="px-4 py-3 h-auto"
                        aria-label="End time"
                      />
                      <Clock className="absolute right-3 h-5 w-5 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Timezone */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Time Zone</Label>
                <Select
                  value={timezone}
                  onValueChange={(value) => {
                    setTimezone(value)
                    setError(null)
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select timezone">{getTimezoneLabel(timezone)}</SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reschedule" className="space-y-6 py-2">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Current Schedule</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                View and manage the current schedule for this link.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border p-4 bg-gray-50 dark:bg-gray-800">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{linkTitle}</h4>
                      <p className="text-sm text-gray-500">Schedule details</p>
                    </div>
                    <div className="px-2.5 py-1 bg-primary/15 text-primary text-xs rounded-full font-medium dark:bg-primary/20 dark:text-primary-foreground">
                      {initialStartDate || initialEndDate ? "Scheduled" : "Not scheduled"}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Start Date</p>
                      <p className="font-medium flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1.5 text-primary/70" />
                        {initialStartDate ? formatDateForDisplay(initialStartDate) : "Not set"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">End Date</p>
                      <p className="font-medium flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1.5 text-primary/70" />
                        {initialEndDate ? formatDateForDisplay(initialEndDate) : "Not set"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Time Zone</p>
                    <p className="font-medium">
                      {initialTimezone ? getTimezoneLabel(initialTimezone) : "Default (browser time zone)"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Button
                  onClick={() => setActiveTab("schedule")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Update Schedule
                </Button>

                {(initialStartDate || initialEndDate) && (
                  <Button
                    variant="outline"
                    onClick={handleClearSchedule}
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove Schedule
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="pt-4">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 sm:flex-none">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 sm:flex-none"
            >
              <Check className="h-4 w-4 mr-2" />
              {initialStartDate || initialEndDate ? "Update Schedule" : "Schedule Link"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


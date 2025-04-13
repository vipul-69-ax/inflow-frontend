"use client"

import { useState } from "react"
import { ProfileCard } from "@/components/biolink/linktree/profile-card"
import { ProfileLinks } from "@/components/biolink/linktree/profile-links"
import { MobilePreview } from "@/components/biolink/linktree/mobile-preview"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useInitializeLinksFromBackend } from "@/utils/syncLinks"
import { useInitializeSettingsFromBackend } from "@/utils/syncSettings"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Check, Copy, Share2 } from "lucide-react"
import { toast } from "sonner"
import { useSettingsStore } from "@/storage/settings-store"

export default function DashboardPage() {
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  
  // Get the current user's username - in a real app, this would come from your auth system
  const store = useSettingsStore()

  // Construct the shareable link
  const shareableLink = `https://inflow.chat/${store.username}`

  // Redirect if not authenticated
  useInitializeSettingsFromBackend()
  useInitializeLinksFromBackend()

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(shareableLink)
      .then(() => {
        setCopied(true)
        toast("Link Copied")

        // Reset the copied state after 2 seconds
        setTimeout(() => {
          setCopied(false)
        }, 2000)
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* This div creates proper spacing from the sidebar */}
      <div className="flex-1 p-4 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold dark:text-white transition-colors duration-300">Inflow</h1>
          <div className="flex items-center gap-4">
            <Link
              to="/biolink/theme"
              className="flex items-center gap-2 rounded-full bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              <span className="dark:text-white transition-colors duration-300">Theme</span>
            </Link>
            <Button
              className="flex items-center gap-2 rounded-full bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
              onClick={() => setShareModalOpen(true)}
            >
              <Share2 className="h-4 w-4 text-black dark:text-white" />
              <span className="text-black dark:text-white transition-colors duration-300">Share</span>
            </Button>
          </div>
        </div>

        <div className="mb-6 rounded-lg bg-white dark:bg-gray-800 p-4 shadow-sm transition-colors duration-300">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium dark:text-white transition-colors duration-300">Analytics</h2>
            <button className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 transition-colors duration-300">
              <span className="sr-only">Expand</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="col-span-2">
            <div className="space-y-6">
              {/* Profile Card */}
              <ProfileCard />

              {/* Links section */}
              <ProfileLinks />
            </div>
          </div>
          <div className="hidden md:block">
            <MobilePreview />
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share your Linktree</DialogTitle>
            <DialogDescription>Anyone with this link will be able to view your Linktree profile.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <div
                className="flex flex-1 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer hover:bg-accent hover:text-accent-foreground"
                onClick={copyToClipboard}
              >
                <span className="truncate">{shareableLink}</span>
                <div className="ml-2 flex-shrink-0">
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </div>
              </div>
              <Button onClick={copyToClipboard}>{copied ? "Copied!" : "Copy"}</Button>
            </div>

            <div className="mt-4 flex justify-center space-x-4">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  window.open(
                    `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareableLink)}&text=Check out my Linktree!`,
                    "_blank",
                  )
                }}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
                Twitter
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableLink)}`,
                    "_blank",
                  )
                }}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  window.location.href = `mailto:?subject=Check out my Linktree&body=Here's my Linktree profile: https://inflow.chat/${store.username}`
                }}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

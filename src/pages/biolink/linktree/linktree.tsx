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
import { useTranslation } from "react-i18next"

export default function DashboardPage() {
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const { t } = useTranslation()
  const store = useSettingsStore()
  const shareableLink = `https://inflow.chat/${store.username}`

  useInitializeSettingsFromBackend()
  useInitializeLinksFromBackend()

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(shareableLink)
      .then(() => {
        setCopied(true)
        toast(t("toast.linkCopied"))

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
      <div className="flex-1 p-4 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold dark:text-white transition-colors duration-300">{t("title")}</h1>
          <div className="flex items-center gap-4">
            <Link
              to="/biolink/theme"
              className="flex items-center gap-2 rounded-full bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              <span className="dark:text-white transition-colors duration-300">{t("theme")}</span>
            </Link>
            <Button
              className="flex items-center gap-2 rounded-full bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
              onClick={() => setShareModalOpen(true)}
            >
              <Share2 className="h-4 w-4 text-black dark:text-white" />
              <span className="text-black dark:text-white transition-colors duration-300">{t("share")}</span>
            </Button>
          </div>
        </div>

        <div className="mb-6 rounded-lg bg-white dark:bg-gray-800 p-4 shadow-sm transition-colors duration-300">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium dark:text-white transition-colors duration-300">{t("analytics")}</h2>
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
          <div className="col-span-2 space-y-6">
            <ProfileCard />
            <ProfileLinks />
          </div>
          <div className="hidden md:block">
            <MobilePreview />
          </div>
        </div>
      </div>

      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("shareDialog.title")}</DialogTitle>
            <DialogDescription>{t("shareDialog.description")}</DialogDescription>
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
              <Button onClick={copyToClipboard}>
                {copied ? t("shareDialog.copiedButton") : t("shareDialog.copyButton")}
              </Button>
            </div>

            <div className="mt-4 flex justify-center space-x-4">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  window.open(
                    `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareableLink)}&text=Check out my Linktree!`,
                    "_blank"
                  )
                }}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775..." />
                </svg>
                {t("shareDialog.shareOn.twitter")}
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableLink)}`,
                    "_blank"
                  )
                }}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12..." />
                </svg>
                {t("shareDialog.shareOn.facebook")}
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  window.location.href = `mailto:?subject=Check out my Linktree&body=${t("shareDialog.emailBody")} ${shareableLink}`
                }}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8..." />
                </svg>
                {t("shareDialog.shareOn.email")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

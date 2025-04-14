/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Facebook, Youtube, ChevronRight, Instagram } from "lucide-react"
import { useAuthorizationUrl, useAccessToken, useFacebookPages } from "@/hooks/scheduling/useFacebookScheduler"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useNavigate } from "react-router-dom"

export default function AuthPage() {
  const [mounted, setMounted] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [authCode, setAuthCode] = useState<string | null>(null)
  const { url: facebookAuthUrl, loading: facebookAuthLoading } = useAuthorizationUrl()
  const [facebookPages, setFacebookPages] = useState<any[]>([])
  const navigate = useNavigate()
  const [selectedPage, setSelectedPage] = useState<string | null>(null)
  const [showPageSelectionModal, setShowPageSelectionModal] = useState(false)

  const { token: facebookAccessToken } = useAccessToken(authCode || "")
  const { getFacebookPages } = useFacebookPages()

  const handleSelectPage = (pageId: string) => {
    setSelectedPage(pageId)
  }

  const fetchFacebookPages = async () => {
    const token = localStorage.getItem("fb_access_token")
    if (token) {
      const { data } = await getFacebookPages(token)
      setFacebookPages(data || [])

      // Show the modal when pages are fetched
      if (data && data.length > 0) {
        setShowPageSelectionModal(true)
      }
    }
  }

  const handleConfirmPageSelection = () => {
    if (selectedPage) {
      // Find the selected page data
      const selectedPageData = facebookPages.find((page) => page.id === selectedPage)

      // Store the selected page data in localStorage
      if (selectedPageData) {
        localStorage.setItem("fb_page_data", JSON.stringify(selectedPageData))

        // Navigate to the scheduling page
        navigate("/scheduling/facebook")
      }
    }

    setShowPageSelectionModal(false)
  }

  const navigateWithFacebook=()=>{
    const token = localStorage.getItem("fb_access_token")
    if (token) {
      // Check if page data already exists
      const pageData = localStorage.getItem("fb_page_data")
      if (pageData) {
        navigate("/scheduling/facebook")
      } else {
        // Fetch pages if token exists but no page is selected yet
        fetchFacebookPages()
      }
    }
  }

  useEffect(() => {

    const searchParams = new URLSearchParams(window.location.search)
    const code = searchParams.get("code")
    if (code) {
      setAuthCode(code)
      localStorage.setItem("fb_access_token", facebookAccessToken)
      fetchFacebookPages()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, facebookAccessToken])

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAuth = async (platform: string) => {
    setSelectedPlatform(platform)
    if(platform ==="youtube"){
      navigate("/scheduling/youtube")
    }
    if(platform =="instagram"){
      navigate("/scheduling/instagram")
    }
    if(platform==="facebook"){
    setIsLoading(facebookAuthLoading)
    const token = localStorage.getItem("fb_access_token")
    const page_data = localStorage.getItem("fb_page_data")
    if(token && page_data){
      navigateWithFacebook()
      return
    }
    if(token && !page_data){
      fetchFacebookPages()
      return
    }
    if (facebookAuthUrl && platform === "facebook") {
      window.location.href = facebookAuthUrl
    }
  }

  
  }

  const platforms = [
    {
      id: "facebook",
      name: "Facebook",
      icon: <Facebook className="h-5 w-5" />,
      description: "Schedule posts and videos",
      color: "bg-[#1877F2]",
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: <Youtube className="h-5 w-5" />,
      description: "Schedule videos and shorts",
      color: "bg-[#FF0000]",
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: <Instagram className="h-5 w-5" />,
      description: "Schedule posts and reels",
      color: "bg-[#ff007f]",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  if (!mounted) return null

  return (
    <div className={`min-h-screen w-full flex flex-col`}>
      {/* Header */}
      <motion.header
        className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-2">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-medium text-sm">CS</span>
            </div>
          </motion.div>
          <span className="font-medium text-lg">Social Media Scheduling</span>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Side - Auth Options */}
        <motion.div
          className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-md mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-semibold mb-2">Social Media Scheduling</h1>
              <p className="text-slate-500 dark:text-slate-400">
                Connect your accounts to start scheduling content across platforms
              </p>
            </motion.div>

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
              {platforms.map((platform) => (
                <motion.div key={platform.id} variants={itemVariants} className="relative">
                  <motion.button
                    onClick={() => handleAuth(platform.id)}
                    disabled={isLoading}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 ${
                      isLoading && selectedPlatform === platform.id ? "opacity-80" : ""
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-full ${platform.color} flex items-center justify-center text-white`}
                      >
                        {platform.icon}
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium">{platform.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{platform.description}</p>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {isLoading && selectedPlatform === platform.id ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="w-5 h-5"
                        >
                          <svg className="animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </motion.div>
                      ) : (
                        <motion.div key="arrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <ChevronRight className="h-5 w-5 text-slate-400" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              className="text-xs text-slate-500 dark:text-slate-400 text-center mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              By continuing, you agree to our{" "}
              <a href="#" className="underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline">
                Privacy Policy
              </a>
            </motion.p>
          </div>
        </motion.div>

        {/* Right Side - Preview */}
        <motion.div
          className="hidden md:flex w-1/2 bg-slate-50 dark:bg-slate-900 items-center justify-center p-12"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="relative max-w-lg w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="absolute top-0 left-0 right-0 h-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-4">
                <motion.div
                  className="col-span-2 h-32 bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <span className="text-xs font-medium">Upcoming Posts</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full w-full"></div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full w-3/4"></div>
                  </div>
                </motion.div>

                <motion.div
                  className="h-32 bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                    <span className="text-xs font-medium">Stats</span>
                  </div>
                  <div className="flex items-end h-16">
                    <div className="w-1/4 h-1/3 bg-blue-500 rounded-sm"></div>
                    <div className="w-1/4 h-2/3 bg-purple-500 rounded-sm mx-1"></div>
                    <div className="w-1/4 h-1/2 bg-red-500 rounded-sm"></div>
                    <div className="w-1/4 h-3/4 bg-green-500 rounded-sm ml-1"></div>
                  </div>
                </motion.div>

                <motion.div
                  className="col-span-3 h-40 bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="text-xs font-medium">Calendar</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 14 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-8 rounded-md flex items-center justify-center text-xs ${
                          i === 3 || i === 9
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            : "bg-slate-100 dark:bg-slate-700"
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Facebook Page Selection Modal */}
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
                  onClick={() => handleSelectPage(page.id)}
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


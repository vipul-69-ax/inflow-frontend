// SchedulingRouter.jsx

"use client"

import { useState, useEffect } from "react"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { Check, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import InstagramDashboardPage from "@/pages/monitoring/instagram/ig-dashboard"
import TiktokDashboard from "@/pages/monitoring/tiktok/tiktok-dashboard"
import YoutubeDashboard from "@/pages/monitoring/youtube/yt-dashboard"

function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeDashboard, setActiveDashboard] = useState<string>("tiktok")

  useEffect(() => {
    if (location.pathname === "/instagram") {
      setActiveDashboard("instagram")
    } else if (location.pathname === "/tiktok") {
      setActiveDashboard("tiktok")
    } else if (location.pathname === "/youtube") {
      setActiveDashboard("youtube")
    }
  }, [location.pathname])

  const handleDashboardChange = (dashboard: string) => {
    setActiveDashboard(dashboard)
    navigate(`/monitoring/${dashboard}`)
  }

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Social Media Dashboard</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              {activeDashboard === "instagram" ? "Instagram" : activeDashboard === "tiktok" ? "TikTok" : "YouTube"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleDashboardChange("instagram")} className="flex items-center gap-2">
              Instagram {activeDashboard === "instagram" && <Check className="h-4 w-4 ml-auto" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDashboardChange("tiktok")} className="flex items-center gap-2">
              TikTok {activeDashboard === "tiktok" && <Check className="h-4 w-4 ml-auto" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDashboardChange("youtube")} className="flex items-center gap-2">
              YouTube {activeDashboard === "youtube" && <Check className="h-4 w-4 ml-auto" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Routes>
        <Route path="/instagram" element={<InstagramDashboardPage />} />
        <Route path="/tiktok" element={<TiktokDashboard />} />
        <Route path="/youtube" element={<YoutubeDashboard />} />
        <Route path="/" element={<TiktokDashboard />} />
      </Routes>
    </main>
  )
}

export default Layout

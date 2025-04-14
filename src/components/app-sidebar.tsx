"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Calendar, Home, ChevronRight, InstagramIcon, LinkIcon, LogOut, Star, Crown, Zap } from "lucide-react"
import { useAuthStore } from "@/storage/auth"
import { useSettingsStore } from "@/storage/settings-store"

const ModernSidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const is_paid = useSettingsStore((state) => state.is_paid)

  // Ensure component is ready before rendering with store values
  useEffect(() => {
    setIsReady(true)
  }, [])

  // Fixed active state logic to ensure only one route is active
  const isActive = (path: string) => {
    if (location.pathname === "/") {
      return path === "/"
    }
    if (path === "/") {
      return location.pathname === "/"
    }
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const navItems = [
    {
      id: "biolink",
      path: "/biolink",
      label: "Biolink",
      icon: LinkIcon,
    },
    {
      id: "monitoring",
      path: "/monitoring",
      label: "Monitoring",
      icon: Calendar,
    },
    {
      id: "scheduling",
      path: "/scheduling",
      label: "Scheduling",
      icon: InstagramIcon,
    },
  ]

  // Get the appropriate icon and color scheme based on plan type
  const getPlanDetails = () => {
    if (is_paid === "PRO") {
      return {
        icon: Crown,
        gradientFrom: "from-purple-400",
        gradientTo: "to-purple-600",
        label: "Pro Plan",
      }
    } else if (is_paid === "GURU") {
      return {
        icon: Zap,
        gradientFrom: "from-amber-400",
        gradientTo: "to-amber-600",
        label: "Guru Plan",
      }
    } else {
      return {
        icon: Star,
        gradientFrom: "from-amber-400",
        gradientTo: "to-amber-600",
        label: "Upgrade to Premium",
      }
    }
  }

  // Don't calculate plan details until component is ready
  const planDetails = isReady
    ? getPlanDetails()
    : {
        icon: Star,
        gradientFrom: "from-amber-400",
        gradientTo: "to-amber-600",
        label: "Upgrade to Premium",
      }

  if (!isReady) {
    return (
      <div className="w-20 h-screen fixed left-0 top-0 z-50 flex flex-col backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-r border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 border-4 border-t-indigo-500 border-r-transparent border-b-indigo-500 border-l-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-20 h-screen fixed left-0 top-0 z-50 flex flex-col backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-r border-gray-200/50 dark:border-gray-700/50 shadow-lg group hover:w-64 transition-all duration-300">
      {/* Header */}
      <div className="p-3 border-b border-gray-200/50 dark:border-gray-700/50 flex justify-center group-hover:justify-start">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
            <Home className="h-5 w-5" />
          </div>
          <h1 className="hidden group-hover:block text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 transition-opacity duration-300">
            App Navigation
          </h1>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isItemActive = isActive(item.path)
            const isHovered = hoveredItem === item.id

            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`relative flex items-center gap-3 px-2 py-3 rounded-xl transition-all duration-300 group/item overflow-hidden ${
                    isItemActive
                      ? "bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                  }`}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div
                    className={`flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-lg transition-all duration-300 ${
                      isItemActive
                        ? "bg-indigo-500 text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover/item:bg-gray-200 dark:group-hover/item:bg-gray-700"
                    }`}
                  >
                    <item.icon
                      className={`h-5 w-5 transition-transform duration-300 ${isHovered ? "scale-110" : ""}`}
                    />
                  </div>

                  <span className="font-medium hidden group-hover:block whitespace-nowrap transition-opacity duration-300 truncate">
                    {item.label}
                  </span>

                  {isItemActive && (
                    <div className="absolute right-3 hidden group-hover:flex items-center">
                      <ChevronRight className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                    </div>
                  )}

                  {isItemActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-indigo-500 rounded-r-full" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200/50 dark:border-gray-700/50 mt-auto">
        {/* Premium Button or Current Plan Display */}
        {is_paid === null ? (
          <Link
            to="/payments"
            className="w-full flex items-center gap-3 px-2 py-3 mb-2 rounded-xl transition-all duration-300 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-amber-500/10 hover:to-amber-600/10 group/premium overflow-hidden"
            onMouseEnter={() => setHoveredItem("premium")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md transition-all duration-300 group-hover/premium:scale-105">
              <Star
                className={`h-5 w-5 transition-transform duration-300 ${hoveredItem === "premium" ? "scale-110" : ""}`}
              />
            </div>
            <span className="font-medium hidden group-hover:block whitespace-nowrap transition-opacity duration-300 truncate">
              Upgrade to Premium
            </span>
          </Link>
        ) : (
          <div
            className="w-full flex items-center gap-3 px-2 py-3 mb-2 rounded-xl transition-all duration-300 text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 group/plan overflow-hidden"
            onMouseEnter={() => setHoveredItem("plan")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div
              className={`flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-lg bg-gradient-to-br ${planDetails.gradientFrom} ${planDetails.gradientTo} text-white shadow-md transition-all duration-300 group-hover/plan:scale-105`}
            >
              <planDetails.icon
                className={`h-5 w-5 transition-transform duration-300 ${hoveredItem === "plan" ? "scale-110" : ""}`}
              />
            </div>
            <div className="hidden group-hover:block min-w-0 flex-1">
              <span className="font-medium whitespace-nowrap transition-opacity duration-300 block truncate">
                {planDetails.label}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Active subscription</p>
            </div>
            <Link to="/payments" className="ml-auto hidden group-hover:block flex-shrink-0">
              <div className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">Manage</div>
            </Link>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-2 py-3 rounded-xl transition-all duration-300 text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 group/logout overflow-hidden"
        >
          <div className="flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover/logout:bg-gray-200 dark:group-hover/logout:bg-gray-700 transition-all duration-300">
            <LogOut className="h-5 w-5" />
          </div>
          <span className="font-medium hidden group-hover:block whitespace-nowrap transition-opacity duration-300 truncate">
            Logout
          </span>
        </button>

        {/* Copyright */}
        <div className="mt-2 flex justify-center group-hover:justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-400 hidden group-hover:block">© 2025 Your App</p>
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-70 hover:opacity-100 transition-opacity cursor-pointer" />
        </div>
      </div>
    </div>
  )
}

export default ModernSidebar

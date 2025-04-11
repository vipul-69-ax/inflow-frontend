/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { AtSign, Facebook, Github, Instagram, Linkedin, Mail, Twitter, Youtube } from "lucide-react"
import { api } from "@/hooks/api/auth/useAuth"



// Add request interceptor to include auth token// Helper function to combine class names
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

// Helper function to adjust color brightness
function adjustColor(hex: string, percent = -20): string {
  if (!hex || !hex.startsWith("#") || hex.length !== 7) return hex

  // Convert hex to RGB
  let r = Number.parseInt(hex.substring(1, 3), 16)
  let g = Number.parseInt(hex.substring(3, 5), 16)
  let b = Number.parseInt(hex.substring(5, 7), 16)

  // Adjust brightness
  r = Math.max(0, Math.min(255, r + (r * percent) / 100))
  g = Math.max(0, Math.min(255, g + (g * percent) / 100))
  b = Math.max(0, Math.min(255, b + (b * percent) / 100))

  // Convert back to hex
  return `#${Math.round(r).toString(16).padStart(2, "0")}${Math.round(g).toString(16).padStart(2, "0")}${Math.round(b).toString(16).padStart(2, "0")}`
}

export default function UserProfilePage() {
  // Get username from URL
  const username = window.location.pathname.split("/").pop() || ""

  const [userData, setUserData] = useState<any>(null)
  const [activeLinks, setActiveLinks] = useState<any[]>([])
  const [activeSocialLinks, setActiveSocialLinks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getData = async () => {
    try {
      setLoading(true)
      const res = await api.post("/getProfile", { username })
      setUserData(res.data)
        console.log(res.data)
      // Filter active links
      if (res.data?.regularLinks) {
        setActiveLinks(res.data.regularLinks.filter((link: any) => link.active))
      }

      // Filter active social links
      if (res.data?.socialLinks) {
        setActiveSocialLinks(res.data.socialLinks.filter((link: any) => link.active))
      }

      setLoading(false)
    } catch (err) {
      console.error("Error fetching profile:", err)
      setError("Failed to load profile")
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [username])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white text-lg">Loading profile...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800">Profile Not Found</h1>
          <p className="mt-2 text-gray-600">The profile you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  // Get background style based on theme settings
  const getBackgroundStyle = () => {
    // If using custom theme from theme settings
    if (userData.settings.themeSettings?.themeColor === "custom" && userData.settings.themeSettings?.customBackground) {
      if (userData.settings.themeSettings.backgroundType === "gradient") {
        return {
          background: `linear-gradient(135deg, ${userData.settings.themeSettings.customBackground}, ${adjustColor(userData.settings.themeSettings.customBackground)})`,
        }
      }
      return { backgroundColor: userData.settings.themeSettings.customBackground }
    }

    // Use the theme images for the backgrounds
    switch (userData.settings.themeSettings?.themeColor) {
      case "leafy":
        return {
          background: "linear-gradient(135deg, #4CAF50, #8BC34A)",
        }
      case "funky":
        return {
          background: "linear-gradient(135deg, #FF9800, #FF5722)",
        }
      case "starry":
        return {
          background: "linear-gradient(135deg, #2196F3, #3F51B5)",
        }
      case "pink-clouds":
        return {
          background: "linear-gradient(135deg, #E91E63, #9C27B0)",
        }
      case "teal-gradient":
        return {
          background: "linear-gradient(135deg, #009688, #4DB6AC)",
        }
      case "mushroom-pattern":
        return {
          background: "linear-gradient(135deg, #795548, #A1887F)",
        }
      case "noisy-gradient":
        return {
          background: "linear-gradient(135deg, #8BC34A, #CDDC39)",
        }
      case "vibrant-dots":
        return {
          background: "linear-gradient(135deg, #673AB7, #3F51B5)",
        }
      case "blue-purple":
        return {
          background: "linear-gradient(135deg, #2196F3, #9C27B0)",
        }
      case "olive-zen":
        return {
          background: "linear-gradient(135deg, #808000, #556B2F)",
        }
      case "golden-royale":
        return {
          background: "linear-gradient(135deg, #FFD700, #FFA500)",
        }
      case "lemon-zest":
        return {
          background: "linear-gradient(135deg, #FFEB3B, #FFC107)",
        }
      case "tunnel":
        return {
          background: "linear-gradient(135deg, #212121, #424242)",
        }
      case "funky-carnival":
        return {
          background: "linear-gradient(135deg, #FF4081, #7C4DFF)",
        }
      case "peach-fuzz":
        return {
          background: "linear-gradient(135deg, #FFCCBC, #FFAB91)",
        }
      case "neo-memphis":
        return {
          background: "linear-gradient(135deg, #00BCD4, #18FFFF)",
        }
      default:
        return {
          background: "linear-gradient(135deg, #9333ea, #e11d48)",
        }
    }
  }

  // Get text color based on theme
  const getTextColor = () => {
    if (userData.settings.themeSettings?.customTextColor && userData.settings.themeSettings?.themeColor === "custom") {
      return { color: userData.settings.themeSettings.customTextColor }
    }

    // Set appropriate text colors for each theme
    switch (userData.settings.themeSettings?.themeColor) {
      case "leafy":
        return { color: "#2c3e50" }
      case "funky":
        return { color: "#ffffff" }
      case "starry":
        return { color: "#ffffff" }
      case "pink-clouds":
        return { color: "#ffffff" }
      case "teal-gradient":
        return { color: "#ffffff" }
      case "mushroom-pattern":
        return { color: "#5d4037" }
      case "noisy-gradient":
        return { color: "#33691e" }
      case "vibrant-dots":
        return { color: "#ffffff" }
      case "blue-purple":
        return { color: "#ffffff" }
      case "olive-zen":
        return { color: "#4b5320" }
      case "golden-royale":
        return { color: "#1e3a8a" }
      case "lemon-zest":
        return { color: "#8B8000" }
      case "tunnel":
        return { color: "#ffffff" }
      case "funky-carnival":
        return { color: "#ffffff" }
      case "peach-fuzz":
        return { color: "#774936" }
      case "neo-memphis":
        return { color: "#ffffff" }
      default:
        return { color: "#ffffff" }
    }
  }

  // Get button style based on theme
  const getButtonStyle = () => {
    // Get button radius based on settings
    const buttonRadius =
      {
        rounded: "rounded-full",
        soft: "rounded-lg",
        square: "rounded-none",
      }[userData.settings.themeSettings?.buttonStyle] || "rounded-lg"

    const buttonShadow = userData.settings.themeSettings?.buttonShadow ? "shadow-md" : ""

    // If using custom theme
    if (userData.settings.themeSettings?.themeColor === "custom") {
      return `${buttonRadius} ${buttonShadow} bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-sm transition-all`
    }

    // Theme-specific button styles
    switch (userData.settings.themeSettings?.themeColor) {
      case "leafy":
        return `${buttonRadius} ${buttonShadow} bg-[#2c3e50]/15 hover:bg-[#2c3e50]/25 text-[#2c3e50] border border-[#2c3e50]/20 backdrop-blur-sm transition-all`
      case "funky":
        return `${buttonRadius} ${buttonShadow} bg-white/25 hover:bg-white/35 text-white border border-white/30 backdrop-blur-sm transition-all`
      case "starry":
        return `${buttonRadius} ${buttonShadow} bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-sm transition-all`
      case "pink-clouds":
        return `${buttonRadius} ${buttonShadow} bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all`
      case "teal-gradient":
        return `${buttonRadius} ${buttonShadow} bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all`
      case "mushroom-pattern":
        return `${buttonRadius} ${buttonShadow} bg-[#5d4037]/10 hover:bg-[#5d4037]/20 text-[#5d4037] border border-[#5d4037]/30 backdrop-blur-sm transition-all`
      case "noisy-gradient":
        return `${buttonRadius} ${buttonShadow} bg-[#33691e]/15 hover:bg-[#33691e]/25 text-[#33691e] border border-[#33691e]/30 backdrop-blur-sm transition-all`
      case "vibrant-dots":
        return `${buttonRadius} ${buttonShadow} bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all`
      case "blue-purple":
        return `${buttonRadius} ${buttonShadow} bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all`
      case "olive-zen":
        return `${buttonRadius} ${buttonShadow} bg-[#4b5320]/15 hover:bg-[#4b5320]/25 text-[#4b5320] border border-[#4b5320]/20 backdrop-blur-sm transition-all`
      case "golden-royale":
        return `${buttonRadius} ${buttonShadow} bg-[#f9d423]/20 hover:bg-[#f9d423]/30 text-[#1e3a8a] border border-[#f9d423]/30 backdrop-blur-sm transition-all`
      case "lemon-zest":
        return `${buttonRadius} ${buttonShadow} bg-[#8B8000]/15 hover:bg-[#8B8000]/25 text-[#8B8000] border border-[#8B8000]/20 backdrop-blur-sm transition-all`
      case "tunnel":
        return `${buttonRadius} ${buttonShadow} bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-sm transition-all`
      case "funky-carnival":
        return `${buttonRadius} ${buttonShadow} bg-[#f9d423]/20 hover:bg-[#f9d423]/30 text-white border border-[#f9d423]/30 backdrop-blur-sm transition-all`
      case "peach-fuzz":
        return `${buttonRadius} ${buttonShadow} bg-[#e07a5f]/15 hover:bg-[#e07a5f]/25 text-[#774936] border border-[#e07a5f]/20 backdrop-blur-sm transition-all`
      case "neo-memphis":
        return `${buttonRadius} ${buttonShadow} bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all`
      default:
        return `${buttonRadius} ${buttonShadow} bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all`
    }
  }

  // Get font family based on theme settings
  const getFontFamily = () => {
    if (!userData.settings.themeSettings?.fontFamily || userData.settings.themeSettings.fontFamily === "default") {
      return "font-sans"
    }

    const fonts = {
      serif: "font-serif",
      mono: "font-mono",
      rounded: "font-sans",
      display: "font-serif",
    }

    return fonts[userData.settings.themeSettings.fontFamily as keyof typeof fonts] || "font-sans"
  }

  // Get animation class for theme preview
  const getAnimationClass = () => {
    if (userData.settings.themeSettings?.backgroundType === "animated" || userData.settings.themeSettings?.themeColor === "rainbow") {
      return "animate-gradient-x"
    }
    return ""
  }

  const renderIcon = (name: string) => {
    switch (name) {
      case "Instagram":
        return <Instagram className="h-5 w-5" />
      case "Twitter":
        return <Twitter className="h-5 w-5" />
      case "Facebook":
        return <Facebook className="h-5 w-5" />
      case "LinkedIn":
        return <Linkedin className="h-5 w-5" />
      case "YouTube":
        return <Youtube className="h-5 w-5" />
      case "TikTok":
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
          </svg>
        )
      case "Email":
        return <Mail className="h-5 w-5" />
      case "Github":
        return <Github className="h-5 w-5" />
      default:
        return <AtSign className="h-5 w-5" />
    }
  }

  // Add CSS for animations
  const animationStyles = `
    @keyframes gradient-x {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .animate-gradient-x {
      background-size: 200% 200%;
      animation: gradient-x 15s ease infinite;
    }
  `

  return (
    <>
      <style>{animationStyles}</style>
      <div
        className={cn("min-h-screen w-full py-10", getAnimationClass(), getFontFamily())}
        style={getBackgroundStyle()}
      >
        <div className="max-w-md mx-auto px-4">
          {/* Profile Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="h-28 w-28 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm p-1">
              {userData.settings.profileImage ? (
            <div className="h-24 w-24 rounded-full overflow-hidden">
              <img src={userData.settings.profileImage || "/placeholder.svg"} alt={userData.settings.displayName} className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold text-white">
              {userData.settings.displayName
                .split(" ")
                .map((name) => name[0])
                .join("")
                .toUpperCase()}
            </div>
          )}
              </div>
              {userData.settings.verified && (
                <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 border-2 border-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold mb-1" style={getTextColor()}>
              {userData.settings.displayName}
            </h1>
            <p className="text-center opacity-90 max-w-xs" style={getTextColor()}>
              {userData.settings.bio}
            </p>
          </div>

          {/* Social Links */}
          {activeSocialLinks.length > 0 && (
            <div className="flex justify-center gap-3 mb-6">
              {activeSocialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors hover:bg-white/30"
                  aria-label={link.name}
                  style={getTextColor()}
                >
                  {renderIcon(link.name)}
                </a>
              ))}
            </div>
          )}

          {/* Regular Links */}
          <div className="space-y-3 mb-10">
            {activeLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex w-full items-center justify-center py-4 px-4 text-center font-medium",
                  getButtonStyle(),
                )}
                style={getTextColor()}
              >
                {link.thumbnail && (
                  <div className="h-5 w-5 mr-3 rounded-sm overflow-hidden relative flex-shrink-0">
                    <img
                      src={link.thumbnail || "https://via.placeholder.com/20"}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <span>{link.title}</span>
              </a>
            ))}

            {activeLinks.length === 0 && (
              <div className="text-center py-8" style={getTextColor()}>
                <p className="opacity-70">No links have been added yet.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="absolute bottom-5 left-0 right-0 flex justify-center">
            <div className="h-10 w-auto opacity-80 transition-opacity hover:opacity-100">
              <img
                src="/images/logo/inflow-logo.png"
                alt="Inflow Logo"
                className="h-full w-auto object-contain"
                style={{
                  filter: "invert(0)",
                  transition: "filter 0.3s ease",
                  opacity:  0.9 ,
                }}
              />
            </div>
          </div>
        
        </div>
      </div>
    </>
  )
}

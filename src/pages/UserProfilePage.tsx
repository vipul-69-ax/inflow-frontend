/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { AtSign, Facebook, Github, Instagram, Linkedin, Mail, Twitter, Youtube } from "lucide-react"
import { api } from "@/hooks/api/auth/useAuth"
import { useSettingsStore } from "@/storage/settings-store"
import ButtonToShow from "@/components/biolink/linktree/preview-buttons"



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
  const { displayName, bio, profileImage, themeSettings } = useSettingsStore()
  const username = window.location.pathname.split("/").pop() || ""

  const [userData, setUserData] = useState<any>(null)
  const [activeLinks, setActiveLinks] = useState<any[]>([])
  const [activeSocialLinks, setActiveSocialLinks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [gfg, setSettings] = useState<any>(null)
  //const socialLinks;


  const getData = async () => {
    try {
      setLoading(true)
      const res = await api.post("/getProfile", { username })
      setUserData(res.data)
      console.log(res.data)
      //socialLinks
      // Filter active links
      if (res.data?.regularLinks) {
        setActiveLinks(res.data.regularLinks.filter((link: any) => link.active))
      }

      // Filter active social links
      if (res.data?.socialLinks) {
        setActiveSocialLinks(res.data.socialLinks.filter((link: any) => link.active))
      }

      if(res.data?.settings) {
        setSettings(res.data.settings)
        console.log(gfg);
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



  const getBackgroundType = () => {
    // If using custom theme from theme settings
    if (themeSettings?.themeColor === "custom" && themeSettings?.customBackground) {
      if (themeSettings.backgroundType === "gradient") {
        return {
          background: `linear-gradient(135deg, ${themeSettings.customBackground}, ${adjustColor(themeSettings.customBackground)})`,
        }
      }
      return { backgroundColor: themeSettings.customBackground }
    }

    // Use the theme images for the backgrounds
    switch (gfg.themeSettings?.themeColor) {
      case "leafy":
        return {
          backgroundImage: "url('/images/themes/leafy.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      case "funky":
        return {
          backgroundImage: "url('/images/themes/funky.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      case "starry":
        return {
          backgroundImage: "url('/images/themes/starry.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      case "pink-clouds":
        return {
          backgroundImage: "url('/images/themes/pink-clouds.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      case "teal-gradient":
        return {
          backgroundImage: "url('/images/themes/teal-gradient.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      case "mushroom-pattern":
        return {
          backgroundImage: "url('/images/themes/mushroom-pattern.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      case "noisy-gradient":
        return {
          backgroundImage: "url('/images/themes/noisy-gradient.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      case "vibrant-dots":
        return {
          backgroundImage: "url('/images/themes/vibrant-dots.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      case "blue-purple":
        return {
          backgroundImage: "url('/images/themes/blue-purple.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      // New themes
      case "olive-zen":
        return {
          backgroundImage: "url('/images/themes/olive-zen.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      case "golden-royale":
        return {
          backgroundImage: "url('/images/themes/golden-royale.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      case "lemon-zest":
        return {
          backgroundImage: "url('/images/themes/lemon-zest.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      case "tunnel":
        return {
          backgroundImage: "url('/images/themes/tunnel.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      case "funky-carnival":
        return {
          backgroundImage: "url('/images/themes/funky-carnival.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      case "peach-fuzz":
        return {
          backgroundImage: "url('/images/themes/peach-fuzz.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      case "neo-memphis":
        return {
          backgroundImage: "url('/images/themes/neo-memphis.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      default:
        return {
          background: "linear-gradient(135deg, #9333ea, #e11d48)",
        }
    }
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
    console.log(gfg.themeSettings.themeColor);
    switch (gfg.themeSettings?.themeColor) {
      case "leafy":
        return {
          //background: "linear-gradient(to bottom right, #f8fafc, #e2e8f0)",
          background: "linear-gradient(to bottom right, #f5f7f5, #e5eae7 50%, #cfd9d6)",
        }
      case "funky":
        return {
          background: "linear-gradient(to top right, #ec4899, #fdba74, #fef08a)",
        }
      case "starry":
        return {
          background: "linear-gradient(to bottom, #172554, #0f172a, #000000)",
        }
      case "pink-clouds":
        return {
          background: "linear-gradient(to bottom, #fbcfe8, #fce7f3, #fff1f2)",
        }
      case "teal-gradient":
        return {
          background: "linear-gradient(to bottom, #22b8cf, #2ab6a7 50%, #20c997)",
        }
      case "mushroom-pattern":
        return {
          background: "linear-gradient(to right, #fecdd3, #fde68a, #ffe4e6)",
        }
      case "noisy-gradient":
        return {
          background: "linear-gradient(to bottom, #d1fac7, #ffd60a)",
        }
      case "vibrant-dots":
        return {
          background: "linear-gradient(to right, #e11d48, #ef4444, #f97316)",
        }
      case "blue-purple":
        return {
          background: "linear-gradient(to bottom right, #06b6d4, #3b82f6, #a855f7)",
        }
      case "olive-zen":
        return {
          background: "linear-gradient(to bottom right, #dcfce7, #d1fae5)",
        }
      case "golden-royale":
        return {
          background: "linear-gradient(135deg, #38bdf8, #fcd34d)",
        }
      case "lemon-zest":
        return {
          background: "linear-gradient(to right, #fef9c3, #fef08a)",
        }
      case "tunnel":
        return {
          background: " linear-gradient(to bottom, #1f2937, #030712)",
        }
      case "funky-carnival":
        return {
          background: "linear-gradient(to bottom, #581c87, #6b21a8, #581c87)",
        }
      case "peach-fuzz":
        return {
          background: "linear-gradient(to right, #ffedd5, #fed7aa)",
        }
      case "neo-memphis":
        return {
          background: " linear-gradient(to right, #2563eb, #4f46e5)",
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
    //console.log(gfg.themeSettings.fontFamily);

    return {
      fontFamily: `"${gfg.themeSettings.fontFamily}", sans-serif`
    }
  }


  const getFont = () => {

    if (!gfg.themeSettings?.fontFamily || gfg.themeSettings.fontFamily === "default") {
      return "default"
    }
  
    return gfg.themeSettings.fontFamily
  }

  
  const getButtonColor = () => {
    //console.log(themeSettings.customTextColor);
    if (gfg.themeSettings.buttonColor) {
      return gfg.themeSettings.buttonColor
    }
    else{
      return "#ffffff"
    }
  }
  

  const getButtonTextColor = () => {
    //console.log(themeSettings.customTextColor);
    if (gfg.themeSettings.buttonFontColor) {
      return gfg.themeSettings.buttonFontColor
    }
    else{
      return "#ffffff"
    }
  }

  const getButtonBorderCurve = () => {
    //console.log(themeSettings.customTextColor);
    if (gfg.themeSettings.buttonBorderCurve) {
      return gfg.themeSettings.buttonBorderCurve
    }
    else{
      return "rounded-full"
    }
  }

  const getButtonType = () => {
    //console.log(themeSettings.customTextColor);
    if (gfg.themeSettings.buttonType) {
      return gfg.themeSettings.buttonType
    }
    else{
      return "transparent"
    }
  }

  // Determine if the logo should be inverted based on the theme
  const shouldInvertLogo = () => {
    // Light themes that need dark (inverted) logo
    const lightThemes = [
      "leafy",
      "pink-clouds",
      "mushroom-pattern",
      "noisy-gradient",
      "olive-zen",
      "golden-royale",
      "lemon-zest",
      "peach-fuzz",
    ]

    return lightThemes.includes(themeSettings?.themeColor || "")
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
    <div style={getBackgroundStyle()}>
      <style>{animationStyles}</style>
      {/* getBackgroundStyle(); */}
      <div className={cn("flex flex-col items-center")}>
      <div className="relative w-full max-w-[280px] overflow-hidden rounded-[40px] border-[8px] border-gray-800 bg-white shadow-xl">
        {/* Notch */}
        <div className="absolute left-1/2 top-0 h-6 w-32 -translate-x-1/2 rounded-b-xl bg-gray-800"></div>

        {/* Phone screen */}
        <div
          className={cn("relative h-[580px] w-full overflow-y-auto", getAnimationClass())}
          style={getBackgroundType()}
        >
          {/* Content */}
          <div className={cn("flex h-full flex-col items-center px-4 pt-12 pb-6")} style={getFontFamily()}>
            {/* Profile */}
            <div className="mb-4 flex flex-col items-center">
              <div className="mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-white/30 to-white/10 text-2xl font-bold backdrop-blur-sm">
                {profileImage ? (
                  <img
                    src={profileImage || "/placeholder.svg"}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span style={getTextColor()}>
                    {displayName
                      .split(" ")
                      .map((name) => name[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                )}
              </div>
              <h2 className="mb-1 text-xl font-bold" style={getTextColor()}>
                {gfg.displayName || "Your Name"}
              </h2>
              <p className="text-center text-sm opacity-80" 
              style={getTextColor()}
              >
                {gfg.bio || "Your bio..."}
              </p>
            </div>

            {/* Social Icons - Only show user-added ones */}
            {activeSocialLinks.length > 0 && (
              <div className="mb-6 flex flex-wrap justify-center gap-2">
                {activeSocialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors hover:bg-white/30"
                    aria-label={social.name}
                  >
                    {
                      renderIcon(social.name)
                    }
                  </a>
                ))}
              </div>
            )}

            {/*button component*/}
            {/* Links - Only show user-added ones */}
            <div className="flex flex-col gap-5">
              {activeLinks
                .filter((link) => link.active)
                .map((link) => (
                  
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center py-3 px-4"
                  >
                    <ButtonToShow
                      backgroundColor={getButtonColor()}
                      textColor={getButtonTextColor()}
                      borderRadiusClass={getButtonBorderCurve()}
                      buttonType={getButtonType()}
                      title={link.title}
                      fontFamily={getFont()}
                      thumbnail={
                          <img
                            src={link.thumbnail || "/placeholder.svg"}
                            alt=""
                            className="h-8 w-8 mr-2 rounded-sm overflow-hidden relative flex-shrink-0"
                          />
                      }
                    />
                  </a>

                ))}

              {activeLinks.length === 0 && (
                <div
                  className={cn(
                    "flex w-full items-center justify-center py-3 px-4 text-center text-sm font-medium",
                    getPlaceholderLinkStyle(),
                  )}
                >
                  Add links to see them here
                </div>
              )}
            </div>
          </div>

          {/* Company Logo - Always visible */}
          <div className="absolute bottom-5 left-0 right-0 flex justify-center">
            <div className="h-10 w-auto opacity-80 transition-opacity hover:opacity-100">
              <img
                src="/images/logo/inflow-logo.png"
                alt="Inflow Logo"
                className="h-full w-auto object-contain"
                style={{
                  filter: shouldInvertLogo() ? "invert(0)" : "invert(1)",
                  transition: "filter 0.3s ease",
                  opacity: shouldInvertLogo() ? 0.9 : 0.8,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Phone bottom bar */}
      <div className="mt-1 h-1 w-16 rounded-full bg-gray-800"></div>
    </div>
    </div>
  )
}

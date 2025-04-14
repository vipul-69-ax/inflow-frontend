"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { useSettingsStore } from "@/storage/settings-store"
import { useLinksStore } from "@/storage/links-store"
import { AtSign, Facebook, Github, Instagram, Linkedin, Mail, Twitter, Youtube } from "lucide-react"

interface MobilePreviewProps {
  className?: string
}

export function MobilePreview({ className }: MobilePreviewProps) {
  const { displayName, bio, profileImage, themeSettings } = useSettingsStore()
  const { socialLinks, regularLinks } = useLinksStore()
  console.log("themeSettings", themeSettings)
  // Helper function to adjust color brightness
  const adjustColor = (hex: string): string => {
    return hex // Simplified for this example
  }

  // Improve the getBackgroundStyle function to handle theme changes more effectively
  const getBackgroundStyle = () => {
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
    switch (themeSettings?.themeColor) {
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

  // Enhance text color function to better match each theme
  const getTextColor = () => {
    if (themeSettings?.customTextColor && themeSettings?.themeColor === "custom") {
      return { color: themeSettings.customTextColor }
    }

    // Set appropriate text colors for each theme
    switch (themeSettings?.themeColor) {
      case "leafy":
        return { color: "#2c3e50" }
      case "funky":
        return { color: "#ffffff" }
      case "starry":
        return { color: "#ffffff" }
      case "pink-clouds":
        return { color: "#d81b60" }
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
      // New themes
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






  // Improve button styling to match each theme perfectly
  const getButtonStyle = () => {
    // Get button radius based on settings
    const buttonRadius =
      {
        rounded: "rounded-full",
        soft: "rounded-lg",
        square: "rounded-none",
      }[themeSettings?.buttonStyle] || "rounded-full"

    const buttonShadow = themeSettings?.buttonShadow ? "shadow-md" : ""

    // If using custom theme
    if (themeSettings?.themeColor === "custom") {
      return `${buttonRadius} ${buttonShadow} bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-sm transition-all`
    }

    // Theme-specific button styles
    switch (themeSettings?.themeColor) {
      case "leafy":
        return `${buttonRadius} ${buttonShadow} bg-[#2c3e50]/15 hover:bg-[#2c3e50]/25 text-[#2c3e50] border border-[#2c3e50]/20 backdrop-blur-sm transition-all`
      case "funky":
        return `${buttonRadius} ${buttonShadow} bg-white/25 hover:bg-white/35 text-white border border-white/30 backdrop-blur-sm transition-all`
      case "starry":
        return `${buttonRadius} ${buttonShadow} bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-sm transition-all`
      case "pink-clouds":
        return `${buttonRadius} ${buttonShadow} bg-[#d81b60]/10 hover:bg-[#d81b60]/20 text-[#d81b60] border border-[#d81b60]/30 backdrop-blur-sm transition-all`
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
      // New themes
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
    // if (!themeSettings?.fontFamily || themeSettings.fontFamily === "default") {
    //   return {}
    // }

    // const fonts = {
    //   serif: "font-serif",
    //   mono: "font-mono",
    //   rounded: "font-sans",
    //   display: "font-serif",
    // }

    // return fonts[themeSettings.fontFamily as keyof typeof fonts] || ""

    if (!themeSettings?.fontFamily || themeSettings.fontFamily === "default") {
      return {}
    }
  
    return {
      fontFamily: `"${themeSettings.fontFamily}", sans-serif`
    }
  }

  // Get background opacity

  // Get animation class for theme preview
  const getAnimationClass = () => {
    if (themeSettings?.backgroundType === "animated" || themeSettings?.themeColor === "rainbow") {
      return "animate-gradient-x"
    }
    return ""
  }

  // Get container style for links to ensure proper spacing and alignment
  const getLinkContainerStyle = () => {
    switch (themeSettings?.themeColor) {
      case "leafy":
        return "w-full space-y-2.5 overflow-y-auto px-0.5 pb-16"
      case "mushroom-pattern":
        return "w-full space-y-2.5 overflow-y-auto px-0.5 pb-16"
      case "pink-clouds":
        return "w-full space-y-2.5 overflow-y-auto pb-16"
      case "noisy-gradient":
        return "w-full space-y-2.5 overflow-y-auto pb-16"
      case "vibrant-dots":
        return "w-full space-y-3 overflow-y-auto pb-16"
      case "teal-gradient":
        return "w-full space-y-3 overflow-y-auto pb-16"
      case "blue-purple":
        return "w-full space-y-3 overflow-y-auto pb-16"
      case "funky":
      case "starry":
        return "w-full space-y-3 overflow-y-auto pb-16"
      // New themes
      case "olive-zen":
        return "w-full space-y-2.5 overflow-y-auto px-0.5 pb-16"
      case "golden-royale":
        return "w-full space-y-3 overflow-y-auto pb-16"
      case "lemon-zest":
        return "w-full space-y-2.5 overflow-y-auto px-0.5 pb-16"
      case "tunnel":
        return "w-full space-y-3 overflow-y-auto pb-16"
      case "funky-carnival":
        return "w-full space-y-3 overflow-y-auto pb-16"
      case "peach-fuzz":
        return "w-full space-y-2.5 overflow-y-auto px-0.5 pb-16"
      case "neo-memphis":
        return "w-full space-y-3 overflow-y-auto pb-16"
      default:
        return "w-full space-y-3 overflow-y-auto pb-16"
    }
  }

  // Get placeholder link style that matches the theme
  const getPlaceholderLinkStyle = () => {
    const buttonRadius =
      {
        rounded: "rounded-full",
        soft: "rounded-lg",
        square: "rounded-none",
      }[themeSettings?.buttonStyle] || "rounded-full"

    switch (themeSettings?.themeColor) {
      case "leafy":
        return `${buttonRadius} border border-dashed border-[#2c3e50]/30 text-[#2c3e50]/70`
      case "mushroom-pattern":
        return `${buttonRadius} border border-dashed border-[#5d4037]/30 text-[#5d4037]/70`
      case "pink-clouds":
        return `${buttonRadius} border border-dashed border-[#d81b60]/30 text-[#d81b60]/70`
      case "noisy-gradient":
        return `${buttonRadius} border border-dashed border-[#33691e]/30 text-[#33691e]/70`
      // New themes
      case "olive-zen":
        return `${buttonRadius} border border-dashed border-[#4b5320]/30 text-[#4b5320]/70`
      case "golden-royale":
        return `${buttonRadius} border border-dashed border-[#1e3a8a]/30 text-[#1e3a8a]/70`
      case "lemon-zest":
        return `${buttonRadius} border border-dashed border-[#8B8000]/30 text-[#8B8000]/70`
      case "peach-fuzz":
        return `${buttonRadius} border border-dashed border-[#774936]/30 text-[#774936]/70`
      case "teal-gradient":
      case "vibrant-dots":
      case "blue-purple":
      case "funky":
      case "starry":
      case "tunnel":
      case "funky-carnival":
      case "neo-memphis":
        return `${buttonRadius} border border-dashed border-white/30 text-white/70`
      default:
        return `${buttonRadius} border border-dashed border-white/30 text-white/70`
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

  const renderIcon =(name:string)=>{
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
        return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
        case "Email":
        return <Mail className="h-5 w-5" />
        case "Github":
        return <Github className="h-5 w-5" />
        default:
          return <AtSign className="h-5 w-5" />
  }
}

  // Update the JSX to use these enhanced styling functions
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div>
        {useSettingsStore().is_paid} is paid
      </div>
      <div className="relative w-full max-w-[280px] overflow-hidden rounded-[40px] border-[8px] border-gray-800 bg-white shadow-xl">
        {/* Notch */}
        <div className="absolute left-1/2 top-0 h-6 w-32 -translate-x-1/2 rounded-b-xl bg-gray-800"></div>

        {/* Phone screen */}
        <div
          className={cn("relative h-[580px] w-full overflow-y-auto", getAnimationClass())}
          style={getBackgroundStyle()}
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
                {displayName || "Your Name"}
              </h2>
              <p className="text-center text-sm opacity-80" style={getTextColor()}>
                {bio || "Your bio..."}
              </p>
            </div>

            {/* Social Icons - Only show user-added ones */}
            {socialLinks.length > 0 && (
              <div className="mb-6 flex flex-wrap justify-center gap-2">
                {socialLinks.map((social, index) => (
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
            <div className={getLinkContainerStyle()}>
              {regularLinks
                .filter((link) => link.active)
                .map((link) => (


                  
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex w-full items-center justify-center py-3 px-4 text-sm font-medium",
                      getButtonStyle(),
                    )}
                    style={getTextColor()}
                  >
                    {link.thumbnail && (
                      <div className="h-5 w-5 mr-2 rounded-sm overflow-hidden relative flex-shrink-0">
                        <img src={link.thumbnail || "/placeholder.svg"} alt="" className="h-full w-full object-cover" />
                      </div>
                    )}
                    <span className="truncate">{link.title}</span>
                  </a>
                ))}




              {regularLinks.length === 0 && (
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
  )
}
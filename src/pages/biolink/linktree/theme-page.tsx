"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Share2 } from "lucide-react"
import { MobilePreview } from "@/components/biolink/linktree/mobile-preview"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { HexColorPicker } from "react-colorful"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Link, useNavigate } from "react-router-dom"
import { useSettingsStore } from "@/storage/settings-store"
import { useSettingsHook } from "@/hooks/api/biolink/useSettings"

export default function ThemePage() {
  const { themeSettings, setThemeSettings, appearancePreferences, setAppearancePreference } =
    useSettingsStore()
const {updateSettings} = useSettingsHook()
  const [activeTab, setActiveTab] = useState("themes")
  const [selectedTheme, setSelectedTheme] = useState(() => themeSettings.themeColor || "default")
  const [buttonStyle, setButtonStyle] = useState(() => themeSettings.buttonStyle || "rounded")
  const [buttonShadow, setButtonShadow] = useState(() => themeSettings.buttonShadow || false)
  const [customBgColor, setCustomBgColor] = useState(() => themeSettings.customBackground || "#9333ea")
  const [customTextColor, setCustomTextColor] = useState(() => themeSettings.customTextColor || "#ffffff")
  const [fontFamily, setFontFamily] = useState(() => themeSettings.fontFamily || "default")
  const [backgroundType, setBackgroundType] = useState(() => themeSettings.backgroundType || "solid")
  const [backgroundOpacity, setBackgroundOpacity] = useState(() => themeSettings.backgroundOpacity || 100)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showTextColorPicker, setShowTextColorPicker] = useState(false)

  // Available themes with more aesthetic options
  const themes = [
    {
      id: "leafy",
      name: "Leafy",
      image: "/images/themes/leafy.jpg",
      color: "url('/images/themes/leafy.jpg')",
      textColor: "#2c3e50",
      description: "Minimalist design with elegant leaf illustrations",
      buttonStyle: "bg-[#2c3e50]/20 hover:bg-[#2c3e50]/30 text-[#2c3e50] border border-[#2c3e50]/30",
    },
    {
      id: "funky",
      name: "Funky",
      image: "/images/themes/funky.png",
      color: "url('/images/themes/funky.png')",
      textColor: "white",
      description: "Vibrant gradient with playful geometric elements",
      buttonStyle: "bg-white/20 hover:bg-white/30 text-white border border-white/30",
    },
    {
      id: "starry",
      name: "Starry Night",
      image: "/images/themes/starry.jpg",
      color: "url('/images/themes/starry.jpg')",
      textColor: "white",
      description: "Dark night sky with twinkling stars",
      buttonStyle: "bg-white/20 hover:bg-white/30 text-white border border-white/30",
    },
    {
      id: "pink-clouds",
      name: "Pink Clouds",
      image: "/images/themes/pink-clouds.jpg",
      color: "url('/images/themes/pink-clouds.jpg')",
      textColor: "#d81b60",
      description: "Soft pink cloud gradient",
      buttonStyle: "bg-[#d81b60]/10 hover:bg-[#d81b60]/20 text-[#d81b60] border border-[#d81b60]/30",
    },
    {
      id: "teal-gradient",
      name: "Teal Gradient",
      image: "/images/themes/teal-gradient.jpg",
      color: "url('/images/themes/teal-gradient.jpg')",
      textColor: "white",
      description: "Smooth gradient from blue to green",
      buttonStyle: "bg-white/20 hover:bg-white/30 text-white border border-white/30",
    },
    {
      id: "mushroom-pattern",
      name: "Nature Pattern",
      image: "/images/themes/mushroom-pattern.jpg",
      color: "url('/images/themes/mushroom-pattern.jpg')",
      textColor: "#5d4037",
      description: "Playful pattern with natural elements",
      buttonStyle: "bg-[#5d4037]/10 hover:bg-[#5d4037]/20 text-[#5d4037] border border-[#5d4037]/30",
    },
    {
      id: "noisy-gradient",
      name: "Lime Texture",
      image: "/images/themes/noisy-gradient.jpg",
      color: "url('/images/themes/noisy-gradient.jpg')",
      textColor: "#33691e",
      description: "Textured gradient from green to yellow",
      buttonStyle: "bg-[#33691e]/15 hover:bg-[#33691e]/25 text-[#33691e] border border-[#33691e]/30",
    },
    {
      id: "vibrant-dots",
      name: "Vibrant Dots",
      image: "/images/themes/vibrant-dots.jpg",
      color: "url('/images/themes/vibrant-dots.jpg')",
      textColor: "white",
      description: "Bold red gradient with geometric elements",
      buttonStyle: "bg-white/20 hover:bg-white/30 text-white border border-white/30",
    },
    {
      id: "blue-purple",
      name: "Ocean Twilight",
      image: "/images/themes/blue-purple.jpg",
      color: "url('/images/themes/blue-purple.jpg')",
      textColor: "white",
      description: "Smooth gradient from blue to purple",
      buttonStyle: "bg-white/20 hover:bg-white/30 text-white border border-white/30",
    },
    // New themes
    {
      id: "olive-zen",
      name: "Olive Zen",
      image: "/images/themes/olive-zen.jpg",
      color: "url('/images/themes/olive-zen.jpg')",
      textColor: "#4b5320",
      description: "Calming olive green background",
      buttonStyle: "bg-[#4b5320]/15 hover:bg-[#4b5320]/25 text-[#4b5320] border border-[#4b5320]/20",
    },
    {
      id: "golden-royale",
      name: "Golden Royale",
      image: "/images/themes/golden-royale.jpg",
      color: "url('/images/themes/golden-royale.jpg')",
      textColor: "#1e3a8a",
      description: "Blue background with golden accents",
      buttonStyle: "bg-[#f9d423]/20 hover:bg-[#f9d423]/30 text-[#1e3a8a] border border-[#f9d423]/30",
    },
    {
      id: "lemon-zest",
      name: "Lemon Zest",
      image: "/images/themes/lemon-zest.jpg",
      color: "url('/images/themes/lemon-zest.jpg')",
      textColor: "#8B8000",
      description: "Bright yellow background",
      buttonStyle: "bg-[#8B8000]/15 hover:bg-[#8B8000]/25 text-[#8B8000] border border-[#8B8000]/20",
    },
    {
      id: "tunnel",
      name: "Digital Tunnel",
      image: "/images/themes/tunnel.jpg",
      color: "url('/images/themes/tunnel.jpg')",
      textColor: "white",
      description: "Dark grid-based perspective tunnel",
      buttonStyle: "bg-white/15 hover:bg-white/25 text-white border border-white/20",
    },
    {
      id: "funky-carnival",
      name: "Funky Carnival",
      image: "/images/themes/funky-carnival.jpg",
      color: "url('/images/themes/funky-carnival.jpg')",
      textColor: "white",
      description: "Vibrant purple with gold accents",
      buttonStyle: "bg-[#f9d423]/20 hover:bg-[#f9d423]/30 text-white border border-[#f9d423]/30",
    },
    {
      id: "peach-fuzz",
      name: "Peach Fuzz",
      image: "/images/themes/peach-fuzz.jpg",
      color: "url('/images/themes/peach-fuzz.jpg')",
      textColor: "#774936",
      description: "Soft peachy background",
      buttonStyle: "bg-[#e07a5f]/15 hover:bg-[#e07a5f]/25 text-[#774936] border border-[#e07a5f]/20",
    },
    {
      id: "neo-memphis",
      name: "Neo Memphis",
      image: "/images/themes/neo-memphis.jpg",
      color: "url('/images/themes/neo-memphis.jpg')",
      textColor: "white",
      description: "Vibrant blue with geometric patterns",
      buttonStyle: "bg-white/20 hover:bg-white/30 text-white border border-white/30",
    },
  ]

  // Font options
  const fonts = [
    { id: "default", name: "Default", family: "Inter, sans-serif" },
    { id: "serif", name: "Serif", family: "Georgia, serif" },
    { id: "mono", name: "Monospace", family: "monospace" },
    { id: "rounded", name: "Rounded", family: "system-ui, -apple-system, sans-serif" },
    { id: "display", name: "Display", family: "'Playfair Display', serif" },
  ]

  // Button style options
  const buttonStyles = [
    { id: "rounded", name: "Rounded", preview: "rounded-full" },
    { id: "soft", name: "Soft", preview: "rounded-lg" },
    { id: "square", name: "Square", preview: "rounded-none" },
  ]

  // Background types
  const backgroundTypes = [
    { id: "solid", name: "Solid Color" },
    { id: "gradient", name: "Gradient" },
    { id: "animated", name: "Animated" },
  ]

  // Apply theme changes to settings context
  useEffect(() => {
    // Only update settings when user explicitly changes a value
    // This prevents the infinite update loop
    const timer = setTimeout(() => {
      setThemeSettings({
        themeColor: selectedTheme,
        customBackground: customBgColor,
        customTextColor: customTextColor,
        buttonStyle: buttonStyle,
        buttonShadow: buttonShadow,
        fontFamily: fontFamily,
        backgroundType: backgroundType,
        backgroundOpacity: backgroundOpacity,
      })
    }, 100)

    return () => clearTimeout(timer)
  }, [
    selectedTheme,
    customBgColor,
    customTextColor,
    buttonStyle,
    buttonShadow,
    fontFamily,
    backgroundType,
    backgroundOpacity,
    setThemeSettings,
  ])

  // Update the theme selection to provide immediate visual feedback
  // Enhance the theme selection handler to update the preview immediately
  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId)

    // If selecting a predefined theme, update background type accordingly
    if (themeId !== "custom") {
      setBackgroundType("image")

      // Immediately update theme settings to reflect in the preview
      setThemeSettings({
        ...themeSettings,
        themeColor: themeId,
        backgroundType: "image",
      })
    }
  }

  const navigate = useNavigate()
  // Save theme settings
  const handleSaveTheme = async () => {
    await updateSettings(useSettingsStore.getState())
    navigate("/biolink")
  }

  // Get background style for theme preview

  // Get animation class for theme preview

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900 md:flex-row transition-colors duration-300">

      <div className="flex-1 p-4 md:p-8 dark:bg-gray-900 transition-colors duration-300">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/biolink"
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold dark:text-white">Theme</h1>
          </div>
          <Button variant="outline" className="flex items-center gap-2" onClick={handleSaveTheme}>
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="col-span-2 space-y-8">
            <Tabs defaultValue="themes" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="themes">Themes</TabsTrigger>
                <TabsTrigger value="buttons">Buttons</TabsTrigger>
              </TabsList>

              {/* Themes Tab */}
              <TabsContent value="themes" className="space-y-6">
                <div className="rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 p-6">
                  <h2 className="mb-4 text-lg font-semibold dark:text-white">Choose a Theme</h2>
                  {/* Update the theme selection grid to better display the theme images */}
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {themes.map((theme) => (
                      <div
                        key={theme.id}
                        className={`relative cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                          selectedTheme === theme.id
                            ? "border-purple-600 ring-2 ring-purple-300"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                        onClick={() => handleThemeSelect(theme.id)}
                      >
                        {selectedTheme === theme.id && (
                          <div className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                        )}
                        <div className="flex flex-col">
                          <div className="aspect-[3/5] w-full">
                            <img
                              src={theme.image || "/placeholder.svg"}
                              alt={`${theme.name} theme preview`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-2 text-center">
                            <p className="text-xs font-medium">{theme.name}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedTheme === "custom" && (
                  <div className="rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 p-6">
                    <h2 className="mb-4 text-lg font-semibold dark:text-white">Customize Your Theme</h2>

                    <div className="space-y-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label className="mb-2 block">Background Type</Label>
                          <RadioGroup
                            value={backgroundType}
                            onValueChange={setBackgroundType}
                            className="flex flex-col space-y-2"
                          >
                            {backgroundTypes.map((type) => (
                              <div key={type.id} className="flex items-center space-x-2">
                                <RadioGroupItem value={type.id} id={`bg-type-${type.id}`} />
                                <Label htmlFor={`bg-type-${type.id}`}>{type.name}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        <div>
                          <Label className="mb-2 block">Background Color</Label>
                          <div className="flex items-center gap-2">
                            <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
                              <PopoverTrigger asChild>
                                <button
                                  className="h-10 w-10 rounded-md border border-gray-300 dark:border-gray-600"
                                  style={{ backgroundColor: customBgColor }}
                                  aria-label="Pick background color"
                                />
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-3" align="start">
                                <HexColorPicker color={customBgColor} onChange={setCustomBgColor} />
                              </PopoverContent>
                            </Popover>
                            <input
                              type="text"
                              value={customBgColor}
                              onChange={(e) => setCustomBgColor(e.target.value)}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="mb-2 block">Text Color</Label>
                        <div className="flex items-center gap-2">
                          <Popover open={showTextColorPicker} onOpenChange={setShowTextColorPicker}>
                            <PopoverTrigger asChild>
                              <button
                                className="h-10 w-10 rounded-md border border-gray-300 dark:border-gray-600"
                                style={{ backgroundColor: customTextColor }}
                                aria-label="Pick text color"
                              />
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-3" align="start">
                              <HexColorPicker color={customTextColor} onChange={setCustomTextColor} />
                            </PopoverContent>
                          </Popover>
                          <input
                            type="text"
                            value={customTextColor}
                            onChange={(e) => setCustomTextColor(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="mb-2 block">Background Opacity: {backgroundOpacity}%</Label>
                        <Slider
                          value={[backgroundOpacity]}
                          min={20}
                          max={100}
                          step={5}
                          onValueChange={(value) => setBackgroundOpacity(value[0])}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 p-6">
                  <h2 className="mb-4 text-lg font-semibold dark:text-white">Font Style</h2>
                  <RadioGroup
                    value={fontFamily}
                    onValueChange={setFontFamily}
                    className="grid gap-4 sm:grid-cols-2 md:grid-cols-3"
                  >
                    {fonts.map((font) => (
                      <div key={font.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={font.id} id={`font-${font.id}`} />
                        <Label htmlFor={`font-${font.id}`} style={{ fontFamily: font.family }}>
                          {font.name}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 p-6">
                  <h2 className="mb-4 text-lg font-semibold dark:text-white">Logo Settings</h2>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-logo">Show Logo</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Display the logo at the bottom of your profile
                      </p>
                    </div>
                    <Switch
                      id="show-logo"
                      checked={appearancePreferences.showLogo}
                      onCheckedChange={(checked) => setAppearancePreference("showLogo", checked)}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Buttons Tab */}
              <TabsContent value="buttons" className="space-y-6">
                <div className="rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 p-6">
                  <h2 className="mb-4 text-lg font-semibold dark:text-white">Button Style</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {buttonStyles.map((style) => (
                      <div
                        key={style.id}
                        className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                          buttonStyle === style.id ? "border-purple-600" : "border-gray-200 dark:border-gray-700"
                        }`}
                        onClick={() => setButtonStyle(style.id)}
                      >
                        {buttonStyle === style.id && (
                          <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                        )}
                        <div className="flex flex-col items-center">
                          <div
                            className={`mb-2 h-10 w-full ${style.preview} bg-purple-600 flex items-center justify-center text-white text-xs`}
                          >
                            Button
                          </div>
                        </div>
                        <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">{style.name}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <Label htmlFor="button-shadow">Button Shadow</Label>
                    <Switch id="button-shadow" checked={buttonShadow} onCheckedChange={setButtonShadow} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end">
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleSaveTheme}>
                Save Theme
              </Button>
            </div>
          </div>

          {/* Mobile Preview */}
          <div className="hidden md:block">
            <div className="sticky top-20">
              <h2 className="mb-4 text-lg font-semibold dark:text-white">Preview</h2>
              <MobilePreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


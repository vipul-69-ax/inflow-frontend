"use client"

import { createContext, useContext, type ReactNode, useEffect } from "react"
import { useSettingsStore } from "@/storage/settings-store"

// We'll keep the same context type for compatibility
type NotificationPreferences = {
  emailProfileViews: boolean
  emailLinkClicks: boolean
  emailPurchases: boolean
  emailMarketing: boolean
  pushAll: boolean
  pushMilestones: boolean
  pushEarnings: boolean
}

type AppearancePreferences = {
  showLogo: boolean | undefined
  animations: boolean
  reducedMotion: boolean
}

type ThemeSettings = {
  profileLayout: "classic" | "hero"
  themeColor: string
  customBackground?: string
  customTextColor?: string
  //buttonStyle?: string
  buttonShadow?: boolean
  fontFamily?: string
  backgroundType?: string
  backgroundOpacity?: number
  buttonType?: string,
  buttonColor?:string,
  buttonFontColor?:string,
  buttonBorderCurve?:string,
}

type SettingsContextType = {
  displayName: string
  setDisplayName: (name: string) => void
  username: string
  setUsername: (username: string) => void
  bio: string
  setBio: (bio: string) => void
  website: string
  setWebsite: (website: string) => void
  profileImage: string | null
  setProfileImage: (image: string | null) => void

  email: string
  setEmail: (email: string) => void
  twoFactorEnabled: boolean
  setTwoFactorEnabled: (enabled: boolean) => void

  theme: string
  setTheme: (theme: string) => void
  appearancePreferences: AppearancePreferences
  setAppearancePreference: (key: keyof AppearancePreferences, value: boolean) => void

  themeSettings: ThemeSettings
  setThemeSettings: (settings: Partial<ThemeSettings>) => void

  notificationPreferences: NotificationPreferences
  setNotificationPreference: (key: keyof NotificationPreferences, value: boolean) => void

  saveSettings: () => Promise<void>
  resetSettings: () => void
  isSaving: boolean
  hasChanges: boolean
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

// Add a comment to clarify that the context is synchronized with the store
export function SettingsProvider({ children }: { children: ReactNode }) {
  // Use the Zustand store instead of React state
  // Any changes to the store will automatically update the context
  const {
    displayName,
    setDisplayName,
    username,
    setUsername,
    bio,
    setBio,
    website,
    setWebsite,
    profileImage,
    setProfileImage,
    email,
    setEmail,
    twoFactorEnabled,
    setTwoFactorEnabled,
    theme,
    setTheme,
    appearancePreferences,
    setAppearancePreference,
    themeSettings,
    setThemeSettings,
    notificationPreferences,
    setNotificationPreference,
    saveSettings,
    resetSettings,
    isSaving,
    hasChanges,
  } = useSettingsStore()

  // Apply theme on initial load
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  const value: SettingsContextType = {
    displayName,
    setDisplayName,
    username,
    setUsername,
    bio,
    setBio,
    website,
    setWebsite,
    profileImage,
    setProfileImage,
    email,
    setEmail,
    twoFactorEnabled,
    setTwoFactorEnabled,
    theme,
    setTheme,
    appearancePreferences,
    setAppearancePreference,
    themeSettings,
    setThemeSettings,
    notificationPreferences,
    setNotificationPreference,
    saveSettings,
    resetSettings,
    isSaving,
    hasChanges,
  }

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
import { create } from "zustand"
import { persist } from "zustand/middleware"

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

type SettingsState = {
  // Profile settings
  displayName: string
  username: string
  bio: string
  website: string
  profileImage: string | null

  // Account settings
  email: string
  twoFactorEnabled: boolean

  // Appearance settings
  theme: string
  appearancePreferences: AppearancePreferences

  // Theme settings
  themeSettings: ThemeSettings

  // Notification settings
  notificationPreferences: NotificationPreferences

  // Status
  isSaving: boolean
  hasChanges: boolean

  // Actions
  setDisplayName: (name: string) => void
  setUsername: (username: string) => void
  setBio: (bio: string) => void
  setWebsite: (website: string) => void
  setProfileImage: (image: string | null) => void
  setEmail: (email: string) => void
  setTwoFactorEnabled: (enabled: boolean) => void
  setTheme: (theme: string) => void
  setAppearancePreference: (key: keyof AppearancePreferences, value: boolean) => void
  setThemeSettings: (settings: Partial<ThemeSettings>) => void
  setNotificationPreference: (key: keyof NotificationPreferences, value: boolean) => void
  saveSettings: () => Promise<void>
  resetSettings: () => void

  // New method to initialize settings from database
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initializeFromDb: (dbSettings: any) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Default values - empty strings as requested
      displayName: "",
      username: "",
      bio: "",
      website: "",
      profileImage: null,
      email: "",
      twoFactorEnabled: false,
      theme: "light",
      appearancePreferences: {
        showLogo: true,
        animations: true,
        reducedMotion: false,
      },
      themeSettings: {
        profileLayout: "classic",
        themeColor: "default",
        customBackground: "#9333ea",
        customTextColor: "#ffffff",
        //buttonStyle: "rounded",
        buttonShadow: false,
        fontFamily: "default",
        backgroundType: "solid",
        backgroundOpacity: 100,
        buttonType : "fill",
        buttonColor: "#373d6d",
        buttonFontColor: "#2ec2d6",
        buttonBorderCurve: "rounded-none",
      },
      notificationPreferences: {
        emailProfileViews: true,
        emailLinkClicks: true,
        emailPurchases: true,
        emailMarketing: false,
        pushAll: true,
        pushMilestones: true,
        pushEarnings: true,
      },
      isSaving: false,
      hasChanges: false,

      // Actions
      setDisplayName: (name) => {
        set({ displayName: name, hasChanges: true })
      },
      setUsername: (username) => {
        set({ username, hasChanges: true })
      },
      setBio: (bio) => {
        set({ bio, hasChanges: true })
      },
      setWebsite: (website) => {
        set({ website, hasChanges: true })
      },
      setProfileImage: (image) => {
        set({ profileImage: image, hasChanges: true })
      },
      setEmail: (email) => {
        set({ email, hasChanges: true })
      },
      setTwoFactorEnabled: (enabled) => {
        set({ twoFactorEnabled: enabled, hasChanges: true })
      },
      setTheme: (theme) => {
        set({ theme, hasChanges: true })

        // Apply theme to document
        if (typeof window !== "undefined") {
          localStorage.setItem("vomyChat_theme", theme)

          if (theme === "dark") {
            document.documentElement.classList.add("dark")
          } else {
            document.documentElement.classList.remove("dark")
          }
        }
      },
      setAppearancePreference: (key, value) => {
        set((state) => ({
          appearancePreferences: {
            ...state.appearancePreferences,
            [key]: value,
          },
          hasChanges: true,
        }))
      },
      setThemeSettings: (settings) => {
        set((state) => {
          const hasChanged = Object.entries(settings).some(
            ([key, value]) => state.themeSettings[key as keyof ThemeSettings] !== value,
          )

          return hasChanged
            ? {
                themeSettings: { ...state.themeSettings, ...settings },
                hasChanges: true,
              }
            : state
        })
      },
      setNotificationPreference: (key, value) => {
        set((state) => ({
          notificationPreferences: {
            ...state.notificationPreferences,
            [key]: value,
          },
          hasChanges: true,
        }))
      },
      saveSettings: async () => {
        set({ isSaving: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 800))
          set({ hasChanges: false })
          return Promise.resolve()
        } catch (error) {
          console.error("Error saving settings:", error)
          return Promise.reject(error)
        } finally {
          set({ isSaving: false })
        }
      },
      resetSettings: () => {
        set({
          displayName: "",
          username: "",
          bio: "",
          website: "",
          profileImage: null,
          email: "",
          twoFactorEnabled: false,
          theme: "light",
          appearancePreferences: {
            showLogo: undefined,
            animations: true,
            reducedMotion: false,
          },
          themeSettings: {
            profileLayout: "classic",
            themeColor: "default",
            customBackground: "#9333ea",
            customTextColor: "#ffffff",
            //buttonStyle: "rounded",
            buttonShadow: false,
            fontFamily: "default",
            backgroundType: "solid",
            backgroundOpacity: 100,
            buttonType : "fill",
            buttonColor: "#373d6d",
            buttonFontColor: "#2ec2d6",
            buttonBorderCurve: "rounded-none",
          },
          notificationPreferences: {
            emailProfileViews: true,
            emailLinkClicks: true,
            emailPurchases: true,
            emailMarketing: false,
            pushAll: true,
            pushMilestones: true,
            pushEarnings: true,
          },
          hasChanges: false,
        })
      },

      // Initialize settings from database
      initializeFromDb: (dbSettings) => {
        if (!dbSettings) return

        set({
          displayName: dbSettings.displayName || "",
          username: dbSettings.username || "",
          bio: dbSettings.bio || "",
          website: dbSettings.website || "",
          profileImage: dbSettings.profileImage,
          email: dbSettings.email || "",
          twoFactorEnabled: dbSettings.twoFactorEnabled || false,
          theme: dbSettings.theme || "light",
          appearancePreferences: dbSettings.appearancePreferences || {
            showLogo: true,
            animations: true,
            reducedMotion: false,
          },
          themeSettings: {
            ...(dbSettings.themeSettings || {
              profileLayout: "classic",
              themeColor: "default",
              customBackground: "#9333ea",
              customTextColor: "#ffffff",
              //buttonStyle: "rounded",
              buttonShadow: false,
              fontFamily: "default",
              backgroundType: "solid",
              backgroundOpacity: 100,
              buttonType : "fill",
              buttonColor: "#373d6d",
              buttonFontColor: "#2ec2d6",
              buttonBorderCurve: "rounded-none",
            }),
            // Ensure profileLayout is a valid value
            profileLayout: (dbSettings.themeSettings?.profileLayout || "classic") as "classic" | "hero",
          },
          notificationPreferences: dbSettings.notificationPreferences || {
            emailProfileViews: true,
            emailLinkClicks: true,
            emailPurchases: true,
            emailMarketing: false,
            pushAll: true,
            pushMilestones: true,
            pushEarnings: true,
          },
          hasChanges: false,
        })
      },
    }),
    {
      name: "vomyChat-settings-storage",
      // Only persist the data, not the methods
      partialize: (state) => ({
        displayName: state.displayName,
        username: state.username,
        bio: state.bio,
        website: state.website,
        profileImage: state.profileImage,
        email: state.email,
        twoFactorEnabled: state.twoFactorEnabled,
        theme: state.theme,
        appearancePreferences: state.appearancePreferences,
        themeSettings: state.themeSettings,
        notificationPreferences: state.notificationPreferences,
      }),
    },
  ),
)
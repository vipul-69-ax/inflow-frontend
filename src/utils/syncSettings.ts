import { useEffect } from "react"
import { useSettingsStore } from "@/storage/settings-store"
import { useSettingsHook } from "@/hooks/api/biolink/useSettings"
import { UpdateSettingsRequest } from "@/types/biolink/settings"

export function useSyncSettingsToBackend() {
  const { updateSettings } = useSettingsHook()

  useEffect(() => {
    const unsubscribe = useSettingsStore.subscribe(
      async (state) => {
        if (!state.hasChanges || state.isSaving) return

        const {
          displayName,
          username,
          bio,
          website,
          profileImage,
          twoFactorEnabled,
          theme,
          appearancePreferences,
          themeSettings,
          notificationPreferences,
        } = state

        const updates: UpdateSettingsRequest = {
          displayName,
          username,
          bio,
          website,
          profileImage,
          twoFactorEnabled,
          theme,
          appearancePreferences,
          themeSettings,
          notificationPreferences,
        }

        try {
          await updateSettings(updates)
          useSettingsStore.setState({ hasChanges: false })
        } catch (err) {
          console.error("Sync failed:", err)
        }
      },
    )

    return () => unsubscribe()
  }, [])
}


export function useInitializeSettingsFromBackend() {
  const { fetchSettings } = useSettingsHook()

  useEffect(() => {
    const init = async () => {
      const settings = await fetchSettings()
      if (settings) {
        useSettingsStore.getState().initializeFromDb(settings)
      }
    }

    init()
  }, [])
}
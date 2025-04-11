/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react"
import { useLinksStore } from "@/storage/links-store"
import { useUserLinks } from "@/hooks/api/biolink/useUserLinks" // assumes you're using this hook
import { api } from "@/hooks/api/auth/useAuth"
import { useAuthStore } from "@/storage/auth"

export function useSyncLinksToBackend() {
  const { updateRegularLinks, updateSocialLinks } = useUserLinks()

  useEffect(() => {
    const unsubscribe = useLinksStore.subscribe(async (state) => {
      if (state.isSaving) return

      try {
        await updateRegularLinks(state.regularLinks)
        await updateSocialLinks(state.socialLinks)
      } catch (err) {
        console.error("Link sync to backend failed:", err)
      }
    })

    return () => unsubscribe()
  }, [updateRegularLinks, updateSocialLinks])
}

export function useInitializeLinksFromBackend() {
  const { fetchLinks } = useUserLinks()
  const userId = useAuthStore((state) => state.userId)

  useEffect(() => {
    const init = async () => {
      try {
        const [regularRes, socialRes] = await Promise.all([
            api.get("/regular-links", {
                headers:{
                    "Authorization": `Bearer ${userId}`
                  }
            }),
            api.get("/social-links",{
                headers:{
                    "Authorization": `Bearer ${userId}`
                  }
            }),
          ])
          useLinksStore.getState().setRegularLinks(regularRes.data || [])
          useLinksStore.getState().setSocialLinks(socialRes.data || [])
      } catch (err) {
        console.error("Failed to initialize links from backend:", err)
      }
    }

    init()
  }, [fetchLinks])
}

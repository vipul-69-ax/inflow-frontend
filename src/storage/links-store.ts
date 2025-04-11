import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface RegularLink {
  id?: number
  userId?: string
  title: string
  url: string
  active: boolean
  clicks?: number
  favorite?: boolean
  thumbnail?: string
  layout?: string
  scheduledDate?: string
  scheduleStart?: string
  scheduleEnd?: string
  timezone?: string
  createdAt?: string
  updatedAt?: string
}

export interface SocialLink {
  id?: number
  userId?: string
  name: string
  icon: string
  url: string
  createdAt?: string
  updatedAt?: string
}

interface LinksState {
  regularLinks: RegularLink[]
  socialLinks: SocialLink[]
  isSaving: boolean
  hasChanges: boolean

  // Regular links
  addRegularLink: (link: RegularLink) => void
  updateRegularLink: (id: number, updates: Partial<RegularLink>) => void
  deleteLink: (id: number) => void
  toggleActive: (id: number) => void
  toggleFavorite: (id: number) => void
  incrementClicks: (id: number) => void
  updateThumbnail: (id: number, url: string) => void
  setRegularLinks: (links: RegularLink[]) => void

  // Social links
  addSocialLink: (link: SocialLink) => void
  updateSocialLink: (index: number, link: SocialLink) => void
  removeSocialLink: (name: string) => void
  setSocialLinks: (links: SocialLink[]) => void

  // Utility state setters
  setSavingState: (saving: boolean) => void
  markAsSynced: () => void
}

export const useLinksStore = create<LinksState>()(
  persist(
    (set) => ({
      regularLinks: [],
      socialLinks: [],
      isSaving: false,
      hasChanges: false,

      // === Regular Links ===
      addRegularLink: (link) =>
        set((state) => ({
          regularLinks: [...state.regularLinks, link],
          hasChanges: true,
        })),

      updateRegularLink: (id, updates) =>
        set((state) => ({
          regularLinks: state.regularLinks.map((link) =>
            link.id === id ? { ...link, ...updates } : link,
          ),
          hasChanges: true,
        })),

      deleteLink: (id) =>
        set((state) => ({
          regularLinks: state.regularLinks.filter((link) => link.id !== id),
          hasChanges: true,
        })),

      toggleActive: (id) =>
        set((state) => ({
          regularLinks: state.regularLinks.map((link) =>
            link.id === id ? { ...link, active: !link.active } : link,
          ),
          hasChanges: true,
        })),

      toggleFavorite: (id) =>
        set((state) => ({
          regularLinks: state.regularLinks.map((link) =>
            link.id === id ? { ...link, favorite: !link.favorite } : link,
          ),
          hasChanges: true,
        })),

      incrementClicks: (id) =>
        set((state) => ({
          regularLinks: state.regularLinks.map((link) =>
            link.id === id ? { ...link, clicks: (link.clicks || 0) + 1 } : link,
          ),
          hasChanges: true,
        })),

      updateThumbnail: (id, url) =>
        set((state) => ({
          regularLinks: state.regularLinks.map((link) =>
            link.id === id ? { ...link, thumbnail: url } : link,
          ),
          hasChanges: true,
        })),

      setRegularLinks: (links) =>
        set(() => ({
          regularLinks: links,
          hasChanges: false,
        })),

      // === Social Links ===
      addSocialLink: (link) =>
        set((state) => ({
          socialLinks: [...state.socialLinks, link],
          hasChanges: true,
        })),

      updateSocialLink: (index, link) =>
        set((state) => {
          const updated = [...state.socialLinks]
          updated[index] = link
          return {
            socialLinks: updated,
            hasChanges: true,
          }
        }),

      removeSocialLink: (name) =>
        set((state) => ({
          socialLinks: state.socialLinks.filter((link) => link.name !== name),
          hasChanges: true,
        })),

      setSocialLinks: (links) =>
        set(() => ({
          socialLinks: links,
          hasChanges: false,
        })),

      // === Utility Setters ===
      setSavingState: (saving) => set(() => ({ isSaving: saving })),
      markAsSynced: () => set(() => ({ hasChanges: false })),
    }),
    {
      name: "user-links-storage",
    },
  ),
)

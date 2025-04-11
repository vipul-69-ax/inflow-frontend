import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

// Define the store's state type
interface AuthState {
  // State properties
  hasVisitedBefore: boolean
  isAuthenticated: boolean
  userId: string | null
  username: string
}

// Define the store's actions type
interface AuthActions {
  // Actions to update state
  setHasVisitedBefore: (value: boolean) => void
  setIsAuthenticated: (value: boolean) => void
  setUserId: (userId: string | null) => void
  setUsername:(username:string)=>void
  // Helper actions
  markAsVisited: () => void
  login: (userId: string) => void
  logout: () => void
}

// Combined type for the entire store
type AuthStore = AuthState & AuthActions

/**
 * Auth store hook that tracks if a user has visited the site before
 * and if they are currently authenticated.
 *
 * Uses persistent storage to remember values across sessions.
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      hasVisitedBefore: false,
      isAuthenticated: false,
      userId: null,
      username: "",

      setUsername: (username:string): void => set({ username }),
      // Actions to update individual values
      setHasVisitedBefore: (value: boolean): void => set({ hasVisitedBefore: value }),

      setIsAuthenticated: (value: boolean): void => set({ isAuthenticated: value }),
      
      setUserId: (userId: string | null): void => set({ userId }),

      // Helper actions
      markAsVisited: (): void => set({ hasVisitedBefore: true }),

      login: (userId: string): void => set({ 
        isAuthenticated: true,
        userId
      }),

      logout: (): void => {
        set({ 
          isAuthenticated: false,
          userId: null
        })
        localStorage.removeItem("accessToken")
      },
    }),
    {
      name: "auth-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist these specific state properties
      partialize: (state: AuthStore): Partial<AuthState> => ({
        hasVisitedBefore: state.hasVisitedBefore,
        isAuthenticated: state.isAuthenticated,
        userId: state.userId,
      }),
    },
  ),
)
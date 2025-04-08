/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useCallback, useEffect, useState } from "react"
import { useAuth } from "./useAuth"
import { useAuthStore } from "@/storage/auth"
import { useSettingsStore } from "@/storage/settings-store"

/**
 * Interface for Google Auth options
 */
export interface GoogleAuthOptions {
  clientId: string
  onSuccess?: (response: any) => void
  onFailure?: (error: Error) => void
  buttonOptions?: {
    theme?: "outline" | "filled_blue" | "filled_black"
    size?: "large" | "medium" | "small"
    text?: "signin_with" | "signup_with" | "continue_with" | "signin"
    shape?: "rectangular" | "pill" | "circle" | "square"
    width?: string
    locale?: string
  }
}

/**
 * Hook for Google authentication
 * Integrates with Zustand store
 */
export function useGoogleAuth(options: GoogleAuthOptions) {
  const { clientId, onSuccess, onFailure, buttonOptions = {} } = options
  const { googleAuth } = useAuth()
  const login = useAuthStore((state) => state.login)
  const [isLoading, setIsLoading] = useState(false)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {setDisplayName, setEmail} = useSettingsStore()
  // Load Google API script
  useEffect(() => {
    if (window.google) {
      setIsScriptLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.onload = () => setIsScriptLoaded(true)
    script.onerror = () => setError("Failed to load Google authentication")

    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  // Initialize Google One Tap
  useEffect(() => {
    if (!isScriptLoaded || !clientId) return

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      })
    } catch (err) {
      setError("Failed to initialize Google authentication")
      if (onFailure) onFailure(new Error("Failed to initialize Google authentication"))
    }
  }, [isScriptLoaded, clientId, onFailure])

  // Handle Google credential response
  const handleCredentialResponse = useCallback(
    async (response: any) => {
      setIsLoading(true)
      setError(null)

      try {
        // Get the ID token from the response
        const { credential } = response

        // Send the token to your backend
        const result = await googleAuth(credential)
        setDisplayName(result.user.username)
        setEmail(result.user.email)
        // Update Zustand store (this is also done in the googleAuth function)
        login(result.user.id)

        if (onSuccess) onSuccess(result)
      } catch (err: any) {
        setError(err.message || "Google authentication failed")
        if (onFailure) onFailure(err)
      } finally {
        setIsLoading(false)
      }
    },
    [googleAuth, onSuccess, onFailure, login],
  )

  // Render Google One Tap button
  const renderButton = useCallback(
    (elementId: string) => {
      if (!isScriptLoaded || !clientId) return

      try {
        const element = document.getElementById(elementId)
        if (!element) {
          console.error(`Element with ID "${elementId}" not found`)
          return
        }

        window.google.accounts.id.renderButton(element, {
          theme: buttonOptions.theme || "outline",
          size: buttonOptions.size || "large",
          text: buttonOptions.text || "signin_with",
          shape: buttonOptions.shape || "rectangular",
          width: buttonOptions.width || undefined,
          locale: buttonOptions.locale || undefined,
        })
      } catch (err) {
        setError("Failed to render Google button")
      }
    },
    [isScriptLoaded, clientId, buttonOptions],
  )

  // Prompt One Tap
  const promptOneTap = useCallback(() => {
    if (!isScriptLoaded || !clientId) return

    try {
      window.google.accounts.id.prompt()
    } catch (err) {
      setError("Failed to prompt Google One Tap")
    }
  }, [isScriptLoaded, clientId])

  // Cancel One Tap
  const cancelOneTap = useCallback(() => {
    if (!isScriptLoaded) return

    try {
      window.google.accounts.id.cancel()
    } catch (err) {
      setError("Failed to cancel Google One Tap")
    }
  }, [isScriptLoaded])

  return {
    isLoading,
    error,
    isScriptLoaded,
    renderButton,
    promptOneTap,
    cancelOneTap,
  }
}

// Add Google types
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void
          renderButton: (element: HTMLElement, options: any) => void
          prompt: () => void
          cancel: () => void
        }
      }
    }
  }
}


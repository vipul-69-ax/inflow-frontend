/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useCallback } from "react"
import axios from "axios"
import { useAuthStore } from "@/storage/auth"
import { useSettingsStore } from "@/storage/settings-store"
import { useSettingsHook } from "../biolink/useSettings"

// Types
export interface User {
  id: string
  username: string
  email: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  displayName:string
  username: string
  email: string
  password: string
}

export interface ResetPasswordData {
  token: string
  password: string
}

// Create axios instance with base URL
export const api = axios.create({
  baseURL: "https://api.inflow.chat/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
})

// Add interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh the token
        const { data } = await api.post("/auth/refresh-token", {
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().userId}`,
          },
        })

        // If successful, update the token and retry the original request
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken)
          api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`
          originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`
          return api(originalRequest)
        }
      } catch {
        // If refresh fails, clear auth state
        localStorage.removeItem("accessToken")
        api.defaults.headers.common["Authorization"] = ""

        // Update Zustand store
        useAuthStore.getState().setIsAuthenticated(false)
      }
    }

    return Promise.reject(error)
  },
)

/**
 * Main authentication hook that provides authentication state and methods
 * Integrates with Zustand store for persistent auth state
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: localStorage.getItem("accessToken"),
    isLoading: false,
    error: null,
  })
  const {setUserId} = useAuthStore()
  const {setDisplayName, setEmail, setUsername} = useSettingsStore()
  /**
   * Login with email and password
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const { data } = await api.post("/auth/login", credentials)

      localStorage.setItem("accessToken", data.accessToken)
      
      useAuthStore.setState({
        username: data.user.username,
      })
      setUserId(data.user.id)
      setDisplayName(data.user.displayName)
      setUsername(data.user.username)
      setEmail(data.user.email) 
      setState({
        user: data.user,
        accessToken: data.accessToken,
        isLoading: false,
        error: null,
      })

      return data
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.message || "Login failed",
      }))

      throw error
    }
  }, [])

  /**
   * Register a new user
   */
  const signup = useCallback(async (userData: SignupData) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const { data } = await api.post("/auth/signup", userData)

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: null,
      }))

      return data
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.message || "Signup failed",
      }))

      throw error
    }
  }, [])

  /**
   * Verify email with token
   */
  const verifyEmail = useCallback(async (token: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const { data } = await api.get(`/auth/verify-email/${token}`)

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: null,
      }))

      return data
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.message || "Email verification failed",
      }))

      throw error
    }
  }, [])

  /**
   * Resend verification email
   */
  const resendVerification = useCallback(async (email: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const { data } = await api.post("/auth/resend-verification", { email })

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: null,
      }))

      return data
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.message || "Failed to resend verification email",
      }))

      throw error
    }
  }, [])

  /**
   * Request password reset email
   */
  const forgotPassword = useCallback(async (email: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const { data } = await api.post("/auth/forgot-password", { email })

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: null,
      }))

      return data
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.message || "Password reset request failed",
      }))

      throw error
    }
  }, [])

  /**
   * Reset password with token
   */
  const resetPassword = useCallback(async ({ token, password }: ResetPasswordData) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, { password })

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: null,
      }))

      return data
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.message || "Password reset failed",
      }))

      throw error
    }
  }, [])

  /**
   * Authenticate with Google
   */
  const googleAuth = useCallback(async (token: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const { data } = await api.post("/auth/google", { token })

      localStorage.setItem("accessToken", data.accessToken)

      setUserId(data.user.id)
      setDisplayName(data.user.displayName)
      setUsername(data.user.username)
      setEmail(data.user.email)

      setState({
        user: data.user,
        accessToken: data.accessToken,
        isLoading: false,
        error: null,
      })

      return data
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.message || "Google authentication failed",
      }))

      throw error
    }
  }, [])

  /**
   * Logout the current user
   */
  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      await api.post("/auth/logout")

      localStorage.removeItem("accessToken")
      api.defaults.headers.common["Authorization"] = ""

      setState({
        user: null,
        accessToken: null,
        isLoading: false,
        error: null,
      })

      // Update Zustand store
      useAuthStore.getState().setIsAuthenticated(false)
    } catch {
      // Even if the server request fails, we still want to clear local state
      localStorage.removeItem("accessToken")
      api.defaults.headers.common["Authorization"] = ""

      setState({
        user: null,
        accessToken: null,
        isLoading: false,
        error: null,
      })

      // Update Zustand store
      useAuthStore.getState().setIsAuthenticated(false)
    }
  }, [])

  /**
   * Clear any authentication errors
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  return {
    user: state.user,
    isAuthenticated: !!state.accessToken,
    isLoading: state.isLoading,
    error: state.error,
    login,
    signup,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    googleAuth,
    logout,
    clearError,
  }
}


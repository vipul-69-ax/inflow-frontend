/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/api/auth/useAuth"
import { useGoogleAuth } from "@/hooks/api/auth/useGoogleAuth"
import { useAuthStore } from "@/storage/auth"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

export default function LoginPage({onSucess}:{onSucess:()=>void}) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [showVerificationDialog, setShowVerificationDialog] = useState(false)
  const [isResendingVerification, setIsResendingVerification] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  // Get authentication functions from our hooks
  const { login, error: authError, resendVerification, isLoading } = useAuth()

  // Get Zustand store actions
  const { setIsAuthenticated } = useAuthStore()
  
  // Setup Google authentication
  const { renderButton } = useGoogleAuth({
    clientId: "473227188517-n690ie9aq3q0n1d6usmnel4mldn0amqb.apps.googleusercontent.com",
    onSuccess: () => {
      setIsAuthenticated(true)
      onSucess()
    },
    onFailure: (error) => setFormErrors({ google: error.message }),
  })

  // Initialize Google button after component mounts
  useEffect(() => {
    const googleButtonContainer = document.getElementById("google-login-button")
    if (googleButtonContainer) {
      renderButton("google-login-button")
    }
  }, [renderButton])

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }))

    // Clear error when field is changed
    if (formErrors[id]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[id]
        return newErrors
      })
    }
  }

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid"
    }

    if (!formData.password) {
      errors.password = "Password is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await login({
        email: formData.email,
        password: formData.password,
      })

      // Mark as visited in Zustand store
      setIsAuthenticated(true)
      onSucess()
      // Navigate to dashboard
    } catch (error: any) {
      // Check if the error is due to unverified email
      if (error.response?.data?.message?.includes("verify your email")) {
        setFormErrors({
          verification: "Please verify your email before logging in.",
        })
        // Show verification dialog
        setShowVerificationDialog(true)
      } else {
        // Other errors are handled by the useAuth hook
        console.error("Login failed:", error)
      }
    }
  }

  // Handle resend verification email
  const handleResendVerification = async () => {
    setIsResendingVerification(true)
    setResendSuccess(false)

    try {
      // Call the resendVerification function from useAuth hook
      await resendVerification(formData.email)

      // Show success message
      setResendSuccess(true)
    } catch (error: any) {
      setFormErrors((prev) => ({
        ...prev,
        verification: error.response?.data?.message || "Failed to resend verification email.",
      }))
      // Close the dialog on error
      setShowVerificationDialog(false)
    } finally {
      setIsResendingVerification(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      {/* Verification Email Dialog */}
      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Your Email</DialogTitle>
            <DialogDescription>
              {!resendSuccess
                ? "Your email address needs to be verified before you can log in. Would you like us to send a new verification email?"
                : "Verification email has been sent successfully!"}
            </DialogDescription>
          </DialogHeader>

          {!resendSuccess ? (
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowVerificationDialog(false)}
                disabled={isResendingVerification}
              >
                Cancel
              </Button>
              <Button onClick={handleResendVerification} disabled={isResendingVerification}>
                {isResendingVerification ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Verification Email"
                )}
              </Button>
            </DialogFooter>
          ) : (
            <DialogFooter>
              <Button onClick={() => setShowVerificationDialog(false)}>Close</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <div className="w-full max-w-5xl">
        <h1 className="mb-8 text-2xl font-medium text-amber-900">
          Log in to manage your links, track analytics, and grow your audience.
        </h1>

        <div className="mb-4 rounded-md bg-blue-50 p-3 text-blue-800">Welcome back! We're glad to see you again.</div>

        {(authError || formErrors.general || formErrors.verification) && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{formErrors.verification || authError || formErrors.general}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-medium">Login</h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="email" className="block font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  className={`w-full ${formErrors.email ? "border-red-500" : ""}`}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className={`w-full ${formErrors.password ? "border-red-500" : ""}`}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {formErrors.password && <p className="text-xs text-red-500">{formErrors.password}</p>}
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        rememberMe: checked === true,
                      }))
                    }
                    disabled={isLoading}
                  />
                  <label htmlFor="rememberMe" className="text-sm">
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot Password
                </Link>
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">or</span>
                </div>
              </div>

              {formErrors.google && <p className="text-xs text-red-500 text-center mb-2">{formErrors.google}</p>}

              <div id="google-login-button" className="w-full"></div>

              <div className="mt-6 text-center text-sm">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-600 hover:underline">
                  Register here
                </Link>
              </div>
            </form>
          </div>

          <div className="flex items-center justify-center">
            <div className="rounded-lg bg-blue-100 p-4">
              <div className="h-[400px] w-[200px] rounded-lg bg-blue-500/10 border border-blue-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


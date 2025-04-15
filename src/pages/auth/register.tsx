"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/hooks/api/auth/useAuth"
import { useGoogleAuth } from "@/hooks/api/auth/useGoogleAuth"
import { useAuthStore } from "@/storage/auth"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [showVerificationDialog, setShowVerificationDialog] = useState(false)

  // Get authentication functions from our hooks
  const { signup, error: authError, isLoading } = useAuth()

  // Get Zustand store actions
  const { markAsVisited, setIsAuthenticated } = useAuthStore()

  // Setup Google authentication
  const { renderButton } = useGoogleAuth({
    clientId: "473227188517-n690ie9aq3q0n1d6usmnel4mldn0amqb.apps.googleusercontent.com",
    onSuccess: () => {
      // Mark as visited in Zustand store
      markAsVisited()
      setIsAuthenticated(true)
    },
    onFailure: (error) => setFormErrors({ google: error.message }),
  })

  // Initialize Google button after component mounts
  useEffect(() => {
    const googleButtonContainer = document.getElementById("google-signup-button")
    if (googleButtonContainer) {
      renderButton("google-signup-button")
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

    if (!formData.displayName.trim()) {
      errors.displayName = "Display Name is required"
    }

    if (!formData.username.trim()) {
      errors.username = "Username is required"
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = "Username can only contain letters, numbers, and underscores"
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid"
    }

    if (!formData.password) {
      errors.password = "Password is required"
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    if (!formData.agreeToTerms) {
      errors.agreeToTerms = "You must agree to the terms"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await signup({
        displayName: formData.displayName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })

      // Mark as visited in Zustand store
      markAsVisited()

      // Show verification dialog
      setShowVerificationDialog(true)

      // Set registration success
      setRegistrationSuccess(true)

      // Redirect to verification page after dialog is closed
      // The timeout is now handled in the dialog close handler
    } catch (error) {
      // Error is handled by the useAuth hook
      console.error("Registration failed:", error)
    }
  }

  // Handle dialog close
  const handleDialogClose = () => {
    setShowVerificationDialog(false)
    // Navigate after dialog is closed
    navigate("/login")
  }

  // Show success message if registration is successful but dialog is closed
  if (registrationSuccess && !showVerificationDialog) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-sm">
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-medium text-green-600">Registration Successful!</h2>
            <p className="mb-4 text-gray-600">Please check your email to verify your account.</p>
            <p className="text-sm text-gray-500">Redirecting to verification page...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      {/* Verification Email Dialog */}
      <Dialog open={showVerificationDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              Verification Email Sent
            </DialogTitle>
            <DialogDescription>
              We've sent a verification email to <span className="font-medium">{formData.email}</span>. Please check
              your inbox and click the verification link to complete your registration.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-500">
              If you don't see the email, please check your spam folder or request a new verification email.
            </p>
            <Button onClick={handleDialogClose}>Continue</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="w-full max-w-5xl">
        <h1 className="mb-8 text-2xl font-medium text-amber-900">
          Create an account to manage your links, track analytics, and grow your audience.
        </h1>

        {(authError || formErrors.general) && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{authError || formErrors.general}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-medium">Register</h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="displayName" className="block font-medium">
                  Display Name
                </label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Enter your display name"
                  className={`w-full ${formErrors.displayName ? "border-red-500" : ""}`}
                  value={formData.displayName}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {formErrors.displayName && <p className="text-xs text-red-500">{formErrors.displayName}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="username" className="block font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username (letters, numbers, underscores only)"
                  className={`w-full ${formErrors.username ? "border-red-500" : ""}`}
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {formErrors.username && <p className="text-xs text-red-500">{formErrors.username}</p>}
                <p className="text-xs text-gray-500">Username can only contain letters, numbers, and underscores (_)</p>
              </div>

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
                  placeholder="Create a password"
                  className={`w-full ${formErrors.password ? "border-red-500" : ""}`}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {formErrors.password && <p className="text-xs text-red-500">{formErrors.password}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block font-medium">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className={`w-full ${formErrors.confirmPassword ? "border-red-500" : ""}`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {formErrors.confirmPassword && <p className="text-xs text-red-500">{formErrors.confirmPassword}</p>}
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeToTerms: checked === true }))}
                  disabled={isLoading}
                />
                <label htmlFor="agreeToTerms" className="text-sm">
                  I agree to the{" "}
                  <Link to="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {formErrors.agreeToTerms && <p className="text-xs text-red-500">{formErrors.agreeToTerms}</p>}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">or</span>
                </div>
              </div>

              {formErrors.google && <p className="text-xs text-red-500 text-center mb-2">{formErrors.google}</p>}

              <div id="google-signup-button" className="w-full"></div>

              <div className="mt-6 text-center text-sm">
                Already have an account?{" "}
                <Link to="/" className="text-blue-600 hover:underline">
                  Login here
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

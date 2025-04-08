"use client"

import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, Mail } from 'lucide-react'
import { useAuth } from "@/hooks/api/auth/useAuth"
import { useAuthStore } from "@/storage/auth"

enum VerificationStatus {
  PENDING = "pending",
  VERIFYING = "verifying",
  SUCCESS = "success",
  ERROR = "error"
}

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const { token } = useParams<{ token: string }>()
  const [status, setStatus] = useState<VerificationStatus>(VerificationStatus.PENDING)
  const [error, setError] = useState<string | null>(null)
  const { verifyEmail } = useAuth()
  const {markAsVisited} = useAuthStore()
  
  // Handle verification
  const handleVerification = async () => {
    if (!token) {
      setError("Verification token is missing")
      setStatus(VerificationStatus.ERROR)
      return
    }
    
    setStatus(VerificationStatus.VERIFYING)
    
    try {
      await verifyEmail(token)
      
      // Update Zustand store
      
      setStatus(VerificationStatus.SUCCESS)
      
      // Redirect to home page after 2 seconds
      setTimeout(() => {
        markAsVisited()
        navigate("/") // Redirect to main website
      }, 2000)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to verify email")
      setStatus(VerificationStatus.ERROR)
    }
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-white p-8 shadow-md">
          {status === VerificationStatus.PENDING && (
            <div className="flex flex-col items-center justify-center">
              <div className="mb-4 rounded-full bg-blue-100 p-3">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900">Verify Your Email</h1>
              
              <p className="mt-4 text-center text-gray-600">
                Thank you for registering! Please click the button below to verify your email address and activate your account.
              </p>
              
              <Button 
                onClick={handleVerification} 
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                Verify Email
              </Button>
            </div>
          )}
          
          {status === VerificationStatus.VERIFYING && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <p className="mt-4 text-center text-gray-600">Verifying your email address...</p>
            </div>
          )}
          
          {status === VerificationStatus.SUCCESS && (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
              <h2 className="mt-4 text-xl font-semibold text-green-600">Email Verified Successfully!</h2>
              <p className="mt-2 text-center text-gray-600">
                Your email has been verified. You will be redirected to the main page in a moment.
              </p>
            </div>
          )}
          
          {status === VerificationStatus.ERROR && (
            <div className="flex flex-col items-center justify-center py-4">
              <Alert variant="destructive">
                <AlertDescription>
                  {error || "There was a problem verifying your email. Please try again or contact support."}
                </AlertDescription>
              </Alert>
              
              <div className="mt-6 flex w-full space-x-4">
                <Button 
                  onClick={() => setStatus(VerificationStatus.PENDING)} 
                  variant="outline"
                  className="flex-1"
                >
                  Try Again
                </Button>
                <Button 
                  onClick={() => navigate("/")} 
                  className="flex-1"
                >
                  Go to Home
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStripe as useStripeHook } from "@/hooks/api/use-stripe"

interface PlanDetails {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  buttonText: string
  popular: boolean
}

interface CheckoutFormProps {
  planDetails: PlanDetails
  onSuccess: () => void
}

export default function CheckoutForm({ planDetails, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { loading: apiLoading, error: apiError } = useStripeHook()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      // Use the client secret already loaded in the Elements instance
      // to confirm the payment
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/payment-success",
          payment_method_data: {
            billing_details: { email },
          },
        },
        redirect: "if_required",
      })

      if (error) {
        throw new Error(error.message || "Payment failed")
      }

      // Payment succeeded
      onSuccess()
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-4 bg-white">
        <div className="flex justify-between mb-4">
          <span className="font-medium">{planDetails?.name} Plan</span>
          <span>${planDetails?.price}/month</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-element">Payment Details</Label>
            <div className="p-3 border rounded-md">
              <PaymentElement id="payment-element" />
            </div>
          </div>
        </div>

        {(errorMessage || apiError) && <div className="text-red-500 text-sm mt-4">{errorMessage || apiError}</div>}
      </Card>

      <Button type="submit" className="w-full" disabled={!stripe || isLoading || apiLoading}>
        {isLoading || apiLoading ? "Processing..." : `Pay $${planDetails?.price}`}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Your payment is secure and encrypted. By subscribing, you agree to our terms of service.
      </p>
    </form>
  )
}


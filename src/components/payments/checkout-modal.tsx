/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import CheckoutForm from "./checkout-form"

// This should be your publishable key, not your secret key
const stripePromise = loadStripe("pk_test_51K4mdGSHlQIgQG8JKl3PLyufQr4UGvBUE7wQpC0vVTFvQCDSEW671rwBZhuaGulKl3FeitQPoaIDUcQMuEGi9oT900LqGRaEmf")

// Default appearance for Stripe Elements
const appearance = {
  theme: "stripe",
  variables: {
    colorPrimary: "#0f172a",
    colorBackground: "#ffffff",
    colorText: "#1e293b",
    colorDanger: "#ef4444",
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    spacingUnit: "4px",
    borderRadius: "8px",
  },
}

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  planId: string
  planDetails: any
}

export default function CheckoutModal({ isOpen, onClose, planId, planDetails }: CheckoutModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch a client secret when the modal opens
  useEffect(() => {
    if (isOpen && planId) {
      setLoading(true)
      setError(null)

      // Create a payment intent on the server to get a client secret
      fetch("https://api.inflow.chat/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          amount: planDetails.price, // Send the amount for the plan
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to create payment intent")
          }
          return response.json()
        })
        .then((data) => {
          setClientSecret(data.clientSecret)
        })
        .catch((err) => {
          setError(err.message || "An error occurred")
          console.error("Error creating payment intent:", err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [isOpen, planId, planDetails])

  // Options for the Stripe Elements
  const options = clientSecret
    ? {
        clientSecret,
        appearance,
      }
    : {
        appearance,
      }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Subscribe to {planDetails?.name}</DialogTitle>
          <DialogDescription>
            Complete your subscription to the {planDetails?.name} plan at ${planDetails?.price}/month.
          </DialogDescription>
        </DialogHeader>

        {loading && <div className="py-4 text-center">Loading payment form...</div>}

        {error && (
          <div className="py-4 text-center text-red-500">Error: {error}. Please try again or contact support.</div>
        )}

        {!loading && !error && clientSecret && stripePromise && (
          <Elements stripe={stripePromise} options={options as any}>
            <CheckoutForm planDetails={planDetails} onSuccess={onClose} />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  )
}


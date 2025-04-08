/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"

// Load Stripe using environment variable
const stripePromise = loadStripe("pk_test_51K4mdGSHlQIgQG8JKl3PLyufQr4UGvBUE7wQpC0vVTFvQCDSEW671rwBZhuaGulKl3FeitQPoaIDUcQMuEGi9oT900LqGRaEmf")

// Response types
interface SubscriptionResponse {
  subscriptionId: string
  clientSecret?: string
  customerId: string
  status: string
}

interface PaymentMethodResponse {
  paymentMethods: any[]
}

interface PaymentIntentResponse {
  clientSecret: string
}

interface SetupIntentResponse {
  clientSecret: string
}

interface UseStripeReturn {
  // Subscription management
  createSubscription: (planId: string, email: string, paymentMethodId: string) => Promise<SubscriptionResponse>
  cancelSubscription: (subscriptionId: string) => Promise<{ status: string; canceledAt: number }>
  getSubscription: (subscriptionId: string) => Promise<any>
  getCustomerSubscriptions: (customerId: string) => Promise<any>
  updateSubscription: (subscriptionId: string, planId?: string, paymentMethodId?: string) => Promise<any>

  // Payment methods
  createPaymentIntent: (amount: number, planId?: string) => Promise<PaymentIntentResponse>
  createSetupIntent: (customerId: string) => Promise<SetupIntentResponse>
  getPaymentMethods: (customerId: string) => Promise<PaymentMethodResponse>
  setDefaultPaymentMethod: (customerId: string, paymentMethodId: string) => Promise<any>
  removePaymentMethod: (paymentMethodId: string) => Promise<any>

  // State
  loading: boolean
  error: string | null

  // Stripe instance
  stripe: Promise<any> | null
}

export function useStripe(): UseStripeReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Use environment variable for API URL with fallback
  const API_URL = "http://api.inflow.chat/api"

  // Helper function for API requests
  const apiRequest = async (endpoint: string, method: string, data?: any) => {
    setLoading(true)
    setError(null)

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }

      // Add authorization header if token exists
      const token = localStorage.getItem("token")
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        ...(data && { body: JSON.stringify(data) }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${method.toLowerCase()} ${endpoint}`)
      }

      return await response.json()
    } catch (err: any) {
      setError(err.message || `An error occurred during ${method.toLowerCase()} ${endpoint}`)
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Create a payment intent
   */
  const createPaymentIntent = async (amount: number, planId?: string): Promise<PaymentIntentResponse> => {
    return apiRequest("/stripe/create-payment-intent", "POST", { amount, planId })
  }

  /**
   * Create a subscription
   */
  const createSubscription = async (
    planId: string,
    email: string,
    paymentMethodId: string,
  ): Promise<SubscriptionResponse> => {
    return apiRequest("/stripe/create-subscription", "POST", {
      planId,
      email,
      paymentMethodId,
    })
  }

  /**
   * Cancel a subscription
   */
  const cancelSubscription = async (subscriptionId: string) => {
    return apiRequest("/stripe/cancel-subscription", "POST", { subscriptionId })
  }

  /**
   * Get subscription details
   */
  const getSubscription = async (subscriptionId: string) => {
    return apiRequest(`/stripe/subscription/${subscriptionId}`, "GET")
  }

  /**
   * Get all subscriptions for a customer
   */
  const getCustomerSubscriptions = async (customerId: string) => {
    return apiRequest(`/stripe/customer-subscriptions?customerId=${customerId}`, "GET")
  }

  /**
   * Update a subscription (change plan, payment method, etc.)
   */
  const updateSubscription = async (subscriptionId: string, planId?: string, paymentMethodId?: string) => {
    return apiRequest(`/stripe/subscription/${subscriptionId}`, "PUT", {
      planId,
      paymentMethodId,
    })
  }

  /**
   * Create a setup intent for saving payment methods
   */
  const createSetupIntent = async (customerId: string): Promise<SetupIntentResponse> => {
    return apiRequest("/stripe/create-setup-intent", "POST", { customerId })
  }

  /**
   * Get all payment methods for a customer
   */
  const getPaymentMethods = async (customerId: string): Promise<PaymentMethodResponse> => {
    return apiRequest(`/stripe/payment-methods?customerId=${customerId}`, "GET")
  }

  /**
   * Set default payment method for a customer
   */
  const setDefaultPaymentMethod = async (customerId: string, paymentMethodId: string) => {
    return apiRequest("/stripe/set-default-payment-method", "POST", {
      customerId,
      paymentMethodId,
    })
  }

  /**
   * Remove a payment method
   */
  const removePaymentMethod = async (paymentMethodId: string) => {
    return apiRequest(`/stripe/payment-method/${paymentMethodId}`, "DELETE")
  }

  return {
    createPaymentIntent,
    createSubscription,
    cancelSubscription,
    getSubscription,
    getCustomerSubscriptions,
    updateSubscription,
    createSetupIntent,
    getPaymentMethods,
    setDefaultPaymentMethod,
    removePaymentMethod,
    loading,
    error,
    stripe: stripePromise,
  }
}


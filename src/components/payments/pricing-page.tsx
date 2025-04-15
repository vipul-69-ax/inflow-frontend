"use client"

import { useEffect, useRef, useState } from "react"
import { useAuthStore } from "@/storage/auth"
import { motion } from "framer-motion"

export default function PricingPage() {
  const userId = useAuthStore((state) => state.userId)
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  useEffect(() => {
    if (!userId || !containerRef.current || !selectedPlan) return

    // Clean previous renders (for safety during hot reloads)
    containerRef.current.innerHTML = ""

    // 1. Inject Stripe script
    const script = document.createElement("script")
    script.src = "https://js.stripe.com/v3/pricing-table.js"
    script.async = true

    // 2. Create the Stripe pricing table element
    const pricingTable = document.createElement("stripe-pricing-table")
    pricingTable.setAttribute("pricing-table-id", "prctbl_1RDSiLR6ix8HjnHbYDfihQGn")
    pricingTable.setAttribute(
      "publishable-key",
      "pk_live_51Prd2zR6ix8HjnHb4XpbUHbsoNqt9S7T3WIhASK4UYAaTlfdQVy0p2shaFfAg0ijlBkfUmZLO4rUwUssF00DwT5z00hFfyiQzz",
    )
    pricingTable.setAttribute("client-reference-id", `${userId} ${selectedPlan.toUpperCase()}`)

    containerRef.current.appendChild(script)
    containerRef.current.appendChild(pricingTable)
  }, [userId, selectedPlan])

  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan)

    // Scroll to pricing table
    setTimeout(() => {
      containerRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Simple, Transparent Pricing
          </h1>
          <p className="text-gray-500 max-w-md mx-auto text-lg">
            Choose the plan that works best for you and your team.
          </p>
        </div>

        {!selectedPlan ? (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-medium text-gray-800">Select your plan</h2>
              <p className="text-gray-500 mt-2">Which experience would you like to explore?</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-12 px-4">
              <PlanCard
                title="Pro"
                description="Perfect for professionals and small teams looking to enhance productivity."
                features={["Advanced analytics", "Priority support", "Custom integrations", "Team collaboration"]}
                onClick={() => handleSelectPlan("pro")}
                icon="💼"
              />

              <PlanCard
                title="Guru"
                description="Enterprise-grade solution with unlimited access to all features."
                features={["Everything in Pro", "Dedicated account manager", "Custom training", "Unlimited workspaces"]}
                onClick={() => handleSelectPlan("guru")}
                icon="✨"
              />
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-12"
          >
            <div className="flex items-center justify-center mb-8">
              <button
                onClick={() => setSelectedPlan(null)}
                className="flex items-center text-gray-500 hover:text-gray-800 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to plan selection
              </button>
            </div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-medium text-gray-800">
                {selectedPlan === "pro" ? "Pro Plan" : "Guru Plan"} Pricing
              </h2>
              <p className="text-gray-500 mt-2">
                {selectedPlan === "pro"
                  ? "Professional tools for individuals and small teams"
                  : "Enterprise-grade features for growing organizations"}
              </p>
            </div>
            <div ref={containerRef} className="mt-8"></div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

interface PlanCardProps {
  title: string
  description: string
  features: string[]
  onClick: () => void
  icon: string
}

function PlanCard({ title, description, features, onClick, icon }: PlanCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="relative backdrop-blur-md bg-white/70 border border-gray-200/50 rounded-2xl overflow-hidden shadow-lg"
      style={{
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05), 0 1px 8px rgba(0, 0, 0, 0.02)",
      }}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none"
        style={{ backdropFilter: "blur(20px)" }}
      />

      <div className="relative p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="text-4xl">{icon}</div>
          <div className="text-2xl font-medium text-gray-800">{title}</div>
        </div>

        <p className="text-gray-600 mb-6">{description}</p>

        <div className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onClick}
          className="w-full py-3 px-4 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
        >
          View Pricing
        </button>
      </div>
    </motion.div>
  )
}

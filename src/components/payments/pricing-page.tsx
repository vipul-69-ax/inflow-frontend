"use client"

import { useState } from "react"
import { CheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import CheckoutModal from "@/components/payments/checkout-modal"

const pricingPlans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Basic features for individuals",
    features: ["Limited storage", "Basic support", "Single user"],
    buttonText: "Get Started",
    popular: false,
  },
  {
    id: "Pro",
    name: "Pro",
    price: 49,
    description: "Everything you need for small teams",
    features: ["Unlimited storage", "Priority support", "Up to 5 users", "Advanced analytics"],
    buttonText: "Subscribe",
    popular: true,
  },
  {
    id: "Max",
    name: "Max",
    price: 99,
    description: "Advanced features for larger teams",
    features: [
      "Unlimited storage",
      "24/7 support",
      "Unlimited users",
      "Advanced analytics",
      "Custom integrations",
      "Dedicated account manager",
    ],
    buttonText: "Subscribe",
    popular: false,
  },
]

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
    if (planId !== "free") {
      setIsCheckoutOpen(true)
    }
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Simple, Transparent Pricing</h1>
        <p className="text-muted-foreground max-w-md mx-auto">Choose the plan that works best for you and your team.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {pricingPlans.map((plan) => (
          <Card key={plan.id} className={`flex flex-col bg-white ${plan.popular ? "border-primary shadow-lg" : ""}`}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-4">
                <span className="text-3xl font-bold">${plan.price}</span>
                {plan.price > 0 && <span className="text-muted-foreground ml-1">/month</span>}
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <CheckIcon className="h-4 w-4 text-primary mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {isCheckoutOpen && selectedPlan && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          planId={selectedPlan}
          planDetails={pricingPlans.find((plan) => plan.id === selectedPlan)}
        />
      )}
    </div>
  )
}


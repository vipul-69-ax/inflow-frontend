import { useAuthStore } from "@/storage/auth"

export default function PricingPage() {

  const userId = useAuthStore((state) => state.userId)
  const html = `
  <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
<stripe-pricing-table pricing-table-id="prctbl_1RDSiLR6ix8HjnHbYDfihQGn"
publishable-key="pk_live_51Prd2zR6ix8HjnHb4XpbUHbsoNqt9S7T3WIhASK4UYAaTlfdQVy0p2shaFfAg0ijlBkfUmZLO4rUwUssF00DwT5z00hFfyiQzz"
client_reference_id="${userId}"
>
</stripe-pricing-table>
`;
  return <>
     <div className="container mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Simple, Transparent Pricing
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Choose the plan that works best for you and your team.
        </p>
      </div>
      <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
<stripe-pricing-table pricing-table-id="prctbl_1RDSiLR6ix8HjnHbYDfihQGn"
publishable-key="pk_live_51Prd2zR6ix8HjnHb4XpbUHbsoNqt9S7T3WIhASK4UYAaTlfdQVy0p2shaFfAg0ijlBkfUmZLO4rUwUssF00DwT5z00hFfyiQzz"
client_reference_id="${userId}"
>
</stripe-pricing-table>
    </div>
  </>
}


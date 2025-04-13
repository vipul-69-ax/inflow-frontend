export default function PricingPage() {


  return <>
  <div className="container mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Simple, Transparent Pricing</h1>
        <p className="text-muted-foreground max-w-md mx-auto">Choose the plan that works best for you and your team.</p>
      </div>
      </div>
      <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
      <stripe-pricing-table pricing-table-id="prctbl_1RDJqmR6ix8HjnHbbuQRvcFl"
      publishable-key="pk_test_51Prd2zR6ix8HjnHbLVnW0RcCvvOZyN4hH3adZPXhfjGcdTCmPD7rERjvis4rTdMIjNXWw7NC7w1BKdiU7kiebwoz009gTjfLdL">
      </stripe-pricing-table>
  </>
}


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="mt-2 text-gray-600">Create a new password for your account</p>
          </div>

          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="block font-medium">
                New Password
              </label>
              <Input id="password" type="password" placeholder="Enter your new password" className="w-full" required />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-password" className="block font-medium">
                Confirm New Password
              </label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your new password"
                className="w-full"
                required
              />
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700">Reset Password</Button>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Need help?{" "}
            <Link to="/contact" className="text-blue-600 hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}


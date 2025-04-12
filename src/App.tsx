"use client"

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Monitoring from "./routers/monitoring"
import ModernSidebar from "@/components/app-sidebar"
import Biolink from "./routers/biolink"
import { useState } from "react"
import LandingPage from "./pages/landing"
import { useAuthStore } from "./storage/auth"
import LoginPage from "./pages/auth/login"
import RegisterPage from "./pages/auth/register"
import ResetPasswordPage from "./pages/auth/forgot-password"
import VerifyEmailPage from "./pages/auth/email-verify"
import PricingPage from "./components/payments/pricing-page"
import SchedulingPage from "./routers/scheduling"
import UserProfilePage from "./pages/UserProfilePage"
import { TestPage } from "./test"

const AppWithParentRouter = () => {
  const [sidebarHovered, setSidebarHovered] = useState(false)
  const { hasVisitedBefore, setHasVisitedBefore, isAuthenticated } = useAuthStore()
  if (!hasVisitedBefore && !isAuthenticated) {
    return (
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <LandingPage
                onPress={() => {
                  setHasVisitedBefore(true)
                }}
              />
            }
          />
          <Route path="/:username" element={<UserProfilePage />} />
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        </Routes>
      </BrowserRouter>
    )
  }

  if (!isAuthenticated && hasVisitedBefore) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ResetPasswordPage />} />
          <Route path="/:username" element={<UserProfilePage />} />

        </Routes>
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <div className="flex h-screen">
        <div onMouseEnter={() => setSidebarHovered(true)} onMouseLeave={() => setSidebarHovered(false)}>
          <ModernSidebar />
        </div>
        <main className={`flex-1 overflow-auto transition-all duration-300 ${sidebarHovered ? "ml-64" : "ml-20"}`}>
          <Routes>
            <Route path="/" element={<Navigate to={"/biolink"} />} />
            <Route path="/biolink/*" element={<Biolink />} />
            <Route path="/monitoring/*" element={<Monitoring />} />
            <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
            <Route path="/scheduling/*" element={<SchedulingPage/>} />
            <Route path="/payments" element={<PricingPage/>}/>
            <Route path="/:username" element={<UserProfilePage />} />
            <Route path="/test" element={<TestPage/>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default AppWithParentRouter


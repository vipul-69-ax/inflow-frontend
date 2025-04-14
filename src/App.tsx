"use client"

import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import Monitoring from "./routers/monitoring"
import ModernSidebar from "@/components/app-sidebar"
import Biolink from "./routers/biolink"
import { useState, useEffect } from "react"
import LandingPage from "./pages/landing"
import { useAuthStore } from "./storage/auth"
import LoginPage from "./pages/auth/login"
import RegisterPage from "./pages/auth/register"
import ResetPasswordPage from "./pages/auth/forgot-password"
import VerifyEmailPage from "./pages/auth/email-verify"
import PricingPage from "./components/payments/pricing-page"
import SchedulingPage from "./routers/scheduling"
import UserProfilePage from "./pages/UserProfilePage"
import { useInitializeSettingsFromBackend } from "./utils/syncSettings"
import { useSettingsHook } from "./hooks/api/biolink/useSettings"
import { useSettingsStore } from "./storage/settings-store"

// This is the parent component that provides the BrowserRouter
const AppWithParentRouter = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

// This is the child component that implements the routing logic
const AppRoutes = () => {
  const [sidebarHovered, setSidebarHovered] = useState(false)
  const [storesLoaded, setStoresLoaded] = useState(false)
  const location = useLocation()
  const path = location.pathname
  //const isBioPage = location.pathname.startsWith("/bio/");
  const isBioPage = !(
    path === "/" ||
    path === "" ||
    path.startsWith("/verify-email") ||
    path.startsWith("/register") ||
    path.startsWith("/forgot-password") ||
    path.startsWith("/biolink") ||
    path.startsWith("/monitoring") ||
    path.startsWith("/scheduling") ||
    path.startsWith("/payments") ||
    path.startsWith("/test")
  )
  const { hasVisitedBefore, setHasVisitedBefore, isAuthenticated } = useAuthStore()

    const { fetchSettings } = useSettingsHook()
    const isPaid = useSettingsStore().is_paid
  // Ensure stores are loaded before rendering components that depend on them
  useEffect(() => {
    // Initialize or check if stores are ready
    const checkStores = async () => {
      // You can add any initialization logic here if needed
      // For example, loading settings from localStorage or API
      // Mark stores as loaded
      const settings = await fetchSettings()
            if (settings) {
              useSettingsStore.getState().initializeFromDb(settings)
            }
      setTimeout(()=>setStoresLoaded(true), 3000)
    }

    checkStores()
  }, [])

  if (!storesLoaded) {
    // Show a loading state while stores are initializing
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 border-4 border-t-indigo-500 border-r-transparent border-b-indigo-500 border-l-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!hasVisitedBefore && !isAuthenticated) {
    return (
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
    )
  }

  if (!isAuthenticated && hasVisitedBefore) {
    return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ResetPasswordPage />} />
        <Route path="/:username" element={<UserProfilePage />} />
      </Routes>
    )
  }

  // Authenticated user routes
  if(storesLoaded){
  return (
    <>
      {isBioPage ? (
        <Routes>
          <Route path="/:username" element={<UserProfilePage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
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
              <Route path="/scheduling/*" element={<SchedulingPage />} />
              <Route path="/payments" element={<PricingPage />} />
              <Route path="/:username" element={<UserProfilePage />} />
            </Routes>
          </main>
        </div>
      )}
    </>
  )
}
}

export default AppWithParentRouter

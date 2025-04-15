"use client"

import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, } from "react-router-dom"
import { useState, useEffect } from "react"

import Monitoring from "./routers/monitoring"
import SchedulingPage from "./routers/scheduling"
import Biolink from "./routers/biolink"
import LandingPage from "./pages/landing"
import LoginPage from "./pages/auth/login"
import RegisterPage from "./pages/auth/register"
import ResetPasswordPage from "./pages/auth/forgot-password"
import VerifyEmailPage from "./pages/auth/email-verify"
import PricingPage from "./components/payments/pricing-page"
import UserProfilePage from "./pages/UserProfilePage"
import ModernSidebar from "@/components/app-sidebar"

import { useAuthStore } from "./storage/auth"
import { useSettingsStore } from "./storage/settings-store"
import { useSettingsHook } from "./hooks/api/biolink/useSettings"

const AppWithParentRouter = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

const AppRoutes = () => {
  const [sidebarHovered, setSidebarHovered] = useState(false)
  const [storesLoaded, setStoresLoaded] = useState(false)
  const location = useLocation()
  const path = location.pathname
  const { isAuthenticated, setIsAuthenticated } = useAuthStore()
  const { fetchSettings } = useSettingsHook()
  const navigate = useNavigate()
  const [isAuthDone, setIsAuthDone] = useState()

  const isBioPage = !(
    path === "/" ||
    path.startsWith("/verify-email") ||
    path.startsWith("/register") ||
    path.startsWith("/forgot-password") ||
    path.startsWith("/biolink") ||
    path.startsWith("/monitoring") ||
    path.startsWith("/scheduling") ||
    path.startsWith("/payments") ||
    path.startsWith("/login")
  )

  // Load settings into Zustand on mount
  useEffect(() => {
    const checkStores = async () => {
      const settings = await fetchSettings()
      if (settings) {
        useSettingsStore.getState().initializeFromDb(settings)
      }
      setStoresLoaded(true)
    }

    checkStores()
  }, [])

  if (!storesLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 border-4 border-t-indigo-500 border-r-transparent border-b-indigo-500 border-l-transparent rounded-full animate-spin" />
      </div>
    )
  }
  // UNAUTHENTICATED: Show Landing + Auth Routes
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage onPress={()=>{
          navigate("/login")
        }} />} />
        <Route path="/login" element={<LoginPage 
          onSucess={()=>{
            navigate("/biolink")
          }}
        />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ResetPasswordPage />} />
        <Route path="/:username" element={<UserProfilePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    )
  }

  // AUTHENTICATED USER ROUTES
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
              <Route path="/" element={<Navigate to="/biolink" />} />
              <Route path="/biolink/*" element={<Biolink />} />
              <Route path="/monitoring/*" element={<Monitoring />} />
              <Route path="/scheduling/*" element={<SchedulingPage />} />
              <Route path="/payments" element={<PricingPage />} />
              <Route path="/login" element={<Navigate to={"/"}/>}/>
              <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
              <Route path="/:username" element={<UserProfilePage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      )}
    </>
  )
}

export default AppWithParentRouter

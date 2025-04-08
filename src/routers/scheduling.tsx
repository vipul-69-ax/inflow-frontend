"use client"

import { Route, Routes } from "react-router-dom"
import SchedulingAuth from "@/pages/scheduling/AuthPage"
import ScheduleFB from "@/pages/scheduling/fb/Dashboard"

export default function SchedulingPage() {

  return (
    <Routes>
        <Route
            path="/" index element={<SchedulingAuth/>}
        />
        <Route
            path="/facebook" index element={<ScheduleFB/>}
        />
        
    </Routes>
  )
}


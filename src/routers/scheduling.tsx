"use client"

import { Route, Routes } from "react-router-dom"
import SchedulingAuth from "@/pages/scheduling/AuthPage"
import ScheduleFB from "@/pages/scheduling/fb/Dashboard"
import YouTubeScheduler from "@/pages/scheduling/yt/Dashboard"

export default function SchedulingPage() {

  return (
    <Routes>
        <Route
            path="/" index element={<SchedulingAuth/>}
        />
        <Route
            path="/facebook" index element={<ScheduleFB/>}
        />
        <Route
            path="/youtube" index element={<YouTubeScheduler/>}
        />
    </Routes>
  )
}


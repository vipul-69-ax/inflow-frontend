"use client"

import { Route, Routes } from "react-router-dom"
import SchedulingAuth from "@/pages/scheduling/AuthPage"
import ScheduleFB from "@/pages/scheduling/fb/Dashboard"
import YouTubeScheduler from "@/pages/scheduling/yt/Dashboard"
import InstagramScheduler from "@/pages/scheduling/ig/Dashboard"

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
        <Route
            path="/instagram" index element={<InstagramScheduler/>}
        />
    </Routes>
  )
}


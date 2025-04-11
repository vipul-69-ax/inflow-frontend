"use client"

import { Route, Routes } from "react-router-dom"
import LinktreeHomepage from "@/pages/biolink/linktree/linktree"
import ThemePage from "@/pages/biolink/linktree/theme-page"

export default function Biolink() {
  
  return (
    <Routes>
        <Route
            path="/" index element={<LinktreeHomepage/>}
        />
        <Route
            path="/theme" element={<ThemePage/>}
        />
    </Routes>
  )
}


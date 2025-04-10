"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Sample font list - replace with your actual font data
const fontList = [
  "Lobster",
  "Bodoni_72",
  "Montserrat",
  "mono",
  "Black_And_White_Picture",
  "Comic_Sans_MS",
  "Orbitron",
  "Alex_Brush",
  "Didot",
  "Allerta_Stencil"
]

export default function FontSelectorOverlay() {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [font,setFont] = useState("Lobster")
  // Filter fonts based on search query
  const filteredFonts = fontList.filter((font) => font.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="flex">
      {/* <Button onClick={() => setOpen(true)}>Select Font</Button> */}

      <div className="flex flex-row">
        <span
          className="flex ml-2 p-3 items-center justify-center rounded-sm bg-gray-200 text-lg transition-colors duration-75 group-hover:bg-white"
          aria-hidden="true"
          style={{
            fontFamily: "Bitter, sans-serif",
            fontWeight: 400,
            letterSpacing: "0px",
          }}>
          Aa
        </span>
        <div onClick={() => setOpen(true)} className="relative ml-2 p-2 cursor-pointer rounded-lg border-2 transition-all border-gray-500 w-100 flex flex-row " style={{ backgroundColor: "white" }}>
          <span className="ml-4 justify-center items-center " style={{ fontFamily: font }}>Button</span>
        </div>
        </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Font Selection</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search fonts..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Font List */}
            <div className="max-h-60 overflow-y-auto border rounded-md">
              {filteredFonts.length > 0 ? (
                <ul className="divide-y">
                  {filteredFonts.map((font, index) => (
                    <li key={index} className="px-4 py-2 hover:bg-muted cursor-pointer" style={{ fontFamily: font }}>
                      {font}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-muted-foreground">No fonts found</div>
              )}
            </div>

            {/* Save Button */}
            <Button className="w-full" onClick={() => setOpen(false)}>
              Save Selection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

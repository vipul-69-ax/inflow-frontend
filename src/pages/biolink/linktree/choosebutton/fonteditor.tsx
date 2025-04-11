"use client"

import { useState } from "react"
import { Search, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Sample font list - replace with your actual font data
const fontList = [
  "Lobster",
  "Bodoni Moda",
  "Montserrat",
  "mono",
  "Black And White Picture",
  "Comic Sans MS",
  "Orbitron",
  "Alex Brush",
  "Poppins",
  "Allerta Stencil"
]

export default function FontSelectorOverlay() {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [font, setFont] = useState("Lobster")

  const filteredFonts = fontList.filter((f) =>
    f.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex">
      <div className="flex flex-row">
        <span
          className="flex h-14 w-14 items-center justify-center rounded-sm bg-gray-200 text-lg transition-colors duration-75 group-hover:bg-white"
          aria-hidden="true"
          style={{
            fontFamily: "Bitter, sans-serif",
            fontWeight: 400,
            letterSpacing: "0px",
          }}
        >
          Aa
        </span>

        <div
          onClick={() => setOpen(true)}
          className="relative ml-2 p-2 cursor-pointer rounded-lg border-2 transition-all border-gray-500 w-45 flex flex-row"
          style={{ backgroundColor: "white" }}
        >
          <span className="ml-11 justify-center items-center text-xl" style={{ fontFamily: font }}>
            Button
          </span>
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
                  {filteredFonts.map((f, index) => (
                    <li
                      key={index}
                      className={`px-4 py-2 flex items-center justify-between hover:bg-muted cursor-pointer`}
                      style={{ fontFamily: f }}
                      onClick={() => setFont(f)}
                    >
                      <span>{f}</span>
                      {font === f && <Check className="h-4 w-4 text-green-500" />}
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

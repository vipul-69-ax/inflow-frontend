"use client"

import { useState, useEffect } from "react"
import { ImageIcon, AlertCircle } from "lucide-react"

interface InstagramMediaProps {
  src: string
  type: "Image" | "Video"
  viewCount?: number | null
  alt?: string
}

export function InstagramMedia({ src, type, alt = "Instagram post" }: InstagramMediaProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [imgSrc, setImgSrc] = useState(src)

  // Handle image loading
  useEffect(() => {
    // eslint-disable-next-line no-constant-condition
    if (true) {
      const img = new Image()
      img.crossOrigin = "anonymous" // Try to avoid CORS issues
      img.onload = () => {
        setIsLoading(false)
        setHasError(false)
      }
      img.onerror = () => {
        setIsLoading(false)
        setHasError(true)
        // Try with a proxy if direct loading fails
        if (src === imgSrc) {
          // Only try once to avoid infinite loops
          setImgSrc(`https://images.weserv.nl/?url=${encodeURIComponent(src)}`)
        }
      }
      img.src = imgSrc
    }
  }, [imgSrc, src, type])


  // For image content
  return (
    <div className="relative aspect-square bg-muted">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted p-4 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Unable to load image</p>
          <p className="text-xs text-muted-foreground mt-1">Instagram may be blocking direct access</p>
        </div>
      ) : (
        <img
          src={imgSrc || "/placeholder.svg?height=400&width=400"}
          alt={alt}
          className="object-cover w-full h-full"
          onError={() => setHasError(true)}
        />
      )}

      {/* Image indicator */}
      <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center">
        <ImageIcon className="h-3 w-3 mr-1" />
        <span>Image</span>
      </div>
    </div>
  )
}


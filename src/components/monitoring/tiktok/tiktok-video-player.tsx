"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Eye, Play, Volume2, VolumeX } from "lucide-react"
import { formatNumber } from "@/lib/utils"

interface TiktokVideoPlayerProps {
  src: string
  cover: string
  viewCount?: number
  alt: string
}

export function TiktokVideoPlayer({ src, cover, viewCount }: TiktokVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isHovering, setIsHovering] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => {
      setIsPlaying(false)
      if (video) {
        video.currentTime = 0
      }
    }

    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("ended", handleEnded)

    return () => {
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("ended", handleEnded)
    }
  }, [])

  return (
    <div
      className="relative w-full h-full bg-black cursor-pointer"
      onClick={togglePlay}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={cover}
        className="w-full h-full object-contain"
        loop
        muted
        playsInline
        preload="metadata"
      />

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Play className="h-16 w-16 text-white opacity-80" />
        </div>
      )}

      {viewCount && (
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          <Eye className="h-3 w-3" />
          <span>{formatNumber(viewCount)}</span>
        </div>
      )}

      {(isPlaying || isHovering) && (
        <div className="absolute bottom-2 right-2">
          <button className="bg-black/50 text-white p-2 rounded-full" onClick={toggleMute}>
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      )}
    </div>
  )
}


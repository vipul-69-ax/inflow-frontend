/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useS3Upload.ts
import { useState } from 'react'

type UploadResult = {
  success: boolean
  url?: string
  error?: string
}

export function useS3Upload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<number | null>(null)

  const uploadToS3 = async (file: File): Promise<UploadResult> => {
    setUploading(true)
    setProgress(null)

    try {
      // 1. Get signed URL from your backend
      const res = await fetch('http://localhost:3000/api/scheduling/youtube/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, filetype: file.type }),
      })

      if (!res.ok) throw new Error('Failed to get upload URL')
      const { uploadUrl, fileUrl } = await res.json()

      // 2. Upload to S3
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })

      if (!uploadRes.ok) throw new Error('Upload to S3 failed')

      setUploading(false)
      return { success: true, url: fileUrl }
    } catch (err: any) {
      setUploading(false)
      return { success: false, error: err.message }
    }
  }

  return { uploadToS3, uploading, progress }
}

import React, { useState } from 'react'
import { useS3Upload } from '@/hooks/api/storage/useS3Uploads'

export const TestPage = () => {
  const [file, setFile] = useState<File | null>(null)
  const { uploadToS3, uploading } = useS3Upload()

  const handleUpload = async () => {
    if (!file) return
    const result = await uploadToS3(file)
    if (result.success) {
      alert(`Uploaded! URL: ${result.url}`)
    } else {
      alert(`Upload failed: ${result.error}`)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {uploading ? 'Uploading...' : 'Upload to S3'}
      </button>
    </div>
  )
}

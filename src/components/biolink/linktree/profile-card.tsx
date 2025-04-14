"use client"

import { useState } from "react"
import { SocialIcons } from "@/components/biolink/linktree/social-icons"
import { EditProfileModal } from "@/components/biolink/linktree/edit-profile-modal"
import { useSettingsStore } from "@/storage/settings-store"
import { useSettingsHook } from "@/hooks/api/biolink/useSettings"

export function ProfileCard() {
  const { displayName, bio, profileImage } = useSettingsStore()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const {updateSettings} = useSettingsHook()
  return (
    <div className="rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 p-6 shadow-sm transition-colors duration-300">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          {profileImage ? (
            <div className="h-24 w-24 rounded-full overflow-hidden">
              <img src={profileImage || "/placeholder.svg"} alt={displayName} className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold text-white">
              {displayName
                .split(" ")
                .map((name) => name[0])
                .join("")
                .toUpperCase()}
            </div>
          )}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="absolute bottom-0 right-0 rounded-full bg-white dark:bg-gray-700 p-1.5 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-gray-600 dark:text-gray-300 transition-colors duration-300"
            >
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </button>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-bold dark:text-white transition-colors duration-300">{displayName}</h2>
          <p className="mt-1 text-gray-500 dark:text-gray-400 transition-colors duration-300">{bio}</p>

          <div className="mt-4 flex justify-center sm:justify-start">
            <SocialIcons />
          </div>
        </div>
      </div>

      <EditProfileModal isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen} onSave={()=>{
          updateSettings(useSettingsStore.getState())
      }}  />
    </div>
  )
}


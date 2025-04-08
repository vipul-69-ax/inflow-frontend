"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Instagram, Mail, Facebook, Youtube, Twitter, Linkedin, Github, AtSign, LinkIcon } from "lucide-react"
import { useLinks } from "@/context/biolink/links-context"
import { SocialIconDialog } from "@/components/biolink/linktree/social-icon-dialog"
import { SocialIconButton } from "@/components/biolink/linktree/social-icon-button"

interface SocialIconsProps {
  variant?: "default" | "compact"
  editable?: boolean
}

export function SocialIcons({ variant = "default", editable = true }: SocialIconsProps) {
  const { socialLinks, addSocialLink, addRegularLink } = useLinks()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newLinkTitle, setNewLinkTitle] = useState("")
  const [newLinkUrl, setNewLinkUrl] = useState("https://")

  // Available social platforms to add
  const availableSocials = [
    { name: "Instagram", icon: <Instagram className="h-5 w-5" /> },
    { name: "Email", icon: <Mail className="h-5 w-5" /> },
    { name: "Facebook", icon: <Facebook className="h-5 w-5" /> },
    { name: "YouTube", icon: <Youtube className="h-5 w-5" /> },
    { name: "Twitter", icon: <Twitter className="h-5 w-5" /> },
    { name: "LinkedIn", icon: <Linkedin className="h-5 w-5" /> },
    { name: "GitHub", icon: <Github className="h-5 w-5" /> },
    {
      name: "TikTok",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      ),
    },
    { name: "Other", icon: <AtSign className="h-5 w-5" /> },
  ]

  const [selectedSocial, setSelectedSocial] = useState<string | null>(null)
  const [isSocialDialogOpen, setIsSocialDialogOpen] = useState(false)

  // Update the handleAddSocial function to open the dialog for URL input
  const handleAddSocial = (socialName: string) => {
    setSelectedSocial(socialName)
    setIsSocialDialogOpen(true)
    setIsAddDialogOpen(false)
  }

  // Update the handleSaveSocialLink function to ensure proper URL formatting
  const handleSaveSocialLink = (data: { name: string; url: string }) => {
    const socialToAdd = availableSocials.find((social) => social.name === data.name)
    if (socialToAdd && !socialLinks.some((link) => link.name === data.name)) {
      // Create a new social link object with the URL
      const newSocialLink = {
        name: socialToAdd.name,
        icon: socialToAdd.icon,
        url: data.url, // URL is already formatted in the SocialIconDialog
      }
      addSocialLink(newSocialLink)
    }
    setIsSocialDialogOpen(false)
    setSelectedSocial(null)
  }

  // Update the formatUrl function for regular links
  const formatUrl = (url: string): string => {
    if (!url.trim()) return url

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`
    }

    return url
  }

  // Update the handleAddRegularLink function to use the formatUrl function
  const handleAddRegularLink = () => {
    if (newLinkTitle.trim() && newLinkUrl.trim()) {
      addRegularLink({
        id: Date.now(),
        title: newLinkTitle,
        url: formatUrl(newLinkUrl),
        active: true,
        clicks: 0,
        favorite: false
      })
      setNewLinkTitle("")
      setNewLinkUrl("")
      setIsAddDialogOpen(false)
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 items-center">
        {socialLinks.map((social, index) => (
          <SocialIconButton key={index} name={social.name} icon={social.icon} url={social.url} editable={editable} />
        ))}

        {/* Add button - only show if editable */}
        {editable && (
          <button
            className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-2 hover:bg-purple-200 dark:hover:bg-purple-800/40 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-purple-600 dark:text-purple-400"
            aria-label="Add link"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Unified add dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Link</DialogTitle>
            <DialogDescription>Add a social media profile or a custom link to your profile.</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="social" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="custom">Custom Link</TabsTrigger>
            </TabsList>

            <TabsContent value="social" className="mt-4">
              <div className="grid grid-cols-3 gap-4">
                {availableSocials.map((social) => (
                  <Button
                    key={social.name}
                    variant="outline"
                    className="flex flex-col items-center justify-center h-24 p-2 gap-2"
                    onClick={() => {
                      handleAddSocial(social.name)
                      setIsAddDialogOpen(false)
                    }}
                    disabled={socialLinks.some((link) => link.name === social.name)}
                  >
                    <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-2">{social.icon}</div>
                    <span className="text-xs font-medium">{social.name}</span>
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="custom" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="link-title">Link Title</Label>
                <Input
                  id="link-title"
                  placeholder="My Awesome Link"
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                />
              </div>

              {/* Update the custom link input field to add a helpful message */}
              <div className="space-y-2">
                <Label htmlFor="link-url">URL</Label>
                <Input
                  id="link-url"
                  placeholder="https://example.com"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  You can enter URLs with or without https:// - we'll handle it for you
                </p>
              </div>

              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={handleAddRegularLink}
                disabled={!newLinkTitle.trim() || !newLinkUrl.trim()}
              >
                <LinkIcon className="mr-2 h-4 w-4" />
                Add Link
              </Button>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Social Icon URL Dialog */}
      {selectedSocial && (
        <SocialIconDialog
          isOpen={isSocialDialogOpen}
          onClose={() => {
            setIsSocialDialogOpen(false)
            setSelectedSocial(null)
          }}
          onSave={handleSaveSocialLink}
          availablePlatforms={[selectedSocial]}
          initialData={{ name: selectedSocial, url: "" }}
        />
      )}
    </>
  )
}


"use client"

import { useState } from "react"
import { ArrowRight, Facebook, Globe, Instagram, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PlatformSelectionPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const TikTokIcon = ({ color = "#000000" }) => {
    return (
      <svg
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 50 50"
        width="10%"
        height="10%"
      >
        <path d="M41,4H9C6.243,4,4,6.243,4,9v32c0,2.757,2.243,5,5,5h32c2.757,0,5-2.243,5-5V9C46,6.243,43.757,4,41,4z M37.006,22.323 c-0.227,0.021-0.457,0.035-0.69,0.035c-2.623,0-4.928-1.349-6.269-3.388c0,5.349,0,11.435,0,11.537c0,4.709-3.818,8.527-8.527,8.527 s-8.527-3.818-8.527-8.527s3.818-8.527,8.527-8.527c0.178,0,0.352,0.016,0.527,0.027v4.202c-0.175-0.021-0.347-0.053-0.527-0.053 c-2.404,0-4.352,1.948-4.352,4.352s1.948,4.352,4.352,4.352s4.527-1.894,4.527-4.298c0-0.095,0.042-19.594,0.042-19.594h4.016 c0.378,3.591,3.277,6.425,6.901,6.685V22.323z" />
      </svg>
    );
  };

  const platforms = [
    {
      value: "instagram",
      label: "Instagram",
      icon: <Instagram className="h-5 w-5 text-pink-500" />,
      description: "Photo and video sharing social network"
    },
    {
      value: "facebook",
      label: "Facebook",
      icon: <Facebook className="h-5 w-5 text-blue-600" />,
      description: "Connect with friends, family and other people you know"
    },
    {
      value: "tiktok",
      label: "TikTok",
      icon: <TikTokIcon />,
      description: "Short-form, video-sharing app"
    },
  ]

  const handleContinue = () => {
    if (!selectedPlatform) return
    
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Here you would typically redirect to the dashboard or next step
      window.location.href = "/"
    }, 1500)
  }

  const selectedPlatformData = platforms.find(p => p.value === selectedPlatform)

  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-b from-background via-background to-secondary/10">
      <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-background/90 px-4 md:px-8 lg:px-12 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2 font-semibold">
            <Globe className="h-6 w-6 text-primary" />
            <span>CompetitorIQ</span>
          </a>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <Card className="shadow-lg border-0 overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold">Select Your Inflow Platform</CardTitle>
                <CardDescription>
                  Choose the social media platform you want to monitor and analyze
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="platform-select" className="text-sm font-medium">
                    Platform
                  </label>
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger id="platform-select" className="w-full h-12">
                      <SelectValue placeholder="Select a platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map((platform) => (
                        <SelectItem 
                          key={platform.value} 
                          value={platform.value}
                          className="h-12 flex items-center gap-2 py-3"
                        >
                          <div className="flex items-center gap-2">
                            {platform.icon}
                            <span>{platform.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedPlatform && (
                  <div className="rounded-lg border p-4 bg-secondary/30 space-y-3 animate-in fade-in-50 duration-300">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Inflow Platform</h3>
                      <div className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                        Selected
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {selectedPlatformData?.icon}
                      <div>
                        <p className="font-medium">{selectedPlatformData?.label}</p>
                        <p className="text-sm text-muted-foreground">{selectedPlatformData?.description}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-3 pt-2">
                <Button 
                  className="w-full rounded-full" 
                  size="lg"
                  disabled={!selectedPlatform || isLoading}
                  onClick={handleContinue}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  You can change platforms later in your dashboard settings
                </p>
              </CardFooter>
            </Card>
          </div>

          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative w-full max-w-sm aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/30 rounded-full blur-3xl opacity-70"></div>
              <div className="relative h-full w-full flex items-center justify-center">
                <div className="bg-background rounded-2xl shadow-xl p-6 w-full max-w-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Inflow Analytics</h3>
                    <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Engagement</span>
                        <span className="text-sm font-medium">+24%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div className="h-2 rounded-full bg-primary" style={{ width: "72%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Followers</span>
                        <span className="text-sm font-medium">+12%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div className="h-2 rounded-full bg-primary" style={{ width: "58%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Reach</span>
                        <span className="text-sm font-medium">+38%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div className="h-2 rounded-full bg-primary" style={{ width: "84%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 w-full shrink-0 px-4 md:px-8 lg:px-12 border-t bg-background/50 backdrop-blur-sm">
        <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2024 CompetitorIQ. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6">
            <a href="#" className="text-xs hover:underline underline-offset-4">
              Terms of Service
            </a>
            <a href="#" className="text-xs hover:underline underline-offset-4">
              Privacy
            </a>
            <a href="#" className="text-xs hover:underline underline-offset-4">
              Help
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
}

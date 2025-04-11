/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Check, Youtube, Loader2, Plus, Search, Trash2, Users, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { YoutubeUserDetails } from "@/components/monitoring/youtube/youtube-user-details"

import {
  useYoutubeUsers,
  useAddYoutubeUser,
  useYoutubeUserData,
  useRefreshYoutubeData,
  useRemoveYoutubeUser,
} from "@/hooks/monitoring/useYoutubeApi"

export default function YoutubeDashboard() {
  const [newUsername, setNewUsername] = useState("")
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch all monitored users
  const { users: monitoredUsers, loading: usersLoading, refetch: refetchUsers } = useYoutubeUsers()

  // Add a new user
  const { addUser, loading: addingUser, error: addError, success: addSuccess } = useAddYoutubeUser()

  // Fetch data for selected user
  const {
    userData,
    loading: dataLoading,
    error: dataError,
    refetch: refetchUserData,
  } = useYoutubeUserData(selectedUser)

  // Log the data when it changes
  useEffect(() => {
    if (userData) {
      console.log(`Received ${userData.length} data entries for ${selectedUser}`)
    }
  }, [userData, selectedUser])

  // Refresh data for all users
  const { refreshData, loading: refreshing, updates } = useRefreshYoutubeData()

  // Remove a user
  const { removeUser, loading: removingUser, success } = useRemoveYoutubeUser()

  // Handle adding a new user
  const handleAddUser = async () => {
    if(monitoredUsers.length>=5){
      alert("You can only monitor 5 accounts at a time.")
      return
    }
    if (!newUsername.trim()) return;
  
    let extractedUsername = newUsername.trim();
  
    // Match patterns
    const youtubeAtPattern = /^https?:\/\/(www\.)?youtube\.com\/@([a-zA-Z0-9._-]+)/;
    const youtubeUserPattern = /^https?:\/\/(www\.)?youtube\.com\/user\/([a-zA-Z0-9._-]+)/;
    const youtubeChannelPattern = /^https?:\/\/(www\.)?youtube\.com\/channel\/([a-zA-Z0-9_-]+)/;
  
    const atMatch = extractedUsername.match(youtubeAtPattern);
    const userMatch = extractedUsername.match(youtubeUserPattern);
    const channelMatch = extractedUsername.match(youtubeChannelPattern);
  
    if (channelMatch) {
      alert("Channel IDs are not supported. Please provide a YouTube username or @handle.");
      return;
    }
  
    if (atMatch) {
      extractedUsername = atMatch[2];
    } else if (userMatch) {
      extractedUsername = userMatch[2];
    }
  
    await addUser(extractedUsername);
  
    if (addSuccess) {
      setNewUsername("");
      window.location.reload()

    }
  };
  

  // Handle refreshing data
  const handleRefreshData = async () => {
    await refreshData()

    if (updates.length > 0) {
      // If a user is selected, refresh their data
      if (selectedUser) {
        refetchUserData(selectedUser)
      }
    }
  }

  // Handle removing a user
  const handleRemoveUser = async (username: string) => {
    try {
      await removeUser(username)

      if (success) {
        // If the removed user was selected, clear the selection
        if (selectedUser === username) {
          setSelectedUser(null)
        }

        // Refresh the user list
        refetchUsers()
      }
    } catch {
      // do nothing
    }
  }

  // Handle selecting a user
  const handleUserSelect = (username: string) => {
    if (selectedUser === username) return
    setSelectedUser(username)
  }

  // Effect to handle add success
  useEffect(() => {
    if (addSuccess && newUsername) {
      // Auto-select the newly added user
      setSelectedUser(newUsername)
    }
  }, [addSuccess, newUsername])

  // Filter users based on search query
  const filteredUsers = monitoredUsers.filter((user) => user.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="flex flex-col min-h-dvh w-full bg-background">
      <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-background/90 px-4 md:px-8 lg:px-12 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2 font-semibold">
            <Youtube className="h-6 w-6 text-red-500" />
            <span>YouTube Analytics Dashboard</span>
          </a>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="grid gap-6 md:grid-cols-12 min-w-2xl">
          {/* Sidebar with user list */}
          <Card className="md:col-span-3 lg:col-span-3">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center justify-between">
                <span>Monitored Channels</span>
                <Badge variant="outline" className="ml-2">
                  {monitoredUsers.length}
                </Badge>
              </CardTitle>
              <CardDescription>Add YouTube channels to monitor</CardDescription>
            </CardHeader>
            <CardContent className="pb-1">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Add channel ID"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="h-9"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddUser()
                    }
                  }}
                  disabled={addingUser}
                />
                <Button
                  size="sm"
                  className="h-9 px-3"
                  onClick={handleAddUser}
                  disabled={addingUser || !newUsername.trim()}
                >
                  {addingUser ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                </Button>
              </div>

              {addError && (
                <Alert variant="destructive" className="mt-3">
                  <X className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{addError}</AlertDescription>
                </Alert>
              )}
            </CardContent>

            <CardContent className="pt-2 pb-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search channels"
                  className="pl-8 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>

            <CardContent>
              <ScrollArea className="h-[calc(100vh-280px)]">
                {usersLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-2 p-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredUsers.map((user) => (
                      <div
                        key={user}
                        className={`group flex items-center justify-between rounded-md px-2 py-2 ${
                          selectedUser === user ? "bg-secondary text-secondary-foreground" : "hover:bg-secondary/50"
                        } cursor-pointer transition-colors`}
                        onClick={() => handleUserSelect(user)}
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8 border border-border">
                            <AvatarImage
                              src={
                                userData && userData[0] && userData[0].username === user
                                  ? userData[0].profile_pic_url
                                  : `https://ui-avatars.com/api/?name=${user}&background=random`
                              }
                            />
                            <AvatarFallback>{user.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{user}</span>
                          </div>
                        </div>
                        <Button
                          variant={selectedUser === user ? "secondary" : "ghost"}
                          size="icon"
                          className={`h-7 w-7 ${
                            selectedUser === user
                              ? "opacity-100 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"
                              : "opacity-0 group-hover:opacity-100"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveUser(user)
                          }}
                          disabled={removingUser}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    {filteredUsers.length === 0 && searchQuery && (
                      <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                        <Search className="h-12 w-12 mb-2 opacity-20" />
                        <p>No matching channels found</p>
                        <p className="text-xs">Try a different search term</p>
                      </div>
                    )}

                    {monitoredUsers.length === 0 && !usersLoading && (
                      <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                        <Users className="h-12 w-12 mb-2 opacity-20" />
                        <p>No channels monitored yet</p>
                        <p className="text-xs">Add a YouTube channel ID to start monitoring</p>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Main content area */}
          <div className="md:col-span-9 lg:col-span-9 space-y-6">
            {selectedUser ? (
              dataLoading ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                      <Skeleton className="h-20 w-20 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-5 w-32" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : dataError ? (
                <Card>
                  <CardContent className="p-6">
                    <Alert variant="destructive">
                      <X className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{dataError}</AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              ) : userData && userData[0] ? (
                <YoutubeUserDetails userData={userData} />
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Loader2 className="h-12 w-12 mb-4 animate-spin text-muted-foreground" />
                      <p>No data available for this channel</p>
                      <p className="text-xs text-muted-foreground mt-1">Try refreshing the data</p>
                    </div>
                  </CardContent>
                </Card>
              )
            ) : (
              <Card className="flex flex-col items-center justify-center h-[calc(100vh-180px)]">
                <div className="max-w-md text-center p-8">
                  <Youtube className="h-16 w-16 text-red-500 mx-auto mb-6 opacity-80" />
                  <h2 className="text-2xl font-bold mb-2">YouTube Channel Monitor</h2>
                  <p className="text-muted-foreground mb-6">
                    Track engagement, subscribers, and content performance for YouTube channels. Select a channel from
                    the sidebar or add a new one to get started.
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Monitor subscriber growth and engagement rates</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Track video performance and content strategy</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Analyze audience behavior and trends</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}


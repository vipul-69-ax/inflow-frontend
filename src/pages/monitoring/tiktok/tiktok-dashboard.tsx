"use client"

import { useState, useEffect } from "react"
import { useTiktokApi } from "@/hooks/monitoring/useTiktokApi"
import {TiktokUserData} from '@/types/scheduling/tiktok'
import { TiktokUserDetails } from "@/components/monitoring/tiktok/tiktok-user-details"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Plus, RefreshCw, Search, Trash2, TrendingUp, User, Users } from "lucide-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useSettingsStore } from "@/storage/settings-store"
import { toast } from "sonner"

export default function TiktokDashboard() {
  const [username, setUsername] = useState("")
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [userData, setUserData] = useState<TiktokUserData[] | null>(null)
  const [monitoredUsers, setMonitoredUsers] = useState<string[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [isRemovingUser, setIsRemovingUser] = useState(false)

  const { loading, error, addTiktokUser, removeTiktokUser, refreshTiktokData, getAllTiktokUsers, getTiktokUserData } =
    useTiktokApi()

  // Fetch all monitored users on component mount
  useEffect(() => {
    fetchMonitoredUsers()
  }, [])

  // Fetch user data when a user is selected
  useEffect(() => {
    if (selectedUser) {
      fetchUserData(selectedUser)
    }
  }, [selectedUser])

  const fetchMonitoredUsers = async () => {
    const users = await getAllTiktokUsers()
    setMonitoredUsers(users)

    // If there are users and none is selected, select the first one
    if (users.length > 0 && !selectedUser) {
      setSelectedUser(users[0])
    }
  }

  const fetchUserData = async (username: string) => {
    const data = await getTiktokUserData(username)
    if (data) {
      setUserData(data)
    }
  }
    const is_paid = useSettingsStore().is_paid
  
  const handleAddUser = async () => {
    const limit = !is_paid?1:5

    if(monitoredUsers.length>=limit){
      toast(`You can only monitor ${limit} accounts at a time.`)
      return
    }
    if (!username.trim()) {
      return;
    }
  
    let extractedUsername = username.trim();
  
    // Check if the input is a TikTok URL
    const tiktokUrlPattern = /^https?:\/\/(www\.)?tiktok\.com\/@([a-zA-Z0-9._]+)/;
    const match = extractedUsername.match(tiktokUrlPattern);
  
    if (match) {
      extractedUsername = match[2]; // extract the username from the URL
    }
  
    setIsAddingUser(true);
    const success = await addTiktokUser(extractedUsername);
  
    if (success) {
      setUsername("");
      await fetchMonitoredUsers();
  
      // Select the newly added user
      setSelectedUser(extractedUsername);
    }
  
    setIsAddingUser(false);
  };
  

  const handleRemoveUser = async (username: string) => {
    setIsRemovingUser(true)
    const success = await removeTiktokUser(username)

    if (success) {
      // If the removed user was selected, clear selection
      if (selectedUser === username) {
        setSelectedUser(null)
        setUserData(null)
      }

      await fetchMonitoredUsers()
    }

    setIsRemovingUser(false)
  }

  const handleRefreshData = async () => {
    setIsRefreshing(true)
    await refreshTiktokData()

    // Refresh the current user's data if one is selected
    if (selectedUser) {
      await fetchUserData(selectedUser)
    }

    setIsRefreshing(false)
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">TikTok Analytics</h1>
          <p className="text-muted-foreground">
            Monitor and analyze TikTok accounts to track performance and engagement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshData}
            disabled={isRefreshing || !monitoredUsers.length}
          >
            {isRefreshing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monitored Accounts</CardTitle>
              <CardDescription>TikTok accounts you are currently tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Input
                  placeholder="Enter TikTok username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button size="sm" onClick={handleAddUser} disabled={isAddingUser || !username.trim()}>
                  {isAddingUser ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                </Button>
              </div>

              <div className="space-y-2">
                {loading && !monitoredUsers.length ? (
                  <>
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </>
                ) : monitoredUsers.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <Users className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <p>No accounts monitored yet</p>
                    <p className="text-xs">Add a TikTok username to start tracking</p>
                  </div>
                ) : (
                  monitoredUsers.map((user) => (
                    <div
                      key={user}
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                        selectedUser === user ? "bg-muted" : "hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://ui-avatars.com/api/?name=${user}&background=random`} />
                          <AvatarFallback>{user.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">@{user}</span>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Remove Account</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to remove @{user} from monitoring? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose>Cancel</DialogClose>
                            <DialogTrigger
                              onClick={() => handleRemoveUser(user)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {isRemovingUser ? (
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                              )}
                              Remove
                            </DialogTrigger>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              {monitoredUsers.length} {monitoredUsers.length === 1 ? "account" : "accounts"} monitored
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
              <CardDescription>Overview of your monitored accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Total Accounts</span>
                </div>
                <Badge variant="outline">{monitoredUsers.length}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Last Updated</span>
                </div>
                <Badge variant="outline">
                  {userData && userData.length > 0 ? new Date(userData[0].timestamp).toLocaleDateString() : "Never"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Selected Account</span>
                </div>
                {selectedUser ? (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    @{selectedUser}
                  </Badge>
                ) : (
                  <Badge variant="outline">None</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          {loading && !userData ? (
            <Card>
              <CardContent className="py-10">
                <div className="space-y-4">
                  <Skeleton className="h-12 w-3/4 mx-auto" />
                  <Skeleton className="h-32 w-full" />
                  <div className="grid grid-cols-3 gap-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="py-10 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Error Loading Data</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => selectedUser && fetchUserData(selectedUser)}>Try Again</Button>
              </CardContent>
            </Card>
          ) : !selectedUser ? (
            <Card>
              <CardContent className="py-10 text-center">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium mb-2">No Account Selected</h3>
                <p className="text-muted-foreground mb-4">
                  Select an account from the sidebar or add a new one to view analytics
                </p>
              </CardContent>
            </Card>
          ) : !userData || userData.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium mb-2">No Data Available</h3>
                <p className="text-muted-foreground mb-4">We couldn't find any data for @{selectedUser}</p>
                <Button onClick={handleRefreshData} disabled={isRefreshing}>
                  {isRefreshing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Data
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <TiktokUserDetails userData={userData} selectedUser={selectedUser} />
          )}
        </div>
      </div>
    </div>
  )
}


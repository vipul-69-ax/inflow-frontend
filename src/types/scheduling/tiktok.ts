export interface TiktokVideo {
    video_id: string
    video_url: string
    video_cover: string
    caption: string
    likes: number
    comments: number
    shares: number
    views: number
    timestamp: number
  }
  
  export interface TiktokUserData {
    username: string
    full_name: string
    profile_pic_url: string
    bio: string
    followers: number
    following: number
    likes: number
    videos: number
    is_verified: boolean
    recent_videos: TiktokVideo[]
    total_likes: number
    total_comments: number
    total_shares: number
    total_views: number
    engagement_rate: number
    timestamp: string
  }
  
  
export interface YoutubeVideo {
  video_id: string
  title: string
  description: string
  published_at: string
  thumbnail_url: string
  likes: number
  comments: number
  views: number
  engagement_rate: number
}

export interface YoutubeUserData {
  username: string
  channel_name: string
  profile_pic_url: string
  description: string
  subscribers: number
  total_views: number
  total_videos: number
  recent_videos: YoutubeVideo[]
  total_likes: string | number
  total_comments: string | number
  engagement_rate: number
  timestamp: string
}


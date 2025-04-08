export interface InstagramUser {
    username: string
    avatar?: string
  }
  
  export interface InstagramPost {
    post_id: string
    caption: string
    media_url: string
    post_type: "Video" | "Image"
    timestamp: string
    likes: number
    comments: number
    engagement_rate: number
    hashtags: string[]
    mentions: string[]
    video_view_count: number | null
  }
  
  export interface InstagramUserData {
    username: string
    full_name: string
    biography: string
    profile_pic_url: string
    is_private: boolean
    is_verified: boolean
    followers: number
    following: number
    posts_count: number
    external_url: string | null
    business_category_name?: string
    business_account?: boolean
    engagement_rate: number
    recent_posts: InstagramPost[]
    timestamp?: string,
    total_likes: number,
    total_comments: number,
  }
  
  export interface ChartDataPoint {
    date: string
    rate?: number
    count?: number
  }
  
  export interface PostPerformanceData {
    name: string
    likes: number
    comments: number
  }
  
  export interface ChartData {
    engagementHistory: ChartDataPoint[]
    followerHistory: ChartDataPoint[]
    postPerformance: PostPerformanceData[]
  }
  
  
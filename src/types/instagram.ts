export interface ScheduleResponse {
    data: object | null;
    error: string | null;
    loading: boolean;
  }

  // Facebook API types

export interface FacebookPageData {
  id: string
  name: string
  access_token: string
  picture?: {
    data: {
      url: string
    }
  }
}

export interface FacebookPost {
  id: string
  message?: string
  created_time: string
  full_picture?: string
  permalink_url: string
  status_type: string
}

export interface FacebookReel {
  id: string
  description?: string
  created_time: string
  thumbnail_url?: string
  permalink: string
  status: string
}

export interface FacebookStory {
  id: string
  created_time: string
  media_type: string
}

export interface ScheduledJob {
  job_id: string
  type: "post" | "reel" | "story"
  status: "scheduled"
  details: {
    type: string
    page_id: string
    message?: string
    description?: string
    scheduled_time: string
    has_media?: boolean
    media_type?: string
  }
  next_run: string
  time_remaining: {
    seconds: number
    formatted: string
  }
  has_media: boolean
}


  
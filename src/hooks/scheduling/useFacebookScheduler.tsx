/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = `https://api.inflow.chat/api/scheduling/facebook`

export const useAuthorizationUrl = () => {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const response = await axios.get<{ data: string }>(`${API_BASE_URL}/auth/url`);
        setUrl(response.data.data);
      } catch (err) {
        setError("Failed to fetch authorization URL");
      } finally {
        setLoading(false);
      }
    };

    fetchUrl();
  }, []);

  return { url, loading, error };
};


export const useAccessToken = (exchange_code: string) => {

  const [token, setToken] = useState<object | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  console.log(exchange_code)
  useEffect(() => {
    const fetchToken = async () => {
        if(exchange_code === "") return
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/access-token`, { exchange_code });
          setToken(response.data);
        } catch (err) {
          setError("Failed to generate long-lived token");
        } finally {
          setLoading(false);
        }
      };
  
      fetchToken();
    }, [exchange_code]);
    
    // Save access token to local storage refresh after 60 days after calling this hook
    if(exchange_code !== ""){
    localStorage.setItem('fb_access_token', token?(token as any).access_token:"")
    }
    const res = token && (token as any).access_token
    return { token:res, loading, error };
  };


// Type for API response states
interface ApiState<T> {
  jobs?:any
  data: T | null
  loading: boolean
  error: string | null
}

export const useFacebookScheduler = () => {
  const [post, setPost] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  })

  const [reel, setReel] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  })

  const [story, setStory] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  })

  const [scheduledJobs, setScheduledJobs] = useState<any>({
    data: null,
    loading: false,
    error: null,
  })

  // Memoize the getScheduledJobs function to prevent it from changing on every render
  const memoizedGetScheduledJobs = React.useCallback(async () => {
    setScheduledJobs({ data: null, loading: true, error: null })

    try {
      const response = await axios.get(`${API_BASE_URL}/scheduled`)

      // Handle 204 No Content response
      if (response.status === 204) {
        setScheduledJobs({
          data: { jobs: [], grouped: { posts: [], reels: [], stories: [] } },
          loading: false,
          error: null,
        })
        return { jobs: [], grouped: { posts: [], reels: [], stories: [] } }
      }

      const res = response.data
      const finalRes = response.data.jobs.filter((i:any)=>{
        return i.platform == "fb" && i.details.page_id == JSON.parse(localStorage.getItem("fb_page_data") || "{}").id
      })
      res['jobs'] = finalRes
      setScheduledJobs({ data: res, loading: false, error: null })
      return response.data
    } catch (error: any) {
      console.error("Error getting scheduled jobs:", error)
      setScheduledJobs({
        data: null,
        loading: false,
        error: error.response?.data?.error || error.message || "Failed to get scheduled jobs",
      })
      throw error
    }
  }, [])

  // Replace the original getScheduledJobs with the memoized version
  const getScheduledJobs = memoizedGetScheduledJobs

  // Schedule a post (text, image, or video)
  const schedulePost = async (
    pageAccessToken: string,
    pageId: string,
    message: string,
    scheduledTime?: string,
    media?: File,
  ) => {
    setPost({ data: null, loading: true, error: null })

    try {
      const formData = new FormData()
      formData.append("page_access_token", pageAccessToken)
      formData.append("page_id", pageId)
      formData.append("message", message)

      if (scheduledTime) {
        formData.append("scheduled_time", scheduledTime)
      }

      if (media) {
        formData.append("media", media)
      }

      const response = await axios.post(`${API_BASE_URL}/schedule-post`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      setPost({ data: response.data, loading: false, error: null })
      return response.data
    } catch (error: any) {
      console.error("Error scheduling post:", error)
      setPost({
        data: null,
        loading: false,
        error: error.response?.data?.error || error.message || "Failed to schedule post",
      })
      throw error
    }
  }

  // Schedule a reel
  const scheduleReel = async (
    pageAccessToken: string,
    pageId: string,
    description: string,
    video: File,
    scheduledTime?: string,
  ) => {
    setReel({ data: null, loading: true, error: null })

    try {
      const formData = new FormData()
      formData.append("page_access_token", pageAccessToken)
      formData.append("page_id", pageId)
      formData.append("description", description)
      formData.append("media", video) // Changed from "video" to "media" to match multer config

      if (scheduledTime) {
        formData.append("scheduled_time", scheduledTime)
      }

      const response = await axios.post(`${API_BASE_URL}/schedule-reel`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      setReel({ data: response.data, loading: false, error: null })
      return response.data
    } catch (error: any) {
      console.error("Error scheduling reel:", error)
      setReel({
        data: null,
        loading: false,
        error: error.response?.data?.error || error.message || "Failed to schedule reel",
      })
      throw error
    }
  }

  // Post a story
  const postStory = async (pageAccessToken: string, pageId: string, media: File, scheduledTime?: string) => {
    setStory({ data: null, loading: true, error: null })

    try {
      const formData = new FormData()
      formData.append("page_access_token", pageAccessToken)
      formData.append("page_id", pageId)
      formData.append("media", media)

      if (scheduledTime) {
        formData.append("scheduled_time", scheduledTime)
      }

      const response = await axios.post(`${API_BASE_URL}/post-story`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      setStory({ data: response.data, loading: false, error: null })
      return response.data
    } catch (error: any) {
      console.error("Error posting story:", error)
      setStory({
        data: null,
        loading: false,
        error: error.response?.data?.error || error.message || "Failed to post story",
      })
      throw error
    }
  }

  // Cancel a scheduled job
  const cancelScheduledJob = async (jobId: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/delete_post`, { job_id: jobId })

      // Refresh the jobs list after cancellation
      await getScheduledJobs()

      return response.data
    } catch (error: any) {
      console.error("Error cancelling scheduled job:", error)
      throw error
    }
  }

  return {
    schedulePost,
    scheduleReel,
    postStory,
    getScheduledJobs,
    cancelScheduledJob,
    post,
    reel,
    story,
    scheduledJobs,
  }
}
  
  export const useFacebookPages = () => {
    const getFacebookPages = async (accessToken: string) => {
      if (!accessToken) {
        throw new Error("Access token is required.");
      }
      try {
        const response = await axios.get(`${API_BASE_URL}/pages`, {
          params: { access_token: accessToken },
        });
        return { data: response.data };
      } catch (error: any) {
        throw error.response?.data || "Internal Server Error";
      }
    };
  
    const getPagePosts = async (pageId: string, pageAccessToken: string) => {
      if (!pageId || !pageAccessToken) {
        throw new Error("Page ID and Access Token are required.");
      }
      try {
        const response = await axios.get(`${API_BASE_URL}/posts`, {
          params: {
            fields: "id,message,created_time,permalink_url,full_picture,attachments,status",
            access_token: pageAccessToken,
          },
        });
        return { data: response.data };
      } catch (error: any) {
        throw error.response?.data || "Failed to fetch page posts";
      }
    };
  
    const getReels = async (pageId: string, pageAccessToken: string) => {
      if (!pageId || !pageAccessToken) {
        throw new Error("Page ID and Access Token are required.");
      }
      try {
        const response = await axios.get(`${API_BASE_URL}/reels`, {
          params: {
            access_token: pageAccessToken,
            fields: "id,media_type,thumbnail_url,permalink,status",
          },
        });
        return { data: response.data };
      } catch (error: any) {
        throw error.response?.data || "Internal Server Error";
      }
    };
  
    const getPageEvents = async (pageId: string, pageAccessToken: string) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/events`, {
          params: {
            access_token: pageAccessToken,
            fields: "id,name,description,start_time,end_time,place,cover",
          },
        });
        return { data: response.data.data };
      } catch (error: any) {
        throw error.response?.data || "Failed to fetch events";
      }
    };
  
    const getPostInsights = async (postId: string, pageAccessToken: string) => {
      if (!postId) {
        throw new Error("Post ID is required.");
      }
      try {
        const response = await axios.get(`${API_BASE_URL}/post-insights`, {
          params: {
            access_token: pageAccessToken,
            metric: [
              "post_impressions",
              "post_clicks",
              "post_engagements",
              "post_video_avg_time_watched",
            ].join(","),
          },
        });
        return { data: response.data };
      } catch (error: any) {
        throw error.response?.data || "Internal Server Error";
      }
    };
  
    const deletePost = async (postId: string, pageAccessToken: string) => {
      if (!postId || !pageAccessToken) {
        throw new Error("Post ID and Access Token are required.");
      }
      try {
        const response = await axios.post(`${API_BASE_URL}/delete-post`, {
          params: { access_token: pageAccessToken },
        });
        return { data: response.data };
      } catch (error: any) {
        throw error.response?.data || "Internal Server Error";
      }
    };

    const getPageInsights = async (pageId:string, pageAccessToken:string, )=>{
        if (!pageId || !pageAccessToken) {
            throw new Error("Post ID and Access Token are required.");
          }
          try {
            const response = await axios.get(`${API_BASE_URL}/insights`, {
              params: { access_token: pageAccessToken },
            });
            return { data: response.data };
          } catch (error: any) {
            throw error.response?.data || "Internal Server Error";
          } 
    }
  
    return {
      getFacebookPages,
      getPagePosts,
      getReels,
      getPageEvents,
      getPostInsights,
      deletePost,
      getPageInsights
    };
  };

  
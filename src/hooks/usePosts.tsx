
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string | null;
  created_at: string;
  profiles: {
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
  comments_count?: number;
  shares_count?: number;
  likes_count?: number;
  user_has_liked?: boolean;
  user_has_saved?: boolean;
}

/**
 * Hook for fetching and managing posts with real-time updates
 */
export function usePosts() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Main query to fetch posts
  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      // Fetch posts with joined profile data
      const postsData = await fetchPostsWithProfiles();
      
      // Get user interactions if authenticated
      const userData = user ? await fetchUserInteractions(user.id) : { likes: [], saved: [] };
      
      // Add like counts to posts
      const postsWithCounts = await countPostLikes(postsData);
      
      // Transform data for the UI
      return mapPostsForUI(postsWithCounts, userData);
    },
    enabled: !!user
  });
  
  // Set up realtime subscriptions for posts
  useEffect(() => {
    const channel = setupPostsRealtimeSubscription(queryClient);
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Set up real-time subscription for post interactions
  useEffect(() => {
    if (!user) return;
    
    const channels = setupInteractionsSubscriptions(user.id, queryClient);
    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [queryClient, user]);
  
  return postsQuery;
}

/**
 * Fetch posts with joined profile data
 */
async function fetchPostsWithProfiles() {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles:user_id (
        username,
        full_name,
        avatar_url
      )
    `)
    .order("created_at", { ascending: false })
    .limit(10);
  
  if (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
  
  return data;
}

/**
 * Fetch user's liked and saved posts
 */
async function fetchUserInteractions(userId: string) {
  const [likedResponse, savedResponse] = await Promise.all([
    // Get user's liked posts
    supabase
      .from("post_likes")
      .select('post_id')
      .eq('user_id', userId),
    
    // Get user's saved posts
    supabase
      .from("saved_posts")
      .select('post_id')
      .eq('user_id', userId)
  ]);
  
  const userLikes = likedResponse.error 
    ? [] 
    : likedResponse.data.map(item => item.post_id);
    
  const userSaved = savedResponse.error 
    ? [] 
    : savedResponse.data.map(item => item.post_id);
    
  return { likes: userLikes, saved: userSaved };
}

/**
 * Count likes for each post
 */
async function countPostLikes(posts: any[]) {
  return Promise.all(
    posts.map(async (post) => {
      const { count, error } = await supabase
        .from('post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id);
        
      if (error) {
        console.error("Error counting likes for post", post.id, error);
        return { ...post, likes_count: 0 };
      }
      
      return { ...post, likes_count: count || 0 };
    })
  );
}

/**
 * Map posts data for UI presentation
 */
function mapPostsForUI(posts: any[], userData: { likes: string[], saved: string[] }): Post[] {
  return posts.map((post): Post => {
    return {
      id: post.id,
      user_id: post.user_id,
      content: post.content,
      image_url: post.image_url,
      created_at: post.created_at,
      profiles: post.profiles,
      comments_count: post.comments_count || 0,
      shares_count: post.shares_count || 0,
      likes_count: post.likes_count || 0,
      user_has_liked: userData.likes.includes(post.id),
      user_has_saved: userData.saved.includes(post.id)
    };
  });
}

/**
 * Set up real-time subscription for posts
 */
function setupPostsRealtimeSubscription(queryClient: any) {
  return supabase
    .channel('public:posts')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'posts' 
    }, () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    })
    .subscribe();
}

/**
 * Set up real-time subscriptions for post interactions
 */
function setupInteractionsSubscriptions(userId: string, queryClient: any) {
  // Comments changes
  const commentsChannel = supabase
    .channel('public:post_comments')
    .on('postgres_changes', { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'post_comments' 
    }, () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    })
    .subscribe();
  
  // Likes changes  
  const likesChannel = supabase
    .channel('public:post_likes')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'post_likes'
    }, () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    })
    .subscribe();
  
  // Saved posts changes
  const savedChannel = supabase
    .channel('public:saved_posts')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'saved_posts',
      filter: `user_id=eq.${userId}`
    }, () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    })
    .subscribe();
    
  return [commentsChannel, likesChannel, savedChannel];
}

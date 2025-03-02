
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

export function usePosts() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Fetch posts
  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      // First, get the posts
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
      
      let userData = {
        likes: [] as string[],
        saved: [] as string[]
      };
      
      // If user is authenticated, check which posts they've liked and saved
      if (user) {
        // Get user's liked posts from post_likes table
        const { data: likedData, error: likedError } = await supabase
          .from("post_likes")
          .select('post_id')
          .eq('user_id', user.id);
          
        if (likedError) {
          console.error("Error fetching liked posts:", likedError);
        } else if (likedData) {
          userData.likes = likedData.map(item => item.post_id);
        }
        
        // Get user's saved posts
        const { data: savedData, error: savedError } = await supabase
          .from("saved_posts")
          .select('post_id')
          .eq('user_id', user.id);
          
        if (savedError) {
          console.error("Error fetching saved posts:", savedError);
        } else if (savedData) {
          userData.saved = savedData.map(item => item.post_id);
        }
      }
      
      // For each post, count likes
      const postsWithCounts = await Promise.all(
        data.map(async (post: any) => {
          // Count likes for this post
          const { count: likesCount, error: likesError } = await supabase
            .from('post_likes')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);
            
          if (likesError) {
            console.error("Error counting likes:", likesError);
          }
          
          return {
            ...post,
            likes_count: likesCount || 0
          };
        })
      );
      
      // Transform data to match our component props
      return postsWithCounts.map((post: any): Post => {
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
    },
    enabled: !!user
  });
  
  // Set up real-time subscription for new posts
  useEffect(() => {
    const channel = supabase
      .channel('public:posts')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'posts' 
      }, (payload) => {
        // When a new post is created, invalidate the posts query
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'posts'
      }, (payload) => {
        // When a post is updated, invalidate the posts query
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Set up real-time subscription for new comments
  useEffect(() => {
    const channel = supabase
      .channel('public:post_comments')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'post_comments' 
      }, (payload) => {
        // When a new comment is created, invalidate the posts query
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Set up real-time subscription for post likes
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('public:post_likes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'post_likes'
      }, (payload) => {
        // When likes change, invalidate the posts query
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, user]);

  // Set up real-time subscription for saved posts
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('public:saved_posts')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'saved_posts',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        // When saved posts change, invalidate the posts query
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, user]);
  
  return postsQuery;
}

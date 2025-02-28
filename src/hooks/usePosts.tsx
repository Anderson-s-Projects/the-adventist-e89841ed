
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
  likes_count?: number;
  comments_count?: number;
  shares_count?: number;
  user_has_liked?: boolean;
}

export function usePosts() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Fetch posts
  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
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
      
      // Transform data to match our component props
      return data.map((post: any): Post => ({
        id: post.id,
        user_id: post.user_id,
        content: post.content,
        image_url: post.image_url,
        created_at: post.created_at,
        profiles: post.profiles,
        likes_count: 0, // We'll implement likes later
        comments_count: 0, // We'll implement comments later
        shares_count: 0, // We'll implement shares later
        user_has_liked: false // We'll implement this later
      }));
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
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
  
  return postsQuery;
}

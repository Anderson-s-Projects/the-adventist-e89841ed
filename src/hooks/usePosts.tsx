
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { fetchPostsWithProfiles, fetchUserInteractions, countPostLikes } from "@/utils/posts/fetchPostsUtils";
import { mapPostsForUI } from "@/utils/posts/postMappers";
import { setupPostsRealtimeSubscription, setupInteractionsSubscriptions } from "@/utils/posts/realtimeSubscriptions";
import type { Post } from "@/utils/posts/postMappers";

export type { Post };

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
      if (!user) return [];
      
      // Fetch posts with joined profile data
      const postsData = await fetchPostsWithProfiles();
      
      // Get user interactions if authenticated
      const userData = await fetchUserInteractions(user.id);
      
      // Add like counts to posts
      const postsWithCounts = await countPostLikes(postsData);
      
      // Transform data for the UI
      return mapPostsForUI(postsWithCounts, userData);
    },
    enabled: !!user
  });
  
  // Set up realtime subscriptions for posts
  useEffect(() => {
    if (!queryClient) return;
    
    const channel = setupPostsRealtimeSubscription(queryClient);
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Set up real-time subscription for post interactions
  useEffect(() => {
    if (!user || !queryClient) return;
    
    const channels = setupInteractionsSubscriptions(user.id, queryClient);
    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [queryClient, user]);
  
  return postsQuery;
}

// Need to import supabase for the cleanup function in useEffect
import { supabase } from "@/integrations/supabase/client";

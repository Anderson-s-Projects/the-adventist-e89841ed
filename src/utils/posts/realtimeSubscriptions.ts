
import { supabase } from "@/integrations/supabase/client";
import { QueryClient } from "@tanstack/react-query";

/**
 * Set up real-time subscription for posts
 */
export function setupPostsRealtimeSubscription(queryClient: QueryClient) {
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
export function setupInteractionsSubscriptions(userId: string, queryClient: QueryClient) {
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

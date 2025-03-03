
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetch posts with joined profile data
 */
export async function fetchPostsWithProfiles() {
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
export async function fetchUserInteractions(userId: string) {
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
export async function countPostLikes(posts: any[]) {
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

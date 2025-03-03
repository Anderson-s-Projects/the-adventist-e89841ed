
/**
 * Map posts data for UI presentation
 */
export function mapPostsForUI(posts: any[], userData: { likes: string[], saved: string[] }): Post[] {
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

export interface Post {
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

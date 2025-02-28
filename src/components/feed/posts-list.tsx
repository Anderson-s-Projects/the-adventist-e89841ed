
import { PostCard } from "@/components/common/post-card";
import { Button } from "@/components/common/button";

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

interface PostsListProps {
  posts: Post[];
  isLoading: boolean;
  onLikeChange: (postId: string, liked: boolean) => void;
}

export function PostsList({ posts, isLoading, onLikeChange }: PostsListProps) {
  return (
    <>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="rounded-md h-12 w-12 border-4 border-t-primary animate-spin"></div>
        </div>
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <PostCard 
            key={post.id}
            id={post.id}
            user={{
              id: post.user_id,
              name: post.profiles?.full_name || "SDA Member",
              username: post.profiles?.username || "member",
              avatar: post.profiles?.avatar_url || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
            }}
            timestamp={new Date(post.created_at).toLocaleDateString()}
            content={post.content}
            image={post.image_url || undefined}
            likes={post.likes_count || 0}
            comments={post.comments_count || 0}
            shares={post.shares_count || 0}
            liked={post.user_has_liked || false}
            onLikeChange={onLikeChange}
          />
        ))
      ) : (
        <div className="bordered-card rounded-xl p-8 text-center">
          <h3 className="font-medium text-lg mb-2">No posts yet</h3>
          <p className="text-muted-foreground mb-4">Be the first to share something with the community!</p>
        </div>
      )}
      
      <div className="flex justify-center mt-6">
        <Button variant="outline" className="px-4">
          Load more
        </Button>
      </div>
    </>
  );
}

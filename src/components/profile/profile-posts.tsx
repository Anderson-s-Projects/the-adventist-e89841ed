
import { PostCard } from "@/components/common/post-card";

interface ProfilePostsProps {
  userPosts: Array<{
    id: string;
    user: {
      id?: string;
      name: string;
      username: string;
      avatar: string;
    };
    timestamp: string;
    content: string;
    image?: string;
    likes: number;
    comments: number;
    shares: number;
    liked: boolean;
    saved?: boolean;
  }>;
  isCurrentUser: boolean;
  onLikeChange: (postId: string, liked: boolean) => void;
  onShare?: (postId: string) => void;
}

export function ProfilePosts({ userPosts, isCurrentUser, onLikeChange, onShare }: ProfilePostsProps) {
  return (
    <>
      {userPosts.length > 0 ? (
        userPosts.map((post) => (
          <PostCard key={post.id} {...post} onLikeChange={onLikeChange} onShare={onShare} />
        ))
      ) : (
        <div className="bordered-card rounded-xl p-8 text-center">
          <h3 className="font-medium text-lg mb-2">No posts yet</h3>
          <p className="text-muted-foreground mb-4">
            {isCurrentUser
              ? "You haven't shared anything with the community yet."
              : "This user hasn't shared anything yet."}
          </p>
          {isCurrentUser && (
            <a href="/feed" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              Create Your First Post
            </a>
          )}
        </div>
      )}
    </>
  );
}


import { PostCard } from "@/components/common/post-card";

interface ProfileSavedPostsProps {
  savedPosts: Array<{
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
    saved: boolean;
  }>;
  isCurrentUser: boolean;
  isLoading: boolean;
  onLikeChange: (postId: string, liked: boolean) => void;
  onSaveChange: (postId: string, saved: boolean) => void;
}

export function ProfileSavedPosts({
  savedPosts,
  isCurrentUser,
  isLoading,
  onLikeChange,
  onSaveChange,
}: ProfileSavedPostsProps) {
  if (!isCurrentUser) {
    return (
      <div className="bordered-card rounded-xl p-8 text-center">
        <h3 className="font-medium text-lg mb-2">Private content</h3>
        <p className="text-muted-foreground">Saved items are only visible to the account owner.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="rounded-md h-12 w-12 border-4 border-t-primary animate-spin"></div>
      </div>
    );
  }

  if (savedPosts.length === 0) {
    return (
      <div className="bordered-card rounded-xl p-8 text-center">
        <h3 className="font-medium text-lg mb-2">No saved items</h3>
        <p className="text-muted-foreground">You haven't saved any posts yet.</p>
      </div>
    );
  }

  return (
    <>
      {savedPosts.map((post) => (
        <PostCard
          key={post.id}
          {...post}
          onLikeChange={onLikeChange}
          onSaveChange={onSaveChange}
        />
      ))}
    </>
  );
}

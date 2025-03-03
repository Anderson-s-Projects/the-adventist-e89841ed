
import { useToast } from "@/components/ui/use-toast";

interface ProfilePostInteractionsProps {
  onLikeChange: (postId: string, liked: boolean) => void;
  onSharePost: (postId: string) => void;
}

export function useProfilePostInteractions(): ProfilePostInteractionsProps {
  const { toast } = useToast();

  // Handle post like changes
  const handlePostLikeChange = async (postId: string, liked: boolean) => {
    console.log(`Post ${postId} ${liked ? "liked" : "unliked"}`);
  };

  // Handle sharing a post
  const handleSharePost = async (postId: string) => {
    try {
      const postUrl = `${window.location.origin}/post/${postId}`;
      await navigator.clipboard.writeText(postUrl);
      toast({
        title: "Post Shared!",
        description: "The post link has been copied to your clipboard."
      });
    } catch (error) {
      console.error("Failed to share post:", error);
      toast({
        title: "Error",
        description: "Failed to share the post. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    onLikeChange: handlePostLikeChange,
    onSharePost: handleSharePost
  };
}

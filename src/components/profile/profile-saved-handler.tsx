
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileSavedHandlerProps {
  isCurrentUser: boolean;
  activeTab: string;
  fetchSavedPosts: () => Promise<void>;
}

export function ProfileSavedHandler({ isCurrentUser, activeTab, fetchSavedPosts }: ProfileSavedHandlerProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isCurrentUser && activeTab === "saved") {
      fetchSavedPosts();
    }
  }, [isCurrentUser, activeTab, fetchSavedPosts]);

  const handleUnsavePost = async (postId: string) => {
    try {
      if (!user?.id) return;

      const { error } = await supabase
        .from("saved_posts")
        .delete()
        .eq("user_id", user.id)
        .eq("post_id", postId);

      if (error) throw error;

      // Refetch the saved posts to update the UI
      await fetchSavedPosts();

      toast({
        title: "Post removed",
        description: "The post has been removed from your saved items"
      });
    } catch (error) {
      console.error("Error removing saved post:", error);
      toast({
        title: "Error",
        description: "Failed to remove saved post",
        variant: "destructive"
      });
    }
  };

  return null; // This is a logic-only component, no UI rendered
}

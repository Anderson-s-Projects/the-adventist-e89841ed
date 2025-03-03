
import { useState } from "react";
import { Button } from "@/components/common/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileFollowButtonProps {
  profileId: string;
  onFollowStatusChange: () => void;
}

export function ProfileFollowButton({ profileId, onFollowStatusChange }: ProfileFollowButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    try {
      if (!user?.id || !profileId) return;
      setIsLoading(true);

      // Check if already following
      const { data, error: checkError } = await supabase
        .from("user_connections")
        .select("*")
        .eq("follower_id", user.id)
        .eq("following_id", profileId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      const isFollowing = !!data;
      
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from("user_connections")
          .delete()
          .eq("follower_id", user.id)
          .eq("following_id", profileId);

        if (error) throw error;
        
        // Decrement follower count for the profile being unfollowed
        await supabase.rpc('decrement_followers_count', { profile_id: profileId });
        
        // Decrement following count for the current user
        await supabase.rpc('decrement_following_count', { profile_id: user.id });

        toast({
          title: "Unfollowed",
          description: "You are no longer following this user."
        });
      } else {
        // Follow
        const { error } = await supabase
          .from("user_connections")
          .insert([{
            follower_id: user.id,
            following_id: profileId
          }]);

        if (error) throw error;
        
        // Increment follower count for the profile being followed
        await supabase.rpc('increment_followers_count', { profile_id: profileId });
        
        // Increment following count for the current user
        await supabase.rpc('increment_following_count', { profile_id: user.id });

        toast({
          title: "Following",
          description: "You are now following this user."
        });
      }
      
      // Notify parent to refresh profile data
      onFollowStatusChange();
      
    } catch (error) {
      console.error("Failed to follow user:", error);
      toast({
        title: "Error",
        description: "Failed to follow user. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 flex justify-center">
      <Button onClick={handleFollow} isLoading={isLoading}>
        Follow
      </Button>
    </div>
  );
}

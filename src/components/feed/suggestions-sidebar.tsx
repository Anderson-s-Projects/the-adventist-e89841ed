
import { Button } from "@/components/common/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export function SuggestionsSidebar({ suggestedProfiles = [] }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [followingState, setFollowingState] = useState<Record<string, boolean>>({});
  
  // Initialize following state based on profiles data
  useEffect(() => {
    if (suggestedProfiles.length > 0) {
      const initialState = suggestedProfiles.reduce((acc, profile) => {
        acc[profile.id] = profile.user_is_following || false;
        return acc;
      }, {});
      setFollowingState(initialState);
    }
  }, [suggestedProfiles]);
  
  const handleProfileClick = (userId) => {
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };
  
  const handleFollow = async (profileId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to follow other users",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // If already following, unfollow
      if (followingState[profileId]) {
        // Delete the connection
        await supabase
          .from('user_connections')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', profileId);
          
        // Decrement follower count for the profile being unfollowed
        await supabase.rpc('decrement_followers_count', { profile_id: profileId });
        
        // Decrement following count for the current user
        await supabase.rpc('decrement_following_count', { profile_id: user.id });
        
        setFollowingState(prev => ({
          ...prev,
          [profileId]: false
        }));
        
        toast({
          title: "Unfollowed",
          description: "You are no longer following this user",
        });
      } else {
        // Otherwise follow
        await supabase
          .from('user_connections')
          .insert([
            { follower_id: user.id, following_id: profileId }
          ]);
          
        // Increment follower count for the profile being followed
        await supabase.rpc('increment_followers_count', { profile_id: profileId });
        
        // Increment following count for the current user
        await supabase.rpc('increment_following_count', { profile_id: user.id });
        
        setFollowingState(prev => ({
          ...prev,
          [profileId]: true
        }));
        
        toast({
          title: "Following",
          description: "You are now following this user",
        });
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
      toast({
        title: "Error",
        description: "Failed to update follow status. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="bordered-card rounded-xl p-5 sticky top-24">
      <h3 className="font-semibold text-lg mb-4">Suggested for you</h3>
      
      {suggestedProfiles.length > 0 ? (
        <div className="space-y-4">
          {suggestedProfiles.map((profile) => (
            <div key={profile.id} className="flex items-center">
              <img 
                src={profile.avatar_url} 
                alt={profile.username} 
                className="h-10 w-10 rounded-full object-cover mr-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleProfileClick(profile.id)}
              />
              <div className="flex-1 min-w-0">
                <h4 
                  className="font-medium truncate cursor-pointer hover:underline"
                  onClick={() => handleProfileClick(profile.id)}
                >
                  {profile.full_name}
                </h4>
                <p className="text-muted-foreground text-sm truncate">@{profile.username}</p>
              </div>
              <Button 
                size="sm" 
                variant={followingState[profile.id] ? "secondary" : "outline"} 
                className="flex-shrink-0"
                onClick={() => handleFollow(profile.id)}
              >
                {followingState[profile.id] ? "Following" : "Follow"}
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div className="bg-muted h-10 w-10 rounded-full mr-3 animate-pulse"></div>
              <div className="flex-1">
                <div className="bg-muted h-4 w-24 mb-1 animate-pulse"></div>
                <div className="bg-muted h-3 w-20 animate-pulse"></div>
              </div>
              <div className="bg-muted h-8 w-16 rounded-md animate-pulse"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

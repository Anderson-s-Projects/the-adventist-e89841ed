
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  about: string | null;
  following_count?: number;
  followers_count?: number;
  user_is_following?: boolean;
}

export function useSuggestedProfiles() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["suggestedProfiles", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // Fetch profiles that are not the current user
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user.id)
        .limit(3);
      
      if (profilesError) {
        console.error("Error fetching suggested profiles:", profilesError);
        throw profilesError;
      }
      
      // Get which profiles the user is following
      const { data: followingData, error: followingError } = await supabase
        .from("user_connections")
        .select("following_id")
        .eq("follower_id", user.id);
      
      if (followingError) {
        console.error("Error fetching following data:", followingError);
      }
      
      // Create a set of followed user IDs for faster lookup
      const followingSet = new Set(
        (followingData || []).map(item => item.following_id)
      );
      
      return profilesData.map((profile): Profile => ({
        id: profile.id,
        username: profile.username || "sdamember",
        full_name: profile.full_name || "SDA Member",
        avatar_url: profile.avatar_url || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
        about: profile.about || "SDA community member",
        following_count: profile.following_count || 0,
        followers_count: profile.followers_count || 0,
        user_is_following: followingSet.has(profile.id)
      }));
    },
    enabled: !!user?.id,
  });
}


import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  about: string | null;
  following_count?: number;
  followers_count?: number;
}

export function useUserProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Set up realtime subscriptions for profile updates
  useEffect(() => {
    if (!user?.id) return;
    
    // Subscribe to profile changes
    const profilesChannel = supabase
      .channel('public:profiles')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'profiles',
        filter: `id=eq.${user.id}`
      }, () => {
        // Invalidate the cache to trigger a refetch
        queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(profilesChannel);
    };
  }, [user?.id, queryClient]);
  
  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      return {
        id: data.id,
        username: data.username || user.email?.split("@")[0],
        full_name: data.full_name || "SDA Member",
        avatar_url: data.avatar_url || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
        about: data.about || "SDA community member",
        following_count: data.following_count || 0,
        followers_count: data.followers_count || 0,
      };
    },
    enabled: !!user?.id,
  });
}

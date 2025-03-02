
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export function useProfileData(userId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    id: "",
    username: "loading...",
    full_name: "Loading...",
    avatar_url: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
    about: "Loading profile information...",
    followers_count: 0,
    following_count: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [isCurrentUser, setIsCurrentUser] = useState(true);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  
  // Check if we're viewing another user's profile
  useEffect(() => {
    if (userId && user?.id !== userId) {
      setIsCurrentUser(false);
      fetchOtherUserProfile(userId);
    } else {
      setIsCurrentUser(true);
      if (user) {
        fetchProfile();
      }
    }
  }, [userId, user]);
  
  // When viewing a profile (current or other), fetch their posts
  useEffect(() => {
    if (profile.id) {
      fetchUserPosts(profile.id);
    }
  }, [profile.id]);
  
  const fetchOtherUserProfile = async (profileId: string) => {
    setIsLoading(true);
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();
      
      if (error) throw error;
      
      if (profileData) {
        setProfile({
          id: profileData.id || "",
          username: profileData.username || "User",
          full_name: profileData.full_name || "SDA Member",
          avatar_url: profileData.avatar_url || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
          about: profileData.about || "SDA community member",
          followers_count: profileData.followers_count || 0,
          following_count: profileData.following_count || 0
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  const fetchProfile = async () => {
    try {
      if (!user?.id) return;
      
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      if (profileData) {
        const formattedProfile = {
          id: profileData.id || "",
          username: profileData.username || user.email?.split('@')[0] || "",
          full_name: profileData.full_name || "SDA Member",
          avatar_url: profileData.avatar_url || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
          about: profileData.about || "SDA community member",
          followers_count: profileData.followers_count || 0,
          following_count: profileData.following_count || 0
        };
        setProfile(formattedProfile);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  const fetchUserPosts = async (profileId: string) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (username, full_name, avatar_url)
        `)
        .eq('user_id', profileId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setUserPosts(data.map(post => ({
          id: post.id,
          user: {
            id: post.user_id,
            name: post.profiles?.full_name || "SDA Member",
            username: post.profiles?.username || "member",
            avatar: post.profiles?.avatar_url || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
          },
          timestamp: new Date(post.created_at).toLocaleDateString(),
          content: post.content,
          image: post.image_url,
          likes: post.likes_count || 0,
          comments: post.comments_count || 0,
          shares: post.shares_count || 0,
          liked: false
        })));
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive"
      });
    }
  };
  
  const fetchSavedPosts = async () => {
    if (!user || !isCurrentUser) return;
    
    setIsLoadingSaved(true);
    try {
      // Get the saved post IDs
      const { data: savedData, error: savedError } = await supabase
        .from('saved_posts')
        .select('post_id')
        .eq('user_id', user.id);
      
      if (savedError) throw savedError;
      
      if (savedData && savedData.length > 0) {
        // Get the actual posts
        const postIds = savedData.map(item => item.post_id);
        
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select(`
            *,
            profiles:user_id (username, full_name, avatar_url)
          `)
          .in('id', postIds)
          .order('created_at', { ascending: false });
        
        if (postsError) throw postsError;
        
        if (postsData) {
          setSavedPosts(postsData.map(post => ({
            id: post.id,
            user: {
              id: post.user_id,
              name: post.profiles?.full_name || "SDA Member",
              username: post.profiles?.username || "member",
              avatar: post.profiles?.avatar_url || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
            },
            timestamp: new Date(post.created_at).toLocaleDateString(),
            content: post.content,
            image: post.image_url,
            likes: post.likes_count || 0,
            comments: post.comments_count || 0,
            shares: post.shares_count || 0,
            liked: false,
            saved: true
          })));
        }
      } else {
        setSavedPosts([]);
      }
    } catch (error) {
      console.error('Error fetching saved posts:', error);
      toast({
        title: "Error",
        description: "Failed to load saved posts",
        variant: "destructive"
      });
    } finally {
      setIsLoadingSaved(false);
    }
  };
  
  return {
    profile,
    setProfile,
    isLoading,
    userPosts,
    isCurrentUser,
    savedPosts,
    isLoadingSaved,
    fetchSavedPosts,
    fetchOtherUserProfile, // Expose this function so the Profile component can refresh data
  };
}

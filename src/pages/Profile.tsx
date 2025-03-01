import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Navbar } from "@/components/nav/navbar";
import { Button } from "@/components/common/button";
import { ProfileCard } from "@/components/common/profile-card";
import { PostCard } from "@/components/common/post-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
const Profile = () => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    userId
  } = useParams();
  const {
    data: currentUserProfile,
    isLoading: isCurrentProfileLoading
  } = useUserProfile();
  const [activeTab, setActiveTab] = useState("posts");
  const [profile, setProfile] = useState({
    id: "",
    username: "loading...",
    full_name: "Loading...",
    avatar_url: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
    about: "Loading profile information...",
    followers_count: 0,
    following_count: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    ...profile
  });
  const [isLoading, setIsLoading] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUser, setIsCurrentUser] = useState(true);
  const [savedItems, setSavedItems] = useState([{
    id: "1",
    user: {
      name: "Daily Devotional",
      username: "devotional",
      avatar: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80"
    },
    timestamp: "5h ago",
    content: "\"For I know the plans I have for you,\" declares the LORD, \"plans to prosper you and not to harm you, plans to give you hope and a future.\" - Jeremiah 29:11",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
    likes: 254,
    comments: 23,
    shares: 15,
    liked: true
  }, {
    id: "2",
    user: {
      name: "SDA Health",
      username: "sdahealth",
      avatar: "https://images.unsplash.com/photo-1612349531440-57023f4e8fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80"
    },
    timestamp: "2d ago",
    content: "Remember to take care of your body - it's the temple of the Holy Spirit. Drink plenty of water, eat plant-based foods, and get regular exercise.",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
    likes: 189,
    comments: 14,
    shares: 7,
    liked: false
  }]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);

  // Check if we're viewing another user's profile
  useEffect(() => {
    if (userId && user?.id !== userId) {
      setIsCurrentUser(false);
      fetchOtherUserProfile(userId);
    } else {
      setIsCurrentUser(true);
    }
  }, [userId, user]);

  // Check for redirect parameters
  useEffect(() => {
    if (location.state && location.state.newUser && isCurrentUser) {
      setIsEditing(true);
      toast({
        title: "Welcome!",
        description: "Let's complete your profile to get started."
      });
    }
  }, [location, isCurrentUser]);
  useEffect(() => {
    if (user && isCurrentUser) {
      fetchProfile();
    }
  }, [user, isCurrentUser]);
  useEffect(() => {
    if (currentUserProfile && isCurrentUser) {
      setProfile(currentUserProfile);
      setEditedProfile(currentUserProfile);
      setIsLoading(false);
    }
  }, [currentUserProfile, isCurrentUser]);

  // When viewing a profile (current or other), fetch their posts
  useEffect(() => {
    if (profile.id) {
      fetchUserPosts(profile.id);
    }
  }, [profile.id]);

  // Fetch saved posts when viewing saved tab and it's the current user
  useEffect(() => {
    if (isCurrentUser && activeTab === "saved") {
      fetchSavedPosts();
    }
  }, [isCurrentUser, activeTab]);
  const fetchOtherUserProfile = async profileId => {
    setIsLoading(true);
    try {
      const {
        data: profileData,
        error
      } = await supabase.from('profiles').select('*').eq('id', profileId).single();
      if (error) throw error;
      if (profileData) {
        setProfile({
          id: profileData.id || "",
          username: profileData.username || "User",
          full_name: profileData.full_name || "SDA Member",
          avatar_url: profileData.avatar_url || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
          about: profileData.about || "SDA community member",
          followers_count: 0,
          following_count: 0
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
      const {
        data: profileData,
        error
      } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (error) throw error;
      if (profileData) {
        const formattedProfile = {
          id: profileData.id || "",
          username: profileData.username || user.email.split('@')[0],
          full_name: profileData.full_name || "SDA Member",
          avatar_url: profileData.avatar_url || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
          about: profileData.about || "SDA community member",
          followers_count: 0,
          following_count: 0
        };
        setProfile(formattedProfile);
        setEditedProfile(formattedProfile);
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
  const fetchUserPosts = async profileId => {
    try {
      const {
        data,
        error
      } = await supabase.from('posts').select(`
          *,
          profiles:user_id (username, full_name, avatar_url)
        `).eq('user_id', profileId).order('created_at', {
        ascending: false
      });
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

  // Handle post like changes
  const handlePostLikeChange = async (postId, liked) => {
    console.log(`Post ${postId} ${liked ? 'liked' : 'unliked'}`);
  };

  // Handle unsaving a post
  const handleUnsavePost = async (postId) => {
    try {
      const { error } = await supabase
        .from('saved_posts')
        .delete()
        .eq('user_id', user.id)
        .eq('post_id', postId);
      
      if (error) throw error;
      
      // Update UI
      setSavedPosts(savedPosts.filter(post => post.id !== postId));
      
      toast({
        title: "Post removed",
        description: "The post has been removed from your saved items",
      });
    } catch (error) {
      console.error('Error removing saved post:', error);
      toast({
        title: "Error",
        description: "Failed to remove saved post",
        variant: "destructive"
      });
    }
  };
  const handleFollow = () => {
    // In a real app, this would connect to your database
    toast({
      title: "Coming soon",
      description: "The follow feature is under development."
    });
  };

  // Fixed the return type to void instead of string
  const uploadAvatar = async (file: File): Promise<void> => {
    try {
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload the file
      const {
        error: uploadError
      } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;

      // Get the public URL
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from('avatars').getPublicUrl(filePath);

      // Update the editedProfile with the new avatar URL
      setEditedProfile({
        ...editedProfile,
        avatar_url: publicUrl
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: "Failed to upload avatar image",
        variant: "destructive"
      });
    }
  };
  const handleSaveProfile = async () => {
    try {
      const {
        error
      } = await supabase.from('profiles').update({
        username: editedProfile.username,
        full_name: editedProfile.full_name,
        about: editedProfile.about,
        avatar_url: editedProfile.avatar_url
      }).eq('id', user.id);
      if (error) throw error;
      setProfile(editedProfile);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  };
  const handleCancelEdit = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };
  return <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16 container max-w-4xl mx-auto px-4">
        <ProfileCard profile={profile} isEditing={isEditing} editedProfile={editedProfile} setEditedProfile={setEditedProfile} onEdit={() => setIsEditing(true)} onSave={handleSaveProfile} onCancel={handleCancelEdit} isCurrentUser={isCurrentUser} onAvatarUpload={uploadAvatar} />
        
        {!isCurrentUser && <div className="mt-4 flex justify-center">
            <Button onClick={handleFollow}>Follow</Button>
          </div>}
        
        <div className="mt-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 py-0 px-[9px]">
              <TabsTrigger value="posts" className="py-0">Posts</TabsTrigger>
              <TabsTrigger value="saved" className="py-0">Saved</TabsTrigger>
              <TabsTrigger value="activity" className="py-0">Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts" className="mt-6">
              {userPosts.length > 0 ? userPosts.map((post, index) => <PostCard key={post.id} {...post} onLikeChange={handlePostLikeChange} />) : <div className="bordered-card rounded-xl p-8 text-center">
                  <h3 className="font-medium text-lg mb-2">No posts yet</h3>
                  <p className="text-muted-foreground mb-4">
                    {isCurrentUser ? "You haven't shared anything with the community yet." : "This user hasn't shared anything yet."}
                  </p>
                  {isCurrentUser && <Button onClick={() => window.location.href = '/feed'}>
                      Create Your First Post
                    </Button>}
                </div>}
            </TabsContent>
            
            <TabsContent value="saved" className="mt-6">
              {isCurrentUser ? isLoadingSaved ? <div className="flex justify-center py-8">
                    <div className="rounded-md h-12 w-12 border-4 border-t-primary animate-spin"></div>
                  </div> : savedPosts.length > 0 ? savedPosts.map(post => <PostCard key={post.id} {...post} onLikeChange={handlePostLikeChange} onSaveChange={(postId, saved) => {
                        if (!saved) handleUnsavePost(postId);
                      }} />) : <div className="bordered-card rounded-xl p-8 text-center">
                    <h3 className="font-medium text-lg mb-2">No saved items</h3>
                    <p className="text-muted-foreground">You haven't saved any posts yet.</p>
                  </div> : <div className="bordered-card rounded-xl p-8 text-center">
                  <h3 className="font-medium text-lg mb-2">Private content</h3>
                  <p className="text-muted-foreground">Saved items are only visible to the account owner.</p>
                </div>}
            </TabsContent>
            
            <TabsContent value="activity" className="mt-6">
              <div className="bordered-card rounded-xl p-8 text-center">
                <h3 className="font-medium text-lg mb-2">Coming soon</h3>
                <p className="text-muted-foreground">Activity tracking features are under development.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>;
};
export default Profile;

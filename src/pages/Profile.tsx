
import { useState, useEffect } from "react";
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
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: profileData, isLoading: isProfileLoading } = useUserProfile();
  const [activeTab, setActiveTab] = useState("posts");
  const [profile, setProfile] = useState({
    id: "",
    username: "loading...",
    full_name: "Loading...",
    avatar_url: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
    about: "Loading profile information...",
    followers_count: 0,
    following_count: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [isLoading, setIsLoading] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
  const [savedItems, setSavedItems] = useState([
    {
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
    },
    {
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
    }
  ]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchUserPosts();
    }
  }, [user]);

  useEffect(() => {
    if (profileData) {
      setProfile(profileData);
      setEditedProfile(profileData);
      setIsLoading(false);
    }
  }, [profileData]);

  const fetchProfile = async () => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      if (profileData) {
        const formattedProfile = {
          id: profileData.id || "",
          username: profileData.username || user.email.split('@')[0],
          full_name: profileData.full_name || "SDA Member",
          avatar_url: profileData.avatar_url || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
          about: profileData.about || "SDA community member",
          followers_count: 0,
          following_count: 0,
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
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (username, full_name, avatar_url)
        `)
        .eq('user_id', user.id)
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
        description: "Failed to load your posts",
        variant: "destructive",
      });
    }
  };

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: editedProfile.username,
          full_name: editedProfile.full_name,
          about: editedProfile.about,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setProfile(editedProfile);
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16 container max-w-4xl mx-auto px-4">
        <ProfileCard 
          profile={profile}
          isEditing={isEditing}
          editedProfile={editedProfile}
          setEditedProfile={setEditedProfile}
          onEdit={() => setIsEditing(true)}
          onSave={handleSaveProfile}
          onCancel={handleCancelEdit}
          isCurrentUser={true}
        />
        
        <div className="mt-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts" className="mt-6">
              {userPosts.length > 0 ? (
                userPosts.map((post, index) => (
                  <PostCard key={post.id} {...post} />
                ))
              ) : (
                <div className="bordered-card rounded-xl p-8 text-center">
                  <h3 className="font-medium text-lg mb-2">No posts yet</h3>
                  <p className="text-muted-foreground mb-4">You haven't shared anything with the community yet.</p>
                  <Button onClick={() => window.location.href = '/feed'}>
                    Create Your First Post
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="saved" className="mt-6">
              {savedItems.map((item) => (
                <PostCard key={item.id} {...item} />
              ))}
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
    </div>
  );
};

export default Profile;


import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Navbar } from "@/components/nav/navbar";
import { Button } from "@/components/common/button";
import { ProfileCard } from "@/components/common/profile-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useProfileData } from "@/hooks/useProfileData";
import { useProfileEdit } from "@/hooks/useProfileEdit";
import { ProfilePosts } from "@/components/profile/profile-posts";
import { ProfileSavedPosts } from "@/components/profile/profile-saved-posts";
import { ProfileActivity } from "@/components/profile/profile-activity";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();
  const { data: currentUserProfile } = useUserProfile();

  const [activeTab, setActiveTab] = useState("posts");

  // Get profile data using custom hook
  const {
    profile,
    setProfile,
    isLoading,
    userPosts,
    isCurrentUser,
    savedPosts,
    isLoadingSaved,
    fetchSavedPosts
  } = useProfileData(userId);

  // Handle unsaving a post
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

  // Get profile editing functionality
  const {
    isEditing,
    setIsEditing,
    editedProfile,
    setEditedProfile,
    uploadAvatar,
    handleSaveProfile,
    handleCancelEdit
  } = useProfileEdit(profile, setProfile);

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

  // Update profile from currentUserProfile when available
  useEffect(() => {
    if (currentUserProfile && isCurrentUser) {
      setProfile(currentUserProfile);
      setEditedProfile(currentUserProfile);
    }
  }, [currentUserProfile, isCurrentUser]);

  // Fetch saved posts when viewing saved tab
  useEffect(() => {
    if (isCurrentUser && activeTab === "saved") {
      fetchSavedPosts();
    }
  }, [isCurrentUser, activeTab]);

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

  // Handle following a user
  const handleFollow = async () => {
    try {
      if (!user?.id || !userId) return;

      const { error } = await supabase.from("followers").insert([
        {
          follower_id: user.id,
          following_id: userId
        }
      ]);

      if (error) throw error;

      toast({
        title: "Following",
        description: "You are now following this user."
      });
    } catch (error) {
      console.error("Failed to follow user:", error);
      toast({
        title: "Error",
        description: "Failed to follow user. Please try again.",
        variant: "destructive"
      });
    }
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
          isCurrentUser={isCurrentUser}
          onAvatarUpload={uploadAvatar}
        />

        {!isCurrentUser && (
          <div className="mt-4 flex justify-center">
            <Button onClick={handleFollow}>Follow</Button>
          </div>
        )}

        <div className="mt-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 py-0 px-[9px]">
              <TabsTrigger value="posts" className="py-0">
                Posts
              </TabsTrigger>
              <TabsTrigger value="saved" className="py-0">
                Saved
              </TabsTrigger>
              <TabsTrigger value="activity" className="py-0">
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-6">
              <ProfilePosts
                userPosts={userPosts}
                isCurrentUser={isCurrentUser}
                onLikeChange={handlePostLikeChange}
                onShare={handleSharePost} // Added share functionality
              />
            </TabsContent>

            <TabsContent value="saved" className="mt-6">
              <ProfileSavedPosts
                savedPosts={savedPosts}
                isCurrentUser={isCurrentUser}
                isLoading={isLoadingSaved}
                onLikeChange={handlePostLikeChange}
                onSaveChange={(postId, saved) => {
                  if (!saved) handleUnsavePost(postId);
                }}
              />
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <ProfileActivity />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;

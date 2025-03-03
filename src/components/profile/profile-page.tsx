
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ProfileCard } from "@/components/common/profile-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ProfilePosts } from "@/components/profile/profile-posts";
import { ProfileSavedPosts } from "@/components/profile/profile-saved-posts";
import { ProfileActivity } from "@/components/profile/profile-activity";
import { ProfileFollowButton } from "@/components/profile/profile-follow-button";
import { useProfilePostInteractions } from "@/components/profile/profile-post-interactions";
import { ProfileSavedHandler } from "@/components/profile/profile-saved-handler";

interface ProfilePageProps {
  profile: any;
  setProfile: (profile: any) => void;
  isLoading: boolean;
  userPosts: any[];
  isCurrentUser: boolean;
  savedPosts: any[];
  isLoadingSaved: boolean;
  fetchSavedPosts: () => Promise<void>;
  fetchOtherUserProfile: (userId: string) => Promise<void>;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  editedProfile: any;
  setEditedProfile: (profile: any) => void;
  handleSaveProfile: () => Promise<void>;
  handleCancelEdit: () => void;
  uploadAvatar: (file: File) => Promise<void>;
  userId?: string;
}

export function ProfilePage({
  profile,
  setProfile,
  isLoading,
  userPosts,
  isCurrentUser,
  savedPosts,
  isLoadingSaved,
  fetchSavedPosts,
  fetchOtherUserProfile,
  isEditing,
  setIsEditing,
  editedProfile,
  setEditedProfile,
  handleSaveProfile,
  handleCancelEdit,
  uploadAvatar,
  userId
}: ProfilePageProps) {
  const { toast } = useToast();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("posts");
  
  // Get post interaction handlers
  const { onLikeChange, onSharePost } = useProfilePostInteractions();

  // Check for redirect parameters
  useEffect(() => {
    if (location.state && location.state.newUser && isCurrentUser) {
      setIsEditing(true);
      toast({
        title: "Welcome!",
        description: "Let's complete your profile to get started."
      });
    }
  }, [location, isCurrentUser, setIsEditing, toast]);

  // Handle unsaving posts
  const handleUnsavePost = (postId: string, saved: boolean) => {
    if (!saved && postId) {
      // This is a bit of a hack since we're not directly passing the handleUnsavePost function
      // but it will get the job done
      const savedHandlerElement = document.getElementById("saved-handler");
      if (savedHandlerElement) {
        const event = new CustomEvent("unsave-post", { detail: { postId } });
        savedHandlerElement.dispatchEvent(event);
      }
    }
  };

  return (
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

      {!isCurrentUser && userId && (
        <ProfileFollowButton 
          profileId={userId} 
          onFollowStatusChange={() => {
            if (fetchOtherUserProfile && userId) {
              fetchOtherUserProfile(userId);
            }
          }} 
        />
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
              onLikeChange={onLikeChange}
              onShare={onSharePost}
            />
          </TabsContent>

          <TabsContent value="saved" className="mt-6">
            <ProfileSavedPosts
              savedPosts={savedPosts}
              isCurrentUser={isCurrentUser}
              isLoading={isLoadingSaved}
              onLikeChange={onLikeChange}
              onSaveChange={handleUnsavePost}
            />
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <ProfileActivity />
          </TabsContent>
        </Tabs>
      </div>

      {/* This is a hidden component to handle saved posts logic */}
      <div id="saved-handler" style={{ display: 'none' }}>
        <ProfileSavedHandler
          isCurrentUser={isCurrentUser}
          activeTab={activeTab}
          fetchSavedPosts={fetchSavedPosts}
        />
      </div>
    </main>
  );
}

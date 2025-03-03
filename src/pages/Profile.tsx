
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "@/components/nav/navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useProfileData } from "@/hooks/useProfileData";
import { useProfileEdit } from "@/hooks/useProfileEdit";
import { ProfilePage } from "@/components/profile/profile-page";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();
  const { data: currentUserProfile } = useUserProfile();

  // Get profile data using custom hook
  const {
    profile,
    setProfile,
    isLoading,
    userPosts,
    isCurrentUser,
    savedPosts,
    isLoadingSaved,
    fetchSavedPosts,
    fetchOtherUserProfile
  } = useProfileData(userId);

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ProfilePage
        profile={profile}
        setProfile={setProfile}
        isLoading={isLoading}
        userPosts={userPosts}
        isCurrentUser={isCurrentUser}
        savedPosts={savedPosts}
        isLoadingSaved={isLoadingSaved}
        fetchSavedPosts={fetchSavedPosts}
        fetchOtherUserProfile={fetchOtherUserProfile}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editedProfile={editedProfile}
        setEditedProfile={setEditedProfile}
        handleSaveProfile={handleSaveProfile}
        handleCancelEdit={handleCancelEdit}
        uploadAvatar={uploadAvatar}
        userId={userId}
      />
    </div>
  );
};

export default Profile;

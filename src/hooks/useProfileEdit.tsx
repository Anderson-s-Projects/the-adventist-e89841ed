
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export function useProfileEdit(profile: any, setProfile: (profile: any) => void) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...profile });
  
  // Update edited profile when the actual profile changes
  useEffect(() => {
    setEditedProfile(profile);
  }, [profile]);
  
  const uploadAvatar = async (file: File): Promise<void> => {
    try {
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

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
      if (!user?.id) return;
      
      const { error } = await supabase
        .from('profiles')
        .update({
          username: editedProfile.username,
          full_name: editedProfile.full_name,
          about: editedProfile.about,
          avatar_url: editedProfile.avatar_url
        })
        .eq('id', user.id);
        
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
  
  return {
    isEditing,
    setIsEditing,
    editedProfile,
    setEditedProfile,
    uploadAvatar,
    handleSaveProfile,
    handleCancelEdit
  };
}

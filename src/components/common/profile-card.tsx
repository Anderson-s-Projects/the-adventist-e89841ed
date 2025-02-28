import { cn } from "@/lib/utils";
import { Button } from "./button";
import { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
interface ProfileCardProps {
  className?: string;
  profile: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    about?: string;
    following_count?: number;
    followers_count?: number;
  };
  isEditing?: boolean;
  editedProfile?: {
    username: string;
    full_name: string;
    about?: string;
    avatar_url?: string;
  };
  setEditedProfile?: (profile: any) => void;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  isCurrentUser?: boolean;
  variant?: "compact" | "full";
  user?: {
    name: string;
    username: string;
    avatar: string;
    bio?: string;
    following: number;
    followers: number;
    isFollowing?: boolean;
  };
}
export function ProfileCard({
  className,
  profile,
  isEditing = false,
  editedProfile,
  setEditedProfile,
  onEdit,
  onSave,
  onCancel,
  isCurrentUser = false,
  variant = "full",
  user
}: ProfileCardProps) {
  const isCompact = variant === "compact";

  // Use either the profile object or user object based on what's provided
  const displayUser = user || {
    name: profile.full_name,
    username: profile.username,
    avatar: profile.avatar_url,
    bio: profile.about,
    following: profile.following_count || 0,
    followers: profile.followers_count || 0
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (setEditedProfile && editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [e.target.name]: e.target.value
      });
    }
  };
  return <div className={cn("bordered-card rounded-xl p-6", className)}>
      <div className={cn("flex", isCompact ? "flex-col items-center text-center" : "items-start")}>
        <img src={isEditing ? editedProfile?.avatar_url || profile.avatar_url : profile.avatar_url} alt={profile.full_name} className={cn("rounded-full object-cover", isCompact ? "w-20 h-20 mb-4" : "w-24 h-24 mr-6")} />
        
        <div className="flex-1">
          {isEditing ? <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Full Name</label>
                <Input name="full_name" value={editedProfile?.full_name} onChange={handleChange} className="max-w-md" />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Username</label>
                <Input name="username" value={editedProfile?.username} onChange={handleChange} className="max-w-md" />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block px-0">About</label>
                <Textarea name="about" value={editedProfile?.about || ''} onChange={handleChange} className="max-w-md" rows={3} />
              </div>
            </div> : <>
              <h2 className="text-2xl font-semibold">{profile.full_name}</h2>
              <p className="text-muted-foreground mb-2">@{profile.username}</p>
              <p className="mb-4">{profile.about}</p>
              
              <div className="flex gap-6">
                <div>
                  <span className="font-medium text-lg">{profile.following_count || 0}</span>
                  <span className="text-muted-foreground ml-1">Following</span>
                </div>
                <div>
                  <span className="font-medium text-lg">{profile.followers_count || 0}</span>
                  <span className="text-muted-foreground ml-1">Followers</span>
                </div>
              </div>
            </>}
        </div>
        
        {isCurrentUser && <div className="flex gap-2 mt-4 md:mt-0">
            {isEditing ? <>
                <Button onClick={onSave}>Save</Button>
                <Button variant="outline" onClick={onCancel}>Cancel</Button>
              </> : <Button variant="outline" onClick={onEdit}>Edit Profile</Button>}
          </div>}
      </div>
    </div>;
}
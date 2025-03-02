
import { useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

import { PostHeader } from "./post-header";
import { PostMedia } from "./post-media";
import { PostActions } from "./post-actions";
import { PostComments } from "./post-comments";

interface PostCardProps {
  id: string;
  user: {
    id?: string;
    name: string;
    username: string;
    avatar: string;
  };
  timestamp: string;
  content: string;
  image?: string | null;
  video?: string | null;
  link?: string | null;
  likes: number;
  comments: number;
  shares: number;
  liked?: boolean;
  saved?: boolean;
  onLikeChange?: (id: string, liked: boolean) => void;
  onSaveChange?: (id: string, saved: boolean) => void;
  onShare?: (id: string) => void;
  className?: string;
  metadata?: {
    media_url?: string;
    media_type?: "image" | "video";
    link_url?: string;
  };
}

export function PostCard({
  id,
  user,
  timestamp,
  content,
  image,
  video,
  link,
  likes,
  comments,
  shares,
  liked = false,
  saved = false,
  onLikeChange,
  onSaveChange,
  onShare,
  className,
  metadata
}: PostCardProps) {
  const [commentCount, setCommentCount] = useState(comments);
  const [showComments, setShowComments] = useState(false);
  
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  // Extract media and links from metadata if available
  const mediaUrl = metadata?.media_url || image || video;
  const mediaType = metadata?.media_type || (image ? "image" : video ? "video" : null);
  const linkUrl = metadata?.link_url || link;

  const handleSaveToggle = async (postId: string, saved: boolean) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save posts",
        variant: "destructive"
      });
      return;
    }

    try {
      if (saved) {
        // Save the post
        const { error } = await supabase
          .from('saved_posts')
          .insert({
            user_id: currentUser.id,
            post_id: postId
          });
        
        if (error) throw error;
        
        toast({
          title: "Post saved",
          description: "This post has been saved to your profile",
        });
      } else {
        // Remove from saved
        const { error } = await supabase
          .from('saved_posts')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('post_id', postId);
        
        if (error) throw error;
        
        toast({
          title: "Post removed",
          description: "This post has been removed from your saved items",
        });
      }
      
      if (onSaveChange) {
        onSaveChange(id, saved);
      }
    } catch (error) {
      console.error("Error toggling save status:", error);
      toast({
        title: "Error",
        description: "Failed to update saved status",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    try {
      // Try to copy the link to clipboard
      await navigator.clipboard.writeText(window.location.origin + `/post/${id}`);
      
      // Update share count in the database
      await supabase
        .from('posts')
        .update({ shares_count: shares + 1 })
        .eq('id', id);
      
      toast({
        title: "Link copied",
        description: "Post link copied to clipboard",
      });

      // Call the onShare prop if provided
      if (onShare) {
        onShare(id);
      }
    } catch (error) {
      console.error("Error sharing post:", error);
      toast({
        title: "Error",
        description: "Failed to share the post",
        variant: "destructive"
      });
    }
  };

  const handleCommentAdded = () => {
    setCommentCount(prev => prev + 1);
  };

  return (
    <div className={cn("bordered-card rounded-xl p-3 sm:p-5 mb-4 sm:mb-6", className)}>
      <PostHeader user={user} timestamp={timestamp} />
      
      <div className="mb-3 sm:mb-4">
        <p className="whitespace-pre-line sm:text-base text-base">{content}</p>
      </div>
      
      <PostMedia 
        mediaUrl={mediaUrl} 
        mediaType={mediaType} 
        linkUrl={linkUrl} 
      />
      
      <PostActions 
        id={id}
        likes={likes}
        comments={commentCount}
        shares={shares}
        liked={liked}
        saved={saved}
        onLikeChange={onLikeChange}
        onSaveChange={handleSaveToggle}
        onCommentsToggle={() => setShowComments(!showComments)}
        onShare={handleShare}
      />

      <PostComments 
        postId={id}
        commentCount={commentCount}
        showComments={showComments}
        onCommentAdded={handleCommentAdded}
      />
    </div>
  );
}

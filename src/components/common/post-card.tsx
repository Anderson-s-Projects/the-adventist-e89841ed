
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Heart, MessageCircle, Share, ExternalLink, Bookmark, Send } from "lucide-react";
import { Button } from "./button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

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
  className,
  metadata
}: PostCardProps) {
  const [isLiked, setIsLiked] = useState(liked);
  const [likeCount, setLikeCount] = useState(likes);
  const [isSaved, setIsSaved] = useState(saved);
  const [commentCount, setCommentCount] = useState(comments);
  const [shareCount, setShareCount] = useState(shares);
  const [showComments, setShowComments] = useState(false);
  const [userComments, setUserComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  // Extract media and links from metadata if available
  const mediaUrl = metadata?.media_url || image || video;
  const mediaType = metadata?.media_type || (image ? "image" : video ? "video" : null);
  const linkUrl = metadata?.link_url || link;

  const handleLikeToggle = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount(prevCount => newLikedState ? prevCount + 1 : prevCount - 1);
    if (onLikeChange) {
      onLikeChange(id, newLikedState);
    }
  };

  const handleSaveToggle = async () => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save posts",
        variant: "destructive"
      });
      return;
    }

    const newSavedState = !isSaved;
    try {
      if (newSavedState) {
        // Save the post
        const { error } = await supabase
          .from('saved_posts')
          .insert({
            user_id: currentUser.id,
            post_id: id
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
          .eq('post_id', id);
        
        if (error) throw error;
        
        toast({
          title: "Post removed",
          description: "This post has been removed from your saved items",
        });
      }
      
      setIsSaved(newSavedState);
      if (onSaveChange) {
        onSaveChange(id, newSavedState);
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
      // Update share count in the database
      const { error } = await supabase
        .from('posts')
        .update({ shares_count: shareCount + 1 })
        .eq('id', id);
      
      if (error) throw error;
      
      // Try to use the Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: `Post by ${user.name}`,
          text: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
          url: window.location.origin + `/post/${id}`,
        });
      } else {
        // Fallback: copy link to clipboard
        await navigator.clipboard.writeText(window.location.origin + `/post/${id}`);
        toast({
          title: "Link copied",
          description: "Post link copied to clipboard",
        });
      }
      
      // Update UI
      setShareCount(prev => prev + 1);
    } catch (error) {
      console.error("Error sharing post:", error);
      if (error instanceof Error && error.name !== 'AbortError') {
        toast({
          title: "Error",
          description: "Failed to share the post",
          variant: "destructive"
        });
      }
    }
  };

  const fetchComments = async () => {
    if (!showComments) {
      setIsLoadingComments(true);
      try {
        const { data, error } = await supabase
          .from('post_comments')
          .select(`
            *,
            profiles:user_id (username, full_name, avatar_url)
          `)
          .eq('post_id', id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setUserComments(data || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
        toast({
          title: "Error",
          description: "Failed to load comments",
          variant: "destructive"
        });
      } finally {
        setIsLoadingComments(false);
      }
    }
    setShowComments(!showComments);
  };

  const handleSubmitComment = async () => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment",
        variant: "destructive"
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment",
        variant: "destructive"
      });
      return;
    }

    setIsSubmittingComment(true);
    try {
      // Add comment to database
      const { data, error } = await supabase
        .from('post_comments')
        .insert({
          post_id: id,
          user_id: currentUser.id,
          content: newComment.trim()
        })
        .select(`
          *,
          profiles:user_id (username, full_name, avatar_url)
        `);
      
      if (error) throw error;
      
      // Update post's comment count
      await supabase
        .from('posts')
        .update({ comments_count: commentCount + 1 })
        .eq('id', id);
      
      // Update UI
      setCommentCount(prev => prev + 1);
      setUserComments(prev => [data[0], ...prev]);
      setNewComment("");
      
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully",
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to post your comment",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleAvatarClick = () => {
    // Navigate to user profile if they have an ID
    if (user.id) {
      navigate(`/profile/${user.id}`);
    } else {
      // Otherwise navigate to the general profile page
      navigate('/profile');
    }
  };

  return (
    <div className={cn("bordered-card rounded-xl p-3 sm:p-5 mb-4 sm:mb-6", className)}>
      <div className="flex items-center mb-3 sm:mb-4">
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover mr-2 sm:mr-3 cursor-pointer hover:opacity-80 transition-opacity" 
          onClick={handleAvatarClick} 
        />
        <div className="overflow-hidden">
          <h3 
            className="font-semibold cursor-pointer hover:underline text-sm sm:text-base truncate" 
            onClick={handleAvatarClick}
          >
            {user.name}
          </h3>
          <p className="text-muted-foreground text-xs sm:text-sm truncate">@{user.username} · {timestamp}</p>
        </div>
      </div>
      
      <div className="mb-3 sm:mb-4">
        <p className="whitespace-pre-line sm:text-base text-base">{content}</p>
      </div>
      
      {mediaUrl && (
        <div className="mb-3 sm:mb-4 rounded-lg overflow-hidden">
          {mediaType === "image" ? (
            <img src={mediaUrl} alt="Post content" className="w-full h-auto rounded-lg" />
          ) : mediaType === "video" ? (
            <video src={mediaUrl} controls className="w-full rounded-lg" />
          ) : null}
        </div>
      )}
      
      {linkUrl && (
        <a 
          href={linkUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block mb-3 sm:mb-4 p-2 sm:p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
        >
          <div className="flex items-center">
            <ExternalLink size={14} className="mr-2 text-primary flex-shrink-0" />
            <span className="text-xs sm:text-sm truncate">{linkUrl}</span>
          </div>
        </a>
      )}
      
      <div className="flex items-center justify-between pt-2 border-t py-0">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 p-1 sm:p-2" 
          onClick={handleLikeToggle}
        >
          <Heart className={cn("w-4 h-4", isLiked && "fill-red-500 text-red-500")} />
          <span className="text-xs sm:text-sm">{likeCount}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 p-1 sm:p-2"
          onClick={fetchComments}
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-xs sm:text-sm">{commentCount}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 p-1 sm:p-2"
          onClick={handleShare}
        >
          <Share className="w-4 h-4" />
          <span className="text-xs sm:text-sm">{shareCount}</span>
        </Button>

        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 p-1 sm:p-2"
          onClick={handleSaveToggle}
        >
          <Bookmark className={cn("w-4 h-4", isSaved && "fill-primary text-primary")} />
        </Button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="mt-3 border-t pt-3">
          {currentUser && (
            <div className="flex items-start gap-2 mb-4">
              <img 
                src={currentUser.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"} 
                alt="Your avatar" 
                className="w-8 h-8 rounded-full object-cover" 
              />
              <div className="flex-1">
                <Textarea 
                  placeholder="Write a comment..." 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="resize-none min-h-[60px] text-sm"
                />
                <div className="flex justify-end mt-2">
                  <Button 
                    size="sm" 
                    disabled={isSubmittingComment || !newComment.trim()}
                    onClick={handleSubmitComment}
                    className="flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Post</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {isLoadingComments ? (
            <div className="flex justify-center py-4">
              <div className="rounded-md h-10 w-10 border-2 border-t-primary animate-spin"></div>
            </div>
          ) : userComments.length > 0 ? (
            <div className="space-y-3">
              {userComments.map((comment) => (
                <Card key={comment.id} className="p-3">
                  <div className="flex items-start gap-2">
                    <img 
                      src={comment.profiles?.avatar_url || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"} 
                      alt="Avatar" 
                      className="w-7 h-7 rounded-full object-cover" 
                    />
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-medium text-sm">
                          {comment.profiles?.full_name || "SDA Member"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{comment.content}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-3 text-sm">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      )}
    </div>
  );
}

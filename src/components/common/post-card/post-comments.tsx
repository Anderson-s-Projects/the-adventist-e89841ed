
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/common/button";
import { Send } from "lucide-react";

interface PostCommentsProps {
  postId: string;
  commentCount: number;
  showComments: boolean;
  onCommentAdded: () => void;
}

export function PostComments({ 
  postId, 
  commentCount, 
  showComments,
  onCommentAdded
}: PostCommentsProps) {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [userComments, setUserComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentsLoaded, setCommentsLoaded] = useState(false);

  // Fetch comments if they haven't been loaded yet
  const ensureCommentsLoaded = async () => {
    if (showComments && !commentsLoaded) {
      setIsLoadingComments(true);
      try {
        const { data, error } = await supabase
          .from('post_comments')
          .select(`
            id, 
            content, 
            created_at, 
            user_id,
            profiles (username, full_name, avatar_url)
          `)
          .eq('post_id', postId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setUserComments(data || []);
        setCommentsLoaded(true);
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
  };

  // Make sure comments are loaded when the component is shown
  if (showComments && !commentsLoaded && !isLoadingComments) {
    ensureCommentsLoaded();
  }

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
          post_id: postId,
          user_id: currentUser.id,
          content: newComment.trim()
        })
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles:user_id (username, full_name, avatar_url)
        `);
      
      if (error) throw error;
      
      // Update UI
      setUserComments(prev => data && data.length > 0 ? [data[0], ...prev] : prev);
      setNewComment("");
      onCommentAdded();
      
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

  if (!showComments) return null;

  return (
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
  );
}

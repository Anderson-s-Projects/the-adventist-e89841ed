
import { useState } from "react";
import { Button } from "@/components/common/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PostComposerProps {
  userAvatarUrl: string | null;
}

export function PostComposer({ userAvatarUrl }: PostComposerProps) {
  const [postContent, setPostContent] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data, error } = await supabase
        .from("posts")
        .insert([
          { 
            user_id: user!.id, 
            content,
            type: "regular",
            is_sabbath_appropriate: true
          }
        ])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setPostContent("");
      toast({
        title: "Post created",
        description: "Your post has been published successfully."
      });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to create post",
        description: error.message,
      });
    }
  });
  
  const handleCreatePost = () => {
    if (!postContent.trim()) {
      toast({
        variant: "destructive",
        title: "Empty post",
        description: "Please enter some content for your post."
      });
      return;
    }
    
    createPostMutation.mutate(postContent);
  };

  return (
    <div className="bordered-card rounded-xl p-5 mb-6">
      <div className="flex items-start">
        <img 
          src={userAvatarUrl || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"} 
          alt="Your profile" 
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <textarea
          placeholder="Share spiritual thoughts or prayer requests..."
          className="flex-1 bg-transparent border-none resize-none h-20 focus:outline-none"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        ></textarea>
      </div>
      <div className="flex justify-between items-center mt-3 pt-3 border-t">
        <div className="flex space-x-2">
          {/* Icon buttons would go here */}
        </div>
        <Button 
          onClick={handleCreatePost}
          disabled={createPostMutation.isPending}
        >
          {createPostMutation.isPending ? "Posting..." : "Post"}
        </Button>
      </div>
    </div>
  );
}


import { useState, useRef } from "react";
import { Button } from "@/components/common/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Image, Link, Video, X } from "lucide-react";

interface PostComposerProps {
  userAvatarUrl: string | null;
}

export function PostComposer({ userAvatarUrl }: PostComposerProps) {
  const [postContent, setPostContent] = useState("");
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [postLink, setPostLink] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async ({ content, mediaUrl, link }: { content: string, mediaUrl?: string, link?: string }) => {
      const postData = { 
        user_id: user!.id, 
        content,
        type: "regular",
        is_sabbath_appropriate: true,
        metadata: {}
      };
      
      if (mediaUrl) {
        postData.metadata = {
          ...postData.metadata,
          media_url: mediaUrl,
          media_type: mediaType
        };
      }
      
      if (link) {
        postData.metadata = {
          ...postData.metadata,
          link_url: link
        };
      }
      
      const { data, error } = await supabase
        .from("posts")
        .insert([postData])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      resetForm();
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
  
  const uploadMedia = async () => {
    if (!mediaFile) return null;
    
    try {
      const fileExt = mediaFile.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `post-media/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('post-media')
        .upload(filePath, mediaFile);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('post-media')
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  };
  
  const handleCreatePost = async () => {
    if (!postContent.trim() && !mediaFile && !postLink.trim()) {
      toast({
        variant: "destructive",
        title: "Empty post",
        description: "Please enter some content, add media, or include a link for your post."
      });
      return;
    }
    
    try {
      let mediaUrl = null;
      
      if (mediaFile) {
        mediaUrl = await uploadMedia();
      }
      
      createPostMutation.mutate({ 
        content: postContent, 
        mediaUrl, 
        link: postLink.trim() ? postLink : undefined 
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to upload media file."
      });
    }
  };
  
  const handleImageClick = () => {
    imageInputRef.current?.click();
  };
  
  const handleVideoClick = () => {
    videoInputRef.current?.click();
  };
  
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMediaFile(file);
      setMediaType(type);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const resetForm = () => {
    setPostContent("");
    setMediaPreview(null);
    setMediaFile(null);
    setMediaType(null);
    setPostLink("");
  };
  
  const removeMedia = () => {
    setMediaPreview(null);
    setMediaFile(null);
    setMediaType(null);
    
    // Reset file inputs
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  return (
    <div className="bordered-card rounded-xl p-5 mb-6">
      <div className="flex items-start">
        <img 
          src={userAvatarUrl || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"} 
          alt="Your profile" 
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <div className="flex-1 flex flex-col">
          <textarea
            placeholder="Share spiritual thoughts or prayer requests..."
            className="flex-1 bg-transparent border-none resize-none h-20 focus:outline-none w-full"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          ></textarea>
          
          {mediaPreview && (
            <div className="relative mt-2 mb-3">
              {mediaType === 'image' ? (
                <img 
                  src={mediaPreview} 
                  alt="Upload preview" 
                  className="rounded-lg max-h-64 object-contain"
                />
              ) : (
                <video 
                  src={mediaPreview} 
                  controls 
                  className="rounded-lg max-h-64 w-full"
                />
              )}
              <button 
                onClick={removeMedia}
                className="absolute top-2 right-2 bg-background/80 p-1 rounded-full"
              >
                <X size={16} className="text-foreground" />
              </button>
            </div>
          )}
          
          {postLink && (
            <div className="mt-2 mb-3 p-3 bg-muted rounded-lg flex items-center">
              <Link size={16} className="mr-2 text-primary" />
              <span className="text-sm text-ellipsis overflow-hidden">{postLink}</span>
              <button 
                onClick={() => setPostLink("")}
                className="ml-auto"
              >
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>
          )}
          
          {!mediaPreview && !postLink && (
            <div className="mt-2 mb-3">
              <input
                type="text"
                placeholder="Add a link..."
                className="w-full p-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                value={postLink}
                onChange={(e) => setPostLink(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-3 pt-3 border-t">
        <div className="flex space-x-2">
          <input 
            type="file" 
            ref={imageInputRef}
            accept="image/*" 
            className="hidden" 
            onChange={(e) => handleMediaChange(e, "image")}
          />
          <input 
            type="file" 
            ref={videoInputRef}
            accept="video/*" 
            className="hidden" 
            onChange={(e) => handleMediaChange(e, "video")}
          />
          
          <button 
            className="p-2 rounded-full hover:bg-muted transition-colors"
            onClick={handleImageClick}
            disabled={!!mediaPreview || !!postLink}
            title="Add image"
          >
            <Image size={18} className={mediaPreview || postLink ? "text-muted-foreground" : "text-foreground"} />
          </button>
          
          <button 
            className="p-2 rounded-full hover:bg-muted transition-colors"
            onClick={handleVideoClick}
            disabled={!!mediaPreview || !!postLink}
            title="Add video"
          >
            <Video size={18} className={mediaPreview || postLink ? "text-muted-foreground" : "text-foreground"} />
          </button>
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

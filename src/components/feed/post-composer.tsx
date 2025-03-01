
import React, { useState, useRef } from "react";
import { Button } from "@/components/common/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { 
  Image as ImageIcon, 
  Video, 
  Link as LinkIcon, 
  Smile, 
  X, 
  Loader2 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

interface PostComposerProps {
  onPostCreated?: () => void;
  className?: string;
  userAvatarUrl?: string; // Added this prop
}

export function PostComposer({ onPostCreated, className, userAvatarUrl }: PostComposerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [linkUrl, setLinkUrl] = useState<string>("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleMediaClick = (type: "image" | "video") => {
    setMediaType(type);
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === "image" ? "image/*" : "video/*";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMediaFile(file);

    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadMedia = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `post-media/${fileName}`;
      
      const { error } = await supabase.storage
        .from('post-media')
        .upload(filePath, file);
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('post-media')
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading media:', error);
      toast({
        title: "Upload Error",
        description: "Failed to upload media file",
        variant: "destructive",
      });
      return null;
    }
  };

  const handlePostSubmit = async () => {
    if (!content.trim() && !mediaFile && !linkUrl) {
      toast({
        title: "Empty Post",
        description: "Please add some content, media, or a link to your post",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let mediaUrl = null;
      if (mediaFile) {
        mediaUrl = await uploadMedia(mediaFile);
      }

      // Prepare metadata for the post
      const metadata = {
        media_type: mediaType,
        media_url: mediaUrl,
        link_url: linkUrl || null
      };

      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: content.trim(),
          metadata: metadata,
          type: 'regular'
        });

      if (error) throw error;

      // Reset form
      setContent("");
      setMediaFile(null);
      setMediaPreview(null);
      setMediaType(null);
      setLinkUrl("");
      setShowLinkInput(false);

      toast({
        title: "Post Created",
        description: "Your post has been shared with the community"
      });

      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bordered-card rounded-xl p-5 ${className}`}>
      <div className="flex space-x-3">
        <Avatar className="h-10 w-10">
          <img 
            src={userAvatarUrl || user?.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"} 
            alt="Avatar" 
            className="h-full w-full rounded-full object-cover"
          />
        </Avatar>
        
        <div className="flex-1">
          <Textarea
            placeholder="Share something with the community..."
            value={content}
            onChange={handleContentChange}
            className="resize-none min-h-[100px] mb-2"
          />
          
          {/* Media preview */}
          {mediaPreview && (
            <div className="relative mb-3 mt-2">
              <div className="rounded-lg overflow-hidden border border-border">
                {mediaType === 'image' ? (
                  <img 
                    src={mediaPreview} 
                    alt="Upload preview" 
                    className="max-h-[300px] w-auto mx-auto"
                  />
                ) : (
                  <video 
                    src={mediaPreview} 
                    controls
                    className="max-h-[300px] w-auto mx-auto"
                  />
                )}
              </div>
              <button
                onClick={removeMedia}
                className="absolute top-2 right-2 bg-background/80 p-1 rounded-full"
              >
                <X size={16} className="text-red-500" />
              </button>
            </div>
          )}
          
          {/* Link input */}
          {showLinkInput && (
            <div className="flex items-center mb-3 mt-2">
              <Input
                type="url"
                placeholder="Enter link URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="flex-1"
              />
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setShowLinkInput(false);
                  setLinkUrl("");
                }}
              >
                <X size={16} className="text-red-500" />
              </Button>
            </div>
          )}
          
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleMediaClick('image')}
                className="flex items-center"
              >
                <ImageIcon size={16} className="mr-1" />
                <span className="hidden sm:inline">Image</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleMediaClick('video')}
                className="flex items-center"
              >
                <Video size={16} className="mr-1" />
                <span className="hidden sm:inline">Video</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowLinkInput(!showLinkInput)}
                className="flex items-center"
              >
                <LinkIcon size={16} className="mr-1" />
                <span className="hidden sm:inline">Link</span>
              </Button>
            </div>
            
            <Button 
              onClick={handlePostSubmit}
              disabled={isSubmitting || (!content.trim() && !mediaFile && !linkUrl)}
              className="flex items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

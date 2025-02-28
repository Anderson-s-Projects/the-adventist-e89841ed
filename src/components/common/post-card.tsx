
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Heart, MessageCircle, Share, ExternalLink } from "lucide-react";
import { Button } from "./button";

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
  onLikeChange?: (id: string, liked: boolean) => void;
  className?: string;
  metadata?: {
    media_url?: string;
    media_type?: "image" | "video";
    link_url?: string;
  }
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
  onLikeChange,
  className,
  metadata
}: PostCardProps) {
  const [isLiked, setIsLiked] = useState(liked);
  const [likeCount, setLikeCount] = useState(likes);
  
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

  return (
    <div className={cn(
      "bordered-card rounded-xl p-5 mb-6", 
      className
    )}>
      <div className="flex items-center mb-4">
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <div>
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-muted-foreground text-sm">@{user.username} · {timestamp}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="whitespace-pre-line">{content}</p>
      </div>
      
      {mediaUrl && (
        <div className="mb-4 rounded-lg overflow-hidden">
          {mediaType === "image" ? (
            <img 
              src={mediaUrl} 
              alt="Post content" 
              className="w-full h-auto rounded-lg"
            />
          ) : mediaType === "video" ? (
            <video 
              src={mediaUrl} 
              controls
              className="w-full rounded-lg"
            />
          ) : null}
        </div>
      )}
      
      {linkUrl && (
        <a 
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-4 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
        >
          <div className="flex items-center">
            <ExternalLink size={16} className="mr-2 text-primary" />
            <span className="text-sm truncate">{linkUrl}</span>
          </div>
        </a>
      )}
      
      <div className="flex items-center justify-between pt-2 border-t">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1" 
          onClick={handleLikeToggle}
        >
          <Heart className={cn(
            "w-4 h-4",
            isLiked && "fill-red-500 text-red-500"
          )} />
          <span>{likeCount}</span>
        </Button>
        
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4" />
          <span>{comments}</span>
        </Button>
        
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Share className="w-4 h-4" />
          <span>{shares}</span>
        </Button>
      </div>
    </div>
  );
}

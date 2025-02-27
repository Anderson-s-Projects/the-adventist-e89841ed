
import { cn } from "@/lib/utils";
import { Heart, MessageCircle, Share } from "lucide-react";
import { Button } from "./button";

interface PostCardProps {
  className?: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  timestamp: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  liked?: boolean;
}

export function PostCard({
  className,
  user,
  timestamp,
  content,
  image,
  likes,
  comments,
  shares,
  liked = false,
}: PostCardProps) {
  return (
    <div className={cn("bordered-card rounded-xl p-5 mb-4 animate-fade-in card-hover", className)}>
      <div className="flex items-center mb-3">
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-10 h-10 rounded-full object-cover mr-3"
          loading="lazy"
        />
        <div>
          <h4 className="font-medium text-base">{user.name}</h4>
          <p className="text-sm text-muted-foreground">@{user.username} · {timestamp}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-balance mb-3">{content}</p>
        {image && (
          <div className="mt-3 rounded-lg overflow-hidden bg-muted/50">
            <img 
              src={image} 
              alt="Post image" 
              className="w-full h-auto object-cover max-h-[28rem]"
              loading="lazy"
            />
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("py-1 flex items-center gap-1", liked && "text-red-500")}
          >
            <Heart className={cn("h-4 w-4", liked && "fill-red-500")} />
            <span>{likes}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="py-1 flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>{comments}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="py-1 flex items-center gap-1">
            <Share className="h-4 w-4" />
            <span>{shares}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

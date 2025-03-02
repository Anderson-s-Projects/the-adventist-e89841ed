
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Heart, MessageCircle, Share, Bookmark } from "lucide-react";
import { Button } from "@/components/common/button";

interface PostActionsProps {
  id: string;
  likes: number;
  comments: number;
  shares: number;
  liked?: boolean;
  saved?: boolean;
  onLikeChange?: (id: string, liked: boolean) => void;
  onSaveChange?: (id: string, saved: boolean) => void;
  onCommentsToggle: () => void;
  onShare: () => void;
}

export function PostActions({ 
  id, 
  likes, 
  comments, 
  shares, 
  liked = false, 
  saved = false,
  onLikeChange,
  onSaveChange,
  onCommentsToggle,
  onShare
}: PostActionsProps) {
  const [isLiked, setIsLiked] = useState(liked);
  const [likeCount, setLikeCount] = useState(likes);
  const [isSaved, setIsSaved] = useState(saved);
  const [shareCount, setShareCount] = useState(shares);

  const handleLikeToggle = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount(prevCount => newLikedState ? prevCount + 1 : prevCount - 1);
    if (onLikeChange) {
      onLikeChange(id, newLikedState);
    }
  };

  const handleSaveToggle = () => {
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    if (onSaveChange) {
      onSaveChange(id, newSavedState);
    }
  };

  const handleShareAction = () => {
    setShareCount(prev => prev + 1);
    onShare();
  };

  return (
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
        onClick={onCommentsToggle}
      >
        <MessageCircle className="w-4 h-4" />
        <span className="text-xs sm:text-sm">{comments}</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex items-center gap-1 p-1 sm:p-2"
        onClick={handleShareAction}
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
  );
}

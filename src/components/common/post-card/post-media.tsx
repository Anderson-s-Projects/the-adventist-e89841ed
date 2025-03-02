
interface PostMediaProps {
  mediaUrl?: string | null;
  mediaType?: "image" | "video" | null;
  linkUrl?: string | null;
}

import { ExternalLink } from "lucide-react";

export function PostMedia({ mediaUrl, mediaType, linkUrl }: PostMediaProps) {
  if (!mediaUrl && !linkUrl) return null;
  
  return (
    <>
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
    </>
  );
}

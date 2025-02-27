
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface ProfileCardProps {
  className?: string;
  user: {
    name: string;
    username: string;
    avatar: string;
    bio?: string;
    following: number;
    followers: number;
    isFollowing?: boolean;
  };
  variant?: "compact" | "full";
}

export function ProfileCard({
  className,
  user,
  variant = "compact"
}: ProfileCardProps) {
  const isCompact = variant === "compact";

  return (
    <div className={cn(
      "bordered-card rounded-xl p-4 animate-scale-in card-hover",
      isCompact ? "max-w-[250px]" : "",
      className
    )}>
      <div className={cn(
        "flex",
        isCompact ? "flex-col items-center text-center" : "items-center"
      )}>
        <img 
          src={user.avatar} 
          alt={user.name} 
          className={cn(
            "rounded-full object-cover",
            isCompact ? "w-16 h-16 mb-3" : "w-14 h-14 mr-4"
          )}
          loading="lazy"
        />
        
        <div className={isCompact ? "" : "flex-1"}>
          <h4 className="font-medium text-base">{user.name}</h4>
          <p className="text-sm text-muted-foreground mb-1">@{user.username}</p>
          {user.bio && <p className="text-sm mb-3 text-balance">{user.bio}</p>}
          
          <div className={cn(
            "flex text-sm gap-3",
            isCompact ? "justify-center mt-2" : ""
          )}>
            <span className="font-medium">{user.following} <span className="text-muted-foreground font-normal">Following</span></span>
            <span className="font-medium">{user.followers} <span className="text-muted-foreground font-normal">Followers</span></span>
          </div>
        </div>
        
        {!isCompact && (
          <Button 
            variant={user.isFollowing ? "outline" : "primary"}
            size="sm"
            className="ml-4"
          >
            {user.isFollowing ? "Following" : "Follow"}
          </Button>
        )}
      </div>
      
      {isCompact && (
        <div className="mt-3 pt-3 border-t">
          <Button 
            variant={user.isFollowing ? "outline" : "primary"}
            size="sm"
            className="w-full"
          >
            {user.isFollowing ? "Following" : "Follow"}
          </Button>
        </div>
      )}
    </div>
  );
}

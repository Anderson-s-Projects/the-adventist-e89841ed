
import { Home, Compass, MessageSquare, Calendar, Settings } from "lucide-react";
import { NavLink } from "@/components/nav/nav-link";

import { useNavigate } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";

export function FeedSidebar({ userProfile }) {
  const navigate = useNavigate();
  
  const handleProfileClick = () => {
    navigate('/profile');
  };
  
  return (
    <div className="bordered-card rounded-xl p-4 sm:p-5 sticky top-20">
      {userProfile ? (
        <div className="flex flex-col items-center text-center">
          <Avatar 
            className="h-16 w-16 sm:h-20 sm:w-20 mb-3 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={handleProfileClick}
          >
            <img 
              src={userProfile.avatar_url || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"} 
              alt={userProfile.full_name} 
              className="aspect-square h-full w-full rounded-full object-cover"
            />
          </Avatar>
          
          <h3 
            className="font-semibold text-base sm:text-lg mb-1 cursor-pointer hover:underline truncate max-w-full"
            onClick={handleProfileClick}
          >
            {userProfile.full_name}
          </h3>
          <p className="text-muted-foreground text-xs sm:text-sm mb-4 truncate max-w-full">@{userProfile.username}</p>
          
          <div className="grid grid-cols-2 w-full gap-4 text-center mb-6">
            <div>
              <p className="font-semibold">{userProfile.following_count || 0}</p>
              <p className="text-muted-foreground text-xs sm:text-sm">Following</p>
            </div>
            <div>
              <p className="font-semibold">{userProfile.followers_count || 0}</p>
              <p className="text-muted-foreground text-xs sm:text-sm">Followers</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-40">
          <div className="animate-pulse bg-muted rounded-full h-16 w-16 sm:h-20 sm:w-20 mb-3"></div>
          <div className="animate-pulse bg-muted h-4 w-24 mb-2"></div>
          <div className="animate-pulse bg-muted h-3 w-20 mb-4"></div>
          <div className="grid grid-cols-2 w-full gap-4 text-center">
            <div>
              <div className="animate-pulse bg-muted h-4 w-8 mx-auto mb-1"></div>
              <div className="animate-pulse bg-muted h-3 w-16 mx-auto"></div>
            </div>
            <div>
              <div className="animate-pulse bg-muted h-4 w-8 mx-auto mb-1"></div>
              <div className="animate-pulse bg-muted h-3 w-16 mx-auto"></div>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-1 text-sm">
        <NavLink href="/feed" exact>
          <Home className="mr-2 h-4 w-4" />
          Home
        </NavLink>
        <NavLink href="/explore">
          <Compass className="mr-2 h-4 w-4" />
          Explore
        </NavLink>
        <NavLink href="/messages">
          <MessageSquare className="mr-2 h-4 w-4" />
          Messages
        </NavLink>
        <NavLink href="/events">
          <Calendar className="mr-2 h-4 w-4" />
          Events
        </NavLink>
        <NavLink href="/profile">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </NavLink>
      </div>
    </div>
  );
}

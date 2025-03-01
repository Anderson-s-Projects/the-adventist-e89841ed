import { Button } from "@/components/common/button";
import { useNavigate } from "react-router-dom";

export function SuggestionsSidebar({ suggestedProfiles = [] }) {
  const navigate = useNavigate();
  
  const handleProfileClick = (userId) => {
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };
  
  return (
    <div className="bordered-card rounded-xl p-5 sticky top-24">
      <h3 className="font-semibold text-lg mb-4">Suggested for you</h3>
      
      {suggestedProfiles.length > 0 ? (
        <div className="space-y-4">
          {suggestedProfiles.map((profile) => (
            <div key={profile.id} className="flex items-center">
              <img 
                src={profile.avatar_url} 
                alt={profile.username} 
                className="h-10 w-10 rounded-full object-cover mr-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleProfileClick(profile.id)}
              />
              <div className="flex-1 min-w-0">
                <h4 
                  className="font-medium truncate cursor-pointer hover:underline"
                  onClick={() => handleProfileClick(profile.id)}
                >
                  {profile.full_name}
                </h4>
                <p className="text-muted-foreground text-sm truncate">@{profile.username}</p>
              </div>
              <Button size="sm" variant="outline" className="flex-shrink-0">
                Follow
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div className="bg-muted h-10 w-10 rounded-full mr-3 animate-pulse"></div>
              <div className="flex-1">
                <div className="bg-muted h-4 w-24 mb-1 animate-pulse"></div>
                <div className="bg-muted h-3 w-20 animate-pulse"></div>
              </div>
              <div className="bg-muted h-8 w-16 rounded-md animate-pulse"></div>
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
}

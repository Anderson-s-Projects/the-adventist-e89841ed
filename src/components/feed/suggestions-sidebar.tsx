
import { ProfileCard } from "@/components/common/profile-card";

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  about: string | null;
  following_count?: number;
  followers_count?: number;
  user_is_following?: boolean;
}

interface SuggestionsSidebarProps {
  suggestedProfiles: Profile[];
}

export function SuggestionsSidebar({ suggestedProfiles }: SuggestionsSidebarProps) {
  return (
    <div className="sticky top-24">
      <div className="bordered-card rounded-xl p-5 mb-6">
        <h3 className="font-medium mb-4">Suggested for you</h3>
        <div className="space-y-4">
          {suggestedProfiles.map((profile) => (
            <ProfileCard 
              key={profile.id}
              user={{
                name: profile.full_name || "SDA Member",
                username: profile.username || "member",
                avatar: profile.avatar_url || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
                bio: profile.about,
                following: profile.following_count || 0,
                followers: profile.followers_count || 0,
                isFollowing: profile.user_is_following || false
              }}
              variant="compact"
              className="w-full"
            />
          ))}
        </div>
      </div>
      
      <div className="bordered-card rounded-xl p-5">
        <h3 className="font-medium mb-2">Trending Topics</h3>
        <div className="space-y-3 mt-4">
          {["Sabbath", "Prayer", "Prophecy", "Health", "Service"].map((topic) => (
            <a 
              key={topic} 
              href={`/topic/${topic.toLowerCase()}`}
              className="block px-3 py-2 rounded-md text-sm bg-secondary hover:bg-secondary/80 transition-colors"
            >
              #{topic}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

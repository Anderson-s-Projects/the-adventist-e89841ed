
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

interface FeedSidebarProps {
  userProfile: Profile | null;
}

export function FeedSidebar({ userProfile }: FeedSidebarProps) {
  return (
    <div className="sticky top-24">
      {userProfile && (
        <ProfileCard 
          profile={{
            id: userProfile.id,
            username: userProfile.username || "member",
            full_name: userProfile.full_name || "SDA Member",
            avatar_url: userProfile.avatar_url || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
            about: userProfile.about || "SDA community member",
            following_count: userProfile.following_count || 0,
            followers_count: userProfile.followers_count || 0,
          }}
          user={{
            name: userProfile.full_name || "SDA Member",
            username: userProfile.username || "member",
            avatar: userProfile.avatar_url || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
            bio: userProfile.about || "SDA community member",
            following: userProfile.following_count || 0,
            followers: userProfile.followers_count || 0,
          }}
          variant="full"
          className="mb-6"
        />
      )}
      
      <div className="bordered-card rounded-xl p-4 mb-6">
        <h3 className="font-medium mb-3">Navigation</h3>
        <nav className="space-y-1">
          {[
            { name: "Home", path: "/feed" },
            { name: "Explore", path: "/explore" },
            { name: "Bible Study", path: "/bible-study" },
            { name: "Events", path: "/events" },
            { name: "Messages", path: "/messages" },
            { name: "Profile", path: "/profile" },
          ].map((item) => (
            <a
              key={item.path}
              href={item.path}
              className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors"
            >
              {item.name}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}


import { Navbar } from "@/components/nav/navbar";
import { Button } from "@/components/common/button";
import { Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Custom hooks
import { usePosts } from "@/hooks/usePosts";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useSuggestedProfiles } from "@/hooks/useSuggestedProfiles";

// Components
import { FeedSidebar } from "@/components/feed/feed-sidebar";
import { PostComposer } from "@/components/feed/post-composer";
import { PostsList } from "@/components/feed/posts-list";
import { SuggestionsSidebar } from "@/components/feed/suggestions-sidebar";
import { useState } from "react";

const Feed = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showComposer, setShowComposer] = useState(false);

  // Use our custom hooks to fetch data
  const { data: posts = [], isLoading: isLoadingPosts } = usePosts();
  const { data: userProfile } = useUserProfile();
  const { data: suggestedProfiles = [] } = useSuggestedProfiles();

  // Handle like toggling
  const handleLikeChange = (postId: string, liked: boolean) => {
    console.log(`Post ${postId} ${liked ? 'liked' : 'unliked'}`);
    // Here we would update the database with the like status
    // For now we just update the UI through the PostCard component's internal state
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Sidebar - profile and navigation */}
            <div className="hidden md:block">
              <FeedSidebar userProfile={userProfile} />
            </div>
            
            {/* Main content - posts */}
            <div className="md:col-span-2 lg:col-span-1">
              {/* Post composer - shown all the time on desktop, toggled on mobile */}
              <div className={`${showComposer ? 'block' : 'hidden'} md:block`}>
                <PostComposer 
                  userAvatarUrl={userProfile?.avatar_url}
                  onPostCreated={() => setShowComposer(false)} 
                />
              </div>
              
              {/* Posts */}
              <PostsList posts={posts} isLoading={isLoadingPosts} onLikeChange={handleLikeChange} />
            </div>
            
            {/* Right sidebar - suggested users */}
            <div className="hidden lg:block">
              <SuggestionsSidebar suggestedProfiles={suggestedProfiles} />
            </div>
          </div>
        </div>
      </main>
      
      {/* Mobile floating action button */}
      <div className="fixed right-4 bottom-20 z-10 md:hidden">
        <Button 
          className="w-14 h-14 rounded-full shadow-lg"
          aria-label="Create post"
          onClick={() => setShowComposer(!showComposer)}
        >
          {showComposer ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </Button>
      </div>
    </div>
  );
};

export default Feed;

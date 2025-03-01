
import { Navbar } from "@/components/nav/navbar";
import { Button } from "@/components/common/button";
import { Plus } from "lucide-react";
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

const Feed = () => {
  const { user } = useAuth();
  const { toast } = useToast();

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
      
      <main className="pt-20 pb-16">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Sidebar - profile and navigation */}
            <div className="hidden md:block">
              <FeedSidebar userProfile={userProfile} />
            </div>
            
            {/* Main content - posts */}
            <div className="md:col-span-2 lg:col-span-1">
              {/* Post composer */}
              <PostComposer userAvatarUrl={userProfile?.avatar_url} />
              
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
      <div className="fixed right-6 bottom-6 md:hidden">
        <Button className="w-14 h-14 rounded-full shadow-lg" aria-label="Create post">
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default Feed;

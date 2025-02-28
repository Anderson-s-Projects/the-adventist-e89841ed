
import { useEffect, useState } from "react";
import { Navbar } from "@/components/nav/navbar";
import { PostCard } from "@/components/common/post-card";
import { ProfileCard } from "@/components/common/profile-card";
import { Button } from "@/components/common/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string | null;
  created_at: string;
  profiles: {
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
  likes_count?: number;
  comments_count?: number;
  shares_count?: number;
  user_has_liked?: boolean;
}

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

const Feed = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [postContent, setPostContent] = useState("");
  
  // Fetch posts
  const { data: posts = [], isLoading: isLoadingPosts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles:user_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }
      
      // Transform data to match our component props
      return data.map((post: any): Post => ({
        id: post.id,
        user_id: post.user_id,
        content: post.content,
        image_url: post.image_url,
        created_at: post.created_at,
        profiles: post.profiles,
        likes_count: 0, // We'll implement likes later
        comments_count: 0, // We'll implement comments later
        shares_count: 0, // We'll implement shares later
        user_has_liked: false // We'll implement this later
      }));
    },
  });
  
  // Fetch current user profile
  const { data: userProfile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      return {
        id: data.id,
        username: data.username || user.email?.split("@")[0],
        full_name: data.full_name || "SDA Member",
        avatar_url: data.avatar_url || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
        about: data.about || "SDA community member",
        following_count: 0, // We'll implement this later
        followers_count: 0, // We'll implement this later
      };
    },
    enabled: !!user?.id,
  });
  
  // Fetch suggested profiles
  const { data: suggestedProfiles = [] } = useQuery({
    queryKey: ["suggestedProfiles"],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user.id)
        .limit(3);
      
      if (error) {
        console.error("Error fetching suggested profiles:", error);
        throw error;
      }
      
      return data.map((profile): Profile => ({
        id: profile.id,
        username: profile.username || "sdamember",
        full_name: profile.full_name || "SDA Member",
        avatar_url: profile.avatar_url || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
        about: profile.about || "SDA community member",
        following_count: 0,
        followers_count: 0,
        user_is_following: false
      }));
    },
    enabled: !!user?.id,
  });
  
  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data, error } = await supabase
        .from("posts")
        .insert([
          { 
            user_id: user!.id, 
            content,
            type: "regular",
            is_sabbath_appropriate: true
          }
        ])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setPostContent("");
      toast({
        title: "Post created",
        description: "Your post has been published successfully."
      });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to create post",
        description: error.message,
      });
    }
  });
  
  const handleCreatePost = () => {
    if (!postContent.trim()) {
      toast({
        variant: "destructive",
        title: "Empty post",
        description: "Please enter some content for your post."
      });
      return;
    }
    
    createPostMutation.mutate(postContent);
  };
  
  // Set up real-time subscription for new posts
  useEffect(() => {
    const subscription = supabase
      .channel('public:posts')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'posts' 
      }, (payload) => {
        // When a new post is created, invalidate the posts query
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [queryClient]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Sidebar - profile and navigation */}
            <div className="hidden md:block">
              <div className="sticky top-24">
                {userProfile && (
                  <ProfileCard 
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
            </div>
            
            {/* Main content - posts */}
            <div className="md:col-span-2 lg:col-span-1">
              {/* Post composer */}
              <div className="bordered-card rounded-xl p-5 mb-6">
                <div className="flex items-start">
                  <img 
                    src={userProfile?.avatar_url || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"} 
                    alt="Your profile" 
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <textarea
                    placeholder="Share spiritual thoughts or prayer requests..."
                    className="flex-1 bg-transparent border-none resize-none h-20 focus:outline-none"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t">
                  <div className="flex space-x-2">
                    {/* Icon buttons would go here */}
                  </div>
                  <Button 
                    onClick={handleCreatePost}
                    disabled={createPostMutation.isPending}
                  >
                    {createPostMutation.isPending ? "Posting..." : "Post"}
                  </Button>
                </div>
              </div>
              
              {/* Posts */}
              {isLoadingPosts ? (
                <div className="flex justify-center py-8">
                  <div className="rounded-md h-12 w-12 border-4 border-t-primary animate-spin"></div>
                </div>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    user={{
                      name: post.profiles?.full_name || "SDA Member",
                      username: post.profiles?.username || "member",
                      avatar: post.profiles?.avatar_url || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
                    }}
                    timestamp={new Date(post.created_at).toLocaleDateString()}
                    content={post.content}
                    image={post.image_url || undefined}
                    likes={post.likes_count || 0}
                    comments={post.comments_count || 0}
                    shares={post.shares_count || 0}
                    liked={post.user_has_liked || false}
                  />
                ))
              ) : (
                <div className="bordered-card rounded-xl p-8 text-center">
                  <h3 className="font-medium text-lg mb-2">No posts yet</h3>
                  <p className="text-muted-foreground mb-4">Be the first to share something with the community!</p>
                </div>
              )}
              
              <div className="flex justify-center mt-6">
                <Button variant="outline" className="px-4">
                  Load more
                </Button>
              </div>
            </div>
            
            {/* Right sidebar - suggested users */}
            <div className="hidden lg:block">
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
            </div>
          </div>
        </div>
      </main>
      
      {/* Mobile floating action button */}
      <div className="fixed right-6 bottom-6 md:hidden">
        <Button className="w-14 h-14 rounded-full shadow-elevated">
          <Plus />
        </Button>
      </div>
    </div>
  );
};

export default Feed;

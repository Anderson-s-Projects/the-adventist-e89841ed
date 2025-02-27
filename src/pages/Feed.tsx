
import { Navbar } from "@/components/nav/navbar";
import { PostCard } from "@/components/common/post-card";
import { ProfileCard } from "@/components/common/profile-card";
import { Button } from "@/components/common/button";
import { Plus } from "lucide-react";

const Feed = () => {
  // Mock data
  const posts = [
    {
      id: 1,
      user: {
        name: "Alex Johnson",
        username: "alexj",
        avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
      },
      timestamp: "2h ago",
      content: "Just finished designing the new homepage for our project. Really happy with how it turned out! What do you think?",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      likes: 24,
      comments: 5,
      shares: 2,
      liked: true
    },
    {
      id: 2,
      user: {
        name: "Mia Williams",
        username: "miaw",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
      },
      timestamp: "5h ago",
      content: "Spent the day exploring some new hiking trails. Nature always helps me reset and find new inspiration.",
      image: "https://images.unsplash.com/photo-1501675423372-9bfa95849e62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      likes: 56,
      comments: 8,
      shares: 3,
      liked: false
    },
    {
      id: 3,
      user: {
        name: "David Chen",
        username: "davitech",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
      },
      timestamp: "1d ago",
      content: "Just read an amazing article about minimalist design principles. It's fascinating how 'less' can actually be 'more' when done thoughtfully.",
      likes: 42,
      comments: 7,
      shares: 5,
      liked: false
    }
  ];

  const suggestedUsers = [
    {
      name: "Emma Smith",
      username: "emmadesigns",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
      bio: "Product designer. Coffee enthusiast. Dog lover.",
      following: 342,
      followers: 2840,
      isFollowing: false
    },
    {
      name: "James Wilson",
      username: "jameswil",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
      bio: "Photographer and filmmaker.",
      following: 128,
      followers: 1254,
      isFollowing: true
    },
    {
      name: "Sophia Lee",
      username: "sophialee",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
      bio: "Digital artist & illustrator",
      following: 215,
      followers: 3120,
      isFollowing: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Sidebar - profile and navigation */}
            <div className="hidden md:block">
              <div className="sticky top-24">
                <ProfileCard 
                  user={{
                    name: "Taylor Morgan",
                    username: "taylor",
                    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
                    bio: "UX Designer | Coffee addict | Minimalist",
                    following: 248,
                    followers: 1356,
                  }}
                  variant="full"
                  className="mb-6"
                />
                
                <div className="bordered-card rounded-xl p-4 mb-6">
                  <h3 className="font-medium mb-3">Navigation</h3>
                  <nav className="space-y-1">
                    {[
                      { name: "Home", path: "/feed" },
                      { name: "Explore", path: "/explore" },
                      { name: "Bookmarks", path: "/bookmarks" },
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
                    src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" 
                    alt="Your profile" 
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <textarea
                    placeholder="What's on your mind?"
                    className="flex-1 bg-transparent border-none resize-none h-20 focus:outline-none"
                  ></textarea>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t">
                  <div className="flex space-x-2">
                    {/* Icon buttons would go here */}
                  </div>
                  <Button>
                    Post
                  </Button>
                </div>
              </div>
              
              {/* Posts */}
              {posts.map((post) => (
                <PostCard key={post.id} {...post} />
              ))}
              
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
                    {suggestedUsers.map((user) => (
                      <ProfileCard 
                        key={user.username}
                        user={user}
                        variant="compact"
                        className="w-full"
                      />
                    ))}
                  </div>
                </div>
                
                <div className="bordered-card rounded-xl p-5">
                  <h3 className="font-medium mb-2">Trending Topics</h3>
                  <div className="space-y-3 mt-4">
                    {["Design", "Photography", "Technology", "Travel", "Art"].map((topic) => (
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


import { Navbar } from "@/components/nav/navbar";
import { Button } from "@/components/common/button";
import { Compass, Bookmark, Users, TrendingUp, Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Explore = () => {
  const [activeCategory, setActiveCategory] = useState<string>("trending");
  
  const categories = [
    { id: "trending", name: "Trending", icon: <TrendingUp className="h-4 w-4 mr-2" /> },
    { id: "popular", name: "Popular", icon: <Star className="h-4 w-4 mr-2" /> },
    { id: "people", name: "People", icon: <Users className="h-4 w-4 mr-2" /> },
    { id: "saved", name: "Saved", icon: <Bookmark className="h-4 w-4 mr-2" /> },
  ];

  // Mock data for exploration content
  const explorePosts = [
    {
      id: 1,
      title: "Photography Basics",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      tags: ["photography", "tutorial", "beginner"],
      author: "Emma Roberts",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
    },
    {
      id: 2,
      title: "Remote Work Tips",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      tags: ["work", "productivity", "remote"],
      author: "Alex Chen",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
    },
    {
      id: 3,
      title: "Healthy Recipes",
      image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      tags: ["food", "health", "cooking"],
      author: "Maria Garcia",
      authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
    },
    {
      id: 4,
      title: "Minimal Interior Design",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      tags: ["design", "interior", "minimalism"],
      author: "James Wilson",
      authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
    },
    {
      id: 5,
      title: "Travel Destinations 2023",
      image: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      tags: ["travel", "adventure", "vacation"],
      author: "Sophie Lee",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
    },
    {
      id: 6,
      title: "Tech Gadgets Review",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      tags: ["tech", "gadgets", "review"],
      author: "David Chen",
      authorAvatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-heading-2 font-display font-bold flex items-center mb-2">
              <Compass className="mr-2 h-7 w-7" /> 
              Explore
            </h1>
            <p className="text-muted-foreground">
              Discover new content, creators, and communities
            </p>
          </div>
          
          {/* Category filters */}
          <div className="flex overflow-x-auto pb-3 mb-6 hide-scrollbar space-x-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "primary" : "outline"}
                size="sm"
                className="whitespace-nowrap flex items-center"
                onClick={() => setActiveCategory(category.id)}
              >
                {category.icon}
                {category.name}
              </Button>
            ))}
          </div>
          
          {/* Search */}
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Search topics, people, or content..."
              className="w-full bg-secondary rounded-full py-3 pl-5 pr-12 subtle-ring"
            />
            <Button
              variant="ghost"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full p-2"
            >
              <Compass className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Grid of explore items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {explorePosts.map((post) => (
              <div 
                key={post.id}
                className="bordered-card rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-2">{post.title}</h3>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center mt-2">
                    <img 
                      src={post.authorAvatar} 
                      alt={post.author} 
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <span className="text-sm text-muted-foreground">{post.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Explore;

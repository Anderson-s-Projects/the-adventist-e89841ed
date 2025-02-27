
import { useState } from "react";
import { Navbar } from "@/components/nav/navbar";
import { PostCard } from "@/components/common/post-card";
import { Button } from "@/components/common/button";
import { Settings, MapPin, Calendar, Link as LinkIcon } from "lucide-react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  
  // Mock data
  const profile = {
    name: "Taylor Morgan",
    username: "taylor",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
    cover: "https://images.unsplash.com/photo-1501675423372-9bfa95849e62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80",
    bio: "UX Designer | Coffee addict | Minimalist | Building digital experiences with a focus on simplicity and usability.",
    location: "San Francisco, CA",
    website: "taylormorgan.design",
    joined: "March 2021",
    following: 248,
    followers: 1356,
    isCurrentUser: true
  };
  
  const posts = [
    {
      id: 1,
      user: {
        name: profile.name,
        username: profile.username,
        avatar: profile.avatar
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
        name: profile.name,
        username: profile.username,
        avatar: profile.avatar
      },
      timestamp: "3d ago",
      content: "Exploring some new design inspiration. Love how these minimalist interfaces focus on content and functionality.",
      likes: 42,
      comments: 7,
      shares: 5,
      liked: false
    }
  ];

  const mediaItems = [
    {
      id: 1,
      type: "image",
      url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      type: "image",
      url: "https://images.unsplash.com/photo-1501675423372-9bfa95849e62?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      type: "image",
      url: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 4,
      type: "image",
      url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        {/* Profile header */}
        <div className="relative">
          {/* Cover photo */}
          <div className="h-48 md:h-64 lg:h-80 overflow-hidden">
            <img 
              src={profile.cover} 
              alt="Cover" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="relative -mt-16 md:-mt-20 flex flex-col md:flex-row md:items-end md:justify-between mb-4 md:mb-6">
              {/* Avatar and name */}
              <div className="flex flex-col md:flex-row md:items-end">
                <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-background overflow-hidden shadow-elevated mr-0 md:mr-4 mx-auto md:mx-0">
                  <img 
                    src={profile.avatar} 
                    alt={profile.name} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                
                <div className="mt-4 md:mt-0 text-center md:text-left">
                  <h1 className="text-heading-4 font-medium">{profile.name}</h1>
                  <p className="text-muted-foreground">@{profile.username}</p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="mt-4 md:mt-0 flex justify-center md:justify-end">
                {profile.isCurrentUser ? (
                  <Button variant="outline" className="flex items-center gap-1">
                    <Settings className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </Button>
                ) : (
                  <Button>Follow</Button>
                )}
              </div>
            </div>
            
            {/* Bio and info */}
            <div className="mb-6">
              <p className="mb-4 text-balance">{profile.bio}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                
                {profile.website && (
                  <div className="flex items-center gap-1">
                    <LinkIcon className="w-4 h-4" />
                    <a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {profile.website}
                    </a>
                  </div>
                )}
                
                {profile.joined && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {profile.joined}</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-4 mt-4">
                <div>
                  <span className="font-medium">{profile.following}</span>
                  <span className="text-muted-foreground ml-1">Following</span>
                </div>
                <div>
                  <span className="font-medium">{profile.followers}</span>
                  <span className="text-muted-foreground ml-1">Followers</span>
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="border-b">
              <div className="flex overflow-x-auto">
                {["posts", "media", "likes"].map((tab) => (
                  <button
                    key={tab}
                    className={`flex-1 max-w-[200px] min-w-[100px] py-3 px-4 text-center font-medium transition-colors relative
                    ${activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="container max-w-7xl mx-auto px-4 md:px-6 py-6">
          {activeTab === "posts" && (
            <div className="max-w-2xl mx-auto">
              {posts.map((post) => (
                <PostCard key={post.id} {...post} />
              ))}
            </div>
          )}
          
          {activeTab === "media" && (
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {mediaItems.map((item) => (
                  <div key={item.id} className="aspect-square rounded-lg overflow-hidden bordered-card card-hover">
                    <img 
                      src={item.url} 
                      alt="Media" 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === "likes" && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center text-muted-foreground py-12">
                <p>No liked posts yet</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;

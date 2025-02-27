
import { Navbar } from "@/components/nav/navbar";
import { Button } from "@/components/common/button";
import { BookOpen, Bookmark, Check, Clock, Star } from "lucide-react";
import { useState } from "react";

const BibleStudy = () => {
  const [activeTab, setActiveTab] = useState<string>("lessons");
  
  const bibleStudies = [
    {
      id: 1,
      title: "The Sanctuary Message",
      description: "Explore the biblical sanctuary and its significance for Adventists today.",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      author: "Pastor Robert Johnson",
      authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
      length: "8 lessons",
      completionRate: 65
    },
    {
      id: 2,
      title: "Daniel's Prophecies",
      description: "A deep dive into the prophetic book of Daniel and its end-time revelations.",
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      author: "Dr. Elizabeth Chen",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
      length: "12 lessons",
      completionRate: 30
    },
    {
      id: 3,
      title: "Sabbath Principles",
      description: "Understanding the biblical basis for Sabbath observance and its modern application.",
      image: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      author: "Mark Williams",
      authorAvatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
      length: "6 lessons",
      completionRate: 0
    },
    {
      id: 4,
      title: "Three Angels' Messages",
      description: "A comprehensive study of Revelation 14 and its relevance to the Adventist mission.",
      image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      author: "Dr. Michael Garcia",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
      length: "10 lessons",
      completionRate: 0
    }
  ];

  const devotionals = [
    {
      id: 1,
      title: "Morning Watch",
      description: "Start your day with Scripture and devotional thoughts.",
      days: "Daily",
      image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 2,
      title: "Sabbath School Quarterly",
      description: "Current quarter's Sabbath School lesson studies.",
      days: "Weekly",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-heading-2 font-display font-bold flex items-center mb-2">
              <BookOpen className="mr-2 h-7 w-7" /> 
              Bible Study
            </h1>
            <p className="text-muted-foreground">
              Grow spiritually with our Bible study resources and devotionals
            </p>
          </div>
          
          {/* Tab navigation */}
          <div className="flex border-b mb-8">
            <button
              className={`pb-2 px-4 font-medium ${activeTab === 'lessons' ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground'}`}
              onClick={() => setActiveTab('lessons')}
            >
              Bible Study Lessons
            </button>
            <button
              className={`pb-2 px-4 font-medium ${activeTab === 'devotionals' ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground'}`}
              onClick={() => setActiveTab('devotionals')}
            >
              Daily Devotionals
            </button>
          </div>
          
          {activeTab === 'lessons' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bibleStudies.map((study) => (
                <div key={study.id} className="bordered-card rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={study.image} 
                      alt={study.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-xl">{study.title}</h3>
                      <Button variant="ghost" size="sm" className="p-1">
                        <Bookmark className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{study.description}</p>
                    
                    <div className="flex items-center mb-3">
                      <img 
                        src={study.authorAvatar} 
                        alt={study.author} 
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <span className="text-sm text-muted-foreground">{study.author}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{study.length}</span>
                    </div>
                    
                    {study.completionRate > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{study.completionRate}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${study.completionRate}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <Button className="w-full">
                      {study.completionRate > 0 ? 'Continue Study' : 'Start Study'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {devotionals.map((devotional) => (
                <div key={devotional.id} className="bordered-card rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={devotional.image} 
                      alt={devotional.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-xl">{devotional.title}</h3>
                      <span className="text-sm bg-secondary px-2 py-1 rounded-full">{devotional.days}</span>
                    </div>
                    
                    <p className="text-muted-foreground mb-6">{devotional.description}</p>
                    
                    <Button className="w-full">
                      Read Today's Devotional
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BibleStudy;

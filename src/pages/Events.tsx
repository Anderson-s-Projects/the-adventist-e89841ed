
import { Navbar } from "@/components/nav/navbar";
import { Button } from "@/components/common/button";
import { Calendar, MapPin, Clock, Users, Filter, Search } from "lucide-react";
import { useState } from "react";

const Events = () => {
  const [filter, setFilter] = useState<string>("all");
  
  const events = [
    {
      id: 1,
      title: "Global Youth Day",
      type: "youth",
      date: "March 18, 2023",
      time: "9:00 AM - 5:00 PM",
      location: "Worldwide",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      attendees: 1250
    },
    {
      id: 2,
      title: "Camp Meeting 2023",
      type: "conference",
      date: "June 15-22, 2023",
      time: "All day",
      location: "Redwood Conference Center",
      image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      attendees: 532
    },
    {
      id: 3,
      title: "Sabbath School Teachers Training",
      type: "workshop",
      date: "April 9, 2023",
      time: "2:00 PM - 4:30 PM",
      location: "Central Adventist Church",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      attendees: 45
    },
    {
      id: 4,
      title: "Pathfinder Camporee",
      type: "youth",
      date: "July 8-15, 2023",
      time: "All Week",
      location: "Mountain View Ranch",
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      attendees: 872
    },
    {
      id: 5,
      title: "Health Expo",
      type: "outreach",
      date: "May 7, 2023",
      time: "10:00 AM - 4:00 PM",
      location: "City Park",
      image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      attendees: 321
    },
    {
      id: 6,
      title: "Bible Prophecy Seminar",
      type: "seminar",
      date: "April 15-22, 2023",
      time: "7:00 PM - 8:30 PM",
      location: "Riverside Adventist Church",
      image: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      attendees: 189
    }
  ];

  // Filter events based on selected filter
  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(event => event.type === filter);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-heading-2 font-display font-bold flex items-center mb-2">
              <Calendar className="mr-2 h-7 w-7" /> 
              Events
            </h1>
            <p className="text-muted-foreground">
              Find Adventist events near you and around the world
            </p>
          </div>
          
          {/* Search and filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full bg-secondary rounded-lg py-2 pl-10 pr-4 subtle-ring"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              <Button
                variant={filter === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'youth' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('youth')}
              >
                Youth
              </Button>
              <Button
                variant={filter === 'workshop' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('workshop')}
              >
                Workshops
              </Button>
              <Button
                variant={filter === 'conference' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('conference')}
              >
                Conferences
              </Button>
              <Button
                variant={filter === 'outreach' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('outreach')}
              >
                Outreach
              </Button>
              <Button
                variant={filter === 'seminar' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('seminar')}
              >
                Seminars
              </Button>
            </div>
          </div>
          
          {/* Events grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div 
                key={event.id}
                className="bordered-card rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="aspect-video w-full overflow-hidden relative">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-primary rounded-full px-3 py-1 text-xs font-medium text-primary-foreground">
                    {event.type}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-medium text-xl mb-3">{event.title}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{event.date}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{event.time}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline">More Info</Button>
                    <Button>Register</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No events found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Events;

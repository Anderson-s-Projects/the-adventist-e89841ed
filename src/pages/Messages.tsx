
import { Navbar } from "@/components/nav/navbar";
import { Button } from "@/components/common/button";
import { Search, Send, Phone, Video, MoreVertical, MessageCircle, Edit } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [messageText, setMessageText] = useState<string>("");
  
  // Mock data for conversations
  const conversations = [
    {
      id: 1,
      user: {
        name: "Alex Johnson",
        avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
        status: "online"
      },
      messages: [
        { id: 1, text: "Hey, how's it going?", fromMe: false, time: "2:34 PM" },
        { id: 2, text: "I'm good, just working on that design project we talked about. How about you?", fromMe: true, time: "2:35 PM" },
        { id: 3, text: "Nice! I'd love to see it when you're done. I'm just relaxing today.", fromMe: false, time: "2:38 PM" },
      ],
      lastMessageTime: "2:38 PM",
      unread: 0
    },
    {
      id: 2,
      user: {
        name: "Emma Smith",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
        status: "offline"
      },
      messages: [
        { id: 1, text: "Did you see the latest update?", fromMe: false, time: "Yesterday" },
        { id: 2, text: "Yes, it looks amazing! I'm excited to try it out.", fromMe: true, time: "Yesterday" },
      ],
      lastMessageTime: "Yesterday",
      unread: 0
    },
    {
      id: 3,
      user: {
        name: "David Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
        status: "online"
      },
      messages: [
        { id: 1, text: "Hey, can you send me that file?", fromMe: false, time: "10:15 AM" },
      ],
      lastMessageTime: "10:15 AM",
      unread: 1
    },
    {
      id: 4,
      user: {
        name: "Sophia Lee",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
        status: "online"
      },
      messages: [
        { id: 1, text: "Are we still meeting today?", fromMe: false, time: "8:45 AM" },
        { id: 2, text: "Yes, at the usual place at 6pm. Does that work?", fromMe: true, time: "8:47 AM" },
        { id: 3, text: "Perfect, see you then!", fromMe: false, time: "8:50 AM" },
      ],
      lastMessageTime: "8:50 AM",
      unread: 0
    },
  ];

  const selectedConversation = conversations.find(conv => conv.id === selectedChat);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // In a real app, you would handle sending messages to the backend here
      console.log("Sending message:", messageText);
      setMessageText("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16 h-screen">
        <div className="container max-w-7xl mx-auto px-4 md:px-6 h-[calc(100%-5rem)]">
          <div className="flex flex-col h-full">
            <div className="mb-4">
              <h1 className="text-heading-2 font-display font-bold flex items-center">
                <MessageCircle className="mr-2 h-7 w-7" /> 
                Messages
              </h1>
            </div>
            
            <div className="bordered-card rounded-xl flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[calc(100%-3rem)]">
              {/* Conversations list */}
              <div className="border-r border-border md:col-span-1 flex flex-col max-h-full">
                <div className="p-3 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      className="w-full pl-9 pr-4 py-2 bg-secondary rounded-full text-sm subtle-ring"
                    />
                  </div>
                </div>
                
                <div className="overflow-y-auto flex-1">
                  {conversations.map((conversation) => (
                    <div 
                      key={conversation.id}
                      className={cn(
                        "flex items-center p-3 cursor-pointer hover:bg-accent transition-colors border-b border-border",
                        selectedChat === conversation.id && "bg-accent"
                      )}
                      onClick={() => setSelectedChat(conversation.id)}
                    >
                      <div className="relative">
                        <img 
                          src={conversation.user.avatar} 
                          alt={conversation.user.name} 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <span className={cn(
                          "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background",
                          conversation.user.status === "online" ? "bg-green-500" : "bg-gray-400"
                        )} />
                      </div>
                      
                      <div className="ml-3 flex-1 overflow-hidden">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium truncate">{conversation.user.name}</h3>
                          <span className="text-xs text-muted-foreground">{conversation.lastMessageTime}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.messages[conversation.messages.length - 1].text}
                        </p>
                      </div>
                      
                      {conversation.unread > 0 && (
                        <div className="ml-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conversation.unread}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="p-3 border-t border-border">
                  <Button variant="outline" className="w-full" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    New Message
                  </Button>
                </div>
              </div>
              
              {/* Chat area */}
              <div className="md:col-span-2 flex flex-col max-h-full">
                {selectedConversation ? (
                  <>
                    {/* Chat header */}
                    <div className="border-b border-border p-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <img 
                          src={selectedConversation.user.avatar} 
                          alt={selectedConversation.user.name} 
                          className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                        <div>
                          <h3 className="font-medium">{selectedConversation.user.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {selectedConversation.user.status === "online" ? "Online" : "Offline"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" className="rounded-full p-2">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-full p-2">
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-full p-2">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {selectedConversation.messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex",
                            message.fromMe ? "justify-end" : "justify-start"
                          )}
                        >
                          <div className={cn(
                            "max-w-[80%] rounded-xl px-4 py-2",
                            message.fromMe 
                              ? "bg-primary text-primary-foreground rounded-tr-none" 
                              : "bg-secondary text-secondary-foreground rounded-tl-none"
                          )}>
                            <p>{message.text}</p>
                            <span className={cn(
                              "text-xs mt-1 block",
                              message.fromMe ? "text-primary-foreground/70" : "text-muted-foreground"
                            )}>
                              {message.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Message input */}
                    <div className="border-t border-border p-3">
                      <div className="flex items-center">
                        <input
                          type="text"
                          placeholder="Type a message..."
                          className="flex-1 bg-secondary rounded-full py-2 px-4 subtle-ring"
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button 
                          variant="primary" 
                          size="sm" 
                          className="ml-2 rounded-full p-2 aspect-square"
                          onClick={handleSendMessage}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center p-6">
                      <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium text-lg mb-2">Your Messages</h3>
                      <p className="text-muted-foreground mb-4">
                        Select a conversation or start a new one
                      </p>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        New Message
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Messages;

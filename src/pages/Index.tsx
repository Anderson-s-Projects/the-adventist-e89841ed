
import { Navbar } from "@/components/nav/navbar";
import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { Button } from "@/components/common/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="py-20 pt-24 md:pt-32">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2 space-y-6 text-center md:text-left">
                <h1 className="text-heading-2 md:text-display font-display font-bold animate-fade-in">
                  Connect with the Adventist community
                </h1>
                <p className="text-lg text-muted-foreground animate-fade-in delay-100">
                  Grow your faith, share your journey, and connect with fellow believers in a supportive online community centered on Seventh-day Adventist values.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 animate-fade-in delay-200">
                  <Link to="/feed">
                    <Button size="lg">
                      Join the Community
                    </Button>
                  </Link>
                  <Link to="/bible-study">
                    <Button variant="outline" size="lg">
                      Explore Bible Studies
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 animate-scale-in">
                <img 
                  src="https://images.unsplash.com/photo-1517022812141-23620dba5c23?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="People in fellowship" 
                  className="rounded-xl w-full shadow-elevated"
                />
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-accent">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-heading-3 font-display font-bold mb-4">Our Community Values</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Connect with fellow believers who share your faith journey
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background rounded-xl p-6 animate-fade-in">
                <div className="mb-4 inline-block p-3 bg-primary/10 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Sabbath Reminders</h3>
                <p className="text-muted-foreground">
                  Get notified about upcoming Sabbath times and special church events in your area.
                </p>
              </div>
              
              <div className="bg-background rounded-xl p-6 animate-fade-in delay-100">
                <div className="mb-4 inline-block p-3 bg-primary/10 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Connect with Believers</h3>
                <p className="text-muted-foreground">
                  Find and connect with other Seventh-day Adventists in your local area and around the world.
                </p>
              </div>
              
              <div className="bg-background rounded-xl p-6 animate-fade-in delay-200">
                <div className="mb-4 inline-block p-3 bg-primary/10 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 2v8"></path><path d="m4.93 10.93 1.41 1.41"></path><path d="M2 18h2"></path><path d="M20 18h2"></path><path d="m19.07 10.93-1.41 1.41"></path><path d="M22 22H2"></path><path d="m8 22 4-10 4 10"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Bible Studies</h3>
                <p className="text-muted-foreground">
                  Access daily devotionals, Bible study guides, and share insights with other members.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-background">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-heading-3 font-display font-bold mb-4">Join our growing community</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Connect with thousands of Adventists who have already discovered a better way to grow in faith together.
              </p>
              <Link to="/feed">
                <Button size="lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        <footer className="py-12 border-t">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <Link to="/" className="flex items-center">
                  <span className="text-xl font-bold">AdventistConnect</span>
                </Link>
                <p className="text-sm text-muted-foreground mt-2">
                  © {new Date().getFullYear()} AdventistConnect. All rights reserved.
                </p>
              </div>
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  About
                </Link>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy
                </Link>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms
                </Link>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;

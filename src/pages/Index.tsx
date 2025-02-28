
import { Link } from "react-router-dom";
import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { Button } from "@/components/common/button";
import { Navbar } from "@/components/nav/navbar";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="bg-background">
      <Navbar />
      <Hero 
        title="Connect with your Seventh-day Adventist Community"
        description="Join our platform designed specifically for Seventh-day Adventists. Share your faith journey, connect with fellow believers, and grow spiritually together."
        image="/og-image.png"
        ctaText={user ? "Go to Feed" : "Sign Up"}
        ctaLink={user ? "/feed" : "/auth"}
      />
      <Features 
        title="Faith-Focused Features"
        description="Our platform is designed to support your spiritual journey and help you connect with the Seventh-day Adventist community."
        features={[
          {
            title: "Bible Studies",
            description: "Access and share Bible studies on Adventist doctrines and beliefs.",
            icon: "book"
          },
          {
            title: "Prayer Requests",
            description: "Share prayer requests and pray for others in the community.",
            icon: "heart"
          },
          {
            title: "Church Events",
            description: "Stay updated on church events and activities in your area.",
            icon: "calendar"
          },
          {
            title: "Sabbath Content",
            description: "Special content and features for Sabbath observance.",
            icon: "sun"
          },
          {
            title: "Health & Wellness",
            description: "Resources and discussions on Adventist health principles.",
            icon: "activity"
          },
          {
            title: "Global Community",
            description: "Connect with Adventists from around the world.",
            icon: "globe"
          }
        ]}
      />
      
      <section className="py-16 bg-primary/5">
        <div className="container max-w-7xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-heading-3 font-medium font-display mb-4">Ready to Join Our Community?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with fellow Seventh-day Adventists, share your faith journey, and grow spiritually together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/feed">
                <Button size="lg">Go to Feed</Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button size="lg">Sign Up Now</Button>
                </Link>
                <Link to="/auth">
                  <Button variant="outline" size="lg">Sign In</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
      
      <footer className="bg-background py-12 border-t">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-medium text-lg mb-4">SDA Connect</h3>
              <p className="text-muted-foreground">
                A community platform for Seventh-day Adventists to connect, share, and grow together in faith.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/bible-study" className="text-muted-foreground hover:text-primary transition-colors">Bible Studies</Link></li>
                <li><Link to="/events" className="text-muted-foreground hover:text-primary transition-colors">Events</Link></li>
                <li><a href="https://www.adventist.org" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">Adventist.org</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} SDA Connect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;


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
        <Hero />
        <Features />
        
        <section className="py-20 bg-accent">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-heading-3 font-display font-bold mb-4">Ready to get started?</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Join thousands of people who have already discovered a better way to connect.
              </p>
              <Link to="/feed">
                <Button size="lg">
                  Join the Community
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
                  <span className="text-xl font-bold">nexus</span>
                </Link>
                <p className="text-sm text-muted-foreground mt-2">
                  © {new Date().getFullYear()} Nexus. All rights reserved.
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

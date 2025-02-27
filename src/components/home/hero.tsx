
import { Button } from "@/components/common/button";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="pt-28 md:pt-36 pb-20 overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-heading-1 md:text-display font-display font-bold leading-tight tracking-tight mb-6 animate-fade-in">
            Connect with <span className="relative">people<span className="absolute -bottom-2 left-0 w-full h-1 bg-primary opacity-70"></span></span> that matter
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in text-balance" style={{ animationDelay: "100ms" }}>
            Join our thoughtfully crafted social experience designed to foster meaningful connections and reduce digital noise.
          </p>
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-in" 
            style={{ animationDelay: "200ms" }}
          >
            <Link to="/feed">
              <Button size="lg" variant="primary">
                Explore the Feed
              </Button>
            </Link>
            <Link to="/profile">
              <Button size="lg" variant="outline">
                Create Profile
              </Button>
            </Link>
          </div>
        </div>

        <div 
          className="mt-16 md:mt-24 relative rounded-xl overflow-hidden shadow-elevated animate-fade-in max-w-5xl mx-auto" 
          style={{ animationDelay: "300ms" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80" 
            alt="People connecting" 
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

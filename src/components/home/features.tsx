
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

function FeatureCard({ title, description, icon, className }: FeatureCardProps) {
  return (
    <div className={cn(
      "glass-card rounded-xl p-6 animate-fade-in card-hover",
      className
    )}>
      <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="text-heading-5 font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground text-balance">{description}</p>
    </div>
  );
}

export function Features() {
  const features = [
    {
      title: "Meaningful Connections",
      description: "Our algorithm promotes deeper relationships over viral content, focusing on quality over quantity.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <path d="M18 16.98h-5.99c-1.66 0-3.01-1.34-3.01-3s1.34-3 3.01-3H18" />
          <path d="M6 17h1" />
          <path d="M6 13h1" />
          <path d="M18 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
          <path d="M18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
          <path d="M6 9h1" />
        </svg>
      ),
    },
    {
      title: "Privacy Focused",
      description: "Your data is yours. We don't sell your information to advertisers or track your every move online.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          <circle cx="12" cy="16" r="1" />
        </svg>
      ),
    },
    {
      title: "Thoughtful Design",
      description: "Our clean interface reduces distraction and helps you focus on what matters most - the people.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" x2="9.01" y1="9" y2="9" />
          <line x1="15" x2="15.01" y1="9" y2="9" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-20">
          <h2 className="text-heading-2 font-display font-bold mb-4">Why Choose Nexus</h2>
          <p className="text-xl text-muted-foreground text-balance">
            We've reimagined social media to prioritize human connection and digital wellbeing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              {...feature}
              className={{ animationDelay: `${index * 100}ms` } as any}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

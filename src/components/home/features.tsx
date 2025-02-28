
import { BookOpen, Calendar, MessageSquare, HeartHandshake, Users, BookMarked } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <BookOpen className="h-10 w-10 mb-3 text-primary" />,
      title: "Bible Study",
      description: "Access Bible study materials, commentaries, and share insights with others."
    },
    {
      icon: <Calendar className="h-10 w-10 mb-3 text-primary" />,
      title: "Events",
      description: "Find and join local church events, seminars, and community service opportunities."
    },
    {
      icon: <MessageSquare className="h-10 w-10 mb-3 text-primary" />,
      title: "Discussion Forums",
      description: "Engage in meaningful conversations about faith, doctrine, and Christian living."
    },
    {
      icon: <HeartHandshake className="h-10 w-10 mb-3 text-primary" />,
      title: "Prayer Requests",
      description: "Share prayer needs and pray for others in the community."
    },
    {
      icon: <Users className="h-10 w-10 mb-3 text-primary" />,
      title: "Community Groups",
      description: "Join interest-based groups for fellowship and collaboration."
    },
    {
      icon: <BookMarked className="h-10 w-10 mb-3 text-primary" />,
      title: "Resource Sharing",
      description: "Share and discover sermons, books, and other spiritual resources."
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-muted/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Connect, Share, Grow
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Discover the key features of our SDA community platform designed to strengthen your faith journey.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 rounded-lg border p-6 bg-card shadow-sm">
              {feature.icon}
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-center text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

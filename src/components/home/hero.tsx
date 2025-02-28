
import { Button } from "@/components/common/button";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-2 md:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                SDA Community Connect
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Connect with fellow Seventh-day Adventists, share spiritual insights, and grow together in faith.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link to="/auth">
                <Button className="px-8">Get Started</Button>
              </Link>
              <Link to="/explore">
                <Button variant="outline" className="px-8">
                  Explore
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              alt="Community"
              className="aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
              height="310"
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80"
              width="550"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

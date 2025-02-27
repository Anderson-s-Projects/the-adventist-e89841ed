
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <div className={cn("font-display font-bold flex items-center", sizeClasses[size], className)}>
      <div className="mr-1.5 bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center">
        <span className="transform -translate-y-px">n</span>
      </div>
      <span className="tracking-tight">nexus</span>
    </div>
  );
}

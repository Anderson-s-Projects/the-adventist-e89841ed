
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  exact?: boolean;
  className?: string;
}

export const NavLink = ({ href, children, exact = false, className }: NavLinkProps) => {
  const location = useLocation();
  const isActive = exact 
    ? location.pathname === href 
    : location.pathname.startsWith(href);

  return (
    <Link
      to={href}
      className={cn(
        "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-foreground/80 hover:text-foreground hover:bg-accent",
        className
      )}
    >
      {children}
    </Link>
  );
};

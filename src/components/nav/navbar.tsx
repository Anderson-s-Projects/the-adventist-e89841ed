
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, User, Home, X, LogOut } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/common/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchActive(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Feed", path: "/feed" },
    { name: "Explore", path: "/explore" },
    { name: "Messages", path: "/messages" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-2",
        isScrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-12 sm:h-14">
          {/* Mobile Search Input (When active) */}
          {isSearchActive ? (
            <div className="flex items-center w-full">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-2"
                onClick={() => setIsSearchActive(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-9 pr-4 py-2 bg-secondary rounded-full text-sm border-none w-full subtle-ring"
                  autoFocus
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center">
                <Link to="/" className="mr-3 sm:mr-6 flex-shrink-0">
                  <Logo />
                </Link>

                <nav className="hidden md:flex items-center space-x-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={cn(
                        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        location.pathname === link.path
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/80 hover:text-foreground hover:bg-accent"
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-full p-2 md:hidden"
                  onClick={() => setIsSearchActive(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>
                
                <div className="hidden md:flex relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-9 pr-4 py-2 bg-secondary rounded-full text-sm border-none subtle-ring"
                  />
                </div>

                {user ? (
                  <>
                    <Link to="/feed" className="hidden md:block">
                      <Button variant="ghost" size="sm" className="rounded-full p-2 md:ml-2">
                        <Home className="h-5 w-5" />
                      </Button>
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="hidden md:flex">
                          Profile
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="z-50 bg-background border border-border shadow-md">
                        <DropdownMenuItem onClick={() => navigate("/profile")}>
                          <User className="h-4 w-4 mr-2" />
                          My Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut}>
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Link to="/profile" className="md:hidden">
                      <Button variant="ghost" size="sm" className="rounded-full p-2">
                        <User className="h-5 w-5" />
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => navigate("/auth")}
                    className="hidden md:inline-flex"
                  >
                    Sign In
                  </Button>
                )}

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-full p-2 md:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="pt-2 pb-4 space-y-1 border-t mt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                    location.pathname === link.path
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:text-foreground hover:bg-accent"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              
              {!user ? (
                <Link 
                  to="/auth" 
                  className="block px-3 py-2 rounded-md text-base font-medium transition-colors bg-primary text-primary-foreground mt-2 text-center"
                >
                  Sign In
                </Link>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full mt-2 flex items-center justify-center"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

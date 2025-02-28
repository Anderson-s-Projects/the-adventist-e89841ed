
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/common/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");

  if (user) {
    navigate("/feed");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (activeTab === "signin") {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate("/feed");
      } else {
        const { error, data } = await signUp(email, password);
        if (error) throw error;
        
        // If it's a new signup, redirect to profile page with state
        if (data?.user) {
          toast({
            title: "Account created",
            description: "Welcome to SDA Connect! Let's set up your profile.",
          });
          navigate("/profile", { state: { newUser: true } });
        } else {
          toast({
            title: "Account created",
            description: "Please check your email for verification instructions.",
          });
          setActiveTab("signin");
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        title: "Authentication failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">SDA Connect</h1>
          <p className="mt-2 text-muted-foreground">
            Join the Seventh-day Adventist community platform
          </p>
        </div>
        
        <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <TabsContent value="signin">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="mt-1"
                  />
                </div>
                <div className="text-right text-sm">
                  <a href="#" className="text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="signup">
              <div className="space-y-4">
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="mt-1"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Password must be at least 6 characters long
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              {activeTab === "signin" ? "Sign In" : "Create Account"}
            </Button>
          </form>
        </Tabs>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="outline" type="button" className="w-full">
              Google
            </Button>
            <Button variant="outline" type="button" className="w-full">
              Facebook
            </Button>
          </div>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
};

export default Auth;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/common/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export default function Auth() {
  const { isLoading, signUp, signIn } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formError, setFormError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateForm = () => {
    if (!email) {
      setFormError("Please enter your email");
      return false;
    }
    if (!password) {
      setFormError("Please enter your password");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    if (!validateForm()) return;
    
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          setFormError(error.message);
          return;
        }
        // Redirect to profile page with newUser flag
        navigate('/profile', { state: { newUser: true }});
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setFormError(error.message);
          return;
        }
        navigate('/feed');
      }
    } catch (error: any) {
      setFormError(error.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {isSignUp ? "Create an account" : "Sign in"}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="m@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {formError && (
                <p className="text-red-500 text-sm">{formError}</p>
              )}
              <Button disabled={isLoading} type="submit">
                {isLoading ? (
                  <>
                    Loading
                  </>
                ) : (
                  isSignUp ? "Sign Up" : "Sign In"
                )}
              </Button>
            </div>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div>
            <Button variant="outline" disabled>
              Google
            </Button>
          </div>
        </CardContent>
        <div className="p-4 text-center text-sm text-muted-foreground">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <button
                className="underline underline-offset-4 hover:text-primary"
                onClick={() => {
                  setIsSignUp(false);
                  setFormError("");
                }}
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button
                className="underline underline-offset-4 hover:text-primary"
                onClick={() => {
                  setIsSignUp(true);
                  setFormError("");
                }}
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

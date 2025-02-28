
import { useEffect } from "react";
import { Navbar } from "@/components/nav/navbar";
import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      navigate("/feed");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        <Hero />
        <Features />
      </main>
    </div>
  );
};

export default Index;

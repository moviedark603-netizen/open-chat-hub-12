import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ProfileCard from "@/components/ProfileCard";
import { LogOut, MessageSquare, User, Shield, MapPin, Heart, Users, Globe, Lock, Sparkles, CheckCircle } from "lucide-react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useMessageNotifications } from "@/hooks/useMessageNotifications";
import MobileNav from "@/components/MobileNav";
import RecentMessages from "@/components/RecentMessages";
import RecentlyJoined from "@/components/RecentlyJoined";

interface Profile {
  id: string;
  name: string;
  email: string;
  mobile_number: string;
  photo_url: string | null;
  user_id: string;
  gender: string;
  location: string;
}

const Index = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();
  const { isAdmin } = useIsAdmin();
  const { unreadCount } = useMessageNotifications(currentProfile?.id || null);

  useEffect(() => {
    checkAuth();
    fetchProfiles();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (profile) {
        setCurrentProfile(profile);
        
        if (!profile.name || !profile.mobile_number || !profile.gender || !profile.location) {
          navigate("/profile");
        }
      }
    }
  };

  const fetchProfiles = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: currentUserProfile } = await supabase
      .from("profiles")
      .select("location")
      .eq("user_id", user.id)
      .single();

    let query = supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (currentUserProfile?.location) {
      query = query.eq("location", currentUserProfile.location);
    }

    const { data, error } = await query;

    if (!error && data) {
      const filteredProfiles = data.filter((p) => p.user_id !== user?.id);
      setProfiles(filteredProfiles);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const features = [
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: "Find Real Connections",
      description: "Connect with genuine people who share your interests, values, and lifestyle preferences."
    },
    {
      icon: <MapPin className="w-8 h-8 text-primary" />,
      title: "Location-Based Matching",
      description: "Discover people near you for easier meetups and stronger local connections."
    },
    {
      icon: <Lock className="w-8 h-8 text-primary" />,
      title: "Safe & Secure",
      description: "Your privacy is our priority. All profiles are verified and conversations are encrypted."
    },
    {
      icon: <Sparkles className="w-8 h-8 text-primary" />,
      title: "Smart Recommendations",
      description: "Our intelligent algorithm suggests compatible matches based on your preferences."
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Create Your Profile",
      description: "Sign up for free and create a detailed profile showcasing your personality and interests."
    },
    {
      step: "2",
      title: "Discover People",
      description: "Browse through profiles of people near you and find those who catch your interest."
    },
    {
      step: "3",
      title: "Start Conversations",
      description: "Send messages, share photos, and build meaningful connections at your own pace."
    },
    {
      step: "4",
      title: "Meet & Connect",
      description: "Take your connection offline and meet in person when you're both ready."
    }
  ];

  const testimonials = [
    {
      name: "Priya S.",
      location: "Mumbai",
      text: "OTHERS helped me find amazing friends in my neighborhood. The location-based feature is fantastic!"
    },
    {
      name: "Rahul M.",
      location: "Delhi",
      text: "Finally a platform that values genuine connections over superficial interactions. Highly recommend!"
    },
    {
      name: "Ananya K.",
      location: "Bangalore",
      text: "I love how safe and secure this platform feels. Made some wonderful connections here."
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-primary to-accent rounded-full p-1.5 md:p-2">
              <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">OTHERS</h1>
          </div>
          <div className="hidden md:flex items-center gap-2">
            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/admin")}
                title="Admin Dashboard"
              >
                <Shield className="w-5 h-5" />
              </Button>
            )}
            {currentProfile ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/profile")}
                >
                  <User className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate("/auth")} variant="default">
                Sign In
              </Button>
            )}
          </div>
          <div className="flex md:hidden items-center gap-2">
            {currentProfile ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/profile")}
                >
                  <User className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate("/auth")} size="sm">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Recently Joined Section - Top */}
      <section className="bg-background border-b border-border py-4">
        <div className="container mx-auto px-4">
          <RecentlyJoined currentProfileId={currentProfile?.id || null} />
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-secondary border-b border-border">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 animate-fade-in-down">
              #1 Local Dating & Connection Platform
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4 md:mb-6 animate-fade-in opacity-0 animate-delay-100">
              Find Your Perfect Match Near You
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in opacity-0 animate-delay-200">
              OTHERS is the trusted platform for meaningful connections. Meet real people in your area who share your interests, values, and dreams.
            </p>
            
            {!currentProfile ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up opacity-0 animate-delay-300">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/auth")}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg px-10 py-6 hover-lift hover-glow"
                >
                  Join Free Today
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate("/auth")}
                  className="text-lg px-10 py-6 hover-lift"
                >
                  Sign In
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 animate-fade-in opacity-0 animate-delay-200">
                <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground bg-card px-4 py-2 rounded-full border border-border hover-lift">
                  <MapPin className="w-4 h-4 text-primary animate-bounce-soft" />
                  <span className="font-medium">{currentProfile.location}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-primary hover:text-accent ml-1"
                    onClick={() => navigate("/profile")}
                  >
                    Change
                  </Button>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 mt-12 max-w-lg mx-auto">
              <div className="text-center animate-fade-in-up opacity-0 animate-delay-400">
                <div className="text-2xl md:text-4xl font-bold text-primary">10K+</div>
                <div className="text-xs md:text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center animate-fade-in-up opacity-0 animate-delay-500">
                <div className="text-2xl md:text-4xl font-bold text-primary">50+</div>
                <div className="text-xs md:text-sm text-muted-foreground">Cities</div>
              </div>
              <div className="text-center animate-fade-in-up opacity-0 animate-delay-700">
                <div className="text-2xl md:text-4xl font-bold text-primary">5K+</div>
                <div className="text-xs md:text-sm text-muted-foreground">Connections Made</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose OTHERS?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're dedicated to helping you build genuine relationships with people who truly matter.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="border-border bg-card card-hover animate-fade-in-up opacity-0"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 hover:animate-bounce-soft transition-all">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How OTHERS Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Getting started is easy. Follow these simple steps to find your perfect match.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div 
                key={index} 
                className="relative text-center animate-fade-in-up opacity-0"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold hover:animate-wiggle transition-all hover:scale-110">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real stories from real people who found meaningful connections on OTHERS.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Sparkles key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-foreground mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 rounded-full w-10 h-10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                About OTHERS
              </h2>
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-6">
                OTHERS is a modern social connection platform designed to help people find meaningful relationships in their local area. Founded with the belief that genuine connections happen when people meet others who share their values and interests, we've created a safe and welcoming space for everyone.
              </p>
              <p className="mb-6">
                Our platform uses advanced location-based technology to connect you with people nearby, making it easier to transition from online conversations to real-life meetups. Whether you're looking for friendship, romance, or simply expanding your social circle, OTHERS provides the tools you need.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Verified Profiles</h4>
                    <p className="text-sm">All users go through our verification process for authenticity.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Privacy First</h4>
                    <p className="text-sm">Your data is encrypted and never shared with third parties.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">24/7 Support</h4>
                    <p className="text-sm">Our dedicated team is always here to help you.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Free to Join</h4>
                    <p className="text-sm">Create your profile and start connecting for free.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-6 md:py-10">
        {/* Recent Messages - Only for logged in users */}
        {currentProfile && (
          <div className="mb-8">
            <RecentMessages currentProfileId={currentProfile.id} />
          </div>
        )}

        {/* Main Content */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              People Near You
            </h2>
            <Badge variant="secondary" className="text-sm">
              {profiles.length} {profiles.length === 1 ? 'match' : 'matches'}
            </Badge>
          </div>
        </div>

        {!currentProfile ? (
          <div className="text-center py-16 md:py-24">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-full w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 md:w-12 md:h-12 text-primary" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
              Join OTHERS Today
            </h3>
            <p className="text-base md:text-lg text-muted-foreground px-4 mb-6">
              Sign up to discover amazing people near you and start meaningful connections
            </p>
            <Button onClick={() => navigate("/auth")} size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
              Get Started Free
            </Button>
          </div>
        ) : profiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {profiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} currentProfileId={currentProfile.id} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 md:py-24">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-full w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 md:w-12 md:h-12 text-primary" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
              No matches yet
            </h3>
            <p className="text-base md:text-lg text-muted-foreground px-4 mb-6">
              {currentProfile.location 
                ? "Be the first in your area! Check back soon for new members."
                : "Complete your profile to start discovering people near you."}
            </p>
            {!currentProfile.location && (
              <Button onClick={() => navigate("/profile")} size="lg">
                Complete Profile
              </Button>
            )}
          </div>
        )}
      </main>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary to-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Find Your Connection?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of happy users who have found meaningful relationships on OTHERS. Your perfect match could be just a click away.
          </p>
          {!currentProfile && (
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate("/auth")}
              className="text-lg px-10 py-6"
            >
              Start Your Journey Today
            </Button>
          )}
        </div>
      </section>

      <MobileNav isAdmin={isAdmin} unreadCount={unreadCount} />

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-primary to-accent rounded-full p-1.5">
                  <MessageSquare className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">OTHERS</span>
              </div>
              <p className="text-muted-foreground text-sm max-w-md">
                OTHERS is your trusted platform for finding meaningful connections. We believe everyone deserves to meet people who truly understand them.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => navigate("/")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/community")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Community
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/groups")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Groups
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => navigate("/terms")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/privacy")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} OTHERS. All rights reserved. Made with ❤️ for meaningful connections.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
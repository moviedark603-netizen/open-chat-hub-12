import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProfileCard from "@/components/ProfileCard";
import { LogOut, MessageSquare, User, Shield, MapPin } from "lucide-react";
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
    
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (profile) {
      setCurrentProfile(profile);
      
      // Check if profile is incomplete and redirect to profile page
      if (!profile.name || !profile.mobile_number || !profile.gender || !profile.location) {
        navigate("/profile");
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

    // Filter by location if available
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
          </div>
          <div className="flex md:hidden items-center gap-2">
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
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-secondary border-b border-border">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-3 md:mb-4">
              Find Your Perfect Match
            </h2>
            <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8">
              Connect with people near you who share your interests and values
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground bg-card px-4 py-2 rounded-full border border-border">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-medium">
                  {currentProfile?.location || "Set your location"}
                </span>
                {currentProfile?.location && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-primary hover:text-accent ml-1"
                    onClick={() => navigate("/profile")}
                  >
                    Change
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-6 md:py-10">
        {currentProfile && (
          <>
            <div className="mb-8">
              <RecentMessages currentProfileId={currentProfile.id} />
            </div>
            <div className="mb-8">
              <RecentlyJoined currentProfileId={currentProfile.id} />
            </div>
          </>
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

        {profiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {profiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} currentProfileId={currentProfile?.id || ""} />
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
              {currentProfile?.location 
                ? "Be the first in your area! Check back soon for new members."
                : "Complete your profile to start discovering people near you."}
            </p>
            {!currentProfile?.location && (
              <Button onClick={() => navigate("/profile")} size="lg">
                Complete Profile
              </Button>
            )}
          </div>
        )}
      </main>

      <MobileNav isAdmin={isAdmin} unreadCount={unreadCount} />
    </div>
  );
};

export default Index;
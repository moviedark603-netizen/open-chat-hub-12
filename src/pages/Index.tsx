import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background pb-20 md:pb-0">
      <header className="bg-card border-b border-border shadow-soft sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-full p-1.5 md:p-2">
              <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-card-foreground">OTHERS</h1>
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

      <main className="container mx-auto px-4 py-4 md:py-8">
        {currentProfile && (
          <>
            <div className="mb-6">
              <RecentMessages currentProfileId={currentProfile.id} />
            </div>
            <div className="mb-6">
              <RecentlyJoined currentProfileId={currentProfile.id} />
            </div>
          </>
        )}

        <div className="mb-4 md:mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Discover People Near You</h2>
          <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>
              {currentProfile?.location ? `${currentProfile.location}` : "Complete your profile to see matches"}
            </span>
            {currentProfile?.location && (
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-primary"
                onClick={() => navigate("/profile")}
              >
                Change
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} currentProfileId={currentProfile?.id || ""} />
          ))}
        </div>

        {profiles.length === 0 && (
          <div className="text-center py-12 md:py-16">
            <MessageSquare className="w-12 h-12 md:w-16 md:h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg md:text-xl text-muted-foreground px-4">
              No matches in your area yet. Check back soon!
            </p>
          </div>
        )}
      </main>

      <MobileNav isAdmin={isAdmin} unreadCount={unreadCount} />
    </div>
  );
};

export default Index;
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Gift, 
  ArrowLeft,
  Send,
  Globe,
  Lock,
  Crown
} from "lucide-react";
import PhotoGallery from "@/components/PhotoGallery";
import SendGiftPoints from "@/components/SendGiftPoints";
import ConnectionActions from "@/components/ConnectionActions";
import OnlineStatusBadge from "@/components/OnlineStatusBadge";
import MobileNav from "@/components/MobileNav";
import { useOnlinePresence } from "@/hooks/useOnlinePresence";
import { toast } from "sonner";

interface Profile {
  id: string;
  name: string;
  email: string;
  photo_url: string | null;
  gender: string | null;
  location: string | null;
  gift_points: number;
  telegram_id: string | null;
  whatsapp_number: string | null;
  created_at: string | null;
  is_premium: boolean;
}

const UserProfile = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const { isUserOnline } = useOnlinePresence(
    currentProfile?.id || null,
    currentProfile?.name || null
  );

  useEffect(() => {
    fetchProfiles();
  }, [profileId]);

  const fetchProfiles = async () => {
    if (!profileId) return;

    setLoading(true);

    // Fetch the viewed profile
    const { data: viewedProfile, error: viewedError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", profileId)
      .maybeSingle();

    if (viewedError) {
      toast.error("Failed to load profile");
      setLoading(false);
      return;
    }

    if (!viewedProfile) {
      toast.error("Profile not found");
      navigate("/community");
      return;
    }

    setProfile(viewedProfile);

    // Fetch current user's profile
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: currentUserProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (currentUserProfile) {
        setCurrentProfile(currentUserProfile);
      }
    }

    setLoading(false);
  };

  const handleTelegramClick = () => {
    if (profile?.telegram_id) {
      window.open(`https://t.me/${profile.telegram_id}`, "_blank");
    }
  };

  const handleWhatsAppClick = () => {
    if (profile?.whatsapp_number) {
      const cleanNumber = profile.whatsapp_number.replace(/\D/g, "");
      window.open(`https://wa.me/${cleanNumber}`, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  const isOwnProfile = currentProfile?.id === profile.id;
  const isPremiumViewer = currentProfile?.is_premium || false;
  const hasContactDetails = profile.telegram_id || profile.whatsapp_number;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="container max-w-2xl mx-auto flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Profile</h1>
        </div>
      </div>

      <div className="container max-w-2xl mx-auto p-4 space-y-6">
        {/* Profile Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                  <AvatarImage src={profile.photo_url || undefined} alt={profile.name} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {profile.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1">
                  <OnlineStatusBadge isOnline={isUserOnline(profile.id)} />
                </div>
              </div>
              
              <h2 className="mt-4 text-2xl font-bold">{profile.name}</h2>
              
              <div className="flex items-center gap-2 mt-2">
                {profile.gender && (
                  <Badge variant="secondary">
                    {profile.gender === "man" ? "👨 Man" : profile.gender === "woman" ? "👩 Woman" : profile.gender}
                  </Badge>
                )}
                {profile.location && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {profile.location}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1 mt-3 text-amber-500">
                <Gift className="w-4 h-4" />
                <span className="font-semibold">{profile.gift_points} points</span>
              </div>

              {profile.created_at && (
                <p className="text-sm text-muted-foreground mt-2">
                  Member since {new Date(profile.created_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Options */}
        {!isOwnProfile && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Contact Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full" 
                onClick={() => navigate(`/messages/${profile.id}`)}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              
              {/* Premium-only contact details */}
              {hasContactDetails && (
                isPremiumViewer ? (
                  <>
                    {profile.telegram_id && (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleTelegramClick}
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        Telegram: @{profile.telegram_id}
                      </Button>
                    )}
                    
                    {profile.whatsapp_number && (
                      <Button 
                        variant="outline" 
                        className="w-full text-green-600 border-green-600 hover:bg-green-50"
                        onClick={handleWhatsAppClick}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        WhatsApp: {profile.whatsapp_number}
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                      <Lock className="w-4 h-4" />
                      <span className="font-medium">Premium Feature</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Upgrade to premium to see contact details
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-amber-500 text-amber-600 hover:bg-amber-50"
                      onClick={() => navigate("/profile")}
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Premium
                    </Button>
                  </div>
                )
              )}

              <Separator />

              <div className="flex gap-2">
                {currentProfile && (
                  <>
                    <div className="flex-1">
                      <SendGiftPoints
                        currentProfileId={currentProfile.id}
                        receiverProfileId={profile.id}
                        receiverName={profile.name}
                      />
                    </div>
                    <ConnectionActions
                      profileId={profile.id}
                      currentProfileId={currentProfile.id}
                    />
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Photo Gallery */}
        <PhotoGallery profileId={profile.id} />
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
};

export default UserProfile;

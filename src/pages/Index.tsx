import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import ProfileCard from "@/components/ProfileCard";
import PhotoUpload from "@/components/PhotoUpload";
import PhotoGallery from "@/components/PhotoGallery";
import { LogOut, MessageSquare, User } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [photoRefresh, setPhotoRefresh] = useState(0);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    mobile_number: "",
    gender: "man" as "man" | "woman",
    location: "",
    photo: null as File | null,
  });
  const navigate = useNavigate();

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
      
      // Check if profile is incomplete
      if (!profile.name || !profile.mobile_number || !profile.gender || !profile.location) {
        setProfileForm({
          name: profile.name || "",
          email: profile.email || session.user.email || "",
          mobile_number: profile.mobile_number || "",
          gender: (profile.gender || "man") as "man" | "woman",
          location: profile.location || "",
          photo: null,
        });
        setShowProfileDialog(true);
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

  const updateProfile = async () => {
    if (!currentProfile || !profileForm.name || !profileForm.mobile_number || !profileForm.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      let photoUrl = currentProfile.photo_url;

      if (profileForm.photo) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const fileExt = profileForm.photo.name.split(".").pop();
        const fileName = `${user.id}/profile.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("photos")
          .upload(fileName, profileForm.photo, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("photos")
          .getPublicUrl(fileName);

        photoUrl = publicUrl;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          name: profileForm.name,
          mobile_number: profileForm.mobile_number,
          gender: profileForm.gender,
          location: profileForm.location,
          photo_url: photoUrl,
        })
        .eq("id", currentProfile.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
      setShowProfileDialog(false);
      checkAuth();
    } catch (error: any) {
      toast.error(error.message || "Error updating profile");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <header className="bg-card border-b border-border shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-full p-2">
              <MessageSquare className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-card-foreground">OTHERS</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowProfileDialog(true)}
            >
              <User className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Discover People Near You</h2>
          <p className="text-muted-foreground">
            {currentProfile?.location ? `Showing profiles in ${currentProfile.location}` : "Complete your profile to see matches"}
          </p>
        </div>

        {currentProfile && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <PhotoGallery profileId={currentProfile.id} refresh={photoRefresh} />
            </div>
            <div>
              <PhotoUpload
                profileId={currentProfile.id}
                onPhotoUploaded={() => setPhotoRefresh((prev) => prev + 1)}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} currentProfileId={currentProfile?.id || ""} />
          ))}
        </div>

        {profiles.length === 0 && (
          <div className="text-center py-16">
            <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">
              No matches in your area yet. Check back soon!
            </p>
          </div>
        )}
      </main>

      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Profile</DialogTitle>
            <DialogDescription>
              Update your profile information to continue
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center">
              <Avatar className="w-24 h-24">
                <AvatarImage src={currentProfile?.photo_url || ""} />
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                  {profileForm.name.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-photo">Profile Photo</Label>
              <Input
                id="profile-photo"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setProfileForm({ ...profileForm, photo: e.target.files?.[0] || null })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-name">Name *</Label>
              <Input
                id="profile-name"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                value={profileForm.email}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-mobile">Mobile Number *</Label>
              <Input
                id="profile-mobile"
                value={profileForm.mobile_number}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, mobile_number: e.target.value })
                }
                placeholder="Enter your mobile number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-gender">Gender *</Label>
              <select
                id="profile-gender"
                value={profileForm.gender}
                onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value as "man" | "woman" })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="man">Man</option>
                <option value="woman">Woman</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-location">Location *</Label>
              <Input
                id="profile-location"
                value={profileForm.location}
                onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                placeholder="City, State or Country"
              />
            </div>
            <Button onClick={updateProfile} className="w-full">
              Update Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
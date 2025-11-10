import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, LogOut } from "lucide-react";
import { toast } from "sonner";
import PhotoUpload from "@/components/PhotoUpload";
import PhotoGallery from "@/components/PhotoGallery";
import MobileNav from "@/components/MobileNav";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useMessageNotifications } from "@/hooks/useMessageNotifications";

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

const Profile = () => {
  const navigate = useNavigate();
  const { isAdmin } = useIsAdmin();
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [photoRefresh, setPhotoRefresh] = useState(0);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    mobile_number: "",
    gender: "man" as "man" | "woman",
    location: "",
    photo: null as File | null,
  });
  const [saving, setSaving] = useState(false);
  const { unreadCount } = useMessageNotifications(currentProfile?.id || null);

  useEffect(() => {
    checkAuth();
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
      setProfileForm({
        name: profile.name || "",
        email: profile.email || session.user.email || "",
        mobile_number: profile.mobile_number || "",
        gender: (profile.gender || "man") as "man" | "woman",
        location: profile.location || "",
        photo: null,
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentProfile || !profileForm.name || !profileForm.mobile_number || !profileForm.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
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
      checkAuth();
      setPhotoRefresh((prev) => prev + 1);
    } catch (error: any) {
      toast.error(error.message || "Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background pb-20 md:pb-0">
      <header className="bg-card border-b border-border shadow-soft sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="md:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl md:text-2xl font-bold text-card-foreground">My Profile</h1>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="space-y-4">
            <div className="bg-card rounded-lg p-6 shadow-soft">
              <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
              <form onSubmit={updateProfile} className="space-y-4">
                <div className="flex justify-center mb-4">
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
                    required
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
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-gender">Gender *</Label>
                  <select
                    id="profile-gender"
                    value={profileForm.gender}
                    onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value as "man" | "woman" })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
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
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Changing location will update your matches
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </div>
          </div>

          <div className="space-y-4">
            {currentProfile && (
              <>
                <PhotoUpload
                  profileId={currentProfile.id}
                  onPhotoUploaded={() => setPhotoRefresh((prev) => prev + 1)}
                />
                <PhotoGallery profileId={currentProfile.id} refresh={photoRefresh} />
              </>
            )}
          </div>
        </div>
      </main>

      <MobileNav isAdmin={isAdmin} unreadCount={unreadCount} />
    </div>
  );
};

export default Profile;

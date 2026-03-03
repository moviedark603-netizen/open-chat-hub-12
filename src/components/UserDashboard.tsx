import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Clock, Wifi } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import OnlineStatusBadge from "./OnlineStatusBadge";

interface DashboardProfile {
  id: string;
  name: string;
  photo_url: string | null;
  location: string | null;
  created_at: string | null;
  last_seen_at: string | null;
}

interface UserDashboardProps {
  currentProfileId: string | null;
  onlineUserIds: string[];
}

const UserDashboard = ({ currentProfileId, onlineUserIds }: UserDashboardProps) => {
  const navigate = useNavigate();
  const [recentUsers, setRecentUsers] = useState<DashboardProfile[]>([]);
  const [recentLogin, setRecentLogin] = useState<DashboardProfile[]>([]);
  const [onlineProfiles, setOnlineProfiles] = useState<DashboardProfile[]>([]);

  useEffect(() => {
    fetchRecentUsers();
    fetchRecentLogin();
  }, [currentProfileId]);

  useEffect(() => {
    if (onlineUserIds.length > 0) {
      fetchOnlineProfiles();
    } else {
      setOnlineProfiles([]);
    }
  }, [onlineUserIds.join(",")]);

  // Update last_seen_at for current user
  useEffect(() => {
    if (!currentProfileId) return;
    supabase
      .from("profiles")
      .update({ last_seen_at: new Date().toISOString() })
      .eq("id", currentProfileId)
      .then();
  }, [currentProfileId]);

  const fetchRecentUsers = async () => {
    let query = supabase
      .from("profiles")
      .select("id, name, photo_url, location, created_at, last_seen_at")
      .order("created_at", { ascending: false })
      .limit(12);

    if (currentProfileId) query = query.neq("id", currentProfileId);

    const { data } = await query;
    if (data) setRecentUsers(data);
  };

  const fetchRecentLogin = async () => {
    let query = supabase
      .from("profiles")
      .select("id, name, photo_url, location, created_at, last_seen_at")
      .not("last_seen_at", "is", null)
      .order("last_seen_at", { ascending: false })
      .limit(12);

    if (currentProfileId) query = query.neq("id", currentProfileId);

    const { data } = await query;
    if (data) setRecentLogin(data);
  };

  const fetchOnlineProfiles = async () => {
    if (onlineUserIds.length === 0) return;
    const { data } = await supabase
      .from("profiles")
      .select("id, name, photo_url, location, created_at, last_seen_at")
      .in("id", onlineUserIds);

    if (data) setOnlineProfiles(data);
  };

  const handleClick = (profileId: string) => {
    if (currentProfileId) {
      navigate(`/messages/${profileId}`);
    } else {
      navigate("/auth");
    }
  };

  const ProfileAvatar = ({ profile, index, showOnline = false }: { profile: DashboardProfile; index: number; showOnline?: boolean }) => (
    <div
      onClick={() => handleClick(profile.id)}
      className="group flex flex-col items-center gap-1.5 min-w-[80px] p-2 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:bg-primary/5 animate-scale-in opacity-0"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: "forwards" }}
    >
      <div className="relative">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary/40 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
        <Avatar className="relative w-14 h-14 ring-2 ring-primary/20 group-hover:ring-primary/60 transition-all duration-300 group-hover:scale-110">
          <AvatarImage src={profile.photo_url || ""} className="object-cover" />
          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-base font-bold">
            {profile.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {showOnline && (
          <div className="absolute -bottom-0.5 -right-0.5">
            <OnlineStatusBadge isOnline={true} size="md" />
          </div>
        )}
      </div>
      <span className="text-xs font-medium truncate w-full text-center group-hover:text-primary transition-colors">
        {profile.name}
      </span>
    </div>
  );

  const duplicatedOnline = [...onlineProfiles, ...onlineProfiles];

  return (
    <div className="space-y-4">
      {/* Online Users - Scrolling with images */}
      {onlineProfiles.length > 0 && (
        <Card className="overflow-hidden border-green-500/20 shadow-lg shadow-green-500/5 animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Wifi className="w-5 h-5 text-green-500 animate-pulse" />
              <h2 className="text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-400 bg-clip-text text-transparent">
                Online Now ({onlineProfiles.length})
              </h2>
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-1 animate-marquee whitespace-nowrap">
                {duplicatedOnline.map((profile, index) => (
                  <ProfileAvatar key={`online-${profile.id}-${index}`} profile={profile} index={0} showOnline />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recently Joined */}
      {recentUsers.length > 0 && (
        <Card className="overflow-hidden border-primary/10 shadow-lg animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <UserPlus className="w-5 h-5 text-primary animate-bounce-soft" />
              <h2 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Recently Joined
              </h2>
            </div>
            <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
              {recentUsers.map((profile, index) => (
                <ProfileAvatar key={`recent-${profile.id}`} profile={profile} index={index} showOnline={onlineUserIds.includes(profile.id)} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recently Logged In */}
      {recentLogin.length > 0 && (
        <Card className="overflow-hidden border-accent/10 shadow-lg animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-accent animate-pulse" />
              <h2 className="text-lg font-semibold bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">
                Recently Active
              </h2>
            </div>
            <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
              {recentLogin.map((profile, index) => (
                <ProfileAvatar key={`login-${profile.id}`} profile={profile} index={index} showOnline={onlineUserIds.includes(profile.id)} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserDashboard;

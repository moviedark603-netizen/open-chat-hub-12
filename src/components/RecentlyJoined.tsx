import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, MapPin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

interface Profile {
  id: string;
  name: string;
  photo_url: string | null;
  location: string;
  created_at: string;
  gender: string;
}

interface RecentlyJoinedProps {
  currentProfileId: string;
}

const RecentlyJoined = ({ currentProfileId }: RecentlyJoinedProps) => {
  const navigate = useNavigate();
  const [recentProfiles, setRecentProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    if (!currentProfileId) return;
    
    fetchRecentlyJoined();

    const channel = supabase
      .channel('new-profiles')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'profiles',
        },
        () => {
          fetchRecentlyJoined();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentProfileId]);

  const fetchRecentlyJoined = async () => {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .neq("id", currentProfileId)
      .order("created_at", { ascending: false })
      .limit(6);

    if (profiles) {
      setRecentProfiles(profiles);
    }
  };

  if (recentProfiles.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Recently Joined</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {recentProfiles.map((profile) => (
            <div
              key={profile.id}
              onClick={() => navigate(`/messages/${profile.id}`)}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted cursor-pointer transition-all hover:scale-105"
            >
              <Avatar className="w-16 h-16 ring-2 ring-primary/20">
                <AvatarImage src={profile.photo_url || ""} />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {profile.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center w-full">
                <h3 className="font-semibold text-sm truncate">{profile.name}</h3>
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{profile.location || "Unknown"}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentlyJoined;

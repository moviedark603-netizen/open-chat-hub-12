import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Users } from "lucide-react";
import OnlineStatusBadge from "./OnlineStatusBadge";

interface Profile {
  id: string;
  name: string;
}

interface ScrollingNamesProps {
  onlineUserIds?: string[];
}

const ScrollingNames = ({ onlineUserIds = [] }: ScrollingNamesProps) => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    fetchRecentProfiles();
  }, []);

  const fetchRecentProfiles = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      setProfiles(data);
    }
  };

  // Filter to show only online users
  const onlineProfiles = profiles.filter(profile => onlineUserIds.includes(profile.id));

  if (onlineProfiles.length === 0) return null;

  // Duplicate for seamless infinite scroll
  const duplicatedProfiles = [...onlineProfiles, ...onlineProfiles];

  return (
    <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-y border-border py-2 overflow-hidden">
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0 flex items-center gap-1.5 px-3 bg-green-500/20 py-1 rounded-r-full">
          <Users className="w-4 h-4 text-green-500" />
          <span className="text-xs font-medium text-green-500 whitespace-nowrap">Online Now:</span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-4">
            {duplicatedProfiles.map((profile, index) => (
              <button
                key={`${profile.id}-${index}`}
                onClick={() => navigate(`/profile/${profile.id}`)}
                className="inline-flex items-center gap-1.5 text-sm text-foreground/80 hover:text-primary transition-colors cursor-pointer hover:underline"
              >
                <OnlineStatusBadge isOnline={onlineUserIds.includes(profile.id)} size="sm" />
                {profile.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollingNames;

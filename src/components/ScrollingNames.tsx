import { useState, useEffect } from "react";
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

  if (profiles.length === 0) return null;

  // Duplicate for seamless infinite scroll
  const duplicatedProfiles = [...profiles, ...profiles];

  return (
    <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-y border-border py-2 overflow-hidden">
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0 flex items-center gap-1.5 px-3 bg-primary/20 py-1 rounded-r-full">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary whitespace-nowrap">Recently Joined:</span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-4">
            {duplicatedProfiles.map((profile, index) => (
              <span
                key={`${profile.id}-${index}`}
                className="inline-flex items-center gap-1.5 text-sm text-foreground/80"
              >
                <OnlineStatusBadge isOnline={onlineUserIds.includes(profile.id)} size="sm" />
                {profile.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollingNames;

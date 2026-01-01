import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, MapPin, Search, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import OnlineStatusBadge from "./OnlineStatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Profile {
  id: string;
  name: string;
  photo_url: string | null;
  location: string;
  created_at: string;
  gender: string;
}

interface RecentlyJoinedProps {
  currentProfileId: string | null;
  onlineUserIds?: string[];
}

const RecentlyJoined = ({ currentProfileId, onlineUserIds = [] }: RecentlyJoinedProps) => {
  const navigate = useNavigate();
  const [recentProfiles, setRecentProfiles] = useState<Profile[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
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

  const fetchRecentlyJoined = async (query?: string, gender?: string) => {
    setIsSearching(true);
    let supabaseQuery = supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (currentProfileId) {
      supabaseQuery = supabaseQuery.neq("id", currentProfileId);
    }

    if (query && query.trim()) {
      supabaseQuery = supabaseQuery.ilike("name", `%${query.trim()}%`);
    }

    if (gender && gender !== "all") {
      supabaseQuery = supabaseQuery.eq("gender", gender);
    }

    const { data: profiles } = await supabaseQuery;

    if (profiles) {
      setRecentProfiles(profiles);
    }
    setIsSearching(false);
  };

  const handleSearch = () => {
    fetchRecentlyJoined(searchQuery, genderFilter);
    if (searchQuery.trim() || genderFilter !== "all") {
      setShowAll(true);
    }
  };

  const handleGenderChange = (value: string) => {
    setGenderFilter(value);
    fetchRecentlyJoined(searchQuery, value);
    if (value !== "all") {
      setShowAll(true);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setGenderFilter("all");
    fetchRecentlyJoined();
    setShowAll(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (recentProfiles.length === 0 && !searchQuery) {
    return null;
  }

  const displayedProfiles = showAll ? recentProfiles : recentProfiles.slice(0, 6);

  return (
    <Card className="overflow-hidden animate-fade-in">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary animate-bounce-soft" />
            <h2 className="text-lg font-semibold">Recently Joined</h2>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={genderFilter} onValueChange={handleGenderChange}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="man">Male</SelectItem>
                <SelectItem value="woman">Female</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search by name..."
                className="pl-9 pr-8 w-full sm:w-48"
              />
              {searchQuery && (
                <button
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button onClick={handleSearch} size="sm" disabled={isSearching}>
              {isSearching ? "..." : "Search"}
            </Button>
          </div>
        </div>

        {recentProfiles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No profiles found for "{searchQuery}"
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {displayedProfiles.map((profile, index) => (
                <div
                  key={profile.id}
                  onClick={() => currentProfileId ? navigate(`/messages/${profile.id}`) : navigate("/auth")}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted cursor-pointer transition-all hover-scale animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="relative">
                    <Avatar className="w-16 h-16 ring-2 ring-primary/20 hover:ring-primary/50 transition-all">
                      <AvatarImage src={profile.photo_url || ""} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                        {profile.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5">
                      <OnlineStatusBadge isOnline={onlineUserIds.includes(profile.id)} size="md" />
                    </div>
                  </div>
                  <div className="text-center w-full">
                    <div className="flex items-center justify-center gap-1">
                      <h3 className="font-semibold text-sm truncate">{profile.name}</h3>
                    </div>
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
            
            {recentProfiles.length > 6 && (
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                  className="text-primary hover:text-primary/80"
                >
                  {showAll ? "Show Less" : `View All (${recentProfiles.length})`}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentlyJoined;

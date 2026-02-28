import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, MapPin, AtSign } from "lucide-react";
import ConnectionActions from "./ConnectionActions";
import SendGiftPoints from "./SendGiftPoints";
import { useSignedUrl } from "@/hooks/useSignedUrl";

interface ProfileCardProps {
  profile: {
    id: string;
    name: string;
    email: string;
    mobile_number: string;
    photo_url: string | null;
    gender: string;
    location: string;
    username?: string | null;
  };
  currentProfileId: string;
}

const ProfileCard = ({ profile, currentProfileId }: ProfileCardProps) => {
  const navigate = useNavigate();
  const resolvedPhotoUrl = useSignedUrl(profile.photo_url);

  return (
    <Card className="group overflow-hidden border-border card-3d magnetic-hover spotlight enter-blur" style={{ animationFillMode: 'forwards' }}>
      <CardContent className="p-0 card-3d-inner">
        {/* Profile Image */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 group-hover:glow-sm transition-shadow duration-500">
          {resolvedPhotoUrl ? (
            <img 
              src={resolvedPhotoUrl} 
              alt={profile.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="bg-gradient-to-br from-primary to-accent rounded-full w-24 h-24 flex items-center justify-center glow-md animate-pulse-soft">
                <span className="text-4xl font-bold text-primary-foreground">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="text-xs capitalize backdrop-blur-md bg-card/80 glass-animated border-white/20">
              {profile.gender}
            </Badge>
          </div>
          {/* Hover overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Profile Info */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-bold text-lg text-card-foreground mb-1 truncate group-hover:text-primary transition-colors duration-300">
              {profile.name}
            </h3>
            {profile.username && (
              <button 
                onClick={() => navigate(`/@${profile.username}`)}
                className="flex items-center gap-1 text-sm text-primary hover:text-accent transition-colors mb-1 group-hover:translate-x-1 transition-transform duration-300"
              >
                <AtSign className="w-3.5 h-3.5" />
                <span className="truncate">{profile.username}</span>
              </button>
            )}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-primary animate-bounce-soft" />
              <span className="truncate">{profile.location}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2">
            <ConnectionActions profileId={profile.id} currentProfileId={currentProfileId} />
            <div className="flex gap-2">
              <Button
                onClick={() => navigate(`/messages/${profile.id}`)}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 btn-ripple glow-sm hover:glow-md transition-all duration-300"
                size="sm"
              >
                <MessageSquare className="w-4 h-4 mr-2 group-hover:animate-wiggle" />
                Message
              </Button>
              <SendGiftPoints
                currentProfileId={currentProfileId}
                receiverProfileId={profile.id}
                receiverName={profile.name}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
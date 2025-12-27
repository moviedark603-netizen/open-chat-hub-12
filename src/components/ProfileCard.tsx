import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, MapPin } from "lucide-react";
import ConnectionActions from "./ConnectionActions";

interface ProfileCardProps {
  profile: {
    id: string;
    name: string;
    email: string;
    mobile_number: string;
    photo_url: string | null;
    gender: string;
    location: string;
  };
  currentProfileId: string;
}

const ProfileCard = ({ profile, currentProfileId }: ProfileCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="group overflow-hidden card-hover border-border animate-scale-in opacity-0" style={{ animationFillMode: 'forwards' }}>
      <CardContent className="p-0">
        {/* Profile Image */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
          {profile.photo_url ? (
            <img 
              src={profile.photo_url} 
              alt={profile.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="bg-gradient-to-br from-primary to-accent rounded-full w-24 h-24 flex items-center justify-center">
                <span className="text-4xl font-bold text-primary-foreground">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="text-xs capitalize backdrop-blur-sm bg-card/90">
              {profile.gender}
            </Badge>
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-bold text-lg text-card-foreground mb-1 truncate">
              {profile.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-primary" />
              <span className="truncate">{profile.location}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2">
            <ConnectionActions profileId={profile.id} currentProfileId={currentProfileId} />
            <Button
              onClick={() => navigate(`/messages/${profile.id}`)}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 hover-glow transition-all"
              size="sm"
            >
              <MessageSquare className="w-4 h-4 mr-2 group-hover:animate-wiggle" />
              Send Message
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
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
    <Card className="overflow-hidden hover:shadow-medium transition-shadow">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
          <Avatar className="w-12 h-12 md:w-16 md:h-16 shrink-0">
            <AvatarImage src={profile.photo_url || ""} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg md:text-xl">
              {profile.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 md:mb-2">
              <h3 className="font-semibold text-base md:text-lg text-card-foreground truncate">{profile.name}</h3>
              <Badge variant="secondary" className="text-xs capitalize shrink-0">
                {profile.gender}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{profile.location}</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <ConnectionActions profileId={profile.id} currentProfileId={currentProfileId} />
          <Button
            onClick={() => navigate(`/messages/${profile.id}`)}
            className="w-full"
            size="sm"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
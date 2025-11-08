import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Phone, Mail } from "lucide-react";

interface ProfileCardProps {
  profile: {
    id: string;
    name: string;
    email: string;
    mobile_number: string;
    photo_url: string | null;
  };
}

const ProfileCard = ({ profile }: ProfileCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden hover:shadow-medium transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={profile.photo_url || ""} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {profile.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-card-foreground">{profile.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <Mail className="w-3 h-3" />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <Phone className="w-3 h-3" />
              <span>{profile.mobile_number}</span>
            </div>
          </div>
        </div>
        <Button
          onClick={() => navigate(`/messages/${profile.id}`)}
          className="w-full"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Send Message
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
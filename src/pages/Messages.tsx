import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const messageSchema = z.object({
  content: z.string().trim().min(1, "Message cannot be empty").max(1000, "Message too long"),
});

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
}

interface Profile {
  id: string;
  name: string;
  photo_url: string | null;
}

const Messages = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [otherProfile, setOtherProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profile) {
        setCurrentProfile(profile);
      }

      const { data: otherProfileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profileId)
        .single();

      if (otherProfileData) {
        setOtherProfile(otherProfileData);
      }
    };

    fetchProfiles();
    fetchMessages();

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profileId, navigate]);

  const fetchMessages = async () => {
    if (!profileId) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!profile) return;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${profile.id},receiver_id.eq.${profileId}),and(sender_id.eq.${profileId},receiver_id.eq.${profile.id})`)
      .order("created_at", { ascending: true });

    if (error) {
      toast.error("Error loading messages");
      return;
    }

    setMessages(data || []);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = messageSchema.parse({ content: newMessage });
      
      if (!currentProfile || !profileId) return;

      setLoading(true);

      const { error } = await supabase.from("messages").insert({
        sender_id: currentProfile.id,
        receiver_id: profileId,
        content: validated.content,
      });

      if (error) throw error;

      setNewMessage("");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Error sending message");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="bg-card border-b border-border p-4 flex items-center gap-3 shadow-soft">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Avatar className="w-10 h-10">
          <AvatarImage src={otherProfile?.photo_url || ""} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {otherProfile?.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold text-card-foreground">{otherProfile?.name}</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isSent = message.sender_id === currentProfile?.id;
          return (
            <div
              key={message.id}
              className={`flex ${isSent ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${
                  isSent
                    ? "bg-message-sent text-message-sent-foreground rounded-tr-sm"
                    : "bg-message-received text-message-received-foreground rounded-tl-sm"
                } shadow-soft`}
              >
                <p className="break-words">{message.content}</p>
                <p className={`text-xs mt-1 ${isSent ? "text-message-sent-foreground/70" : "text-message-received-foreground/70"}`}>
                  {new Date(message.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={sendMessage} className="bg-card border-t border-border p-4">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={loading || !newMessage.trim()}>
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Messages;
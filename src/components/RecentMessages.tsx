import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Conversation {
  profileId: string;
  profileName: string;
  profilePhoto: string | null;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface RecentMessagesProps {
  currentProfileId: string;
}

const RecentMessages = ({ currentProfileId }: RecentMessagesProps) => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (!currentProfileId) return;
    
    fetchConversations();

    const channel = supabase
      .channel('recent-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentProfileId]);

  const fetchConversations = async () => {
    // Fetch all messages where current user is sender or receiver
    const { data: messages } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${currentProfileId},receiver_id.eq.${currentProfileId}`)
      .order("created_at", { ascending: false });

    if (!messages || messages.length === 0) {
      setConversations([]);
      return;
    }

    // Group by conversation partner
    const conversationsMap = new Map<string, Conversation>();

    for (const message of messages) {
      const otherProfileId = message.sender_id === currentProfileId 
        ? message.receiver_id 
        : message.sender_id;

      if (!conversationsMap.has(otherProfileId)) {
        // Fetch profile info
        const { data: profile } = await supabase
          .from("profiles")
          .select("name, photo_url")
          .eq("id", otherProfileId)
          .single();

        if (profile) {
          conversationsMap.set(otherProfileId, {
            profileId: otherProfileId,
            profileName: profile.name,
            profilePhoto: profile.photo_url,
            lastMessage: message.content,
            lastMessageTime: message.created_at,
            unreadCount: 0,
          });
        }
      }
    }

    setConversations(Array.from(conversationsMap.values()));
  };

  if (conversations.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">No messages yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Start a conversation with someone below
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Messages</h2>
        <div className="space-y-2">
          {conversations.map((conv) => (
            <div
              key={conv.profileId}
              onClick={() => navigate(`/messages/${conv.profileId}`)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
            >
              <Avatar className="w-12 h-12 shrink-0">
                <AvatarImage src={conv.profilePhoto || ""} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {conv.profileName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{conv.profileName}</h3>
                <p className="text-xs text-muted-foreground truncate">
                  {conv.lastMessage.substring(0, 50)}
                  {conv.lastMessage.length > 50 ? "..." : ""}
                </p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                {formatDistanceToNow(new Date(conv.lastMessageTime), { addSuffix: true })}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentMessages;

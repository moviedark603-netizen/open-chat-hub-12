import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import AudioRecorder from "@/components/AudioRecorder";
import MessageItem from "@/components/MessageItem";
import { useMessageNotifications } from "@/hooks/useMessageNotifications";

const messageSchema = z.object({
  content: z.string().trim().max(1000, "Message too long"),
});

interface Message {
  id: string;
  content: string;
  message_type: string;
  media_url: string | null;
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
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { resetUnreadCount } = useMessageNotifications(currentProfile?.id || null);

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
    resetUnreadCount(); // Clear notifications when viewing messages

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        message_type: "text",
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentProfile || !profileId) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    try {
      setUploading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("photos")
        .getPublicUrl(fileName);

      const { error } = await supabase.from("messages").insert({
        sender_id: currentProfile.id,
        receiver_id: profileId,
        content: "",
        message_type: "image",
        media_url: publicUrl,
      });

      if (error) throw error;

      toast.success("Image sent!");
    } catch (error: any) {
      toast.error(error.message || "Error uploading image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAudioRecorded = async (audioBlob: Blob) => {
    if (!currentProfile || !profileId) return;

    try {
      setUploading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileName = `${user.id}/${Date.now()}.webm`;

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(fileName, audioBlob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("photos")
        .getPublicUrl(fileName);

      const { error } = await supabase.from("messages").insert({
        sender_id: currentProfile.id,
        receiver_id: profileId,
        content: "",
        message_type: "audio",
        media_url: publicUrl,
      });

      if (error) throw error;

      toast.success("Voice message sent!");
    } catch (error: any) {
      toast.error(error.message || "Error sending audio");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="bg-card border-b border-border p-3 md:p-4 flex items-center gap-3 shadow-soft sticky top-0 z-40">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Avatar className="w-9 h-9 md:w-10 md:h-10 shrink-0">
          <AvatarImage src={otherProfile?.photo_url || ""} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {otherProfile?.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-card-foreground truncate">{otherProfile?.name}</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
        {messages.map((message) => {
          const isSent = message.sender_id === currentProfile?.id;
          return (
            <MessageItem 
              key={message.id} 
              message={message} 
              isSent={isSent}
              senderName={otherProfile?.name}
              senderPhoto={otherProfile?.photo_url}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="bg-card border-t border-border p-3 md:p-4">
        <div className="flex gap-2 items-end">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="shrink-0"
          >
            <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
          <AudioRecorder onAudioRecorded={handleAudioRecorded} />
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 min-w-0"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={loading || !newMessage.trim()}
            className="shrink-0"
          >
            <Send className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Messages;
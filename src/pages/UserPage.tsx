import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MapPin, Send, MessageSquare, Crown } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import MobileNav from "@/components/MobileNav";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useMessageNotifications } from "@/hooks/useMessageNotifications";
import logo from "@/assets/logo.jpg";

interface Profile {
  id: string;
  name: string;
  username: string | null;
  photo_url: string | null;
  gender: string;
  location: string;
  is_premium: boolean;
}

interface Post {
  id: string;
  content: string;
  created_at: string;
  post_type: string;
  media_url: string | null;
}

const UserPage = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useIsAdmin();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { unreadCount } = useMessageNotifications(currentProfile?.id || null);

  useEffect(() => {
    if (username) {
      fetchUserByUsername();
      checkAuth();
    }
  }, [username]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data } = await supabase
        .from("profiles")
        .select("id, name, username, photo_url, gender, location, is_premium")
        .eq("user_id", session.user.id)
        .single();
      if (data) setCurrentProfile(data);
    }
  };

  const fetchUserByUsername = async () => {
    setLoading(true);
    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("id, name, username, photo_url, gender, location, is_premium")
      .eq("username", username)
      .single();

    if (error || !profileData) {
      toast.error("User not found");
      navigate("/");
      return;
    }

    setProfile(profileData);

    // Fetch user's posts
    const { data: postsData } = await supabase
      .from("posts")
      .select("*")
      .eq("author_id", profileData.id)
      .order("created_at", { ascending: false });

    if (postsData) setPosts(postsData);
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentProfile || !profile) return;
    
    setSending(true);
    const { error } = await supabase.from("messages").insert({
      sender_id: currentProfile.id,
      receiver_id: profile.id,
      content: newMessage.trim(),
      message_type: "text"
    });

    if (error) {
      toast.error("Failed to send message");
    } else {
      toast.success("Message sent!");
      setNewMessage("");
    }
    setSending(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) return null;

  const isOwnPage = currentProfile?.id === profile.id;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <img src={logo} alt="OTHERS" className="w-8 h-8 rounded-full" />
          <span className="font-semibold text-foreground">@{profile.username}</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Profile Header */}
        <Card className="mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 h-24"></div>
          <CardContent className="pt-0 -mt-12">
            <div className="flex flex-col items-center text-center">
              <Avatar className="w-24 h-24 border-4 border-card shadow-lg">
                <AvatarImage src={profile.photo_url || ""} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {profile.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="mt-3 flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">{profile.name}</h1>
                {profile.is_premium && (
                  <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                )}
              </div>
              <p className="text-muted-foreground">@{profile.username}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
                <Badge variant="secondary">{profile.gender}</Badge>
              </div>
              
              {!isOwnPage && currentProfile && (
                <Button 
                  onClick={() => navigate(`/messages/${profile.id}`)}
                  className="mt-4"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Open Chat
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Message */}
        {!isOwnPage && currentProfile && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Send a message to @{profile.username}</h3>
              <div className="flex gap-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Write your message..."
                  className="flex-1 min-h-[80px]"
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={sending || !newMessage.trim()}
                  size="icon"
                  className="self-end"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Posts by @{profile.username}</h2>
          
          {posts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No posts yet
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/post/${post.id}`)}>
                <CardContent className="p-4">
                  <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
                  {post.media_url && (
                    <div className="mt-3">
                      {post.post_type === "image" && (
                        <img src={post.media_url} alt="" className="rounded-lg max-h-64 object-cover" />
                      )}
                      {post.post_type === "video" && (
                        <video src={post.media_url} controls className="rounded-lg max-h-64 w-full" />
                      )}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-3">
                    {format(new Date(post.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      <MobileNav isAdmin={isAdmin} unreadCount={unreadCount} />
    </div>
  );
};

export default UserPage;
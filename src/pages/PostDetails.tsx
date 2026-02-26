import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, Image as ImageIcon, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import AudioRecorder from "@/components/AudioRecorder";
import { formatDistanceToNow } from "date-fns";
import HomeLogo from "@/components/HomeLogo";

const replySchema = z.object({
  content: z.string().trim().min(1, "Reply cannot be empty").max(1000, "Reply too long"),
});

interface Reply {
  id: string;
  author_id: string;
  content: string;
  reply_type: string;
  media_url: string | null;
  created_at: string;
  author?: {
    name: string;
    photo_url: string | null;
  };
}

interface Post {
  id: string;
  author_id: string;
  content: string;
  post_type: string;
  media_url: string | null;
  created_at: string;
  author?: {
    name: string;
    photo_url: string | null;
  };
}

interface Profile {
  id: string;
  name: string;
  photo_url: string | null;
}

const PostDetails = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState("");
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    checkAuth();
    fetchPost();
    fetchReplies();

    const channel = supabase
      .channel("post-replies")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "post_replies",
          filter: `post_id=eq.${postId}`,
        },
        () => {
          fetchReplies();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  const checkAuth = async () => {
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
  };

  const fetchPost = async () => {
    if (!postId) return;

    const { data: postData } = await supabase
      .from("posts")
      .select("*")
      .eq("id", postId)
      .single();

    if (postData) {
      const { data: author } = await supabase
        .from("profiles")
        .select("name, photo_url")
        .eq("id", postData.author_id)
        .single();

      setPost({ ...postData, author });
    }
  };

  const fetchReplies = async () => {
    if (!postId) return;

    const { data: repliesData } = await supabase
      .from("post_replies")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (repliesData) {
      const repliesWithAuthors = await Promise.all(
        repliesData.map(async (reply) => {
          const { data: author } = await supabase
            .from("profiles")
            .select("name, photo_url")
            .eq("id", reply.author_id)
            .single();

          return { ...reply, author };
        })
      );

      setReplies(repliesWithAuthors);
    }
  };

  const createReply = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validated = replySchema.parse({ content: newReply });

      if (!currentProfile || !postId) return;

      setLoading(true);

      const { error } = await supabase.from("post_replies").insert({
        post_id: postId,
        author_id: currentProfile.id,
        content: validated.content,
        reply_type: "text",
      });

      if (error) throw error;

      setNewReply("");
      toast.success("Reply posted!");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Error posting reply");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentProfile || !postId) return;

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

      const { error } = await supabase.from("post_replies").insert({
        post_id: postId,
        author_id: currentProfile.id,
        content: "",
        reply_type: "image",
        media_url: publicUrl,
      });

      if (error) throw error;

      toast.success("Image reply posted!");
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
    if (!currentProfile || !postId) return;

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

      const { error } = await supabase.from("post_replies").insert({
        post_id: postId,
        author_id: currentProfile.id,
        content: "",
        reply_type: "audio",
        media_url: publicUrl,
      });

      if (error) throw error;

      toast.success("Voice reply posted!");
    } catch (error: any) {
      toast.error(error.message || "Error posting audio");
    } finally {
      setUploading(false);
    }
  };

  const toggleAudio = (replyId: string, audioRef: HTMLAudioElement | null) => {
    if (!audioRef) return;

    if (isPlaying[replyId]) {
      audioRef.pause();
      setIsPlaying({ ...isPlaying, [replyId]: false });
    } else {
      audioRef.play();
      setIsPlaying({ ...isPlaying, [replyId]: true });
    }
  };

  if (!post) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background pb-20 md:pb-8">
      <header className="bg-card border-b border-border shadow-soft sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center gap-3">
          <HomeLogo size="sm" showText={false} />
          <h1 className="text-xl md:text-2xl font-bold text-card-foreground">Post Details</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-8 max-w-2xl">
        {/* Original Post */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <Avatar className="w-10 h-10 shrink-0">
                <AvatarImage src={post.author?.photo_url || ""} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {post.author?.name.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm">{post.author?.name || "Unknown"}</h3>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>

            {post.post_type === "text" && post.content && (
              <p className="text-sm break-words whitespace-pre-wrap">{post.content}</p>
            )}

            {post.post_type === "image" && post.media_url && (
              <div className="space-y-2">
                <img
                  src={post.media_url}
                  alt="Post"
                  className="rounded-lg w-full max-h-96 object-cover"
                />
                {post.content && <p className="text-sm">{post.content}</p>}
              </div>
            )}

            {post.post_type === "audio" && post.media_url && (
              <audio src={post.media_url} controls className="w-full" />
            )}
          </CardContent>
        </Card>

        {/* Replies */}
        <div className="space-y-3 mb-6">
          {replies.map((reply) => (
            <Card key={reply.id}>
              <CardContent className="p-3">
                <div className="flex items-start gap-2 mb-2">
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarImage src={reply.author?.photo_url || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {reply.author?.name.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs">{reply.author?.name || "Unknown"}</h4>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                {reply.reply_type === "text" && reply.content && (
                  <p className="text-sm break-words ml-10">{reply.content}</p>
                )}

                {reply.reply_type === "image" && reply.media_url && (
                  <img
                    src={reply.media_url}
                    alt="Reply"
                    className="rounded-lg max-h-64 object-cover ml-10 cursor-pointer"
                    onClick={() => window.open(reply.media_url!, "_blank")}
                  />
                )}

                {reply.reply_type === "audio" && reply.media_url && (
                  <div className="flex items-center gap-2 ml-10 p-2 bg-secondary rounded-lg">
                    <button
                      onClick={() => {
                        const audio = document.getElementById(`audio-${reply.id}`) as HTMLAudioElement;
                        toggleAudio(reply.id, audio);
                      }}
                      className="p-1 rounded-full hover:bg-background transition"
                    >
                      <Volume2 className={`w-4 h-4 ${isPlaying[reply.id] ? "animate-pulse text-primary" : ""}`} />
                    </button>
                    <span className="text-xs">Voice Note</span>
                    <audio
                      id={`audio-${reply.id}`}
                      src={reply.media_url}
                      onEnded={() => setIsPlaying({ ...isPlaying, [reply.id]: false })}
                      className="hidden"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reply Form */}
        <Card className="sticky bottom-0">
          <CardContent className="p-3">
            <form onSubmit={createReply}>
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
                  <ImageIcon className="w-4 h-4" />
                </Button>
                <AudioRecorder onAudioRecorded={handleAudioRecorded} />
                <Input
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 min-w-0"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={loading || !newReply.trim()}
                  className="shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PostDetails;

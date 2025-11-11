import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, Image as ImageIcon, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import AudioRecorder from "@/components/AudioRecorder";
import PostItem from "@/components/PostItem";
import { formatDistanceToNow } from "date-fns";

const postSchema = z.object({
  content: z.string().trim().min(1, "Post cannot be empty").max(2000, "Post too long"),
});

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
  reply_count?: number;
}

interface Profile {
  id: string;
  name: string;
  photo_url: string | null;
}

const Community = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkAuth();
    fetchPosts();

    const channel = supabase
      .channel("community-posts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "posts",
        },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

  const fetchPosts = async () => {
    const { data: postsData } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (postsData) {
      // Fetch author details for each post
      const postsWithAuthors = await Promise.all(
        postsData.map(async (post) => {
          const { data: author } = await supabase
            .from("profiles")
            .select("name, photo_url")
            .eq("id", post.author_id)
            .single();

          // Get reply count
          const { count } = await supabase
            .from("post_replies")
            .select("*", { count: "exact", head: true })
            .eq("post_id", post.id);

          return {
            ...post,
            author,
            reply_count: count || 0,
          };
        })
      );

      setPosts(postsWithAuthors);
    }
  };

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validated = postSchema.parse({ content: newPost });

      if (!currentProfile) return;

      setLoading(true);

      const { error } = await supabase.from("posts").insert({
        author_id: currentProfile.id,
        content: validated.content,
        post_type: "text",
      });

      if (error) throw error;

      setNewPost("");
      toast.success("Post created!");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Error creating post");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentProfile) return;

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

      const { error } = await supabase.from("posts").insert({
        author_id: currentProfile.id,
        content: newPost || "",
        post_type: "image",
        media_url: publicUrl,
      });

      if (error) throw error;

      setNewPost("");
      toast.success("Image posted!");
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
    if (!currentProfile) return;

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

      const { error } = await supabase.from("posts").insert({
        author_id: currentProfile.id,
        content: "",
        post_type: "audio",
        media_url: publicUrl,
      });

      if (error) throw error;

      toast.success("Voice note posted!");
    } catch (error: any) {
      toast.error(error.message || "Error posting audio");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background pb-20 md:pb-8">
      <header className="bg-card border-b border-border shadow-soft sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            <h1 className="text-xl md:text-2xl font-bold text-card-foreground">Community Feed</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-8 max-w-2xl">
        {/* Create Post Card */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <Avatar className="w-10 h-10 shrink-0">
                <AvatarImage src={currentProfile?.photo_url || ""} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {currentProfile?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{currentProfile?.name}</h3>
                <p className="text-xs text-muted-foreground">Share with the community</p>
              </div>
            </div>
            <form onSubmit={createPost}>
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
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="What's on your mind?"
                  className="flex-1 min-w-0"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={loading || !newPost.trim()}
                  className="shrink-0"
                >
                  <Send className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.map((post) => (
            <PostItem key={post.id} post={post} currentProfileId={currentProfile?.id || ""} />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">
              No posts yet. Be the first to share!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Community;

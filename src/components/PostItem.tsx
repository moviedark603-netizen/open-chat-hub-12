import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Volume2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PostItemProps {
  post: {
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
  };
  currentProfileId: string;
}

const PostItem = ({ post, currentProfileId }: PostItemProps) => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
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

        {/* Post Content */}
        <div className="mb-3">
          {post.post_type === "text" && post.content && (
            <p className="text-sm break-words whitespace-pre-wrap">{post.content}</p>
          )}

          {post.post_type === "image" && post.media_url && (
            <div className="space-y-2">
              <img
                src={post.media_url}
                alt="Post"
                className="rounded-lg w-full max-h-96 object-cover cursor-pointer"
                onClick={() => window.open(post.media_url!, "_blank")}
              />
              {post.content && (
                <p className="text-sm break-words">{post.content}</p>
              )}
            </div>
          )}

          {post.post_type === "audio" && post.media_url && (
            <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
              <button
                onClick={playAudio}
                className="p-2 rounded-full hover:bg-background transition"
              >
                <Volume2 className={`w-5 h-5 ${isPlaying ? "animate-pulse text-primary" : ""}`} />
              </button>
              <span className="text-sm font-medium">Voice Note</span>
              <audio
                ref={audioRef}
                src={post.media_url}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            </div>
          )}

          {post.post_type === "video" && post.media_url && (
            <div className="space-y-2">
              <video
                src={post.media_url}
                controls
                className="rounded-lg w-full max-h-96 object-contain bg-muted"
                preload="metadata"
              />
              {post.content && (
                <p className="text-sm break-words">{post.content}</p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => navigate(`/post/${post.id}`)}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-xs">
              {post.reply_count || 0} {post.reply_count === 1 ? "Reply" : "Replies"}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostItem;

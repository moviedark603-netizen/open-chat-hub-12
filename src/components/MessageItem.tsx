import { Image as ImageIcon, Volume2 } from "lucide-react";
import { useState, useRef } from "react";

interface MessageItemProps {
  message: {
    id: string;
    content: string;
    message_type: string;
    media_url: string | null;
    created_at: string;
    sender_id: string;
  };
  isSent: boolean;
}

const MessageItem = ({ message, isSent }: MessageItemProps) => {
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
    <div className={`flex ${isSent ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${
          isSent
            ? "bg-message-sent text-message-sent-foreground rounded-tr-sm"
            : "bg-message-received text-message-received-foreground rounded-tl-sm"
        } shadow-soft`}
      >
        {message.message_type === "text" && (
          <p className="break-words">{message.content}</p>
        )}

        {message.message_type === "image" && message.media_url && (
          <div className="space-y-2">
            <img
              src={message.media_url}
              alt="Shared"
              className="rounded-lg max-h-64 w-full object-cover cursor-pointer"
              onClick={() => window.open(message.media_url!, "_blank")}
            />
            {message.content && (
              <p className="break-words text-sm">{message.content}</p>
            )}
          </div>
        )}

        {message.message_type === "audio" && message.media_url && (
          <div className="flex items-center gap-2">
            <button
              onClick={playAudio}
              className="p-2 rounded-full hover:bg-white/10 transition"
            >
              <Volume2 className={`w-5 h-5 ${isPlaying ? "animate-pulse" : ""}`} />
            </button>
            <span className="text-sm">Voice message</span>
            <audio
              ref={audioRef}
              src={message.media_url}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          </div>
        )}

        <p
          className={`text-xs mt-1 ${
            isSent
              ? "text-message-sent-foreground/70"
              : "text-message-received-foreground/70"
          }`}
        >
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
};

export default MessageItem;
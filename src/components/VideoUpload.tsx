import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { makeStoragePath } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Video, X, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoUploadProps {
  onVideoUploaded: (url: string) => void;
  maxSizeMB?: number;
}

const VideoUpload = ({ onVideoUploaded, maxSizeMB = 10 }: VideoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      toast({
        title: "Invalid file type",
        description: "Please select a video file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast({
        title: "File too large",
        description: `Video must be less than ${maxSizeMB}MB.`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Not authenticated",
          description: "Please sign in to upload videos.",
          variant: "destructive",
        });
        return;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("videos")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const storagePath = makeStoragePath("videos", fileName);

      setPreviewUrl(storagePath);
      onVideoUploaded(storagePath);

      toast({
        title: "Video uploaded",
        description: "Your video has been uploaded successfully.",
      });
    } catch (error: any) {
      console.error("Video upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload video.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onVideoUploaded("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {previewUrl ? (
        <div className="relative rounded-lg overflow-hidden border border-border">
          <video
            src={previewUrl}
            controls
            className="w-full max-h-64 object-contain bg-muted"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full h-24 border-dashed flex flex-col gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Uploading...</span>
            </>
          ) : (
            <>
              <Video className="w-6 h-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Upload video (max {maxSizeMB}MB)
              </span>
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default VideoUpload;

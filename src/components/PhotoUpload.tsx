import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { makeStoragePath } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";

interface PhotoUploadProps {
  profileId: string;
  onPhotoUploaded: () => void;
}

const PhotoUpload = ({ profileId, onPhotoUploaded }: PhotoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    try {
      setUploading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const storagePath = makeStoragePath("photos", fileName);

      const { error: dbError } = await supabase.from("photos").insert({
        profile_id: profileId,
        photo_url: storagePath,
        is_public: isPublic,
      });

      if (dbError) throw dbError;

      toast.success("Photo uploaded successfully!");
      setFile(null);
      onPhotoUploaded();
    } catch (error: any) {
      toast.error(error.message || "Error uploading photo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Photo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="photo">Select Photo</Label>
          <Input
            id="photo"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="public" className="cursor-pointer">
            Make photo public
          </Label>
          <Switch
            id="public"
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
        </div>
        <Button
          onClick={handleUpload}
          disabled={uploading || !file}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Upload Photo"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PhotoUpload;
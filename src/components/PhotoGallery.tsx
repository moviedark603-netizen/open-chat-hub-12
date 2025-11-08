import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Images, Lock, Globe } from "lucide-react";

interface Photo {
  id: string;
  photo_url: string;
  is_public: boolean;
  created_at: string;
}

interface PhotoGalleryProps {
  profileId: string;
  refresh?: number;
}

const PhotoGallery = ({ profileId, refresh }: PhotoGalleryProps) => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    fetchPhotos();
  }, [profileId, refresh]);

  const fetchPhotos = async () => {
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPhotos(data);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Images className="w-5 h-5" />
          Photo Gallery
        </CardTitle>
      </CardHeader>
      <CardContent>
        {photos.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No photos uploaded yet</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <img
                  src={photo.photo_url}
                  alt="Photo"
                  className="w-full h-32 object-cover rounded-lg shadow-soft"
                />
                <Badge
                  variant={photo.is_public ? "default" : "secondary"}
                  className="absolute top-2 right-2"
                >
                  {photo.is_public ? (
                    <><Globe className="w-3 h-3 mr-1" /> Public</>
                  ) : (
                    <><Lock className="w-3 h-3 mr-1" /> Private</>
                  )}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PhotoGallery;
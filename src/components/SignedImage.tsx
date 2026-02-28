import { useState, useEffect } from "react";
import { getSignedUrl } from "@/lib/storage";

interface SignedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  storedUrl: string | null | undefined;
  fallback?: string;
}

/**
 * Image component that automatically resolves storage paths to signed URLs.
 */
const SignedImage = ({ storedUrl, fallback = "", ...props }: SignedImageProps) => {
  const [resolvedUrl, setResolvedUrl] = useState<string>(fallback);

  useEffect(() => {
    if (!storedUrl) {
      setResolvedUrl(fallback);
      return;
    }

    let cancelled = false;
    getSignedUrl(storedUrl).then((url) => {
      if (!cancelled) setResolvedUrl(url);
    });
    return () => { cancelled = true; };
  }, [storedUrl, fallback]);

  if (!resolvedUrl) return null;

  return <img src={resolvedUrl} {...props} />;
};

export default SignedImage;

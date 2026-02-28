import { useState, useEffect } from "react";
import { getSignedUrl } from "@/lib/storage";

/**
 * Hook to resolve a stored media URL/path to a signed URL.
 * Caches the result and refreshes before expiry.
 */
export function useSignedUrl(storedUrl: string | null | undefined) {
  const [signedUrl, setSignedUrl] = useState<string>("");

  useEffect(() => {
    if (!storedUrl) {
      setSignedUrl("");
      return;
    }

    let cancelled = false;

    getSignedUrl(storedUrl).then((url) => {
      if (!cancelled) setSignedUrl(url);
    });

    return () => { cancelled = true; };
  }, [storedUrl]);

  return signedUrl;
}

/**
 * Hook to resolve multiple media URLs to signed URLs.
 */
export function useSignedUrls(storedUrls: (string | null | undefined)[]) {
  const [signedUrls, setSignedUrls] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      storedUrls.map((url) => (url ? getSignedUrl(url) : Promise.resolve("")))
    ).then((urls) => {
      if (!cancelled) setSignedUrls(urls);
    });

    return () => { cancelled = true; };
  }, [JSON.stringify(storedUrls)]);

  return signedUrls;
}

import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

/**
 * Extract the bucket and file path from a stored URL or path.
 * Handles both legacy full public URLs and new relative paths.
 */
export function parseStoragePath(storedUrl: string): { bucket: string; path: string } | null {
  if (!storedUrl) return null;

  // New format: "bucket:path"
  if (storedUrl.includes(":") && !storedUrl.startsWith("http")) {
    const [bucket, ...rest] = storedUrl.split(":");
    return { bucket, path: rest.join(":") };
  }

  // Legacy format: full public URL
  // e.g. https://xxx.supabase.co/storage/v1/object/public/photos/userId/file.ext
  try {
    const url = new URL(storedUrl);
    const match = url.pathname.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)/);
    if (match) {
      return { bucket: match[1], path: match[2] };
    }
  } catch {
    // Not a valid URL
  }

  return null;
}

/**
 * Get a signed URL for a stored media path/URL.
 * Returns the original string if it can't be parsed (fallback).
 */
export async function getSignedUrl(storedUrl: string | null, expiresIn = 3600): Promise<string> {
  if (!storedUrl) return "";

  const parsed = parseStoragePath(storedUrl);
  if (!parsed) return storedUrl; // Can't parse, return as-is

  const { data, error } = await supabase.storage
    .from(parsed.bucket)
    .createSignedUrl(parsed.path, expiresIn);

  if (error || !data?.signedUrl) {
    console.error("Failed to get signed URL:", error);
    return storedUrl; // Fallback
  }

  return data.signedUrl;
}

/**
 * Store a file path in the format "bucket:path" for use with getSignedUrl.
 */
export function makeStoragePath(bucket: string, filePath: string): string {
  return `${bucket}:${filePath}`;
}

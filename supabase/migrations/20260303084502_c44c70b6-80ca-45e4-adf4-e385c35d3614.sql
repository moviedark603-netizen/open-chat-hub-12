
-- Add last_seen_at column to profiles for tracking recent logins
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_seen_at timestamp with time zone;

-- Create index for efficient ordering
CREATE INDEX IF NOT EXISTS idx_profiles_last_seen_at ON public.profiles (last_seen_at DESC NULLS LAST);

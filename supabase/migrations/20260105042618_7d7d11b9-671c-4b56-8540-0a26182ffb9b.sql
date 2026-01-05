-- Add username column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN username TEXT UNIQUE;

-- Create index for faster username lookups
CREATE INDEX idx_profiles_username ON public.profiles(username);

-- Add constraint to ensure username format (alphanumeric and underscores only, 3-30 chars)
ALTER TABLE public.profiles 
ADD CONSTRAINT valid_username CHECK (
  username IS NULL OR (
    LENGTH(username) >= 3 AND 
    LENGTH(username) <= 30 AND 
    username ~ '^[a-zA-Z0-9_]+$'
  )
);
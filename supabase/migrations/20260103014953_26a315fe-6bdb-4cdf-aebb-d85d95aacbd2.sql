-- Add is_premium column to profiles
ALTER TABLE public.profiles ADD COLUMN is_premium boolean NOT NULL DEFAULT false;

-- Add premium_until timestamp for expiration (optional future use)
ALTER TABLE public.profiles ADD COLUMN premium_until timestamp with time zone;
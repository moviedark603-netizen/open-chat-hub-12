-- Add gender and location to profiles
ALTER TABLE public.profiles
ADD COLUMN gender TEXT CHECK (gender IN ('man', 'woman')),
ADD COLUMN location TEXT;

-- Update existing profiles to have default values
UPDATE public.profiles SET gender = 'man' WHERE gender IS NULL;
UPDATE public.profiles SET location = 'Not specified' WHERE location IS NULL;
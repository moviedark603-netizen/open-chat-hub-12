-- Add telegram_id and whatsapp_number columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN telegram_id text,
ADD COLUMN whatsapp_number text;
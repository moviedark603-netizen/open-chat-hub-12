
-- 1. Fix transfer_gift_points: Add sender ownership verification and positive points check
CREATE OR REPLACE FUNCTION public.transfer_gift_points(
  p_sender_id uuid,
  p_receiver_id uuid,
  p_points integer,
  p_message text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sender_balance integer;
BEGIN
  -- CRITICAL: Verify sender ownership
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = p_sender_id 
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Cannot transfer from other profiles';
  END IF;
  
  -- Validate points are positive
  IF p_points <= 0 THEN
    RAISE EXCEPTION 'Points must be positive';
  END IF;
  
  -- Check sender has enough points
  SELECT gift_points INTO sender_balance
  FROM profiles
  WHERE id = p_sender_id;
  
  IF sender_balance < p_points THEN
    RAISE EXCEPTION 'Insufficient gift points';
  END IF;
  
  -- Deduct from sender
  UPDATE profiles
  SET gift_points = gift_points - p_points
  WHERE id = p_sender_id;
  
  -- Add to receiver
  UPDATE profiles
  SET gift_points = gift_points + p_points
  WHERE id = p_receiver_id;
  
  -- Record transaction
  INSERT INTO gift_transactions (sender_id, receiver_id, points, message)
  VALUES (p_sender_id, p_receiver_id, p_points, p_message);
  
  RETURN true;
END;
$$;

-- 2. Fix profile update: Restrict updatable columns to prevent privilege escalation
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (name, email, mobile_number, photo_url, gender, location, telegram_id, whatsapp_number, username) 
  ON public.profiles TO authenticated;
-- Admins need full update access
GRANT UPDATE ON public.profiles TO service_role;

-- 3. Fix increment_page_view: Add input validation
CREATE OR REPLACE FUNCTION public.increment_page_view(p_page_name text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count integer;
BEGIN
  -- Validate page name format and length
  IF LENGTH(p_page_name) > 50 OR p_page_name !~ '^[a-z0-9-]+$' THEN
    RAISE EXCEPTION 'Invalid page name format';
  END IF;
  
  INSERT INTO page_views (page_name, view_count, last_viewed_at)
  VALUES (p_page_name, 1, now())
  ON CONFLICT (page_name)
  DO UPDATE SET 
    view_count = page_views.view_count + 1,
    last_viewed_at = now()
  RETURNING view_count INTO new_count;
  
  RETURN new_count;
END;
$$;

-- 4. Fix photos bucket upload path: Enforce user-specific folders
DROP POLICY IF EXISTS "Authenticated users can upload photos" ON storage.objects;
CREATE POLICY "Users can upload photos to their folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

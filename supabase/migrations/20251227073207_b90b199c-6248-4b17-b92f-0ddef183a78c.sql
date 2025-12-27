-- Add gift_points column to profiles with default 100 points
ALTER TABLE public.profiles 
ADD COLUMN gift_points integer NOT NULL DEFAULT 100;

-- Create gift_transactions table to track transfers
CREATE TABLE public.gift_transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  points integer NOT NULL CHECK (points > 0),
  message text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gift_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions (sent or received)
CREATE POLICY "Users can view their own transactions"
ON public.gift_transactions
FOR SELECT
USING (
  sender_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  OR receiver_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

-- Users can create transactions where they are the sender
CREATE POLICY "Users can send gifts"
ON public.gift_transactions
FOR INSERT
WITH CHECK (
  sender_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

-- Function to transfer gift points
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
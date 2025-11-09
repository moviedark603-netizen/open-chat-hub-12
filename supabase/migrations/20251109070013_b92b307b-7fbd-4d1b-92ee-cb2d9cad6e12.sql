-- Add message types and media to messages table
ALTER TABLE public.messages
ADD COLUMN message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'audio', 'image')),
ADD COLUMN media_url TEXT;

-- Create profile connections table for blocking/accepting
CREATE TABLE public.profile_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(requester_id, receiver_id)
);

-- Enable RLS on profile_connections
ALTER TABLE public.profile_connections ENABLE ROW LEVEL SECURITY;

-- RLS policies for profile_connections
CREATE POLICY "Users can view their own connections"
  ON public.profile_connections FOR SELECT
  USING (
    requester_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR receiver_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create connections"
  ON public.profile_connections FOR INSERT
  WITH CHECK (
    requester_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update their connections"
  ON public.profile_connections FOR UPDATE
  USING (
    requester_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR receiver_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- Update messages RLS to respect blocks
DROP POLICY IF EXISTS "Users can view messages they sent or received" ON public.messages;

CREATE POLICY "Users can view messages if not blocked"
  ON public.messages FOR SELECT
  USING (
    (sender_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR receiver_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
    AND NOT EXISTS (
      SELECT 1 FROM public.profile_connections
      WHERE ((requester_id = sender_id AND receiver_id = messages.receiver_id)
        OR (requester_id = messages.receiver_id AND receiver_id = sender_id))
      AND status = 'blocked'
    )
  );

DROP POLICY IF EXISTS "Users can send messages" ON public.messages;

CREATE POLICY "Users can send messages if accepted or pending"
  ON public.messages FOR INSERT
  WITH CHECK (
    sender_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    AND NOT EXISTS (
      SELECT 1 FROM public.profile_connections
      WHERE ((requester_id = sender_id AND receiver_id = messages.receiver_id)
        OR (requester_id = messages.receiver_id AND receiver_id = sender_id))
      AND status = 'blocked'
    )
  );

-- Create index for better performance
CREATE INDEX idx_profile_connections_requester ON public.profile_connections(requester_id);
CREATE INDEX idx_profile_connections_receiver ON public.profile_connections(receiver_id);
CREATE INDEX idx_messages_type ON public.messages(message_type);

-- Enable realtime for profile_connections
ALTER PUBLICATION supabase_realtime ADD TABLE public.profile_connections;
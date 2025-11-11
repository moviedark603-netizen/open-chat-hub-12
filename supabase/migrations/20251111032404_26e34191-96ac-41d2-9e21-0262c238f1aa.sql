-- Create public posts table
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  post_type TEXT NOT NULL DEFAULT 'text',
  media_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Everyone can view all posts
CREATE POLICY "Posts are viewable by everyone"
ON public.posts
FOR SELECT
USING (true);

-- Users can create their own posts
CREATE POLICY "Users can create posts"
ON public.posts
FOR INSERT
WITH CHECK (author_id IN (
  SELECT id FROM profiles WHERE user_id = auth.uid()
));

-- Users can update their own posts
CREATE POLICY "Users can update their own posts"
ON public.posts
FOR UPDATE
USING (author_id IN (
  SELECT id FROM profiles WHERE user_id = auth.uid()
));

-- Users can delete their own posts
CREATE POLICY "Users can delete their own posts"
ON public.posts
FOR DELETE
USING (author_id IN (
  SELECT id FROM profiles WHERE user_id = auth.uid()
));

-- Admins can delete any post
CREATE POLICY "Admins can delete any post"
ON public.posts
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create post replies table
CREATE TABLE public.post_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  reply_type TEXT NOT NULL DEFAULT 'text',
  media_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on replies
ALTER TABLE public.post_replies ENABLE ROW LEVEL SECURITY;

-- Everyone can view all replies
CREATE POLICY "Replies are viewable by everyone"
ON public.post_replies
FOR SELECT
USING (true);

-- Users can create replies
CREATE POLICY "Users can create replies"
ON public.post_replies
FOR INSERT
WITH CHECK (author_id IN (
  SELECT id FROM profiles WHERE user_id = auth.uid()
));

-- Users can delete their own replies
CREATE POLICY "Users can delete their own replies"
ON public.post_replies
FOR DELETE
USING (author_id IN (
  SELECT id FROM profiles WHERE user_id = auth.uid()
));

-- Admins can delete any reply
CREATE POLICY "Admins can delete any reply"
ON public.post_replies
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime for posts and replies
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_replies;
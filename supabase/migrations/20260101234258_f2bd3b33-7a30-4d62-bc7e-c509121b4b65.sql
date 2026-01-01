-- Create page_views table to track total views
CREATE TABLE public.page_views (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name text NOT NULL UNIQUE,
  view_count integer NOT NULL DEFAULT 0,
  last_viewed_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read page views
CREATE POLICY "Page views are viewable by everyone"
ON public.page_views
FOR SELECT
USING (true);

-- Allow anonymous inserts/updates for view counting
CREATE POLICY "Anyone can update page views"
ON public.page_views
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can insert page views"
ON public.page_views
FOR INSERT
WITH CHECK (true);

-- Insert initial record for home page
INSERT INTO public.page_views (page_name, view_count) VALUES ('home', 0);

-- Create function to increment page views
CREATE OR REPLACE FUNCTION public.increment_page_view(p_page_name text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count integer;
BEGIN
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
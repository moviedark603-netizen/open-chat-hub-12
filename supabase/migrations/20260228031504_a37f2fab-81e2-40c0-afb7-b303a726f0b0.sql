-- Fix 1: Remove overly permissive page_views INSERT/UPDATE policies
-- The increment_page_view() SECURITY DEFINER function handles all writes safely
DROP POLICY IF EXISTS "Anyone can update page views" ON public.page_views;
DROP POLICY IF EXISTS "Anyone can insert page views" ON public.page_views;

-- Fix 2: Create verify_admin_access RPC for server-side admin verification
CREATE OR REPLACE FUNCTION public.verify_admin_access()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin');
$$;
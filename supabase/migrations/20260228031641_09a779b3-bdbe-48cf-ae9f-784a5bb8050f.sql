-- Make storage buckets private
UPDATE storage.buckets SET public = false WHERE id IN ('photos', 'videos');

-- Add RLS policies for authenticated users to read from storage
CREATE POLICY "Authenticated users can view photos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'photos');

CREATE POLICY "Authenticated users can view videos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'videos');
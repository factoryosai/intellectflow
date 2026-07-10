-- Owners manage files in their own folder: business-assets/{user_id}/...
CREATE POLICY "Owners can view own assets"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'business-assets'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Owners can upload own assets"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'business-assets'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Owners can update own assets"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'business-assets'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'business-assets'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Owners can delete own assets"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'business-assets'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Admins can view all business assets
CREATE POLICY "Admins can view all business assets"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'business-assets'
  AND private.has_role(auth.uid(), 'admin')
);

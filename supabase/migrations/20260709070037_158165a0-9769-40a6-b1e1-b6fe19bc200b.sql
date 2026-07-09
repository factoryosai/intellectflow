ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS website text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS rating numeric,
  ADD COLUMN IF NOT EXISTS user_ratings_total integer;
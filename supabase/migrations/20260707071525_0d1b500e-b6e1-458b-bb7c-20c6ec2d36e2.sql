ALTER TABLE public.subscriptions
  ADD CONSTRAINT subscriptions_business_id_unique UNIQUE (business_id);
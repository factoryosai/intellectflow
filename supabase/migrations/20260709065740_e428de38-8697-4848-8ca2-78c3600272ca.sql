CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  new_slug text;
  new_business_id uuid;
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'owner')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'owner')
  ON CONFLICT (user_id, role) DO NOTHING;

  new_slug := substr(md5(random()::text || NEW.id::text), 1, 10);
  INSERT INTO public.businesses (user_id, slug)
  VALUES (NEW.id, new_slug)
  RETURNING id INTO new_business_id;

  -- Start a 3-day Starter free trial automatically for every new business
  INSERT INTO public.subscriptions (business_id, plan, status, current_period_end)
  VALUES (new_business_id, 'starter', 'trialing', now() + interval '3 days')
  ON CONFLICT (business_id) DO NOTHING;

  RETURN NEW;
END;
$function$;
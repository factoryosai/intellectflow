-- 1) Remove overly-broad public (anon) read access
DROP POLICY IF EXISTS "Public can read businesses by slug" ON public.businesses;
DROP POLICY IF EXISTS "Public can read subscription status by business" ON public.subscriptions;

-- 2) Move has_role out of the API-exposed public schema into a private schema
CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Only authenticated users need to reference it (via RLS); schema stays out of the exposed API
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated;

-- 3) Repoint all admin policies to the private function
DROP POLICY IF EXISTS "Admins can read all businesses" ON public.businesses;
CREATE POLICY "Admins can read all businesses" ON public.businesses
  FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update all businesses" ON public.businesses;
CREATE POLICY "Admins can update all businesses" ON public.businesses
  FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
CREATE POLICY "Admins can read all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins read all review events" ON public.review_events;
CREATE POLICY "Admins read all review events" ON public.review_events
  FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins read all subscriptions" ON public.subscriptions;
CREATE POLICY "Admins read all subscriptions" ON public.subscriptions
  FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins update subscriptions" ON public.subscriptions;
CREATE POLICY "Admins update subscriptions" ON public.subscriptions
  FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can read all roles" ON public.user_roles;
CREATE POLICY "Admins can read all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- 4) Remove the now-unused public (API-exposed) function
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
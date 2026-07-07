-- Lock down SECURITY DEFINER functions
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Review events: log server-side (service role) instead of anon direct insert
DROP POLICY IF EXISTS "Public can log review events" ON public.review_events;
REVOKE INSERT ON public.review_events FROM anon;
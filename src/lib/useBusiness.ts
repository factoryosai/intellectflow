import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export interface BusinessRow {
  id: string;
  user_id: string;
  business_name: string | null;
  place_id: string | null;
  address: string | null;
  location_lat: number | null;
  location_lng: number | null;
  contact_number: string | null;
  google_review_link: string | null;
  slug: string | null;
  created_at: string;
}

export interface SubscriptionRow {
  id: string;
  business_id: string;
  plan: string | null;
  status: string;
  current_period_end: string | null;
}

export function useBusiness() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["business", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: business, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;

      let subscription: SubscriptionRow | null = null;
      let reviewCount = 0;
      if (business) {
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("id, business_id, plan, status, current_period_end")
          .eq("business_id", business.id)
          .maybeSingle();
        subscription = sub as SubscriptionRow | null;

        const { count } = await supabase
          .from("review_events")
          .select("id", { count: "exact", head: true })
          .eq("business_id", business.id);
        reviewCount = count ?? 0;
      }

      return {
        business: business as BusinessRow | null,
        subscription,
        reviewCount,
      };
    },
  });
}

export function isOnboarded(business: BusinessRow | null): boolean {
  return !!(business && business.business_name && business.google_review_link);
}

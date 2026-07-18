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
  website: string | null;
  description: string | null;
  logo_url: string | null;
  rating: number | null;
  user_ratings_total: number | null;
  created_at: string;
  is_lifetime_free?: boolean; // NEW - Value ₹55k+ FREE
  coupon_enabled?: boolean; // NEW - Value ₹1.5k/mo
  coupon_text?: string | null;
}

export interface SubscriptionRow {
  id: string;
  business_id: string;
  plan: string | null;
  status: string;
  current_period_end: string | null;
  ai_reply_used?: number; // NEW - Growth 50/mo Pro Unlimited
  gmb_post_used?: number; // NEW - Growth 5/mo Pro 15/mo
  razorpay_subscription_id?: string | null;
}

export interface BusinessData {
  business: BusinessRow | null;
  subscription: SubscriptionRow | null;
  reviewCount: number;
  isLifetimeFree: boolean; // NEW
  marketValue: string; // NEW
  planLimits: { // NEW
    ai_reply: number;
    gmb_post: number;
    posters: number;
    review_pages: number;
  };
  usagePercent: { // NEW - For UI progress bars
    ai_reply: number;
    gmb_post: number;
  };
}

export function useBusiness() {
  const { user, isFounder } = useAuth() as any;
  return useQuery<BusinessData>({
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
      let isLifetimeFree = false;
      let marketValue = "₹8,000/mo";
      let planLimits = { ai_reply: 5, gmb_post: 0, posters: 1, review_pages: 1 };
      let usagePercent = { ai_reply: 0, gmb_post: 0 };

      if (business) {
        // Check lifetime free - Value ₹55k+ FREE - Founder Kaushik Savaliya
        isLifetimeFree = (business as any).is_lifetime_free === true || isFounder === true;
        
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("id, business_id, plan, status, current_period_end, ai_reply_used, gmb_post_used, razorpay_subscription_id")
          .eq("business_id", business.id)
          .maybeSingle();
        subscription = sub as SubscriptionRow | null;

        const { count } = await supabase
          .from("review_events")
          .select("id", { count: "exact", head: true })
          .eq("business_id", business.id);
        reviewCount = count ?? 0;

        // Market Value + Limits based on plan or lifetime free
        if (isLifetimeFree) {
          marketValue = "₹55,000+/mo FREE - Lifetime - Founder Kaushik Approved";
          planLimits = { ai_reply: 999999, gmb_post: 999999, posters: 999999, review_pages: 999999 };
        } else if (subscription?.plan === "business" || subscription?.plan === "pro") {
          marketValue = "₹55,000+/mo - Aap Dukaan Chalao Google Hum Sambhalenge";
          planLimits = { ai_reply: 999999, gmb_post: 15, posters: 999999, review_pages: 999999 };
        } else if (subscription?.plan === "growth") {
          marketValue = "₹25,000/mo - Most Popular 80% Choose This";
          planLimits = { ai_reply: 50, gmb_post: 5, posters: 10, review_pages: 5 };
        } else {
          marketValue = "₹8,000/mo - Starter";
          planLimits = { ai_reply: 5, gmb_post: 0, posters: 1, review_pages: 1 };
        }

        // Usage percent for progress bars
        if (subscription) {
          const aiUsed = (subscription as any).ai_reply_used || 0;
          const gmbUsed = (subscription as any).gmb_post_used || 0;
          usagePercent = {
            ai_reply: planLimits.ai_reply >= 999999 ? 0 : Math.min(100, (aiUsed / planLimits.ai_reply) * 100),
            gmb_post: planLimits.gmb_post >= 999999 ? 0 : Math.min(100, (gmbUsed / planLimits.gmb_post) * 100),
          };
        }
      }

      return {
        business: business as BusinessRow | null,
        subscription,
        reviewCount,
        isLifetimeFree,
        marketValue,
        planLimits,
        usagePercent,
      };
    },
  });
}

export function isOnboarded(business: BusinessRow | null): boolean {
  return !!(business && business.business_name && business.google_review_link);
}

// Helper: Check if user has access to feature based on plan + lifetime free
export function hasFeatureAccess(
  businessData: BusinessData | undefined,
  feature: "ai_reply" | "gmb_post" | "sentiment" | "competitor" | "whatsapp" | "poster" | "website" | "premium_templates"
): boolean {
  if (!businessData) return false;
  if (businessData.isLifetimeFree) return true; // Value ₹55k+ FREE - All features

  const plan = businessData.subscription?.plan;
  if (!plan) return feature === "ai_reply" ? true : false; // Starter gets at least AI reply limited

  const accessMap: Record<string, string[]> = {
    starter: ["ai_reply"],
    growth: ["ai_reply", "whatsapp", "poster", "premium_templates"],
    business: ["ai_reply", "gmb_post", "sentiment", "competitor", "whatsapp", "poster", "website", "premium_templates"],
    pro: ["ai_reply", "gmb_post", "sentiment", "competitor", "whatsapp", "poster", "website", "premium_templates"],
  };

  return accessMap[plan]?.includes(feature) || false;
}

// Helper: Get remaining usage
export function getRemainingUsage(businessData: BusinessData | undefined, type: "ai_reply" | "gmb_post"): number {
  if (!businessData) return 0;
  if (businessData.isLifetimeFree) return 999999;
  
  const used = type === "ai_reply" ? businessData.subscription?.ai_reply_used || 0 : businessData.subscription?.gmb_post_used || 0;
  const limit = type === "ai_reply" ? businessData.planLimits.ai_reply : businessData.planLimits.gmb_post;
  
  if (limit >= 999999) return 999999;
  return Math.max(0, limit - used);
}

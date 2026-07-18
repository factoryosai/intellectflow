import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";

/**
 * List businesses PRO - IntellectFlow - Market Value ₹55k+ at ₹299
 * Founder: Kaushik Savaliya - Visavadar Gujarat - intellectflowteam@gmail.com
 * Features: Lifetime Free + Coupon + Subscription + Market Value + Public URL + QR Value
 */

export function supabaseForUser(ctx: ToolContext) {
  // PRO: Vercel Fix - Support both SUPABASE_URL and VITE_ vars + Service role fallback for admin ops
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
  return createClient(url, key, {
    global: { 
      headers: { 
        Authorization: `Bearer ${ctx.getToken()}`,
        'X-IntellectFlow-Founder': 'Kaushik Savaliya - Market Value ₹55k+ at ₹299 - Aap Dukaan Chalao Google Hum Sambhalenge',
        'X-IntellectFlow-Market-Value': '₹55k+/mo Features - QR ₹1k + AI Writer ₹3k + Coupon ₹1.5k + Negative Filter ₹7k + Reviews ₹5k + AI Reply ₹5k + WhatsApp ₹3k + GMB ₹8k + Sentiment ₹5k + Competitor ₹12k'
      } 
    },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "list_businesses",
  title: "List businesses PRO - Market Value ₹55k+",
  description:
    "List the review-collection businesses PRO owned by the signed-in user, with name, address, Google rating, review page slug, total ratings, lifetime free status Value ₹55k+ FREE Founder Kaushik Approved, coupon status Value ₹1.5k/mo, subscription plan Market ₹8k/₹25k/₹55k+, public review URL /r/slug Value ₹1k + ₹8k/mo QR, market value breakdown. Founder Kaushik Savaliya - Aap Dukaan Chalao Google Hum Sambhalenge - 500+ Businesses Trust IntellectFlow.in PRO - Market Value ₹55k+ at ₹299.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated - Founder Kaushik Savaliya - intellectflowteam@gmail.com - Market Value ₹55k+ at ₹299 - Please login to IntellectFlow.in - Aap Dukaan Chalao Google Hum Sambhalenge" }], isError: true };
    
    const supabase = supabaseForUser(ctx);
    
    const { data: businesses, error } = await supabase
      .from("businesses")
      .select(
        "id, business_name, address, contact_number, website, google_review_link, slug, rating, user_ratings_total, created_at, is_lifetime_free, coupon_enabled, coupon_code, coupon_discount",
      )
      .eq("user_id", ctx.getUserId())
      .order("created_at", { ascending: false });
    
    if (error) return { content: [{ type: "text", text: `${error.message} - Market Value ₹55k+ Billing - Founder Kaushik Savaliya - intellectflowteam@gmail.com` }], isError: true };

    if (!businesses || businesses.length === 0) {
      return {
        content: [{ type: "text", text: JSON.stringify([]) }],
        structuredContent: { 
          businesses: [],
          message: "No businesses yet - Create your first business in onboarding - Market Value ₹55k+ at ₹299 - Founder Kaushik Savaliya - Aap Dukaan Chalao Google Hum Sambhalenge - Value ₹1k QR + ₹3k/mo AI Writer + ₹1.5k/mo Coupon + ₹7k/mo Negative Filter + ₹5k/mo Reviews Counter + ₹5k/mo AI Reply + ₹3k/mo WhatsApp + ₹8k/mo GMB + ₹5k/mo Sentiment + ₹12k/mo Competitor = ₹55k+/mo at ₹299",
          founder: "Kaushik Savaliya - Visavadar Gujarat 362130 - intellectflowteam@gmail.com",
          market_value: "Starter Market ₹8k/mo at ₹299, Growth Market ₹25k/mo at ₹599 - 80% Popular, Business Pro Market ₹55k+/mo at ₹1299 - Aap Dukaan Chalao Google Hum Sambhalenge"
        },
      };
    }

    // Get subscriptions for all businesses - Market Value tracking
    const businessIds = businesses.map(b => b.id);
    const { data: subscriptions } = await supabase
      .from("subscriptions")
      .select("business_id, plan, status, current_period_end, ai_reply_used, gmb_post_used")
      .in("business_id", businessIds);

    const subMap = new Map(subscriptions?.map(s => [s.business_id, s]) || []);

    const enriched = businesses.map((b: any) => {
      const sub = subMap.get(b.id) as any;
      const isLifetimeFree = b.is_lifetime_free === true;
      const plan = sub?.plan || "starter";
      
      const marketValueMap: Record<string, number> = { starter: 8000, growth: 25000, business: 55000 };
      const priceMap: Record<string, number> = { starter: 299, growth: 599, business: 1299 };
      
      const marketValue = isLifetimeFree ? 55000 : (marketValueMap[plan] || 8000);
      const price = isLifetimeFree ? 0 : (priceMap[plan] || 299);

      return {
        ...b,
        public_url: b.slug ? `https://intellectflow.in/r/${b.slug}` : null, // QR Page - Value ₹1k + ₹8k/mo
        qr_value: "₹1,000 - QR + /r/slug - Scan to Review - Value ₹1k + ₹8k/mo QR Code Generator",
        is_lifetime_free_label: isLifetimeFree ? "Yes ✓ - Lifetime FREE - Value ₹55k+ FREE - Founder Kaushik Savaliya Approved - Never enforce limits - Aap Dukaan Chalao Google Hum Sambhalenge" : "No - Starter ₹299 Market ₹8k, Growth ₹599 Market ₹25k - 80% Popular, Pro ₹1299 Market ₹55k+",
        coupon_label: b.coupon_enabled ? `Enabled ✓ - Code: ${b.coupon_code || 'WELCOME10'} - ${b.coupon_discount || '10% OFF'} - Value ₹1.5k/mo - Thank You + Coupon` : "Disabled - Enable for ₹1.5k/mo value",
        subscription: sub ? {
          ...sub,
          plan_label: isLifetimeFree ? "Lifetime FREE ✓ - Market ₹55k+ FREE - Founder Kaushik Approved" : plan === "business" ? "Business Pro - Market ₹55k+/mo at ₹1299 - Aap Dukaan Chalao Google Hum Sambhalenge" : plan === "growth" ? "Growth - Market ₹25k/mo at ₹599 - 80% Popular" : "Starter - Market ₹8k/mo at ₹299",
          market_value: `₹${marketValue.toLocaleString()}/mo`,
          price: isLifetimeFree ? "FREE ✓ Lifetime" : `₹${price}/mo`,
          savings: isLifetimeFree ? `₹${marketValue.toLocaleString()}/mo Saved - Lifetime FREE` : `Save ₹${(marketValue - price).toLocaleString()}/mo`,
          ai_reply_usage: `${sub.ai_reply_used || 0} / ${plan === "business" || isLifetimeFree ? "∞ Unlimited" : plan === "growth" ? "50/mo" : "10/mo"} - Value ₹5k/mo`,
          gmb_post_usage: `${sub.gmb_post_used || 0} / ${plan === "business" || isLifetimeFree ? "15/mo" : plan === "growth" ? "5/mo" : "0/mo"} - Value ₹8k/mo`,
        } : {
          plan: "starter",
          status: "trialing",
          plan_label: "Starter - Market ₹8k/mo at ₹299 - Upgrade to Growth ₹599 Market ₹25k - 80% Popular or Pro ₹1299 Market ₹55k+",
          market_value: "₹8,000/mo",
          price: "₹299/mo",
          savings: "Save ₹7,701/mo",
        },
        market_value_breakdown: isLifetimeFree ? "₹55,000+/mo FREE - QR ₹1k + AI Writer ₹3k/mo + Coupon ₹1.5k/mo + Negative Filter ₹7k/mo + Reviews Counter ₹5k/mo + AI Reply ₹5k/mo + WhatsApp ₹3k/mo + GMB Post ₹8k/mo + Sentiment ₹5k/mo + Competitor ₹12k/mo + Stickers ₹2k/mo + Website ₹10k/mo = ₹55k+/mo FREE Lifetime - Founder Kaushik Approved" : `₹${marketValue.toLocaleString()}/mo - Starter ₹8k at ₹299, Growth ₹25k at ₹599, Pro ₹55k+ at ₹1299`,
      };
    });

    const totalMarketValue = enriched.reduce((sum, b: any) => {
      const sub = subMap.get(b.id) as any;
      const isLifetime = b.is_lifetime_free === true;
      const plan = sub?.plan || "starter";
      return sum + (isLifetime ? 55000 : (plan === "business" ? 55000 : plan === "growth" ? 25000 : 8000));
    }, 0);

    return {
      content: [{ type: "text", text: JSON.stringify(enriched, null, 2) }],
      structuredContent: { 
        businesses: enriched,
        total_businesses: enriched.length,
        total_market_value: `₹${totalMarketValue.toLocaleString()}/mo - Market Value of all your businesses - Founder Kaushik Savaliya - Aap Dukaan Chalao Google Hum Sambhalenge`,
        founder: {
          name: "Kaushik Savaliya",
          email: "intellectflowteam@gmail.com",
          location: "Visavadar, Gujarat 362130",
          tagline: "Aap Dukaan Chalao, Google Hum Sambhalenge",
          website: "https://intellectflow.in",
          market_value: `Total ₹${totalMarketValue.toLocaleString()}+/mo at low price - Founder Kaushik`,
          trust: "500+ Businesses Trust IntellectFlow.in PRO - Market Value ₹55k+ at ₹299",
        },
        pricing: {
          starter: "Starter - Market ₹8,000/mo at ₹299 - QR ₹1k + Basic",
          growth: "Growth - Market ₹25,000/mo at ₹599 - 80% Popular - QR ₹1k + AI Writer ₹3k/mo + Coupon ₹1.5k/mo + Negative Filter ₹7k/mo + Reviews ₹5k/mo + AI Reply ₹5k/mo (50/mo) + WhatsApp ₹3k/mo + GMB ₹8k/mo (5/mo) + Sentiment ₹5k/mo",
          business: "Business Pro - Market ₹55,000+/mo at ₹1299 - Aap Dukaan Chalao Google Hum Sambhalenge - All Features Unlimited - AI Reply ∞ + GMB 15/mo + Competitor ₹12k/mo + Stickers ₹2k/mo + Website ₹10k/mo FREE",
          lifetime_free: "Lifetime FREE ✓ - Value ₹55k+ FREE - Founder Kaushik Approved - intellectflowteam@gmail.com - Visavadar Gujarat - Never enforce limits - For early 500+ businesses & founder",
        }
      },
    };
  },
});
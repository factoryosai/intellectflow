import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "./list-businesses";

/**
 * Get business stats PRO - IntellectFlow - Market Value ₹55k+ at ₹299
 * Founder: Kaushik Savaliya - Visavadar Gujarat - intellectflowteam@gmail.com
 * Features: Review stats + Subscription + Lifetime Free + Coupon + Negative Filter + AI Reply + GMB + Market Value
 * Value: QR ₹1k + AI Writer ₹3k/mo + Coupon ₹1.5k/mo + Negative Filter ₹7k/mo + Reviews Counter ₹5k/mo + AI Reply ₹5k/mo + WhatsApp ₹3k/mo + GMB ₹8k/mo + Sentiment ₹5k/mo + Competitor ₹12k/mo = ₹55k+/mo
 */

export default defineTool({
  name: "get_business_stats",
  title: "Get business stats PRO - Market Value ₹55k+",
  description:
    "Get review-collection stats PRO for one of the signed-in user's businesses: total review events, recent events, subscription plan and status, lifetime free status Value ₹55k+ FREE, coupon usage Value ₹1.5k/mo, negative filter stats Value ₹7k/mo, AI reply usage Growth 50/mo Pro Unlimited Value ₹5k/mo, GMB post usage Growth 5/mo Pro 15/mo Value ₹8k/mo, market value breakdown. Pass the business id from list_businesses. Founder Kaushik Savaliya - Aap Dukaan Chalao Google Hum Sambhalenge.",
  inputSchema: {
    business_id: z.string().describe("The id of a business owned by the signed-in user - Market Value ₹55k+ Billing."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ business_id }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated - Founder Kaushik Savaliya - intellectflowteam@gmail.com - Market Value ₹55k+ at ₹299 - Please login to IntellectFlow.in" }], isError: true };
    const db = supabaseForUser(ctx);

    const { data: business, error: bizError } = await db
      .from("businesses")
      .select("id, business_name, rating, user_ratings_total, slug, google_review_link, is_lifetime_free, coupon_enabled, coupon_code, coupon_discount, created_at")
      .eq("id", business_id)
      .eq("user_id", ctx.getUserId())
      .maybeSingle();
    if (bizError) return { content: [{ type: "text", text: `${bizError.message} - Market Value ₹55k+ Billing - Founder Kaushik Savaliya` }], isError: true };
    if (!business)
      return { content: [{ type: "text", text: "Business not found or not yours - Market Value ₹55k+ at ₹299 - Founder Kaushik Savaliya - Aap Dukaan Chalao Google Hum Sambhalenge - Check your business list." }], isError: true };

    const { count: totalEvents } = await db
      .from("review_events")
      .select("id", { count: "exact", head: true })
      .eq("business_id", business_id);

    const { count: positiveEvents } = await db
      .from("review_events")
      .select("id", { count: "exact", head: true })
      .eq("business_id", business_id)
      .eq("is_negative", false);

    const { count: negativeEvents } = await db
      .from("review_events")
      .select("id", { count: "exact", head: true })
      .eq("business_id", business_id)
      .eq("is_negative", true);

    const { count: couponUsed } = await db
      .from("review_events")
      .select("id", { count: "exact", head: true })
      .eq("business_id", business_id)
      .eq("coupon_used", true);

    const { data: subscription } = await db
      .from("subscriptions")
      .select("plan, status, current_period_end, ai_reply_used, gmb_post_used, razorpay_subscription_id")
      .eq("business_id", business_id)
      .maybeSingle();

    const { data: recentFeedbacks } = await db
      .from("feedbacks")
      .select("id, rating, text, created_at")
      .eq("business_id", business_id)
      .order("created_at", { ascending: false })
      .limit(5);

    const { data: recentEvents } = await db
      .from("review_events")
      .select("id, suggestion_shown, rating_selected, is_negative, coupon_used, created_at")
      .eq("business_id", business_id)
      .order("created_at", { ascending: false })
      .limit(10);

    // Market Value Calculation - Founder Kaushik Savaliya
    const isLifetimeFree = (business as any).is_lifetime_free === true;
    const plan = subscription?.plan || "starter";
    const marketValueMap: Record<string, number> = {
      starter: 8000,
      growth: 25000,
      business: 55000,
    };
    const marketValue = isLifetimeFree ? 55000 : (marketValueMap[plan] || 8000);
    const currentPriceMap: Record<string, number> = { starter: 299, growth: 599, business: 1299 };
    const currentPrice = isLifetimeFree ? 0 : (currentPriceMap[plan] || 299);

    const result = {
      business: {
        ...business,
        public_url: business.slug ? `https://intellectflow.in/r/${business.slug}` : null,
        qr_value: "₹1,000", // QR + /r/slug - Value ₹1k
      },
      stats: {
        review_events_total: totalEvents ?? 0, // Value ₹5k/mo - Reviews Driven Counter
        review_events_positive: positiveEvents ?? 0, // 4-5★ - AI Writer + Coupon - Value ₹3k/mo + ₹1.5k/mo
        review_events_negative: negativeEvents ?? 0, // 1-2★ Private - Value ₹7k/mo - Not posted to Google
        coupon_used_total: couponUsed ?? 0, // Thank You + Coupon 10% OFF - Value ₹1.5k/mo
        reviews_driven_counter: totalEvents ?? 0, // Counter for landing page - Value ₹5k/mo
      },
      subscription: subscription ? {
        ...subscription,
        plan_label: plan === "business" ? "Business Pro - Market ₹55k+/mo at ₹1299 - Aap Dukaan Chalao Google Hum Sambhalenge" : plan === "growth" ? "Growth - Market ₹25k/mo at ₹599 - 80% Popular" : "Starter - Market ₹8k/mo at ₹299",
        ai_reply_usage: `${subscription.ai_reply_used || 0} / ${plan === "business" ? "∞ Unlimited" : plan === "growth" ? "50/mo" : "10/mo"} - Value ₹5k/mo - AI Reply 3 Variants`, // Growth 50/mo Pro Unlimited - Value ₹5k/mo
        gmb_post_usage: `${subscription.gmb_post_used || 0} / ${plan === "business" ? "15/mo" : plan === "growth" ? "5/mo" : "0/mo"} - Value ₹8k/mo - GMB Post Generator`, // Growth 5/mo Pro 15/mo - Value ₹8k/mo
        status_label: subscription.status === "active" ? "Active ✓ - Market Value Billing - Founder Kaushik Savaliya" : subscription.status,
      } : null,
      market_value: {
        total_value: `₹${marketValue.toLocaleString()}/mo`, // ₹8k, ₹25k, ₹55k+
        current_price: isLifetimeFree ? "FREE ✓ Lifetime - Value ₹55k+ FREE - Founder Kaushik Approved" : `₹${currentPrice}/mo`,
        savings: isLifetimeFree ? `₹${marketValue.toLocaleString()}/mo Saved - Lifetime FREE ✓` : `Save ₹${(marketValue - currentPrice).toLocaleString()}/mo - Market Value vs Price`,
        breakdown: {
          qr_short_link: "₹1,000 - QR + /r/slug - Value ₹1k",
          ai_writer: "₹3,000/mo - AI Review Writer 4 Suggestions Gujarati/Hinglish/English - Value ₹3k/mo",
          coupon: "₹1,500/mo - Thank You + Coupon 10% OFF - Value ₹1.5k/mo",
          negative_filter: "₹7,000/mo - Negative Filter 1-2★ Private Feedback Not Posted to Google - Value ₹7k/mo",
          reviews_counter: "₹5,000/mo - Reviews Driven Counter for Landing - Value ₹5k/mo",
          ai_reply: `₹5,000/mo - AI Reply 3 Variants Professional Hinglish Gujarati - Growth 50/mo Pro Unlimited - Used: ${subscription?.ai_reply_used || 0}`,
          whatsapp: "₹3,000/mo - WhatsApp Auto-Reminder 24hr After QR Scan - Value ₹3k/mo",
          gmb_post: `₹8,000/mo - GMB Post Generator Growth 5/mo Pro 15/mo - Used: ${subscription?.gmb_post_used || 0}`,
          sentiment: "₹5,000/mo - Sentiment Analysis - Value ₹5k/mo",
          competitor: "₹12,000/mo - Competitor Tracking 2 Competitors Every 6hr - Value ₹12k/mo",
          stickers: "₹2,000/mo - Premium Stickers 20+ Designs - Value ₹2k/mo",
          website: "₹10,000/mo - Website FREE with Pro Plan - Value ₹10k/mo",
        },
        is_lifetime_free: isLifetimeFree ? "Yes ✓ - Value ₹55k+ FREE - Lifetime - Founder Kaushik Savaliya Approved - intellectflowteam@gmail.com - Visavadar Gujarat - Never enforce limits - Aap Dukaan Chalao Google Hum Sambhalenge" : "No - Upgrade to Growth ₹599 Market ₹25k or Pro ₹1299 Market ₹55k+",
      },
      recent: {
        review_events: recentEvents || [], // Last 10 events - Rating + Coupon + Negative filter
        private_feedbacks: recentFeedbacks || [], // Last 5 private - 1-2★ - Value ₹7k/mo - Owner only
      },
      founder: {
        name: "Kaushik Savaliya",
        email: "intellectflowteam@gmail.com",
        location: "Visavadar, Gujarat 362130",
        tagline: "Aap Dukaan Chalao, Google Hum Sambhalenge",
        website: "https://intellectflow.in",
        market_value: `₹${marketValue.toLocaleString()}+ at ₹${currentPrice} - Founder Kaushik Savaliya`,
        trust: "500+ Businesses Trust IntellectFlow.in PRO - Market Value ₹55k+ at ₹299",
      },
    };
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result,
    };
  },
});
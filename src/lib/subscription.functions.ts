import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const PlanInput = z.object({ plan: z.enum(["starter", "growth", "pro", "business"]) });

const PLAN_ENV: Record<string, string> = {
  starter: "RAZORPAY_PLAN_STARTER",
  growth: "RAZORPAY_PLAN_GROWTH",
  pro: "RAZORPAY_PLAN_PRO",
  business: "RAZORPAY_PLAN_PRO", // Alias for business = pro
};

const PLAN_MARKET_VALUE: Record<string, string> = {
  starter: "₹8,000/mo Market Value → You Pay ₹299",
  growth: "₹25,000/mo Market Value → You Pay ₹599 - 80% Choose This",
  pro: "₹55,000+/mo Market Value → You Pay ₹1299 - Aap Dukaan Chalao Google Hum Sambhalenge",
  business: "₹55,000+/mo Market Value → You Pay ₹1299",
};

/**
 * Creates Razorpay subscription - PRO Version with Lifetime Free Check
 * Founder: Kaushik Savaliya | Intellectflow.in | Market Value ₹55k+
 */
export const createSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => PlanInput.parse(input))
  .handler(async ({ data, context }) => {
    // Normalize plan name
    const planName = data.plan === "business" ? "pro" : data.plan;
    
    // Check if business is lifetime free - Value ₹55k+ FREE - Founder Control
    const { data: businessCheck, error: bizCheckErr } = await context.supabase
      .from("businesses")
      .select("id, business_name, is_lifetime_free")
      .eq("user_id", context.userId)
      .maybeSingle();
    
    if (!bizCheckErr && (businessCheck as any)?.is_lifetime_free === true) {
      throw new Error("You are Lifetime Free! Value ₹55k+ FREE - No need to pay - Co-founder Kaushik Approved ✓ - Contact intellectflowteam@gmail.com");
    }

    // Founder check
    if (context.userId) {
      const { data: userData } = await context.supabase.auth.getUser();
      if (userData.user?.email === "intellectflowteam@gmail.com") {
        throw new Error("Founder Access - You are Lifetime Free! Value ₹55k+ FREE - Founder Kaushik Savaliya ✓");
      }
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const planId = process.env[PLAN_ENV[planName]];

    if (!keyId || !keySecret) {
      throw new Error("Payments not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env - Value ₹55k+ billing");
    }
    if (!planId) {
      throw new Error(`The ${planName} plan not configured. Add ${PLAN_ENV[planName]} in .env - Market Value ${PLAN_MARKET_VALUE[planName]}`);
    }

    // Find caller's business
    const { data: business, error } = await context.supabase
      .from("businesses")
      .select("id, business_name")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error || !business) throw new Error("No business found. Complete onboarding first - Value ₹8k/mo QR setup");

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const res = await fetch("https://api.razorpay.com/v1/subscriptions", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan_id: planId,
        total_count: 120, // 10 years
        customer_notify: 1,
        notes: { 
          business_id: business.id, 
          plan: planName,
          market_value: PLAN_MARKET_VALUE[planName],
          founder: "Kaushik Savaliya - Intellectflow.in",
          tagline: "Aap Dukaan Chalao, Google Hum Sambhalenge"
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`Razorpay subscription failed [${res.status}]: ${body} - Market Value ${PLAN_MARKET_VALUE[planName]}`);
      throw new Error(`Could not start checkout for ${planName} - ${PLAN_MARKET_VALUE[planName]}. Try again or contact intellectflowteam@gmail.com`);
    }

    const sub = await res.json();

    // Upsert pending subscription via admin
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("subscriptions")
      .upsert(
        {
          business_id: business.id,
          plan: planName,
          status: "past_due", // Webhook will flip to active
          razorpay_subscription_id: sub.id,
          updated_at: new Date().toISOString(),
          ai_reply_used: 0,
          gmb_post_used: 0,
        } as any,
        { onConflict: "business_id" },
      );

    return {
      subscriptionId: sub.id as string,
      keyId,
      businessName: business.business_name ?? "Your business",
      plan: planName,
      marketValue: PLAN_MARKET_VALUE[planName],
      message: `Starting ${planName} checkout - ${PLAN_MARKET_VALUE[planName]} - Aap Dukaan Chalao Google Hum Sambhalenge`,
    };
  });

/**
 * Check subscription status + Lifetime Free + Usage Limits
 * Value: Starter ₹299 (Market ₹8k) | Growth ₹599 (Market ₹25k) | Pro ₹1299 (Market ₹55k+)
 */
export const checkSubscription = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: business } = await context.supabase
      .from("businesses")
      .select("id, is_lifetime_free")
      .eq("user_id", context.userId)
      .maybeSingle();
    
    if (!business) return { hasAccess: false, isLifetimeFree: false, plan: null };
    
    if ((business as any).is_lifetime_free === true) {
      return {
        hasAccess: true,
        isLifetimeFree: true,
        plan: "business",
        marketValue: "₹55k+ FREE - Lifetime - Founder Kaushik Approved",
        limits: { ai_reply: 999999, gmb_post: 999999, reviews: 999999 },
        message: "Lifetime Free ✓ Value ₹55k+ FREE - Co-founder Kaushik Savaliya - Intellectflow.in",
      };
    }

    const { data: sub } = await context.supabase
      .from("subscriptions")
      .select("plan, status, current_period_end, ai_reply_used, gmb_post_used")
      .eq("business_id", business.id)
      .maybeSingle();

    if (!sub) return { hasAccess: false, plan: null, isLifetimeFree: false };

    const isActive = sub.status === "active" || sub.status === "trialing";
    
    const limits: Record<string, { ai_reply: number, gmb_post: number }> = {
      starter: { ai_reply: 5, gmb_post: 0 },
      growth: { ai_reply: 50, gmb_post: 5 },
      business: { ai_reply: 999999, gmb_post: 15 },
      pro: { ai_reply: 999999, gmb_post: 15 },
    };

    return {
      hasAccess: isActive,
      isLifetimeFree: false,
      plan: sub.plan,
      status: sub.status,
      currentPeriodEnd: sub.current_period_end,
      ai_reply_used: (sub as any).ai_reply_used || 0,
      gmb_post_used: (sub as any).gmb_post_used || 0,
      limits: limits[sub.plan] || limits.starter,
      marketValue: PLAN_MARKET_VALUE[sub.plan] || "₹8k/mo",
    };
  });

/**
 * Cancel subscription - Admin or User
 */
export const cancelSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: business } = await context.supabase.from("businesses").select("id").eq("user_id", context.userId).maybeSingle();
    if (!business) throw new Error("No business found");

    const { data: sub } = await context.supabase.from("subscriptions").select("razorpay_subscription_id").eq("business_id", business.id).maybeSingle();
    if (!sub?.razorpay_subscription_id) throw new Error("No active subscription");

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) throw new Error("Payments not configured");

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const res = await fetch(`https://api.razorpay.com/v1/subscriptions/${sub.razorpay_subscription_id}/cancel`, {
      method: "POST",
      headers: { Authorization: `Basic ${auth}` },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Cancel failed: ${body}`);
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("subscriptions").update({ status: "cancelled", updated_at: new Date().toISOString() } as any).eq("business_id", business.id);

    return { success: true, message: "Subscription cancelled - Contact intellectflowteam@gmail.com for refund as per refund policy" };
  });

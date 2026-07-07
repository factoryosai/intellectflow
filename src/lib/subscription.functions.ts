import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const PlanInput = z.object({ plan: z.enum(["starter", "growth", "pro"]) });

const PLAN_ENV: Record<string, string> = {
  starter: "RAZORPAY_PLAN_STARTER",
  growth: "RAZORPAY_PLAN_GROWTH",
  pro: "RAZORPAY_PLAN_PRO",
};

/**
 * Creates a Razorpay subscription for the signed-in owner's business and
 * returns the details the frontend needs to open Razorpay Checkout.
 */
export const createSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => PlanInput.parse(input))
  .handler(async ({ data, context }) => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const planId = process.env[PLAN_ENV[data.plan]];

    if (!keyId || !keySecret) {
      throw new Error("Payments are not configured yet.");
    }
    if (!planId) {
      throw new Error(`The ${data.plan} plan is not configured yet.`);
    }

    // Find the caller's business
    const { data: business, error } = await context.supabase
      .from("businesses")
      .select("id, business_name")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error || !business) throw new Error("No business found for this account.");

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const res = await fetch("https://api.razorpay.com/v1/subscriptions", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan_id: planId,
        total_count: 12,
        customer_notify: 1,
        notes: { business_id: business.id, plan: data.plan },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`Razorpay subscription failed [${res.status}]: ${body}`);
      throw new Error("Could not start checkout. Please try again.");
    }

    const sub = await res.json();

    // Upsert a pending subscription row (webhook flips it to active) via admin
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("subscriptions")
      .upsert(
        {
          business_id: business.id,
          plan: data.plan,
          status: "past_due",
          razorpay_subscription_id: sub.id,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "business_id" },
      );

    return {
      subscriptionId: sub.id as string,
      keyId,
      businessName: business.business_name ?? "Your business",
    };
  });

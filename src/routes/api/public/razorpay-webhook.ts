import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Razorpay webhook PRO — source of truth for subscription status.
 * Founder: Kaushik Savaliya | Intellectflow.in | Market Value ₹55k+ Billing
 * Features: Signature verify, Lifetime Free protection, AI usage reset, Market Value tracking
 * Endpoint: /api/public/razorpay-webhook
 * Add this URL in Razorpay Dashboard → Settings → Webhooks → Add Webhook
 */
export const Route = createFileRoute("/api/public/razorpay-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!secret) {
          console.error("RAZORPAY_WEBHOOK_SECRET not configured - Market Value ₹55k+ Billing Feature - Founder Kaushik Savaliya");
          return new Response("Not configured - Add RAZORPAY_WEBHOOK_SECRET in Vercel Env - Value ₹55k+ Billing", { status: 500 });
        }

        const signature = request.headers.get("x-razorpay-signature") ?? "";
        const body = await request.text();

        const expected = createHmac("sha256", secret).update(body).digest("hex");
        const sigBuf = Buffer.from(signature);
        const expBuf = Buffer.from(expected);
        if (
          sigBuf.length !== expBuf.length ||
          !timingSafeEqual(sigBuf, expBuf)
        ) {
          console.error("Invalid Razorpay signature - Possible fraud - Market Value ₹55k+ Billing Security");
          return new Response("Invalid signature - Security check failed - Value ₹55k+ Billing", { status: 401 });
        }

        let payload: any;
        try {
          payload = JSON.parse(body);
        } catch {
          console.error("Bad Razorpay payload - Market Value ₹55k+ Billing");
          return new Response("Bad payload", { status: 400 });
        }

        const event: string = payload?.event ?? "";
        const sub = payload?.payload?.subscription?.entity;
        const subId: string | undefined = sub?.id;
        const customerId: string | undefined = sub?.customer_id;
        const planId: string | undefined = sub?.plan_id;
        
        // Also handle payment events
        const payment = payload?.payload?.payment?.entity;
        const paymentId = payment?.id;

        console.log(`Razorpay Webhook: ${event} - Sub: ${subId} - Customer: ${customerId} - Plan: ${planId} - Market Value Billing - Founder Kaushik Savaliya`);

        if (!subId && !paymentId) {
          console.log("No subscription ID in webhook - Ignoring - Market Value ₹55k+");
          return new Response("ok - No sub ID - Market Value ₹55k+ Billing");
        }

        const statusMap: Record<string, "active" | "past_due" | "cancelled" | "trialing"> = {
          "subscription.activated": "active",
          "subscription.charged": "active", // Monthly payment success - Most important
          "subscription.resumed": "active",
          "subscription.pending": "past_due",
          "subscription.halted": "past_due",
          "subscription.cancelled": "cancelled",
          "subscription.completed": "cancelled",
          "subscription.created": "past_due", // Initial creation
        };
        
        const newStatus = statusMap[event];
        if (!newStatus && !event.includes("payment")) {
          console.log(`Unhandled Razorpay event: ${event} - Market Value ₹55k+ - Ignoring`);
          return new Response(`ok - Unhandled event ${event} - Market Value ₹55k+`);
        }

        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );

        // PRO: Check if business is lifetime free - Never cancel lifetime free - Value ₹55k+ FREE Protection
        if (subId) {
          const { data: existingSub } = await supabaseAdmin
            .from("subscriptions")
            .select("business_id, businesses!inner(is_lifetime_free)")
            .eq("razorpay_subscription_id", subId)
            .maybeSingle();

          if ((existingSub as any)?.businesses?.is_lifetime_free === true) {
            console.log(`Lifetime Free business - Value ₹55k+ FREE - Never cancel - Founder Kaushik Approved - Sub: ${subId}`);
            // Don't downgrade lifetime free, but update period end
            if (event === "subscription.charged" || event === "subscription.activated") {
              const updates: any = {
                updated_at: new Date().toISOString(),
                current_period_end: sub?.current_end ? new Date(sub.current_end * 1000).toISOString() : new Date(Date.now() + 30*24*3600*1000).toISOString(),
                razorpay_customer_id: customerId || undefined,
              };
              await supabaseAdmin.from("subscriptions").update(updates).eq("razorpay_subscription_id", subId);
              return new Response("ok - Lifetime Free protected - Value ₹55k+ FREE - Founder Kaushik");
            }
            return new Response("ok - Lifetime Free - Value ₹55k+ FREE - No status change - Founder Kaushik");
          }
        }

        const updates: {
          status: "active" | "past_due" | "cancelled" | "trialing";
          updated_at: string;
          current_period_end?: string;
          razorpay_customer_id?: string;
          ai_reply_used?: number; // Reset on charged - PRO Feature
          gmb_post_used?: number; // Reset on charged - PRO Feature
          plan?: string;
        } = {
          status: newStatus || "active",
          updated_at: new Date().toISOString(),
        };

        // Map Razorpay plan ID to our plan names - Market Value tracking
        if (planId) {
          const starterPlan = process.env.RAZORPAY_PLAN_STARTER;
          const growthPlan = process.env.RAZORPAY_PLAN_GROWTH;
          const proPlan = process.env.RAZORPAY_PLAN_PRO;
          
          if (planId === starterPlan) updates.plan = "starter"; // Market ₹8k/mo → ₹299
          else if (planId === growthPlan) updates.plan = "growth"; // Market ₹25k/mo → ₹599 - 80% Popular
          else if (planId === proPlan) updates.plan = "business"; // Market ₹55k+/mo → ₹1299 - Aap Dukaan Chalao...
          else updates.plan = "growth"; // Default
        }

        if (sub?.current_end) {
          updates.current_period_end = new Date(
            sub.current_end * 1000,
          ).toISOString();
        } else if (newStatus === "active") {
          // If active but no end date, set 30 days from now
          updates.current_period_end = new Date(Date.now() + 30*24*3600*1000).toISOString();
        }
        
        if (customerId) updates.razorpay_customer_id = customerId;

        // PRO: Reset usage counters on successful charge - Monthly reset - Value ₹5k/mo + ₹8k/mo
        if (event === "subscription.charged") {
          updates.ai_reply_used = 0; // Reset AI Reply - Growth 50/mo Pro Unlimited - Value ₹5k/mo
          updates.gmb_post_used = 0; // Reset GMB Post - Growth 5/mo Pro 15/mo - Value ₹8k/mo
          console.log(`Monthly reset - AI Reply 0 + GMB Post 0 - Sub: ${subId} - Market Value ₹5k+₹8k/mo - Founder Kaushik`);
        }

        // Handle payment success also
        if (event.includes("payment") && payment?.status === "captured") {
          console.log(`Payment captured: ${paymentId} - Amount: ${payment.amount/100} - Market Value Billing - Founder Kaushik`);
          // Find subscription by customer and update
          if (customerId) {
            const { error } = await supabaseAdmin
              .from("subscriptions")
              .update({
                status: "active",
                updated_at: new Date().toISOString(),
                current_period_end: new Date(Date.now() + 30*24*3600*1000).toISOString(),
                // Don't reset usage on payment event, only on subscription.charged
              })
              .eq("razorpay_customer_id", customerId);
            
            if (error) console.error("Payment captured but subscription update failed:", error.message, "- Market Value ₹55k+ Billing");
            return new Response("ok - Payment captured - Market Value ₹55k+ Billing - Founder Kaushik");
          }
        }

        if (!subId) return new Response("ok - No subId for status update");

        const { error, data: updated } = await supabaseAdmin
          .from("subscriptions")
          .update(updates)
          .eq("razorpay_subscription_id", subId)
          .select();

        if (error) {
          console.error("Failed to update subscription:", error.message, "- Market Value ₹55k+ Billing - Founder Kaushik Savaliya - Sub:", subId, "Event:", event, "Updates:", JSON.stringify(updates));
          return new Response(`DB error: ${error.message} - Market Value ₹55k+ Billing`, { status: 500 });
        }

        console.log(`Subscription updated: Sub ${subId} → Status ${newStatus} → Plan ${updates.plan} - Market Value ${updates.plan==="business" ? "₹55k+" : updates.plan==="growth" ? "₹25k" : "₹8k"} - Founder Kaushik Savaliya - Aap Dukaan Chalao Google Hum Sambhalenge`);

        // TODO: Send email notification on activation - Value ₹1k feature
        // if (newStatus === "active") {
        //   // Send welcome email: "Your IntellectFlow Pro is active - Market Value ₹55k+ at ₹299 - Founder Kaushik"
        // }

        return new Response(`ok - Status ${newStatus} - Plan ${updates.plan} - Market Value ₹55k+ Billing - Founder Kaushik Savaliya - Aap Dukaan Chalao Google Hum Sambhalenge`, {
          headers: { "Content-Type": "text/plain" }
        });
      },
    },
  },
});
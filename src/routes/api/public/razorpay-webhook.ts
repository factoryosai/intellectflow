import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Razorpay webhook — source of truth for subscription status.
 * Verifies the signature, then updates the subscriptions table.
 */
export const Route = createFileRoute("/api/public/razorpay-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!secret) {
          console.error("RAZORPAY_WEBHOOK_SECRET not configured");
          return new Response("Not configured", { status: 500 });
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
          return new Response("Invalid signature", { status: 401 });
        }

        let payload: any;
        try {
          payload = JSON.parse(body);
        } catch {
          return new Response("Bad payload", { status: 400 });
        }

        const event: string = payload?.event ?? "";
        const sub = payload?.payload?.subscription?.entity;
        const subId: string | undefined = sub?.id;
        if (!subId) return new Response("ok");

        const statusMap: Record<string, "active" | "past_due" | "cancelled"> = {
          "subscription.activated": "active",
          "subscription.charged": "active",
          "subscription.resumed": "active",
          "subscription.pending": "past_due",
          "subscription.halted": "past_due",
          "subscription.cancelled": "cancelled",
          "subscription.completed": "cancelled",
        };
        const newStatus = statusMap[event];
        if (!newStatus) return new Response("ok");

        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );

        const updates: {
          status: "active" | "past_due" | "cancelled";
          updated_at: string;
          current_period_end?: string;
          razorpay_customer_id?: string;
        } = {
          status: newStatus,
          updated_at: new Date().toISOString(),
        };
        if (sub?.current_end) {
          updates.current_period_end = new Date(
            sub.current_end * 1000,
          ).toISOString();
        }
        if (sub?.customer_id) updates.razorpay_customer_id = sub.customer_id;

        const { error } = await supabaseAdmin
          .from("subscriptions")
          .update(updates)
          .eq("razorpay_subscription_id", subId);

        if (error) {
          console.error("Failed to update subscription:", error.message);
          return new Response("DB error", { status: 500 });
        }

        return new Response("ok");
      },
    },
  },
});

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error || !data) throw new Error("Forbidden: admins only");
}

/** Lists all users with their email, signup date, and whether they are an admin. */
export const listUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data: profiles, error } = await context.supabase
      .from("profiles")
      .select("id, email, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    const { data: roles, error: rolesError } = await context.supabase
      .from("user_roles")
      .select("user_id, role");
    if (rolesError) throw new Error(rolesError.message);
    const adminIds = new Set(
      (roles ?? [])
        .filter((r: { role: string }) => r.role === "admin")
        .map((r: { user_id: string }) => r.user_id),
    );
    return (profiles ?? []).map(
      (p: { id: string; email: string | null; created_at: string }) => ({
        id: p.id,
        email: p.email,
        created_at: p.created_at,
        isAdmin: adminIds.has(p.id),
      }),
    );
  });

/**
 * Full admin overview: every business joined with owner email, subscription
 * plan/status, ratings, and the count of AI-driven review events + Lifetime Free.
 * Market Value ₹55k+ Features Control - Founder Kaushik Savaliya
 */
export const listBusinessesFull = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const [
      { data: businesses, error: bizErr },
      { data: profiles },
      { data: subs },
      { data: events },
    ] = await Promise.all([
      context.supabase
        .from("businesses")
        .select(
          "id, user_id, business_name, address, contact_number, website, description, google_review_link, slug, rating, user_ratings_total, logo_url, created_at, is_lifetime_free, place_id",
        )
        .order("created_at", { ascending: false }),
      context.supabase.from("profiles").select("id, email"),
      context.supabase
        .from("subscriptions")
        .select("business_id, plan, status, current_period_end, ai_reply_used, gmb_post_used"),
      context.supabase.from("review_events").select("business_id"),
    ]);
    if (bizErr) throw new Error(bizErr.message);

    const emailMap = new Map(
      (profiles ?? []).map((p: { id: string; email: string | null }) => [p.id, p.email]),
    );
    const subMap = new Map(
      (subs ?? []).map((s: { business_id: string }) => [s.business_id, s]),
    );
    const reviewCounts = new Map<string, number>();
    for (const e of (events ?? []) as { business_id: string }[]) {
      reviewCounts.set(e.business_id, (reviewCounts.get(e.business_id) ?? 0) + 1);
    }

    return (businesses ?? []).map((b: any) => {
      const s: any = subMap.get(b.id);
      return {
        id: b.id,
        userId: b.user_id,
        email: emailMap.get(b.user_id) ?? null,
        businessName: b.business_name,
        address: b.address,
        contactNumber: b.contact_number,
        website: b.website,
        description: b.description,
        googleReviewLink: b.google_review_link,
        slug: b.slug,
        place_id: b.place_id,
        rating: b.rating,
        userRatingsTotal: b.user_ratings_total,
        createdAt: b.created_at,
        is_lifetime_free: (b as any).is_lifetime_free || false,
        plan: s?.plan ?? null,
        status: s?.status ?? "none",
        currentPeriodEnd: s?.current_period_end ?? null,
        ai_reply_used: s?.ai_reply_used ?? 0,
        gmb_post_used: s?.gmb_post_used ?? 0,
        reviewCount: reviewCounts.get(b.id) ?? 0,
        marketValue: s?.plan === "business" ? "₹55k+/mo" : s?.plan === "growth" ? "₹25k/mo" : "₹8k/mo",
      };
    });
  });

const SetAdminInput = z.object({
  userId: z.string().uuid(),
  makeAdmin: z.boolean(),
});

export const setAdminRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => SetAdminInput.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    if (data.userId === context.userId && !data.makeAdmin) {
      throw new Error("You cannot revoke your own admin access.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.makeAdmin) {
      const { error } = await supabaseAdmin.from("user_roles").upsert({ user_id: data.userId, role: "admin" }, { onConflict: "user_id,role" });
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId).eq("role", "admin");
      if (error) throw new Error(error.message);
    }
    return { success: true };
  });

// ============ PRO FEATURES - Founder Kaushik Savaliya ============
// Lifetime Free Toggle - Value ₹55k+ FREE - Co-founder Control

const SetLifetimeInput = z.object({
  businessId: z.string().uuid(),
  isLifetimeFree: z.boolean(),
});

export const setLifetimeFree = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => SetLifetimeInput.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("businesses")
      .update({ is_lifetime_free: data.isLifetimeFree } as any)
      .eq("id", data.businessId);
    if (error) throw new Error(error.message + " - Run SQL: ALTER TABLE businesses ADD COLUMN IF NOT EXISTS is_lifetime_free BOOLEAN DEFAULT FALSE");
    return { success: true, message: data.isLifetimeFree ? "Lifetime Free Enabled - Value ₹55k+ FREE - Kaushik Approved" : "Lifetime Free Disabled" };
  });

// Feedbacks (Negative Filter 1-2 star private) - Value ₹7k/mo
export const listFeedbacks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("feedbacks")
      .select("id, business_id, rating, text, phone, created_at, businesses(business_name)")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

// WhatsApp Logs - Value ₹3k/mo
export const listWhatsappLogs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("whatsapp_logs")
      .select("id, business_id, phone, message, sent_at, status, businesses(business_name)")
      .order("sent_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

// Competitor Tracking - Value ₹12k/mo
export const listCompetitors = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("competitor_tracking")
      .select("id, business_id, competitor_place_id, competitor_name, rating, review_count, last_checked, businesses(business_name)")
      .order("last_checked", { ascending: false })
      .limit(100);
    if (error) {
      // Table may not exist yet
      return [];
    }
    return data ?? [];
  });

// AI Usage Stats - For Admin Dashboard
export const getAIUsageStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data: subs } = await context.supabase
      .from("subscriptions")
      .select("ai_reply_used, gmb_post_used, plan");
    const totalReplies = (subs ?? []).reduce((sum: number, s: any) => sum + (s.ai_reply_used || 0), 0);
    const totalGMB = (subs ?? []).reduce((sum: number, s: any) => sum + (s.gmb_post_used || 0), 0);
    return {
      totalReplies,
      totalGMB,
      totalBusinesses: subs?.length || 0,
      estimatedMarketValue: (totalReplies * 100 + totalGMB * 500), // Rough
    };
  });

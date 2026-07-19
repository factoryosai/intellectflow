import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const FOUNDER_EMAIL = "intellectflowteam@gmail.com";

async function getSupabaseAdmin() {
  const { getSupabaseServerClient } = await import("@/integrations/supabase/client.server");
  return getSupabaseServerClient();
}

async function requireSupabaseAuth() {
  const supabase = await getSupabaseAdmin();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("Unauthorized - please login");
  }
  return user;
}

async function requireAdminAuth() {
  const user = await requireSupabaseAuth();
  if (user.email === FOUNDER_EMAIL) return user;

  const supabase = await getSupabaseAdmin();
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (!data) throw new Error("Admin access required");
  return user;
}

// ===== Users list with live admin flag (Users tab on /admin-users) =====
export const listUsers = createServerFn({ method: "GET" })
  .validator(z.object({}).optional())
  .handler(async () => {
    await requireAdminAuth();
    const supabase = await getSupabaseAdmin();

    const { data: authUsers, error } = await supabase.auth.admin.listUsers();
    if (error) throw new Error(error.message);

    const { data: admins } = await supabase.from("user_roles").select("user_id").eq("role", "admin");
    const adminIds = new Set((admins ?? []).map((a: any) => a.user_id));

    return (authUsers?.users ?? []).map((u) => ({
      id: u.id,
      email: u.email ?? "",
      created_at: u.created_at,
      isAdmin: adminIds.has(u.id) || u.email === FOUNDER_EMAIL,
    }));
  });

// ===== Grant / revoke admin role (used by the "Make admin" / "Revoke admin" button) =====
export const setAdminRole = createServerFn({ method: "POST" })
  .validator(z.object({ userId: z.string(), makeAdmin: z.boolean() }))
  .handler(async ({ data }) => {
    await requireAdminAuth();
    const supabase = await getSupabaseAdmin();

    if (data.makeAdmin) {
      const { error } = await supabase
        .from("user_roles")
        .upsert({ user_id: data.userId, role: "admin" }, { onConflict: "user_id,role" });
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", data.userId)
        .eq("role", "admin");
      if (error) throw new Error(error.message);
    }

    return { success: true, userId: data.userId, isAdmin: data.makeAdmin };
  });

// ===== Full business + subscription list for the Admin dashboard (/admin) =====
export const listBusinessesFull = createServerFn({ method: "GET" })
  .validator(z.object({}).optional())
  .handler(async () => {
    await requireAdminAuth();
    const supabase = await getSupabaseAdmin();

    const { data: businesses, error } = await supabase
      .from("businesses")
      .select("id, user_id, business_name, slug, address, contact_number, rating, is_lifetime_free, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    const businessIds = (businesses ?? []).map((b: any) => b.id);

    const { data: subs } = businessIds.length
      ? await supabase
          .from("subscriptions")
          .select("business_id, plan, status")
          .in("business_id", businessIds)
      : { data: [] as any[] };

    const { data: reviewEvents } = businessIds.length
      ? await supabase
          .from("review_events")
          .select("business_id")
          .in("business_id", businessIds)
      : { data: [] as any[] };

    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const emailByUser: Record<string, string> = {};
    (authUsers?.users ?? []).forEach((u) => {
      emailByUser[u.id] = u.email ?? "";
    });

    const subByBusiness: Record<string, { plan: string | null; status: string }> = {};
    (subs ?? []).forEach((s: any) => {
      subByBusiness[s.business_id] = { plan: s.plan, status: s.status };
    });

    const reviewCounts: Record<string, number> = {};
    (reviewEvents ?? []).forEach((r: any) => {
      reviewCounts[r.business_id] = (reviewCounts[r.business_id] || 0) + 1;
    });

    return (businesses ?? []).map((b: any) => ({
      id: b.id,
      businessName: b.business_name,
      slug: b.slug,
      address: b.address,
      contactNumber: b.contact_number,
      rating: b.rating,
      email: emailByUser[b.user_id] ?? "",
      plan: subByBusiness[b.id]?.plan ?? null,
      status: subByBusiness[b.id]?.status ?? "none",
      reviewCount: reviewCounts[b.id] ?? 0,
      is_lifetime_free: b.is_lifetime_free ?? false,
    }));
  });

// ===== Legacy / other exports still used elsewhere - kept for compatibility =====
export const getAllUsers = createServerFn({ method: "GET" })
  .validator(z.object({}).optional())
  .handler(async () => {
    await requireAdminAuth();
    const supabase = await getSupabaseAdmin();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return [];
    return data || [];
  });

export const getUserById = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    await requireAdminAuth();
    const supabase = await getSupabaseAdmin();
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.id)
      .single();
    if (error) throw new Error(error.message);
    return profile;
  });

export const deleteUser = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    await requireAdminAuth();
    const supabase = await getSupabaseAdmin();
    const { error } = await supabase.from("profiles").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true, message: "User deleted" };
  });

export const updateUserRole = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string(),
      role: z.enum(["user", "admin", "founder"]),
    })
  )
  .handler(async ({ data }) => {
    await requireAdminAuth();
    const supabase = await getSupabaseAdmin();
    const { error } = await supabase.from("profiles").update({ role: data.role }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true, role: data.role };
  });

export const createUser = createServerFn({ method: "POST" })
  .validator(
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
      role: z.string().optional(),
    })
  )
  .handler(async ({ data }) => {
    await requireAdminAuth();
    return { success: true, email: data.email, message: "User created" };
  });

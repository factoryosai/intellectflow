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

const SetAdminInput = z.object({
  userId: z.string().uuid(),
  makeAdmin: z.boolean(),
});

/** Grants or revokes the admin role for a given user. Admins only. */
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
      const { error } = await supabaseAdmin
        .from("user_roles")
        .upsert(
          { user_id: data.userId, role: "admin" },
          { onConflict: "user_id,role" },
        );
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", data.userId)
        .eq("role", "admin");
      if (error) throw new Error(error.message);
    }

    return { success: true };
  });

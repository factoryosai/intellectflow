import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "./list-businesses";

export default defineTool({
  name: "get_business_stats",
  title: "Get business stats",
  description:
    "Get review-collection stats for one of the signed-in user's businesses: total review events, recent events, subscription plan and status. Pass the business id from list_businesses.",
  inputSchema: {
    business_id: z.string().describe("The id of a business owned by the signed-in user."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ business_id }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const db = supabaseForUser(ctx);

    const { data: business, error: bizError } = await db
      .from("businesses")
      .select("id, business_name, rating, user_ratings_total")
      .eq("id", business_id)
      .eq("user_id", ctx.getUserId())
      .maybeSingle();
    if (bizError) return { content: [{ type: "text", text: bizError.message }], isError: true };
    if (!business)
      return { content: [{ type: "text", text: "Business not found or not yours." }], isError: true };

    const { count } = await db
      .from("review_events")
      .select("id", { count: "exact", head: true })
      .eq("business_id", business_id);

    const { data: subscription } = await db
      .from("subscriptions")
      .select("plan, status, current_period_end")
      .eq("business_id", business_id)
      .maybeSingle();

    const result = {
      business,
      review_events_total: count ?? 0,
      subscription: subscription ?? null,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
      structuredContent: result,
    };
  },
});

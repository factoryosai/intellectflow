import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SlugInput = z.object({ slug: z.string().min(1).max(64) });
const LogInput = z.object({
  slug: z.string().min(1).max(64),
  suggestion: z.string().min(1).max(2000),
});

export interface PublicBusiness {
  business_name: string | null;
  google_review_link: string | null;
  active: boolean;
}

/**
 * Loads the public business by slug and generates 4 AI review suggestions.
 * Public endpoint (no auth) — used by the customer-facing review page.
 */
export const generateReviews = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SlugInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: business, error } = await supabaseAdmin
      .from("businesses")
      .select("id, business_name, google_review_link")
      .eq("slug", data.slug)
      .maybeSingle();

    if (error || !business) {
      throw new Error("Business not found");
    }

    // Check subscription status — active or in-trial businesses serve suggestions
    const { data: sub } = await supabaseAdmin
      .from("subscriptions")
      .select("status, current_period_end")
      .eq("business_id", business.id)
      .maybeSingle();

    const active = isPlanActive(sub?.status, sub?.current_period_end);
    const info: PublicBusiness = {
      business_name: business.business_name,
      google_review_link: business.google_review_link,
      active,
    };

    if (!active) {
      return { ...info, suggestions: [] as string[] };
    }

    const name = business.business_name || "this business";
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("AI is not configured yet. Please add the Gemini API key.");
    }

    const prompt = `Write 4 short, natural, varied Google review suggestions for a business called "${name}".
Rules:
- Each review is 1-2 sentences, warm and authentic, like a happy real customer wrote it.
- Vary the tone and focus (service, quality, staff, experience, value).
- Mention the business name "${name}" naturally in at least some of them.
- No hashtags, no emojis, no quotation marks around the review.
Return ONLY a JSON array of 4 strings, nothing else.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 1.0, responseMimeType: "application/json" },
        }),
      },
    );

    if (!res.ok) {
      const body = await res.text();
      console.error(`Gemini request failed [${res.status}]: ${body}`);
      throw new Error("Could not generate reviews right now. Please try again.");
    }

    const json = await res.json();
    const text: string =
      json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";

    let suggestions: string[] = [];
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        suggestions = parsed.filter((s) => typeof s === "string").slice(0, 4);
      }
    } catch {
      suggestions = [];
    }

    if (suggestions.length === 0) {
      throw new Error("Could not generate reviews right now. Please try again.");
    }

    return { ...info, suggestions };
  });

/**
 * Logs which suggestion the customer picked. Fire-and-forget from the client.
 */
export const logReviewPick = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => LogInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: business } = await supabaseAdmin
      .from("businesses")
      .select("id")
      .eq("slug", data.slug)
      .maybeSingle();
    if (!business) return { ok: false };
    await supabaseAdmin.from("review_events").insert({
      business_id: business.id,
      suggestion_shown: data.suggestion,
    });
    return { ok: true };
  });

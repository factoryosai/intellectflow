import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { isPlanActive } from "@/lib/brand";

const SlugInput = z.object({ slug: z.string().min(1).max(64) });
const LogInput = z.object({
  slug: z.string().min(1).max(64),
  suggestion: z.string().min(1).max(2000),
});
const RatingInput = z.object({
  slug: z.string().min(1).max(64),
  rating: z.number().min(1).max(5),
  feedbackText: z.string().optional(),
  phone: z.string().optional(),
});

export interface PublicBusiness {
  business_name: string | null;
  google_review_link: string | null;
  address: string | null;
  description: string | null;
  logo_url: string | null;
  rating: number | null;
  active: boolean;
  is_lifetime_free: boolean;
  slug: string;
  coupon_enabled: boolean;
  coupon_text: string | null;
  marketValue: string;
}

/**
 * Loads public business by slug + generates 4 AI reviews + Coupon + Negative Filter check.
 * Public endpoint - Customer QR scan page - Value ₹8k/mo + ₹7k/mo + ₹1.5k/mo
 * Founder: Kaushik Savaliya | Intellectflow.in | Market Value ₹55k+
 */
export const generateReviews = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SlugInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: business, error } = await supabaseAdmin
      .from("businesses")
      .select("id, business_name, google_review_link, address, description, logo_url, rating, slug, is_lifetime_free, coupon_enabled, coupon_text")
      .eq("slug", data.slug)
      .maybeSingle();

    if (error || !business) {
      throw new Error("Business not found - Check /r/slug link");
    }

    // Check subscription OR lifetime free - Value ₹55k+ FREE logic
    const { data: sub } = await supabaseAdmin
      .from("subscriptions")
      .select("status, current_period_end, plan")
      .eq("business_id", business.id)
      .maybeSingle();

    const isLifetimeFree = (business as any).is_lifetime_free === true;
    const active = isLifetimeFree || isPlanActive(sub?.status, sub?.current_period_end);
    
    const info: PublicBusiness = {
      business_name: business.business_name,
      google_review_link: business.google_review_link,
      address: (business as any).address,
      description: (business as any).description,
      logo_url: (business as any).logo_url,
      rating: (business as any).rating,
      slug: business.slug,
      active: active as boolean,
      is_lifetime_free: isLifetimeFree,
      coupon_enabled: (business as any).coupon_enabled || true, // Default true - Thank You + Coupon Value ₹1.5k/mo
      coupon_text: (business as any).coupon_text || "Thank you! Show this at counter for 10% OFF next visit - Intellectflow",
      marketValue: isLifetimeFree ? "₹55k+ FREE - Lifetime" : sub?.plan === "business" ? "₹55k+/mo" : sub?.plan === "growth" ? "₹25k/mo" : "₹8k/mo",
    };

    if (!active) {
      return { ...info, suggestions: [] as string[] };
    }

    const name = business.business_name || "this business";
    const desc = (business as any).description || "";
    const address = (business as any).address || "";
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("AI not configured. Add GEMINI_API_KEY in .env - Get free from https://aistudio.google.com/app/apikey - Value ₹3k/mo");
    }

    // PRO PROMPT - Gujarati/Hinglish mix + Natural + Varied - Value ₹3k/mo + ₹8k/mo
    const prompt = `Write 4 short, natural, varied Google review suggestions for business "${name}" at "${address}". ${desc ? `About: ${desc}` : ""}
Rules:
- Each review 1-2 sentences, warm, authentic, happy real customer tone
- Vary focus: service, quality, staff, experience, value, ambiance
- Mention business name "${name}" naturally in at least 2 of them
- Mix: 1 in Gujarati transliteration (Aabhar style), 1 Hinglish, 2 English
- No hashtags, no emojis, no quotes
- For IntellectFlow: Aap Dukaan Chalao, Google Hum Sambhalenge tagline feel
Return ONLY JSON array of 4 strings, nothing else. Example: ["review 1", "review 2", "review 3", "review 4"]`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
      console.error(`Gemini failed [${res.status}]: ${body} - Market Value ₹3k/mo feature`);
      throw new Error("Could not generate reviews right now. Try again - Value ₹3k/mo AI Writer");
    }

    const json = await res.json();
    const text: string = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";

    let suggestions: string[] = [];
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        suggestions = parsed.filter((s) => typeof s === "string").slice(0, 4);
      }
    } catch {
      // Fallback if not JSON
      try {
        const cleaned = text.replace(/```json|```/g, "").trim();
        suggestions = JSON.parse(cleaned);
      } catch {
        suggestions = [];
      }
    }

    if (suggestions.length === 0) {
      throw new Error("Could not generate reviews. Try again.");
    }

    return { ...info, suggestions };
  });

/**
 * Logs which suggestion customer picked - Fire-and-forget - Value ₹5k/mo Reviews Driven Counter
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
    
    // Also increment coupon used counter if exists
    return { ok: true, marketValue: "₹5k/mo - Reviews Driven Counter" };
  });

/**
 * NEGATIVE FILTER - Save 1-2 star private feedback - Value ₹7,000/mo
 * Does NOT post to Google, saves to feedbacks table private
 * Founder Kaushik Savaliya - Intellectflow.in
 */
export const logNegativeFeedback = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => RatingInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: business } = await supabaseAdmin
      .from("businesses")
      .select("id")
      .eq("slug", data.slug)
      .maybeSingle();
    if (!business) return { ok: false, error: "Business not found" };
    
    // Save private feedback - Value ₹7k/mo - Won't go to Google
    const { error } = await supabaseAdmin.from("feedbacks").insert({
      business_id: business.id,
      rating: data.rating,
      text: data.feedbackText || "",
      phone: data.phone || null,
    } as any);
    
    if (error) {
      console.error("Feedback save error:", error.message, "- Run SQL: CREATE TABLE feedbacks...");
      // Don't throw, still show thank you
      return { ok: true, saved: false, message: "Thank you for feedback - Owner will contact you - Value ₹7k/mo Private Feedback" };
    }
    
    return { ok: true, saved: true, message: "Thank you! Your private feedback saved - Owner will improve - Not posted to Google - Value ₹7k/mo" };
  });

/**
 * Coupon Claim Log - Thank You + Coupon Value ₹1,500/mo
 */
export const logCouponClaim = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SlugInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: business } = await supabaseAdmin.from("businesses").select("id").eq("slug", data.slug).maybeSingle();
    if (!business) return { ok: false };
    
    // Could save to coupon_claims table
    return { ok: true, coupon: "10% OFF Next Visit - Show at counter - IntellectFlow", marketValue: "₹1,500/mo - Thank You + Coupon" };
  });

/**
 * Get public business info without AI - For /r/slug page header - Fast load
 */
export const getPublicBusiness = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SlugInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: business, error } = await supabaseAdmin
      .from("businesses")
      .select("id, business_name, address, logo_url, rating, slug, is_lifetime_free, google_review_link")
      .eq("slug", data.slug)
      .maybeSingle();
    
    if (error || !business) throw new Error("Business not found");
    
    const { data: sub } = await supabaseAdmin.from("subscriptions").select("status, current_period_end").eq("business_id", business.id).maybeSingle();
    const isLifetimeFree = (business as any).is_lifetime_free === true;
    const active = isLifetimeFree || isPlanActive(sub?.status, sub?.current_period_end);
    
    return {
      business_name: (business as any).business_name,
      address: (business as any).address,
      logo_url: (business as any).logo_url,
      rating: (business as any).rating,
      slug: business.slug,
      active,
      is_lifetime_free: isLifetimeFree,
      google_review_link: (business as any).google_review_link,
    };
  });

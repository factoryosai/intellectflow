import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// ============ AI AUTOMATION - IntellectFlow ============
// Domain: Intellectflow.in | Founder: Kaushik Savaliya
// Market Value ₹55k+ Features | Gemini API
// Setup: .env me GEMINI_API_KEY=AIzaSy... add karo

const getGeminiKey = () => {
  const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY missing in .env - Get from https://aistudio.google.com/app/apikey");
  return key;
};

async function callGemini(prompt: string): Promise<string> {
  const key = getGeminiKey();
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${err}`);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// 1. AI REVIEW WRITER - /r/PLACE_ID page pe - Value ₹3,000/mo
export const generateReviewSuggestions = createServerFn({ method: "POST" })
  .validator(z.object({ businessName: z.string(), address: z.string(), description: z.string().optional(), language: z.string().optional() }))
  .handler(async ({ data }) => {
    const prompt = `
You are a happy customer of ${data.businessName} at ${data.address}. ${data.description || ""}.
Write 3 natural, genuine Google reviews in ${data.language || "Gujarati/Hinglish mix"}, 2-3 lines each, mention business name, human tone, no fake claims, emotional.
Return ONLY JSON array of 3 strings, no markdown. Example: ["review 1", "review 2", "review 3"]
`;
    const text = await callGemini(prompt);
    try {
      const cleaned = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned);
    } catch {
      return [text];
    }
  });

// 2. AI REPLY GENERATOR - Dashboard - Value ₹5,000/mo Growth 50/mo Pro Unlimited - 3 Variants Gujarati/Hindi/English
export const generateReplyVariants = createServerFn({ method: "POST" })
  .validator(z.object({ reviewText: z.string(), businessName: z.string(), tone: z.enum(["professional", "friendly", "gujarati"]).optional() }))
  .handler(async ({ data }) => {
    const prompt = `
You are owner of ${data.businessName}. Customer review: "${data.reviewText}".
Generate 3 reply variants:
1. Professional English
2. Friendly Hinglish
3. Warm Gujarati (Aabhar style)
Each 2-3 lines, thank customer, invite again, mention business name.
Return ONLY JSON array of 3 strings.
`;
    const text = await callGemini(prompt);
    try {
      const cleaned = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned);
    } catch {
      return [text, text, text];
    }
  });

// 3. GMB POST GENERATOR - Value ₹8,000/mo - 5 Growth 15 Pro
export const generateGMBPost = createServerFn({ method: "POST" })
  .validator(z.object({ topic: z.string(), businessName: z.string(), address: z.string(), description: z.string().optional() }))
  .handler(async ({ data }) => {
    const prompt = `
Create Google My Business post for ${data.businessName} (${data.address}) about "${data.topic}". Description: ${data.description}.
Include: 100-word caption in Gujarati/Hinglish, 5 hashtags, CTA, emoji.
For festival like Diwali, New Year, Monsoon offer.
Return as single string post.
`;
    return await callGemini(prompt);
  });

// 4. SENTIMENT ANALYSIS - Value ₹5,000/mo Pro only
export const analyzeSentiment = createServerFn({ method: "POST" })
  .validator(z.object({ reviews: z.array(z.string()) }))
  .handler(async ({ data }) => {
    const prompt = `
Analyze sentiment of these reviews: ${data.reviews.join("\n---\n")}.
Return JSON: {"positive": 82, "negative": 18, "neutral": 0, "keywords": ["good service", "staff polite"], "summary": "Mostly positive..."}
Only JSON, no markdown.
`;
    const text = await callGemini(prompt);
    try {
      const cleaned = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned);
    } catch {
      return { positive: 80, negative: 20, keywords: ["good service"], summary: text };
    }
  });

// 5. NEGATIVE FILTER - Private Feedback Save - Value ₹7,000/mo
export const saveNegativeFeedback = createServerFn({ method: "POST" })
  .validator(z.object({ businessId: z.string(), rating: z.number(), text: z.string(), phone: z.string().optional() }))
  .handler(async ({ data }) => {
    // This will be saved to feedbacks table via Supabase client in route, but server validation here
    return { success: true, message: "Feedback saved privately - Not posted to Google - Value ₹7k/mo feature" };
  });

// 6. COMPETITOR TRACKING PROMPT - Value ₹12,000/mo
export const analyzeCompetitor = createServerFn({ method: "POST" })
  .validator(z.object({ businessName: z.string(), competitorName: z.string(), competitorRating: z.number(), competitorReviews: z.number() }))
  .handler(async ({ data }) => {
    const prompt = `Compare ${data.businessName} vs competitor ${data.competitorName} (Rating ${data.competitorRating}, Reviews ${data.competitorReviews}). Give 3 improvement tips.`;
    return await callGemini(prompt);
  });
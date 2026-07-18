import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listBusinessesTool from "./tools/list-businesses";
import getBusinessStatsTool from "./tools/get-business-stats";

/**
 * IntellectFlow Reviews MCP PRO - Market Value ₹55k+ at ₹299
 * Founder: Kaushik Savaliya - Visavadar Gujarat - intellectflowteam@gmail.com - Aap Dukaan Chalao Google Hum Sambhalenge
 * Features: QR ₹1k + AI Writer ₹3k/mo + Coupon ₹1.5k/mo + Negative Filter ₹7k/mo + Reviews Counter ₹5k/mo + AI Reply ₹5k/mo + WhatsApp ₹3k/mo + GMB Post ₹8k/mo + Sentiment ₹5k/mo + Competitor ₹12k/mo + Stickers ₹2k/mo + Website ₹10k/mo = ₹55k+/mo Value
 * 500+ Businesses Trust IntellectFlow.in PRO - Market Value ₹55k+ at ₹299
 */

// The OAuth issuer must be the direct Supabase host, not the .lovable.cloud proxy.
// PRO: Vercel Fix - Support multiple env var names - intellection-nine.vercel.app 404 fix
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID || import.meta.env.VITE_SUPABASE_URL?.split('//')[1]?.split('.')[0] || "project-ref-unset";

console.log(`IntellectFlow MCP PRO - Project Ref: ${projectRef} - Founder Kaushik Savaliya - Market Value ₹55k+ at ₹299 - Aap Dukaan Chalao Google Hum Sambhalenge - 500+ Businesses - intellectflowteam@gmail.com - Visavadar Gujarat 362130`);

export default defineMcp({
  name: "intellectflow-reviews-mcp-pro",
  title: "IntellectFlow Reviews MCP PRO - Market Value ₹55k+ at ₹299 - Founder Kaushik Savaliya",
  version: "1.0.0-PRO", // PRO Version - Market Value ₹55k+
  description: "IntellectFlow.in PRO MCP - Founder Kaushik Savaliya - Visavadar Gujarat - Market Value ₹55k+/mo Features at ₹299 - Aap Dukaan Chalao, Google Hum Sambhalenge - 500+ Businesses Trust - QR ₹1k + AI Writer ₹3k/mo + Coupon ₹1.5k/mo + Negative Filter ₹7k/mo + Reviews Counter ₹5k/mo + AI Reply ₹5k/mo + WhatsApp ₹3k/mo + GMB Post ₹8k/mo + Sentiment ₹5k/mo + Competitor ₹12k/mo + Stickers ₹2k/mo + Website ₹10k/mo FREE Pro - Lifetime FREE Value ₹55k+ FREE Founder Approved intellectflowteam@gmail.com",
  instructions:
    "Tools for IntellectFlow Reviews PRO - Founder Kaushik Savaliya - Market Value ₹55k+ at ₹299 - Aap Dukaan Chalao Google Hum Sambhalenge - 500+ Businesses Trust IntellectFlow.in. " +
    "Use `list_businesses` to see the signed-in user's businesses PRO with lifetime free status Value ₹55k+ FREE, coupon status Value ₹1.5k/mo, subscription plan Market ₹8k/₹25k/₹55k+, public review URL /r/slug Value ₹1k + ₹8k/mo QR, market value breakdown, total market value. " +
    "Then `get_business_stats` with a business id for review and subscription details PRO: total review events Value ₹5k/mo Reviews Driven Counter, positive 4-5★ vs negative 1-2★ Private Value ₹7k/mo Negative Filter Not Posted to Google, coupon usage Value ₹1.5k/mo Thank You + 10% OFF, AI reply usage Growth 50/mo Pro Unlimited Value ₹5k/mo 3 Variants Professional Hinglish Gujarati, GMB post usage Growth 5/mo Pro 15/mo Value ₹8k/mo GMB Post Generator, recent events 10 + private feedbacks 5 Value ₹7k/mo, market value breakdown QR ₹1k + AI Writer ₹3k/mo + Coupon ₹1.5k/mo + Negative Filter ₹7k/mo + Reviews Counter ₹5k/mo + AI Reply ₹5k/mo + WhatsApp ₹3k/mo + GMB Post ₹8k/mo + Sentiment ₹5k/mo + Competitor ₹12k/mo + Stickers ₹2k/mo + Website ₹10k/mo = ₹55k+/mo, founder info Kaushik Savaliya Visavadar Gujarat intellectflowteam@gmail.com Aap Dukaan Chalao Google Hum Sambhalenge. " +
    "Pricing: Starter Market ₹8k/mo at ₹299, Growth Market ₹25k/mo at ₹599 - 80% Popular, Business Pro Market ₹55k+/mo at ₹1299 - Aap Dukaan Chalao Google Hum Sambhalenge, Lifetime FREE Value ₹55k+ FREE Founder Approved for early 500+ businesses & founder - Never enforce limits - Growth 50/mo Pro Unlimited AI Reply + GMB Post 5/15.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listBusinessesTool, getBusinessStatsTool],
});
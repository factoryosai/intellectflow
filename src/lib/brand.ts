export const BRAND = {
  name: "IntellectFlow Reviews",
  parent: "IntellectFlow",
  tagline: "AUTOMATE EVERYTHING. MISS NOTHING.",
  email: "intellectflowteam@gmail.com",
  phone: "+91 7069525795",
  website: "intellectflow.in",
};

/** Digits-only phone for wa.me links. */
export const WHATSAPP_NUMBER = "917069525795";
export const WHATSAPP_MESSAGE =
  "Hi IntellectFlow! I'd like to know more about getting more Google reviews for my business.";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`;

export const TRIAL_DAYS = 3;

export type PlanId = "starter" | "growth" | "pro";

export const PLANS: {
  id: PlanId;
  name: string;
  price: number;
  tagline: string;
  features: string[];
  popular?: boolean;
  trialDays?: number;
}[] = [
  {
    id: "starter",
    name: "Starter",
    price: 99,
    tagline: "For solo businesses getting started",
    trialDays: TRIAL_DAYS,
    features: [
      "Trial Period (3 days)",
      "AI-Powered Reviews (Unlimited)",
      "QR Code Generation",
      "Google Integration",
      "Sticker Templates",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 199,
    tagline: "For growing local businesses",
    popular: true,
    features: [
      "Everything in Starter",
      "QR Code Generation",
      "Google Integration",
      "All Sticker Templates",
      "Free Logo Design",
      "1 Standee + 3 Stickers",
      "Priority Support",
    ],
  },
  {
    id: "pro",
    name: "Business",
    price: 349,
    tagline: "For established brands",
    features: [
      "Everything in Growth",
      "1 Free Website",
      "Website SEO",
      "Google Business SEO",
      "WhatsApp Chatbot",
      "AI Assistant",
      "AI-Powered Reviews",
      "1 Standee + 3 Stickers",
      "Priority Support",
      "All upcoming Features",
    ],
  },
];

export const PLAN_MAP = Object.fromEntries(PLANS.map((p) => [p.id, p])) as Record<
  PlanId,
  (typeof PLANS)[number]
>;

/** Treats both paid ("active") and in-trial ("trialing") subscriptions as active. */
export function isPlanActive(
  status?: string | null,
  periodEnd?: string | null,
): boolean {
  if (status === "active") return true;
  if (status === "trialing") {
    if (!periodEnd) return true;
    return new Date(periodEnd).getTime() > Date.now();
  }
  return false;
}

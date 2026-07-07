export const BRAND = {
  name: "IntellectFlow Reviews",
  parent: "IntellectFlow",
  tagline: "AUTOMATE EVERYTHING. MISS NOTHING.",
  email: "intellectflowteam@gmail.com",
  phone: "+91 7069525795",
  website: "intellectflow.in",
};

export type PlanId = "starter" | "growth" | "pro";

export const PLANS: {
  id: PlanId;
  name: string;
  price: number;
  tagline: string;
  features: string[];
  popular?: boolean;
}[] = [
  {
    id: "starter",
    name: "Starter",
    price: 99,
    tagline: "For solo businesses getting started",
    features: [
      "AI-written review suggestions",
      "QR code & shareable link",
      "Unlimited customer scans",
      "Review activity counter",
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
      "Priority AI generation",
      "Downloadable QR (PNG & SVG)",
      "Editable business profile",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 349,
    tagline: "For established brands",
    features: [
      "Everything in Growth",
      "Fastest AI response",
      "Premium support",
      "Early access to new features",
    ],
  },
];

export const PLAN_MAP = Object.fromEntries(PLANS.map((p) => [p.id, p])) as Record<
  PlanId,
  (typeof PLANS)[number]
>;

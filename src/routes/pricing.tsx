import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Check, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useBusiness } from "@/lib/useBusiness";
import { PLANS as BASE_PLANS, type PlanId } from "@/lib/brand";
import { createSubscription } from "@/lib/subscription.functions";

export const Route = createFileRoute("/pricing")({
  component: Pricing,
});

declare global {
  interface Window {
    Razorpay?: any;
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

// PRO PLAN DATA WITH MARKET VALUE
const PRO_PLANS = [
  {
    id: "starter" as PlanId,
    name: "Starter",
    tagline: "Perfect for single location to start getting reviews.",
    price: 299,
    yearlyPrice: 2999,
    marketValue: "₹8,000/mo",
    popular: false,
    theme: "white",
    features: [
      { name: "Unlimited AI Review Writer (QR Scan)", value: "₹3,000/mo" },
      { name: "1 Smart QR Code + Short Link", value: "₹1,000" },
      { name: "5 Basic Sticker Templates", value: "₹500" },
      { name: "Custom Thank You Page + Coupon", value: "₹1,500/mo" },
      { name: "Last 5 Google Reviews Dashboard", value: "₹1,000/mo" },
      { name: "Basic Analytics (Scans vs Reviews)", value: "₹500/mo" },
      { name: "Google Review Direct Link Generator", value: "₹500/mo" },
      { name: "7-Day Free Trial", value: "FREE" },
    ],
  },
  {
    id: "growth" as PlanId,
    name: "Growth",
    tagline: "Most businesses choose this to automate replies and filter negative reviews.",
    price: 599,
    yearlyPrice: 5999,
    marketValue: "₹25,000/mo",
    popular: true,
    theme: "black",
    badge: "80% Businesses Choose This",
    features: [
      { name: "Everything in Starter", value: "₹8,000" },
      { name: "AI Review Reply Generator 50/mo 3 Tones Gujarati/Hindi/English 1-Click Copy", value: "₹5,000/mo" },
      { name: "Negative Review Filter + Private Feedback Form", value: "₹7,000/mo" },
      { name: "WhatsApp Auto-Reminder 24hr", value: "₹3,000/mo" },
      { name: "All Premium Sticker Templates 20+ Designs", value: "₹1,000" },
      { name: "Custom Branding Logo on QR Page", value: "₹1,000/mo" },
      { name: "Review Poster Generator", value: "₹2,000/mo" },
      { name: "Weekly WhatsApp Report", value: "₹1,000/mo" },
      { name: "FREE: 1 NFC Standee + 5 QR Stickers", value: "Worth ₹800" },
    ],
    note: "+ One-time Setup Fee ₹499 for printing & delivery",
  },
  {
    id: "business" as PlanId,
    name: "Business Pro",
    tagline: "All-in-one AI marketing for serious growth. Best for Clinic/Restaurant/Showroom.",
    price: 1299,
    yearlyPrice: 12999,
    marketValue: "₹55,000+/mo",
    popular: false,
    theme: "white",
    features: [
      { name: "Everything in Growth", value: "₹25,000" },
      { name: "Unlimited AI Reply Gujarati Auto-Detect", value: "₹12,000/mo" },
      { name: "AI GMB Post Generator 15 posts/mo", value: "₹8,000/mo" },
      { name: "AI Sentiment Analysis", value: "₹5,000/mo" },
      { name: "Competitor Tracking 2 Competitors", value: "₹12,000/mo" },
      { name: "1-Page AI Website + Review Widget FREE", value: "₹30,000 one-time" },
      { name: "AI Review to Instagram Story/Reel Template", value: "₹4,000/mo" },
      { name: "Loyalty Coupon Auto", value: "₹3,000/mo" },
      { name: "Video Testimonial QR 10 sec", value: "₹5,000/mo" },
      { name: "Google Map Rank Checker", value: "₹4,000/mo" },
      { name: "Fake Review Alert", value: "₹2,000/mo" },
    ],
    note: "+ Setup ₹499",
  },
];

function Pricing() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const { data, refetch } = useBusiness();
  const start = useServerFn(createSubscription);
  const [busy, setBusy] = useState<PlanId | null>(null);
  const [isYearly, setIsYearly] = useState(false);

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/auth", search: { mode: "signup" } });
  }, [loading, session, navigate]);

  const currentPlan = data?.subscription?.status === "active" ? data.subscription.plan : null;

  const choose = async (plan: PlanId) => {
    setBusy(plan);
    try {
      const ok = await loadRazorpay();
      if (!ok) throw new Error("Could not load payment checkout.");
      const { subscriptionId, keyId, businessName } = await start({ data: { plan } });

      const rzp = new window.Razorpay({
        key: keyId,
        subscription_id: subscriptionId,
        name: "IntellectFlow Reviews",
        description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} plan`,
        theme: { color: "#FFCC00" },
        notes: { business: businessName },
        handler: async () => {
          toast.success("Payment received! Activating your plan…");
          navigate({ to: "/dashboard" });
          let tries = 0;
          const poll = setInterval(async () => {
            tries += 1;
            const res = await refetch();
            const status = res.data?.subscription?.status;
            if (status === "active" || tries >= 6) {
              clearInterval(poll);
              if (status === "active") toast.success("Your plan is now active!");
            }
          }, 2500);
        },
        modal: { ondismiss: () => setBusy(null) },
      });
      rzp.open();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not start checkout");
      setBusy(null);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <Link to="/"><Logo /></Link>
        <Button asChild variant="ghost" size="sm">
          <Link to="/dashboard"><ArrowLeft className="h-4 w-4" /> Dashboard</Link>
        </Button>
      </header>

      <main className="mx-auto max-w-7xl px-5 pb-20">
        {/* TOP */}
        <div className="text-center pt-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-sm font-medium">
            ★ Trusted by 500+ Growing Businesses
          </div>
          <h1 className="mt-8 text-4xl md:text-6xl font-black tracking-tight leading-[1.05]">
            Aap Dukaan Chalao,<br />
            <span className="border-b-[6px] border-yellow-400">Google Hum Sambhalenge.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, transparent pricing. No hidden fees. Cancel anytime.<br />
            <span className="font-bold text-black">Market Value ₹55,000+ | Starting at just ₹299</span>
          </p>

          <div className="mt-8 flex justify-center">
            <div className="inline-flex p-1 bg-gray-100 rounded-full">
              <button onClick={() => setIsYearly(false)} className={`px-6 py-2 rounded-full font-bold text-sm ${!isYearly ? "bg-black text-white" : "text-gray-600"}`}>Monthly</button>
              <button onClick={() => setIsYearly(true)} className={`px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 ${isYearly ? "bg-black text-white" : "text-gray-600"}`}>
                Yearly <span className="bg-yellow-400 text-black text-[10px] px-2 py-0.5 rounded-full">Save 20% + 2 Months FREE</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 CARDS */}
        <div className="mt-16 grid gap-8 md:grid-cols-3 items-start">
          {PRO_PLANS.map((p) => {
            const isCurrent = currentPlan === p.id;
            const isBlack = p.theme === "black";
            return (
              <div key={p.id} className={`relative flex flex-col rounded-[24px] border p-8 ${isBlack ? "bg-black text-white border-yellow-400 border-2" : "bg-white border-border"}`}>
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-yellow-400 px-4 py-1 text-[11px] font-black text-black">
                    MOST POPULAR - {p.badge}
                  </span>
                )}
                <div className={`text-xs line-through ${isBlack ? "text-gray-500" : "text-gray-400"}`}>Market Value {p.marketValue}</div>
                <h3 className="text-2xl font-black mt-2">{p.name}</h3>
                <p className={`mt-1 text-sm ${isBlack ? "text-gray-400" : "text-muted-foreground"}`}>{p.tagline}</p>
                <p className="mt-6 text-4xl font-black">
                  ₹{isYearly ? p.yearlyPrice : p.price}
                  <span className={`text-sm font-medium ${isBlack ? "text-gray-400" : "text-muted-foreground"}`}>{isYearly ? "/year" : "/month"}</span>
                </p>
                <p className={`text-xs ${isBlack ? "text-gray-500" : "text-gray-400"}`}>{isYearly ? `₹${Math.round(p.yearlyPrice/12)}/mo billed yearly` : `₹${p.yearlyPrice}/yr when yearly`}</p>

                <ul className="mt-8 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f.name} className="flex justify-between gap-3 text-sm">
                      <span className="flex gap-2"><Check className={`mt-0.5 h-4 w-4 shrink-0 ${isBlack ? "text-yellow-400" : "text-primary"}`} />{f.name}</span>
                      <span className={`text-[11px] shrink-0 ${isBlack ? "text-gray-500" : "text-gray-400"}`}>{f.value}</span>
                    </li>
                  ))}
                </ul>

                {(p as any).note && <div className={`mt-4 text-xs ${isBlack ? "text-gray-500" : "text-gray-400"}`}>{(p as any).note}</div>}

                <Button
                  variant={isBlack ? "default" : p.popular ? "default" : "outline"}
                  size="lg"
                  className={`mt-7 w-full font-bold ${isBlack ? "bg-yellow-400 text-black hover:bg-yellow-300" : p.id === "business" ? "bg-black text-white hover:bg-black/90" : ""}`}
                  disabled={isCurrent || busy !== null}
                  onClick={() => choose(p.id)}
                >
                  {busy === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : isCurrent ? "Current plan" : p.id === "starter" ? "Start Free Trial" : p.id === "growth" ? "Choose Growth" : "Go Pro - All-in-One"}
                </Button>
              </div>
            );
          })}
        </div>

        {/* ADDONS */}
        <div className="mt-20">
          <h2 className="text-2xl font-black text-center">Add-Ons - Zarurat Lage Tabhi Lo</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {[
              ["Website Special", "₹1999 Setup + ₹499/mo", "Market Value ₹30,000"],
              ["GMB Booster Extra 10 Posts", "₹999/mo", "Value ₹8,000/mo"],
              ["NFC Tap Card", "₹399", "Value ₹1,500"],
              ["Extra Kit", "Standee ₹299 Stickers ₹199", "Printing"],
              ["Video Review Hosting", "₹299/mo", "Value ₹5,000/mo"],
              ["WhatsApp Marketing 1000 msgs", "₹499", "Value ₹2,000/mo"],
            ].map(([t, p, v]) => (
              <div key={t} className="border rounded-xl p-6 flex justify-between items-center bg-card">
                <div><div className="font-bold">{t}</div><div className="text-sm mt-1 text-muted-foreground">{p}</div></div>
                <div className="text-xs text-gray-400">{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* COMPARISON */}
        <div className="mt-20">
          <h2 className="text-2xl font-black text-center">Compare Plans</h2>
          <div className="mt-8 overflow-x-auto border rounded-xl bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/50"><tr><th className="p-4 text-left">Feature</th><th className="p-4">Starter</th><th className="p-4 bg-black text-white">Growth</th><th className="p-4">Pro</th></tr></thead>
              <tbody>
                {[
                  ["AI Review Writer", "✓", "✓", "✓"],
                  ["QR Code", "1", "1 + Premium", "Unlimited"],
                  ["AI Reply Limit", "0", "50/mo", "Unlimited"],
                  ["Negative Filter", "✗", "✓", "✓"],
                  ["WhatsApp Reminder", "✗", "✓", "✓"],
                  ["GMB Posts", "0", "5/mo", "15/mo"],
                  ["Sentiment Analysis", "✗", "✗", "✓"],
                  ["Competitor Tracking", "✗", "✗", "✓ (2)"],
                  ["1-Page Website", "✗", "✗", "✓ FREE"],
                ].map(([f,s,g,p]) => (
                  <tr key={f} className="border-t"><td className="p-4 font-medium">{f}</td><td className="p-4 text-center">{s}</td><td className="p-4 text-center bg-muted font-bold">{g}</td><td className="p-4 text-center">{p}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="bg-black text-white rounded-[32px] p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-black">Ready to grow your Google presence?</h2>
            <p className="mt-3 text-gray-400">Start your 7-day free trial. No credit card required.</p>
            <div className="mt-8 flex gap-4 justify-center flex-wrap">
              <Button onClick={() => choose("growth")} className="bg-yellow-400 text-black px-8 py-6 rounded-xl font-black hover:bg-yellow-300">Start Trial</Button>
              <Button variant="outline" className="bg-transparent border-white text-white px-8 py-6 rounded-xl font-bold hover:bg-white/10" onClick={() => toast.info("Expert will call you!")}>Talk to Expert</Button>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 py-10 mt-10 border-t">Intellectflow.in | intellectflowteam@gmail.com | Co-founder Kaushik Savaliya | Domain intellectflow.in</div>
      </main>
    </div>
  );
}

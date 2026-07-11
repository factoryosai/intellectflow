import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Check, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useBusiness } from "@/lib/useBusiness";
import { PLANS, type PlanId } from "@/lib/brand";
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

function Pricing() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const { data, refetch } = useBusiness();
  const start = useServerFn(createSubscription);
  const [busy, setBusy] = useState<PlanId | null>(null);

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
        theme: { color: "#7C3AED" },
        notes: { business: businessName },
        handler: async () => {
          toast.success("Payment received! Activating your plan…");
          navigate({ to: "/dashboard" });
          // Poll a few times so the newly activated plan shows without a manual refresh.
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
        modal: {
          ondismiss: () => setBusy(null),
        },
      });
      rzp.open();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not start checkout");
      setBusy(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Link to="/">
          <Logo />
        </Link>
        <Button asChild variant="ghost" size="sm">
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Link>
        </Button>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10">
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tight">
            Choose your <span className="text-gradient-brand">plan</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Cancel anytime. Every plan keeps your review page live and collecting.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PLANS.map((p) => {
            const isCurrent = currentPlan === p.id;
            return (
              <div
                key={p.id}
                className={`relative flex flex-col rounded-2xl border bg-card p-7 shadow-sm ${
                  p.popular ? "border-primary ring-2 ring-primary/30" : "border-border"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-brand px-4 py-1 text-xs font-bold text-primary-foreground">
                    Most popular
                  </span>
                )}
                <h3 className="text-xl font-black">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
                <p className="mt-5 text-4xl font-black">
                  ₹{p.price}
                  <span className="text-sm font-medium text-muted-foreground">
                    /month
                  </span>
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={p.popular ? "hero" : "outline"}
                  size="lg"
                  className="mt-7 w-full"
                  disabled={isCurrent || busy !== null}
                  onClick={() => choose(p.id)}
                >
                  {busy === p.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isCurrent ? (
                    "Current plan"
                  ) : (
                    "Choose " + p.name
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { QrCode, Sparkles, Star, ArrowRight, Check, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { BRAND, PLANS } from "@/lib/brand";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Logo />
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link to="/auth">Log in</Link>
          </Button>
          <Button asChild variant="hero">
            <Link to="/auth" search={{ mode: "signup" }}>
              Get started
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-gradient-brand opacity-20 blur-3xl" />
        <div className="mx-auto max-w-4xl px-5 pb-16 pt-14 text-center md:pt-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-powered Google review collection
          </span>
          <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
            Turn happy customers into{" "}
            <span className="text-gradient-brand">5-star Google reviews</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
            Your customer scans a QR code, our AI writes a personalised review in
            seconds, and they post it from their own Google account. Genuine
            reviews, zero friction.
          </p>
          <p className="mt-6 text-sm font-black uppercase tracking-[0.2em] text-gradient-brand">
            {BRAND.tagline}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="hero" size="xl">
              <Link to="/auth" search={{ mode: "signup" }}>
                Start collecting reviews <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link to="/pricing">View pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-center text-3xl font-black tracking-tight">
          How it works
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: QrCode,
              title: "Customer scans your QR",
              desc: "Display your unique QR code or share the link. No app, no login for your customer.",
            },
            {
              icon: Sparkles,
              title: "AI writes the review",
              desc: "We instantly generate 4 natural, personalised review suggestions mentioning your business.",
            },
            {
              icon: Star,
              title: "They post it on Google",
              desc: "They pick one, it's copied automatically, and they're sent straight to your Google review page.",
            },
          ].map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="bg-gradient-brand mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-primary-foreground">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Every review is posted by the customer from their own Google account.
        </div>
      </section>

      {/* Pricing preview */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-center text-3xl font-black tracking-tight">
          Simple, honest pricing
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className={`rounded-2xl border bg-card p-6 shadow-sm ${
                p.popular ? "border-primary ring-2 ring-primary/30" : "border-border"
              }`}
            >
              {p.popular && (
                <span className="mb-3 inline-block rounded-full bg-gradient-brand px-3 py-1 text-xs font-bold text-primary-foreground">
                  Most popular
                </span>
              )}
              <h3 className="text-xl font-black">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
              <p className="mt-4 text-3xl font-black">
                ₹{p.price}
                <span className="text-sm font-medium text-muted-foreground">
                  /month
                </span>
              </p>
              <ul className="mt-5 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild variant="hero" size="lg">
            <Link to="/auth" search={{ mode: "signup" }}>
              Get started today
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-muted-foreground md:flex-row">
          <Logo size="sm" />
          <div className="flex flex-col items-center gap-1 md:items-end">
            <span>{BRAND.email} · {BRAND.phone}</span>
            <span>{BRAND.website} · © {new Date().getFullYear()} {BRAND.parent}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

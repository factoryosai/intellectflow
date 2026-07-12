import { createFileRoute, Link } from "@tanstack/react-router";
import {
  QrCode,
  Sparkles,
  Star,
  ArrowRight,
  Check,
  ShieldCheck,
  Zap,
  TrendingUp,
  Clock,
  Smartphone,
  BadgeCheck,
  Heart,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { BRAND, PLANS } from "@/lib/brand";

const SITE_URL = "https://intellectflow.lovable.app";

const FAQS = [
  {
    q: "How does IntellectFlow Reviews get me more Google reviews?",
    a: "Your customer scans your QR code or opens your link, our AI instantly writes natural review suggestions mentioning your business, they pick one, and it's copied straight to your Google review page — so they post it from their own Google account in seconds.",
  },
  {
    q: "Are the reviews genuine and Google-compliant?",
    a: "Yes. Every review is posted by the real customer from their own Google account. We only remove the friction of writing — the customer always chooses and posts.",
  },
  {
    q: "Do my customers need to install an app?",
    a: "No. There's no app and no login for your customers. They just scan the QR code or tap the link.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes — every new business gets a 3-day free trial on the Starter plan, no card required to start.",
  },
  {
    q: "Which businesses is this for?",
    a: "Restaurants, cafes, salons, clinics, retail shops, service providers — any local business that wants more 5-star Google reviews.",
  },
];

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "IntellectFlow Reviews — Get More 5-Star Google Reviews with AI" },
      {
        name: "description",
        content:
          "AI-powered Google review collection for local businesses. Customers scan a QR code, AI writes the review, they post it from their own account. Start a 3-day free trial.",
      },
      {
        name: "keywords",
        content:
          "Google reviews, get more reviews, QR code reviews, AI review generator, local business reviews, review collection, 5 star reviews",
      },
      { property: "og:title", content: "IntellectFlow Reviews — Get More 5-Star Google Reviews with AI" },
      {
        property: "og:description",
        content:
          "Turn happy customers into 5-star Google reviews. AI writes the review, customers post it from their own Google account. 3-day free trial.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "IntellectFlow Reviews",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          description:
            "AI-powered Google review collection for local businesses using QR codes.",
          offers: PLANS.map((p) => ({
            "@type": "Offer",
            name: p.name,
            price: p.price,
            priceCurrency: "INR",
          })),
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "180",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
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
                Start 3-day free trial <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link to="/pricing">View pricing</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            No card required to start · Cancel anytime
          </p>
        </div>
      </section>

      {/* Trusted by local businesses */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Trusted by local businesses across India
          </p>
          <div className="mt-6 grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
            {[
              { value: "500+", label: "Businesses onboarded" },
              { value: "50k+", label: "Reviews driven" },
              { value: "4.9★", label: "Average rating" },
              { value: "3 days", label: "Free trial" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-black text-gradient-brand">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
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
              desc: "We instantly generate natural, personalised review suggestions mentioning your business.",
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

      {/* Why businesses love us */}
      <section className="bg-muted/30">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-center text-3xl font-black tracking-tight">
            Why businesses <span className="text-gradient-brand">love us</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            Everything you need to rank higher on Google Maps and win more walk-ins.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Reviews in seconds",
                desc: "AI removes the writing effort, so customers actually leave a review instead of skipping it.",
              },
              {
                icon: TrendingUp,
                title: "Rank higher on Maps",
                desc: "More fresh 5-star reviews push your business up in local Google search.",
              },
              {
                icon: Smartphone,
                title: "Zero friction for customers",
                desc: "No app, no signup. Just scan, tap, and post — works on any phone.",
              },
              {
                icon: BadgeCheck,
                title: "100% genuine reviews",
                desc: "Customers post from their own Google account — fully compliant, never fake.",
              },
              {
                icon: Clock,
                title: "Set up in minutes",
                desc: "Connect your Google business, download your QR, and start collecting today.",
              },
              {
                icon: Heart,
                title: "Priority support",
                desc: "Real humans help you get set up and make the most of every plan.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="bg-gradient-brand mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-primary-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-center text-3xl font-black tracking-tight">
          Loved by local businesses
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              name: "Rahul Mehta",
              role: "Cafe owner, Ahmedabad",
              quote:
                "We went from 40 to 180 Google reviews in two months. The QR code on our tables does all the work.",
            },
            {
              name: "Dr. Sneha Patel",
              role: "Dental clinic, Surat",
              quote:
                "Patients used to say they'd review us but never did. Now the AI makes it effortless — our rating jumped to 4.9.",
            },
            {
              name: "Imran Shaikh",
              role: "Salon owner, Mumbai",
              quote:
                "Setup took ten minutes. More reviews means more new customers finding us on Maps every week.",
            },
          ].map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="mb-3 flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="flex-1 text-sm text-foreground">"{t.quote}"</p>
              <div className="mt-4">
                <p className="text-sm font-bold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing preview */}
      <section className="bg-muted/30">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-center text-3xl font-black tracking-tight">
            Simple, honest pricing
          </h2>
          <p className="mt-3 text-center text-muted-foreground">
            Start free for 3 days. Upgrade when you're ready.
          </p>
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
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 py-16">
        <h2 className="text-center text-3xl font-black tracking-tight">
          Frequently asked questions
        </h2>
        <div className="mt-10 space-y-4">
          {FAQS.map((f) => (
            <div
              key={f.q}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <h3 className="font-bold">{f.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Meet the founders */}
      <section className="bg-muted/30">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-center text-3xl font-black tracking-tight">
            Meet the <span className="text-gradient-brand">founders</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            The team building IntellectFlow, on a mission to help local
            businesses win more customers.
          </p>
          <div className="mx-auto mt-10 max-w-sm">
            <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
              <img
                src={founderPhoto.url}
                alt="Kaushik Savaliya, Co-Founder of IntellectFlow"
                className="h-32 w-32 rounded-full object-cover object-top"
              />
              <h3 className="mt-5 text-lg font-bold">Kaushik Savaliya</h3>
              <p className="mt-1 text-sm font-semibold text-gradient-brand">
                Co-Founder
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Driving product and growth at IntellectFlow, helping local
                businesses turn happy customers into 5-star Google reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-brand opacity-20 blur-3xl" />
          <h2 className="text-3xl font-black tracking-tight">
            Ready for more 5-star reviews?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Join hundreds of local businesses growing on Google with IntellectFlow.
          </p>
          <Button asChild variant="hero" size="xl" className="mt-7">
            <Link to="/auth" search={{ mode: "signup" }}>
              Start your free trial <ArrowRight className="h-4 w-4" />
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

import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Sparkles, Target, Users } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";
import founderPhoto from "@/assets/kaushik-savaliya.png.asset.json";

const SITE_URL = "https://intellectflow.lovable.app";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Us — IntellectFlow Reviews" },
      {
        name: "description",
        content:
          "Learn about IntellectFlow Reviews — our mission to help local businesses collect more genuine 5-star Google reviews with AI.",
      },
      { property: "og:title", content: "About Us — IntellectFlow Reviews" },
      {
        property: "og:description",
        content:
          "Our mission is to help local businesses grow on Google with AI-assisted review collection.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/about` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/about` }],
  }),
});

function AboutPage() {
  return (
    <PageShell
      title="About IntellectFlow"
      subtitle="We help local businesses turn happy customers into genuine 5-star Google reviews — effortlessly."
    >
      <div className="space-y-12">
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            {
              icon: Target,
              title: "Our mission",
              desc: "Make it effortless for every local business to build a strong, authentic Google reputation.",
            },
            {
              icon: Sparkles,
              title: "What we do",
              desc: "Our AI writes natural review suggestions so customers can post in seconds from their own Google account.",
            },
            {
              icon: Users,
              title: "Who we serve",
              desc: "Restaurants, cafes, salons, clinics, retailers — any local business that wants more reviews.",
            },
            {
              icon: Heart,
              title: "Our promise",
              desc: "100% genuine reviews, zero friction for customers, and real human support for you.",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="bg-gradient-brand mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-primary-foreground">
                <c.icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold">{c.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-center text-3xl font-black tracking-tight">
            Meet the <span className="text-gradient-brand">founders</span>
          </h2>
          <div className="mx-auto mt-8 max-w-sm">
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

        <div className="rounded-2xl border border-border bg-muted/30 p-8 text-center">
          <h2 className="text-2xl font-black tracking-tight">
            Ready to grow on Google?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Start your 3-day free trial today, or reach us at {BRAND.email}.
          </p>
          <Button asChild variant="hero" size="lg" className="mt-6">
            <Link to="/auth" search={{ mode: "signup" }}>
              Start free trial
            </Link>
          </Button>
        </div>
      </div>
    </PageShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, Globe, MessageCircle } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { BRAND, WHATSAPP_LINK } from "@/lib/brand";

const SITE_URL = "https://intellectflow.lovable.app";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact Us — IntellectFlow Reviews" },
      {
        name: "description",
        content:
          "Get in touch with the IntellectFlow Reviews team by email, phone, or WhatsApp. We're here to help you get more Google reviews.",
      },
      { property: "og:title", content: "Contact Us — IntellectFlow Reviews" },
      {
        property: "og:description",
        content: "Reach the IntellectFlow team by email, phone, or WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/contact` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/contact` }],
  }),
});

function ContactPage() {
  const cards = [
    {
      icon: Mail,
      title: "Email",
      value: BRAND.email,
      href: `mailto:${BRAND.email}`,
    },
    {
      icon: Phone,
      title: "Phone",
      value: BRAND.phone,
      href: `tel:${BRAND.phone.replace(/\s/g, "")}`,
    },
    {
      icon: Globe,
      title: "Website",
      value: BRAND.website,
      href: `https://${BRAND.website}`,
    },
  ];

  return (
    <PageShell
      title="Contact us"
      subtitle="Have a question or need help getting set up? We'd love to hear from you."
    >
      <div className="space-y-8">
        <div className="grid gap-5 sm:grid-cols-3">
          {cards.map((c) => (
            <a
              key={c.title}
              href={c.href}
              className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-colors hover:border-primary"
            >
              <div className="bg-gradient-brand mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-primary-foreground">
                <c.icon className="h-5 w-5" />
              </div>
              <h2 className="text-sm font-bold">{c.title}</h2>
              <p className="mt-1 break-all text-sm text-muted-foreground">
                {c.value}
              </p>
            </a>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-muted/30 p-8 text-center">
          <h2 className="text-2xl font-black tracking-tight">
            Chat with us on WhatsApp
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            The fastest way to reach us. Tap below and we'll reply quickly.
          </p>
          <Button asChild size="lg" className="mt-6 bg-[#25D366] text-white hover:bg-[#1eba57]">
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5 fill-current" /> Message on WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </PageShell>
  );
}

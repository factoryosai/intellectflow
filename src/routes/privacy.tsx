import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { BRAND } from "@/lib/brand";

const SITE_URL = "https://intellectflow.lovable.app";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy — IntellectFlow Reviews" },
      {
        name: "description",
        content:
          "How IntellectFlow Reviews collects, uses, and protects your information.",
      },
      { property: "og:title", content: "Privacy Policy — IntellectFlow Reviews" },
      {
        property: "og:description",
        content: "How IntellectFlow Reviews handles and protects your data.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/privacy` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/privacy` }],
  }),
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function PrivacyPage() {
  return (
    <PageShell
      title="Privacy Policy"
      subtitle={`Last updated: ${new Date().getFullYear()}`}
    >
      <div className="space-y-8">
        <p className="text-sm leading-relaxed text-muted-foreground">
          This Privacy Policy explains how {BRAND.parent} ("we", "us", "our")
          collects, uses, and safeguards your information when you use{" "}
          {BRAND.name} and related services (the "Service"). By using the
          Service, you agree to the practices described here.
        </p>

        <Section title="1. Information we collect">
          <p>
            We collect information you provide directly, such as your name,
            email address, phone number, and business details when you create an
            account or connect your business. We also collect your Google
            business information (name, address, ratings, and review link) that
            you choose to connect.
          </p>
          <p>
            We automatically collect limited usage data such as device
            information and log data to operate and improve the Service.
          </p>
        </Section>

        <Section title="2. How we use your information">
          <p>
            We use your information to provide and maintain the Service,
            generate AI review suggestions, process payments, provide customer
            support, and communicate important updates.
          </p>
        </Section>

        <Section title="3. Payments">
          <p>
            Payments are processed by our payment provider (Razorpay). We do not
            store your full card details on our servers. Your payment
            information is handled by the provider under their own privacy and
            security terms.
          </p>
        </Section>

        <Section title="4. Sharing of information">
          <p>
            We do not sell your personal information. We share data only with
            service providers that help us operate the Service (such as hosting,
            AI processing, and payment processing), and when required by law.
          </p>
        </Section>

        <Section title="5. Data security">
          <p>
            We use industry-standard measures to protect your data. However, no
            method of transmission or storage is completely secure, and we
            cannot guarantee absolute security.
          </p>
        </Section>

        <Section title="6. Your rights">
          <p>
            You may access, update, or request deletion of your personal
            information by contacting us. We will respond within a reasonable
            timeframe.
          </p>
        </Section>

        <Section title="7. Contact us">
          <p>
            For any privacy questions, contact us at {BRAND.email} or{" "}
            {BRAND.phone}.
          </p>
        </Section>
      </div>
    </PageShell>
  );
}

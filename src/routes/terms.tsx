import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { BRAND } from "@/lib/brand";

const SITE_URL = "https://intellectflow.lovable.app";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms of Service — IntellectFlow Reviews" },
      {
        name: "description",
        content:
          "The terms and conditions for using IntellectFlow Reviews and related services.",
      },
      { property: "og:title", content: "Terms of Service — IntellectFlow Reviews" },
      {
        property: "og:description",
        content: "Terms and conditions for using IntellectFlow Reviews.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/terms` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/terms` }],
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

function TermsPage() {
  return (
    <PageShell
      title="Terms of Service"
      subtitle={`Last updated: ${new Date().getFullYear()}`}
    >
      <div className="space-y-8">
        <p className="text-sm leading-relaxed text-muted-foreground">
          These Terms of Service ("Terms") govern your use of {BRAND.name}{" "}
          provided by {BRAND.parent} ("we", "us", "our"). By accessing or using
          the Service, you agree to be bound by these Terms.
        </p>

        <Section title="1. The Service">
          <p>
            {BRAND.name} helps businesses collect genuine Google reviews by
            generating AI-assisted review suggestions that customers may choose
            to post from their own Google accounts. We do not post reviews on
            your behalf, and every review is submitted by the customer.
          </p>
        </Section>

        <Section title="2. Eligibility and accounts">
          <p>
            You must provide accurate information when creating an account and
            are responsible for keeping your credentials secure and for all
            activity under your account.
          </p>
        </Section>

        <Section title="3. Acceptable use">
          <p>
            You agree not to use the Service to generate false or misleading
            reviews, incentivize dishonest reviews, or violate Google's review
            policies or any applicable law. Reviews must reflect genuine
            customer experiences.
          </p>
        </Section>

        <Section title="4. Subscriptions and payments">
          <p>
            Paid plans are billed on a recurring basis through our payment
            provider. New businesses may receive a free trial period. You can
            cancel at any time; access continues until the end of the current
            billing period. Fees are non-refundable except where required by
            law.
          </p>
        </Section>

        <Section title="5. Intellectual property">
          <p>
            All rights, title, and interest in the Service, including software,
            branding, and content, remain with {BRAND.parent}. You retain
            ownership of the business information you provide.
          </p>
        </Section>

        <Section title="6. Disclaimers">
          <p>
            The Service is provided "as is" without warranties of any kind. We
            do not guarantee any specific number of reviews, ratings, or search
            ranking outcomes.
          </p>
        </Section>

        <Section title="7. Limitation of liability">
          <p>
            To the maximum extent permitted by law, {BRAND.parent} is not liable
            for any indirect, incidental, or consequential damages arising from
            your use of the Service.
          </p>
        </Section>

        <Section title="8. Changes to these Terms">
          <p>
            We may update these Terms from time to time. Continued use of the
            Service after changes take effect constitutes acceptance of the
            updated Terms.
          </p>
        </Section>

        <Section title="9. Contact us">
          <p>
            Questions about these Terms? Contact us at {BRAND.email} or{" "}
            {BRAND.phone}.
          </p>
        </Section>
      </div>
    </PageShell>
  );
}

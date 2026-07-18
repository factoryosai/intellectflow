import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/montserrat/900.css";
import "@fontsource/nunito/400.css";
import "@fontsource/nunito/500.css";
import "@fontsource/nunito/600.css";
import "@fontsource/nunito/700.css";
import "@fontsource/nunito/800.css";
import "@fontsource/nunito/900.css";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "../lib/auth";
import { Toaster } from "../components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="inline-flex bg-black text-white text-[10px] px-3 py-1 rounded-full mb-4">IntellectFlow.in | Founder Kaushik Savaliya | Market Value ₹55k+ at ₹299</div>
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found - Aap Dukaan Chalao Google Hum Sambhalenge</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist. But your Google rating 4.8★ journey starts here - Value ₹55k+ features at ₹299
        </p>
        <div className="mt-6 flex gap-2 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-black px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-black/90"
          >
            Go home - Market Value ₹55k+
          </Link>
          <Link
            to="/onboarding"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] px-6 py-2 text-sm font-medium text-white"
          >
            Start Free - Value ₹8k/mo FREE
          </Link>
        </div>
        <div className="mt-6 text-[10px] text-gray-400">Intellectflow.in | intellectflowteam@gmail.com | Founder Kaushik Savaliya | 500+ Businesses | Visavadar, Gujarat</div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="inline-flex bg-yellow-400 text-black text-[10px] px-3 py-1 rounded-full font-bold mb-4">Market Value ₹55k+ Error - Founder Kaushik Fixing</div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load - Aap Dukaan Chalao, Google Hum Sambhalenge
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Founder Kaushik Savaliya is fixing it. Contact intellectflowteam@gmail.com - Value ₹55k+ features still available.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black/90"
          >
            Try again - Value ₹55k+
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
        <div className="mt-4 text-[10px] text-gray-400">Intellectflow.in | Founder Kaushik Savaliya | intellectflowteam@gmail.com | Market Value ₹55k+ at ₹299</div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { 
        title: "IntellectFlow.in PRO - Google Review Automation SaaS | Market Value ₹55k+ at ₹299 | Founder Kaushik Savaliya | Aap Dukaan Chalao Google Hum Sambhalenge" 
      },
      {
        name: "description",
        content:
          "IntellectFlow.in - Google Review Automation SaaS by Founder Kaushik Savaliya. Market Value ₹55k+ Features at ₹299/mo: QR + /r/slug ₹1k, AI Review Writer 4 Suggestions ₹3k/mo Gujarati/Hinglish, Thank You + Coupon 10% OFF ₹1.5k/mo, Negative Filter 1-2★ Private ₹7k/mo, Reviews Driven Counter ₹5k/mo, AI Reply 3 Variants ₹5k/mo Growth 50/mo Pro Unlimited, WhatsApp Reminder 24hr ₹3k/mo, GMB Post Generator 5 Growth 15 Pro ₹8k/mo, Sentiment Analysis ₹5k/mo, Competitor Tracking 2 ₹12k/mo, Premium Stickers 20+ ₹2k/mo, Website FREE ₹10k/mo. 500+ Businesses Trust. Aap Dukaan Chalao, Google Hum Sambhalenge. intellectflowteam@gmail.com | Visavadar, Gujarat 362130",
      },
      { name: "author", content: "Kaushik Savaliya - Co-founder IntellectFlow.in - Visavadar, Gujarat" },
      { name: "keywords", content: "Google review automation, QR review, AI review writer, Gujarati review, Hinglish review, negative filter, coupon, GMB post generator, AI reply, WhatsApp reminder, competitor tracking, Visavadar, Gujarat, IntellectFlow, Kaushik Savaliya, Aap Dukaan Chalao Google Hum Sambhalenge, Market Value 55k, lifetime free" },
      { property: "og:title", content: "IntellectFlow.in PRO - Market Value ₹55k+ at ₹299 | Founder Kaushik Savaliya | Aap Dukaan Chalao Google Hum Sambhalenge | 500+ Businesses" },
      {
        property: "og:description",
        content:
          "Collect more genuine Google reviews - QR Scan → AI Writer Gujarati/Hinglish 4 suggestions ₹3k/mo → Negative Filter 1-2★ Private ₹7k/mo → Thank You + Coupon 10% OFF ₹1.5k/mo → Reviews Counter ₹5k/mo → AI Reply 3 Variants ₹5k/mo → WhatsApp Reminder ₹3k/mo → GMB Post ₹8k/mo → Sentiment ₹5k/mo → Competitor ₹12k/mo → Website FREE ₹10k/mo - Total Market Value ₹55k+ at ₹299/mo. Founder Kaushik Savaliya - intellectflowteam@gmail.com",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://intellectflow.in" },
      { property: "og:site_name", content: "IntellectFlow.in - Founder Kaushik Savaliya" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "IntellectFlow.in PRO - Google Review Automation - Market Value ₹55k+ at ₹299 - Founder Kaushik Savaliya" },
      { name: "twitter:description", content: "QR + AI Writer Gujarati/Hinglish ₹3k/mo + Negative Filter ₹7k/mo + Coupon ₹1.5k/mo + AI Reply ₹5k/mo + GMB ₹8k/mo + Competitor ₹12k/mo = Market ₹55k+ at ₹299 - Aap Dukaan Chalao Google Hum Sambhalenge - Founder Kaushik Savaliya | 500+ Businesses | intellectflowteam@gmail.com" },
      { property: "og:image", content: "https://intellectflow.in/og-image.png" },
      { name: "twitter:image", content: "https://intellectflow.in/og-image.png" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { name: "googlebot", content: "index, follow" },
      { name: "theme-color", content: "#6A4DFF" },
      { name: "msapplication-TileColor", content: "#6A4DFF" },
      { property: "og:locale", content: "en_IN" },
      { property: "og:locale:alternate", content: "gu_IN" },
      { property: "og:locale:alternate", content: "hi_IN" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "canonical", href: "https://intellectflow.in" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "IntellectFlow.in - Google Review Automation SaaS",
          "applicationCategory": "BusinessApplication",
          "offers": [
            { "@type": "Offer", "name": "Starter - Market Value ₹8k/mo", "price": "299", "priceCurrency": "INR" },
            { "@type": "Offer", "name": "Growth - Market Value ₹25k/mo", "price": "599", "priceCurrency": "INR" },
            { "@type": "Offer", "name": "Business Pro - Market Value ₹55k+/mo", "price": "1299", "priceCurrency": "INR" }
          ],
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "ratingCount": "500", "bestRating": "5" },
          "author": { "@type": "Person", "name": "Kaushik Savaliya", "jobTitle": "Co-founder", "email": "intellectflowteam@gmail.com", "address": { "@type": "PostalAddress", "addressLocality": "Visavadar", "addressRegion": "Gujarat", "postalCode": "362130" } },
          "description": "Google Review Automation SaaS - Market Value ₹55k+ Features: QR + /r/slug ₹1k, AI Writer ₹3k/mo, Coupon ₹1.5k/mo, Negative Filter ₹7k/mo, Reviews Counter ₹5k/mo, AI Reply ₹5k/mo, WhatsApp ₹3k/mo, GMB Post ₹8k/mo, Sentiment ₹5k/mo, Competitor ₹12k/mo at ₹299/mo - Founder Kaushik Savaliya - Aap Dukaan Chalao Google Hum Sambhalenge",
          "founder": "Kaushik Savaliya",
          "slogan": "Aap Dukaan Chalao, Google Hum Sambhalenge",
          "url": "https://intellectflow.in",
          "keywords": "Google review automation, AI review writer Gujarati Hinglish, negative filter, coupon, GMB post, Visavadar Gujarat"
        })
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* IntellectFlow PRO - Founder Kaushik Savaliya - Market Value ₹55k+ at ₹299 - Aap Dukaan Chalao Google Hum Sambhalenge */}
        <meta name="intellectflow-founder" content="Kaushik Savaliya - Visavadar Gujarat 362130 - intellectflowteam@gmail.com" />
        <meta name="intellectflow-market-value" content="₹55k+/mo Value at ₹299/mo - QR ₹1k + AI Writer ₹3k/mo + Coupon ₹1.5k/mo + Negative Filter ₹7k/mo + Reviews Counter ₹5k/mo + AI Reply ₹5k/mo + WhatsApp ₹3k/mo + GMB Post ₹8k/mo + Sentiment ₹5k/mo + Competitor ₹12k/mo + Stickers ₹2k/mo + Website ₹10k/mo" />
        <meta name="intellectflow-tagline" content="Aap Dukaan Chalao, Google Hum Sambhalenge" />
      </head>
      <body>
        {/* Top Founder Banner - Value ₹55k+ FREE */}
        <div className="bg-black text-white text-center py-1.5 text-[10px] md:text-[11px] tracking-wide px-2">
          <span className="bg-yellow-400 text-black px-2 py-0.5 rounded-full font-bold mr-2 hidden md:inline">500+ Businesses ✓</span>
          <span className="font-bold">IntellectFlow.in PRO</span> | Founder <span className="text-yellow-400 font-bold">Kaushik Savaliya</span> | Market Value <span className="bg-yellow-400 text-black px-1 rounded font-bold">₹55k+ at ₹299</span> | <span className="hidden md:inline">intellectflowteam@gmail.com | Visavadar, Gujarat | </span>Aap Dukaan Chalao, Google Hum Sambhalenge
        </div>
        {children}
        <Scripts />
        {/* Footer SEO - Hidden but for crawlers */}
        <div style={{ display: 'none' }}>
          IntellectFlow.in Founder Kaushik Savaliya Visavadar Gujarat 362130 intellectflowteam@gmail.com Market Value ₹55k+ Features at ₹299/mo: QR + Short Link /r/slug ₹1k, AI Review Writer 4 Suggestions Gujarati Hinglish English ₹3k/mo, Thank You + Coupon 10% OFF ₹1.5k/mo, Negative Filter 1-2 Star Private Feedback Not Posted to Google ₹7k/mo, Reviews Driven Counter ₹5k/mo, AI Reply 3 Variants Professional Hinglish Gujarati ₹5k/mo Growth 50/mo Pro Unlimited, WhatsApp Auto-Reminder 24hr After QR Scan ₹3k/mo, GMB Post Generator 5 Growth 15 Pro ₹8k/mo, Sentiment Analysis ₹5k/mo, Competitor Tracking 2 Competitors Every 6hr ₹12k/mo, Premium Stickers 20+ ₹2k/mo, Website FREE with Pro ₹10k/mo, Lifetime Free Value ₹55k+ FREE Early Founder Offer. Aap Dukaan Chalao Google Hum Sambhalenge. 500+ Businesses Trust IntellectFlow.
        </div>
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes - IntellectFlow PRO - Founder Kaushik Savaliya */}
        <Outlet />
        <Toaster richColors position="top-center" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
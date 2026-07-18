import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = process.env.VITE_APP_URL || "https://intellectflow.in";

interface SitemapEntry {
  path: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: string;
  lastmod?: string;
}

/**
 * Sitemap.xml PRO - SEO for IntellectFlow.in - Market Value ₹55k+ at ₹299
 * Founder: Kaushik Savaliya | Aap Dukaan Chalao Google Hum Sambhalenge
 * Includes: Static pages + Dynamic /r/slug pages for SEO - Value ₹10k/mo Website FREE
 */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const now = new Date().toISOString().split("T")[0];
        
        // Static entries - Market Value SEO
        const staticEntries: SitemapEntry[] = [
          { path: "/", changefreq: "daily", priority: "1.0", lastmod: now }, // Hero + Pricing - Market ₹55k+ at ₹299
          { path: "/pricing", changefreq: "weekly", priority: "0.9", lastmod: now }, // Starter ₹299 Market ₹8k, Growth ₹599 Market ₹25k, Pro ₹1299 Market ₹55k+
          { path: "/onboarding", changefreq: "weekly", priority: "0.8", lastmod: now }, // Google Places Search - Value ₹1k + ₹8k/mo QR
          { path: "/auth", changefreq: "monthly", priority: "0.6", lastmod: now }, // Login - Founder Kaushik Savaliya
          { path: "/dashboard", changefreq: "daily", priority: "0.7", lastmod: now }, // Dashboard 5 tabs - QR ₹1k + AI Reply ₹5k/mo + GMB ₹8k/mo + Analytics ₹12k/mo
        ];

        // Dynamic entries - All public /r/slug pages - Value ₹1k each - For SEO - Website FREE Pro ₹10k/mo
        let dynamicEntries: SitemapEntry[] = [];
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          
          // Get all businesses with slug - Public review pages - SEO boost - Value ₹10k/mo Website FREE feature
          const { data: businesses, error } = await supabaseAdmin
            .from("businesses")
            .select("slug, created_at, business_name")
            .not("slug", "is", null)
            .limit(1000); // Max 1000 for sitemap - SEO best practice
          
          if (!error && businesses) {
            dynamicEntries = businesses
              .filter((b: any) => b.slug)
              .map((b: any) => ({
                path: `/r/${b.slug}`,
                changefreq: "weekly" as const,
                priority: "0.7", // Public review pages - Good for SEO - Value ₹1k each + ₹8k/mo QR
                lastmod: b.created_at ? new Date(b.created_at).toISOString().split("T")[0] : now,
              }));
            
            console.log(`Sitemap: Added ${dynamicEntries.length} dynamic /r/slug pages - Value ₹1k each + SEO - Founder Kaushik Savaliya - Market Value ₹55k+ - Total ${staticEntries.length + dynamicEntries.length} URLs`);
          }
        } catch (e) {
          console.error("Sitemap dynamic fetch failed - Market Value ₹10k/mo Website FREE feature:", e);
          // Continue with static only if dynamic fails
        }

        const allEntries = [...staticEntries, ...dynamicEntries];

        const urls = allEntries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<!-- IntellectFlow.in PRO Sitemap - Founder Kaushik Savaliya - Market Value ₹55k+ at ₹299 - Aap Dukaan Chalao Google Hum Sambhalenge - 500+ Businesses - intellectflowteam@gmail.com - Visavadar Gujarat 362130 -->`,
          `<!-- Features: QR + /r/slug ₹1k + AI Writer ₹3k/mo + Coupon ₹1.5k/mo + Negative Filter ₹7k/mo + Reviews Counter ₹5k/mo + AI Reply ₹5k/mo + WhatsApp ₹3k/mo + GMB Post ₹8k/mo + Sentiment ₹5k/mo + Competitor ₹12k/mo + Stickers ₹2k/mo + Website ₹10k/mo = ₹55k+/mo Value -->`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400", // 1hr cache + 1 day stale
            "X-Robots-Tag": "noindex", // Don't index sitemap itself
            "X-IntellectFlow-Founder": "Kaushik Savaliya - Visavadar Gujarat - intellectflowteam@gmail.com - Market Value ₹55k+ at ₹299",
            "X-IntellectFlow-Market-Value": "₹55k+/mo Features at ₹299 - QR ₹1k + AI Writer ₹3k/mo + Coupon ₹1.5k/mo + Negative Filter ₹7k/mo + Reviews ₹5k/mo + AI Reply ₹5k/mo + WhatsApp ₹3k/mo + GMB ₹8k/mo + Sentiment ₹5k/mo + Competitor ₹12k/mo",
          },
        });
      },
    },
  },
});
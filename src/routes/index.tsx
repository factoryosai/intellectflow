import { createFileRoute, Link } from "@tanstack/react-router";
import {
  QrCode, Sparkles, Star, ArrowRight, Check, ShieldCheck, Zap, TrendingUp, Clock, Smartphone, BadgeCheck, Heart, Crown, MessageSquare, BarChart3, Globe
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { BRAND, PLANS } from "@/lib/brand";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import founderPhoto from "@/assets/kaushik-savaliya.png.asset.json";

const SITE_URL = "https://intellectflow.in";

const FAQS = [
  { q: "How does IntellectFlow get me more Google reviews?", a: "Customer scans QR, AI writes review mentioning your business, they post from own Google account. Genuine, no friction. Value ₹8,000/mo feature starting ₹299." },
  { q: "Are reviews genuine and Google-compliant?", a: "Yes. Every review posted by real customer from own Google account. We only remove friction. 100% compliant." },
  { q: "What is Market Value vs Our Price?", a: "Market Value is what agencies charge: Starter ₹8k, Growth ₹25k, Pro ₹55k+/mo. We give same at ₹299/₹599/₹1299. Aap Dukaan Chalao, Google Hum Sambhalenge." },
  { q: "Is there a free trial?", a: "Yes 7-day free trial Starter, no card required. Growth me FREE NFC Standee + 5 Stickers Worth ₹800." },
  { q: "Which businesses is this for?", a: "Restaurants, cafes, salons, clinics, retail, showroom - any local business wants 5-star Google reviews + GMB posts + Sentiment." },
];

export const Route = createFileRoute("/")({
  component: IndexPro,
  head: () => ({
    meta: [
      { title: "IntellectFlow - Aap Dukaan Chalao, Google Hum Sambhalenge. | Get 5-Star Reviews" },
      { name: "description", content: "Market Value ₹55k+ | Starting ₹299/mo. AI-powered Google review collection + GMB posts + Sentiment + QR + Posters + 1-Page Website FREE. Trusted by 500+ businesses. Co-founder Kaushik Savaliya." },
      { name: "keywords", content: "Google reviews, QR code reviews, AI review generator, GMB post generator, sentiment analysis, Intellectflow.in, Kaushik Savaliya" },
      { property: "og:title", content: "IntellectFlow - Aap Dukaan Chalao, Google Hum Sambhalenge." },
      { property: "og:description", content: "Market Value ₹55k+ Starting ₹299. AI reviews + GMB + Sentiment + QR + Website FREE. 7-day trial." },
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
          description: "AI-powered Google review collection Market Value ₹55k+ starting ₹299",
          offers: PLANS.map((p) => ({ "@type": "Offer", name: p.name, price: p.price, priceCurrency: "INR" })),
          aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "500" },
        }),
      },
    ],
  }),
});

function IndexPro() {
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sticky top-0 z-50 bg-white/80 backdrop-blur">
        <Logo />
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 mr-4 text-xs font-bold"><span className="line-through text-gray-400">Market Value ₹55k+</span><span className="bg-yellow-400 text-black px-2 py-1 rounded-full">From ₹299/mo</span></div>
          <Button asChild variant="ghost"><Link to="/auth">Log in</Link></Button>
          <Button asChild className="bg-black text-white hover:bg-black/90"><Link to="/auth" search={{ mode: "signup" }}>Get started</Link></Button>
        </div>
      </header>

      {/* HERO - BIG TAGLINE */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] opacity-20 blur-3xl" />
        <div className="mx-auto max-w-5xl px-5 pb-16 pt-14 text-center md:pt-20">
          <span className="inline-flex items-center gap-2 rounded-full border bg-purple-50 border-purple-100 px-4 py-1.5 text-xs font-bold text-purple-700">
            <Sparkles className="h-3.5 w-3.5" /> Trusted by 500+ Growing Businesses • Market Value ₹55,000+ | Starting ₹299
          </span>
          <h1 className="mt-8 text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
            Aap Dukaan Chalao,<br />
            <span className="border-b-[8px] border-yellow-400">Google Hum Sambhalenge.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
            AI-powered Google review collection + GMB Post Generator + Sentiment Analysis + QR + Posters + 1-Page Website FREE. <b>Market Value ₹55k+ ka sab kuch sirf ₹299 se.</b> Customer scan kare, AI review likhe, khud ke Google account se post kare.
          </p>
          <p className="mt-4 text-sm font-black uppercase tracking-[0.2em] bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] bg-clip-text text-transparent">{BRAND.tagline} • Intellectflow.in • Kaushik Savaliya</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild className="bg-black text-white px-8 py-6 text-lg rounded-xl" size="lg"><Link to="/auth" search={{ mode: "signup" }}>Start 7-day free trial <ArrowRight className="h-5 w-5" /></Link></Button>
            <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg rounded-xl"><Link to="/pricing">View Pricing - Save 80%</Link></Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">No card required • Cancel anytime • Value ₹55k+ FREE Trial • intellectflowteam@gmail.com</p>
        </div>
      </section>

      {/* TRUSTED */}
      <section className="border-y bg-gray-50">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Trusted by local businesses • Market Value ₹55k+ Features at ₹299</p>
          <div className="mt-6 grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
            {[
              { value: "500+", label: "Businesses", sub: "Value ₹8k/mo" },
              { value: "50k+", label: "Reviews Driven", sub: "Value ₹5k/mo" },
              { value: "₹55k+", label: "Market Value", sub: "You Pay ₹299+" },
              { value: "7 Days", label: "Free Trial", sub: "No Card" },
            ].map((s) => (
              <div key={s.label}><p className="text-3xl font-black bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] bg-clip-text text-transparent">{s.value}</p><p className="mt-1 text-xs font-bold">{s.label}</p><p className="text-[10px] text-muted-foreground">{s.sub}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS + VALUE */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-center text-3xl font-black tracking-tight">How it works <span className="text-sm font-normal text-muted-foreground">(Market Value ₹25k/mo ka automation ₹599 me)</span></h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { icon: QrCode, title: "Customer scans QR", desc: "Unique QR + /r/slug link. No app, no login. Value ₹1,000", color: "from-[#6A4DFF] to-[#2D9CDB]" },
            { icon: Sparkles, title: "AI writes review", desc: "Gujarati/Hindi/English 3 tones, auto-detect. Value ₹5k/mo", color: "bg-yellow-400" },
            { icon: Star, title: "They post on Google", desc: "Pick → Copy → Google page. Genuine from own account. Value ₹8k/mo", color: "bg-black" },
          ].map((s) => (
            <div key={s.title} className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-white ${s.color.includes("gradient") ? `bg-gradient-to-r ${s.color}` : s.color}`}><s.icon className="h-5 w-5" /></div>
              <h3 className="text-lg font-bold">{s.title}</h3><p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4 text-primary" />Every review posted by customer from own Google account • Value ₹8k/mo feature</div>
      </section>

      {/* PRO FEATURES GRID - VALUE SHOW */}
      <section className="bg-muted/30">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-center text-3xl font-black tracking-tight">Everything you need <span className="bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] bg-clip-text text-transparent">to dominate Google</span> <span className="text-sm block mt-2 font-normal text-muted-foreground">Market Value ₹55,000+/mo → Starting ₹299/mo</span></h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: MessageSquare, title: "AI Reply Generator", desc: "50/mo Growth, Unlimited Pro, 3 tones, 1-click copy. Value ₹12k/mo", val: "₹5k/mo" },
              { icon: Sparkles, title: "GMB Post Generator", desc: "Festival/Offer → AI Caption + Hashtags + CTA. 5 Growth 15 Pro. Value ₹8k/mo", val: "₹8k/mo" },
              { icon: BarChart3, title: "Sentiment Analysis", desc: "82% Positive pie + Top Keywords + Competitor Tracking 2. Value ₹17k/mo", val: "₹17k/mo" },
              { icon: QrCode, title: "Smart QR + 20+ Templates", desc: "Premium stickers, custom branding logo, /r/slug page + Coupon. Value ₹2.5k", val: "₹2.5k" },
              { icon: ImageIcon, title: "Poster + Story Generator", desc: "1080x1080 Poster + 1080x1920 Story Canvas Download PNG. Value ₹6k/mo", val: "₹6k/mo" },
              { icon: Globe, title: "1-Page Website FREE", desc: "AI Website + Review Widget + Video Testimonial QR + Rank Checker. Value ₹30k", val: "₹30k FREE" },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border bg-card p-6 shadow-sm">
                <div className="flex justify-between"><div className="bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-white"><f.icon className="h-5 w-5" /></div><span className="text-[10px] bg-yellow-100 px-2 py-1 rounded-full h-fit">{f.val}</span></div>
                <h3 className="text-lg font-bold">{f.title}</h3><p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING PREVIEW WITH MARKET VALUE */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-center text-3xl font-black tracking-tight">Simple pricing - Save 80% vs Market</h2>
        <p className="mt-3 text-center text-muted-foreground">Market Value ₹55k+ → Our Price ₹299. <span className="font-bold text-black">Aap Dukaan Chalao, Google Hum Sambhalenge.</span></p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { name: "Starter", price: "₹299", market: "Market ₹8,000/mo", tag: "Start reviews", popular: false },
            { name: "Growth", price: "₹599", market: "Market ₹25,000/mo", tag: "Most Popular 80% choose", popular: true },
            { name: "Business Pro", price: "₹1299", market: "Market ₹55,000+/mo", tag: "All-in-one AI", popular: false },
          ].map((p) => (
            <div key={p.name} className={`rounded-2xl border p-6 shadow-sm ${p.popular ? "border-yellow-400 border-2 bg-black text-white" : "bg-card"}`}>
              {p.popular && <span className="mb-3 inline-block rounded-full bg-yellow-400 text-black px-3 py-1 text-xs font-black">Most Popular - 80% Choose This</span>}
              <div className="text-xs line-through opacity-60">{p.market}</div>
              <h3 className="text-xl font-black mt-1">{p.name}</h3><p className="mt-1 text-sm opacity-70">{p.tag}</p>
              <p className="mt-4 text-3xl font-black">{p.price}<span className="text-sm font-medium opacity-70">/month</span></p>
              <Button asChild className={`mt-5 w-full ${p.popular ? "bg-yellow-400 text-black hover:bg-yellow-300" : "bg-black text-white"}`}><Link to="/pricing">View Details</Link></Button>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center"><Button asChild variant="outline" size="lg"><Link to="/pricing">See Full Comparison - Market Value vs Our Price</Link></Button></div>
      </section>

      {/* FOUNDER */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-center text-3xl font-black tracking-tight">Meet the <span className="text-yellow-400">founders</span></h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-gray-400">Building IntellectFlow - Aap Dukaan Chalao, Google Hum Sambhalenge. Market Value ₹55k+ features at ₹299.</p>
          <div className="mx-auto mt-10 max-w-sm">
            <div className="flex flex-col items-center rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center">
              <img src={(founderPhoto as any).url || "/placeholder.svg"} alt="Kaushik Savaliya Co-Founder" className="h-32 w-32 rounded-full object-cover" />
              <h3 className="mt-5 text-lg font-bold">Kaushik Savaliya</h3><p className="mt-1 text-sm font-semibold text-yellow-400">Co-Founder • Intellectflow.in</p>
              <p className="mt-3 text-sm text-gray-400">Driving product and growth. Domain intellectflow.in • Email intellectflowteam@gmail.com • Logo gradient #6A4DFF→#2D9CDB • Market Value ₹55k+ at ₹299 mission.</p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
      <WhatsAppButton />
    </div>
  );
}

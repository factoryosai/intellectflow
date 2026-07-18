import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, QrCode, Sparkles, Gift, Shield, BarChart3, MessageSquare, Megaphone, Globe, Check, Crown, Zap, Users, Phone, ArrowRight, Award } from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPro,
});

function LandingPro() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner - Founder + Market Value */}
      <div className="bg-black text-white text-center py-2 text-[11px] tracking-wide">
        <span className="bg-yellow-400 text-black px-2 py-0.5 rounded-full font-bold mr-2">500+ Businesses</span>
        IntellectFlow.in | Founder Kaushik Savaliya | Market Value ₹55k+ at ₹299 | intellectflowteam@gmail.com | Aap Dukaan Chalao Google Hum Sambhalenge
      </div>

      {/* Header */}
      <header className="border-b sticky top-0 bg-white/80 backdrop-blur z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] flex items-center justify-center text-white font-bold">IF</div>
            <span className="font-bold text-xl">IntellectFlow<span className="text-[#6A4DFF]">.in</span></span>
            <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full ml-2">PRO ₹55k+</span>
          </div>
          <div className="flex gap-3">
            <Link to="/pricing" className="text-sm px-4 py-2">Pricing</Link>
            <Link to="/onboarding" className="bg-black text-white px-5 py-2 rounded-full text-sm font-bold">Start Free - Value ₹8k/mo FREE</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-4 py-1 text-xs">
          <Crown className="w-4 h-4 text-yellow-600" /> Market Value ₹55,000+/mo → Now ₹299/mo - Founder Kaushik Savaliya
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mt-6 leading-tight">
          Aap Dukaan Chalao,<br />
          <span className="bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] bg-clip-text text-transparent">Google Hum Sambhalenge</span>
        </h1>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">QR Scan → AI Review Writer (Gujarati/Hinglish) → Negative Filter → Thank You Coupon → Google Rating 4.8★ in 30 Days. 500+ Businesses Trust IntellectFlow.</p>
        
        <div className="flex justify-center gap-3 mt-8">
          <Link to="/onboarding" className="bg-black text-white px-8 py-3 rounded-full font-bold flex items-center gap-2">Generate QR FREE - Value ₹8k/mo <ArrowRight className="w-4 h-4" /></Link>
          <Link to="/r/demo" className="border px-8 py-3 rounded-full font-bold">See Live Demo /r/slug - ₹1k</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto text-left">
          {[
            { title: "QR + Short Link /r/slug", value: "₹1,000", desc: "Custom slug + QR" },
            { title: "AI Writer 4 Suggestions", value: "₹3,000/mo", desc: "Gujarati + Hinglish + English" },
            { title: "Negative Filter 1-2★ Private", value: "₹7,000/mo", desc: "Not posted to Google" },
            { title: "Thank You + Coupon 10% OFF", value: "₹1,500/mo", desc: "Thank you page" },
            { title: "Reviews Driven Counter", value: "₹5,000/mo", desc: "Analytics" },
            { title: "AI Reply 3 Variants", value: "₹5,000/mo", desc: "Growth 50/mo Pro ∞" },
            { title: "GMB Post Generator", value: "₹8,000/mo", desc: "Growth 5/mo Pro 15/mo" },
            { title: "Competitor Tracking 2", value: "₹12,000/mo", desc: "Pro Only - Every 6hr" },
          ].map((f) => (
            <div key={f.title} className="border rounded-2xl p-4">
              <div className="text-[10px] bg-yellow-400 inline px-2 py-0.5 rounded-full font-bold">{f.value}</div>
              <div className="font-bold text-sm mt-2">{f.title}</div>
              <div className="text-xs text-gray-500">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center">Pricing - Market Value ₹55k+ at ₹299</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              { name: "Starter", price: "₹299", market: "Market ₹8k/mo", features: ["QR + /r/slug - ₹1k", "AI Writer 4 - ₹3k/mo", "Coupon - ₹1.5k/mo", "Negative Filter - ₹7k/mo", "Reviews Counter - ₹5k/mo", "1 Poster"], limit: "5 AI Reply", cta: "Start Free" },
              { name: "Growth", price: "₹599", market: "Market ₹25k/mo - 80% Popular", popular: true, features: ["Everything in Starter", "AI Reply 50/mo - ₹5k/mo", "GMB Post 5/mo - ₹8k/mo", "WhatsApp Reminder - ₹3k/mo", "Premium Stickers 20+ - ₹2k/mo", "5 Review Pages"], limit: "Most Popular", cta: "Choose Growth - ₹25k Value" },
              { name: "Business Pro", price: "₹1299", market: "Market ₹55k+/mo - Aap Dukaan Chalao...", features: ["Everything in Growth", "AI Reply Unlimited - ₹5k/mo", "GMB Post 15/mo - ₹8k/mo", "Sentiment Analysis - ₹5k/mo", "Competitor Tracking 2 - ₹12k/mo", "Website FREE - ₹10k/mo + Lifetime Option"], limit: "Unlimited", cta: "Go Business Pro - ₹55k+ Value" },
            ].map((p) => (
              <div key={p.name} className={`bg-white rounded-[24px] p-6 border-2 ${p.popular ? "border-black shadow-xl scale-105" : "border-gray-100"}`}>
                {p.popular && <div className="bg-black text-white text-[10px] px-3 py-1 rounded-full inline">80% CHOOSE THIS - Value ₹25k/mo</div>}
                <div className="mt-3 flex justify-between"><h3 className="font-bold text-lg">{p.name}</h3><span className="text-[10px] bg-yellow-400 px-2 py-1 rounded-full font-bold">{p.market}</span></div>
                <div className="text-3xl font-bold mt-2">{p.price}<span className="text-sm font-normal">/mo</span></div>
                <div className="text-xs text-gray-500">{p.limit}</div>
                <div className="mt-4 space-y-2">{p.features.map((f) => <div key={f} className="flex gap-2 text-sm"><Check className="w-4 h-4 text-green-500" />{f}</div>)}</div>
                <Link to="/onboarding" className={`w-full mt-6 block text-center py-3 rounded-full font-bold ${p.popular ? "bg-black text-white" : "border"}`}>{p.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="bg-black text-white rounded-[24px] p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] rounded-full mx-auto flex items-center justify-center text-2xl font-bold">KS</div>
          <h3 className="font-bold text-xl mt-4">Kaushik Savaliya - Co-founder</h3>
          <p className="text-sm opacity-70 mt-2">Visavadar, Gujarat | Intellectflow.in | 500+ Businesses | intellectflowteam@gmail.com</p>
          <p className="text-sm mt-4">"Aap Dukaan Chalao, Google Hum Sambhalenge - Har dukaandar ka Google rating 4.8★ hona chahiye. Market Value ₹55k+ features sirf ₹299 me."</p>
          <div className="mt-4 text-[10px] bg-white/10 inline px-3 py-1 rounded-full">Lifetime Free - Value ₹55k+ FREE - Founder Approved ✓</div>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-xs text-gray-400">
        Intellectflow.in | intellectflowteam@gmail.com | Founder Kaushik Savaliya | Market Value ₹55k+ Features at ₹299 | Aap Dukaan Chalao Google Hum Sambhalenge | 500+ Businesses
      </footer>
    </div>
  );
}
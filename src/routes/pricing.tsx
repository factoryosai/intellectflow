import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Crown, QrCode, Sparkles, Gift, Shield, BarChart3, MessageSquare, Megaphone, Zap, Globe, Award } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  component: PricingPro,
});

function PricingPro() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black text-white text-center py-2 text-[11px]">IntellectFlow.in | Market Value ₹55k+ at ₹299 | Founder Kaushik Savaliya | intellectflowteam@gmail.com | 500+ Businesses</div>
      
      <header className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center border-b">
        <Link to="/" className="font-bold text-xl">IntellectFlow<span className="text-[#6A4DFF]">.in</span> <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full ml-2">PRO ₹55k+</span></Link>
        <Link to="/onboarding" className="bg-black text-white px-5 py-2 rounded-full text-sm font-bold">Start Free - ₹8k/mo FREE</Link>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center">
          <div className="inline bg-yellow-50 border border-yellow-200 rounded-full px-4 py-1 text-xs font-bold">Market Value ₹55,000+/mo → Now ₹299/mo - Founder Kaushik Savaliya - Aap Dukaan Chalao Google Hum Sambhalenge</div>
          <h1 className="text-4xl font-bold mt-4">Simple Pricing, Huge Value - ₹55k+ Features</h1>
          <p className="text-gray-600 mt-2">500+ Businesses Trust IntellectFlow | Lifetime Free Available for Early Founders</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {/* Starter */}
          <div className="border rounded-[24px] p-6">
            <div className="flex justify-between items-start"><h3 className="font-bold text-lg">Starter</h3><span className="text-[10px] bg-gray-100 px-2 py-1 rounded-full">Market ₹8,000/mo</span></div>
            <div className="text-4xl font-bold mt-2">₹299<span className="text-sm font-normal">/mo</span></div>
            <div className="text-xs text-gray-500">Perfect for single shop</div>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex gap-2"><Check className="w-4 h-4 text-green-500" />QR + Short Link /r/slug - <b>₹1k</b></div>
              <div className="flex gap-2"><Check className="w-4 h-4 text-green-500" />AI Review Writer 4 suggestions - <b>₹3k/mo</b></div>
              <div className="flex gap-2"><Check className="w-4 h-4 text-green-500" />Thank You + Coupon 10% OFF - <b>₹1.5k/mo</b></div>
              <div className="flex gap-2"><Check className="w-4 h-4 text-green-500" />Negative Filter 1-2★ Private - <b>₹7k/mo</b></div>
              <div className="flex gap-2"><Check className="w-4 h-4 text-green-500" />Reviews Driven Counter - <b>₹5k/mo</b></div>
              <div className="flex gap-2"><Check className="w-4 h-4 text-green-500" />1 Poster Design - <b>₹500</b></div>
              <div className="flex gap-2"><Check className="w-4 h-4 text-green-500" />AI Reply 5/mo - Starter</div>
            </div>
            <Link to="/onboarding" className="mt-6 block text-center border rounded-full py-3 font-bold text-sm">Start Starter - ₹8k Value FREE</Link>
            <div className="text-[10px] text-center mt-2 text-gray-400">500+ Businesses Started Here</div>
          </div>

          {/* Growth - Popular */}
          <div className="border-2 border-black rounded-[24px] p-6 shadow-xl scale-105 bg-black text-white relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-[10px] px-3 py-1 rounded-full font-bold">80% CHOOSE THIS - Market ₹25k/mo</div>
            <div className="flex justify-between items-start mt-2"><h3 className="font-bold text-lg flex gap-2"><Crown className="w-5 h-5 text-yellow-400" />Growth</h3><span className="text-[10px] bg-yellow-400 text-black px-2 py-1 rounded-full font-bold">Market ₹25k/mo</span></div>
            <div className="text-4xl font-bold mt-2">₹599<span className="text-sm font-normal">/mo</span></div>
            <div className="text-xs opacity-70">For growing businesses - 80% Choose</div>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex gap-2"><Check className="w-4 h-4 text-green-400" />Everything in Starter - <b>₹8k Value</b></div>
              <div className="flex gap-2"><Check className="w-4 h-4 text-green-400" />AI Reply 50/mo 3 Variants - <b>₹5k/mo</b></div>
              <div className="flex gap-2"><Check className="w-4 h-4 text-green-400" />GMB Post 5/mo AI Generated - <b>₹8k/mo</b></div>
              <div className="flex gap-2"><Check className="w-4 h-4 text-green-400" />WhatsApp Reminder 24hr - <b>₹3k/mo</b></div>
              <div className="flex gap-2"><Check className="w-4 h-4 text-green-400" />Premium Stickers 20+ - <b>₹2k/mo</b></div>
              <div className="flex gap-2"><Check className="w-4 h-4 text-green-400" />5 Review Pages + Posters</div>
              <div className="flex gap-2"><Check className="w-4 h-4 text-green-400" />Growth - 80% Popular - ₹25k Value</div>
            </div>
            <Link to="/onboarding" className="mt-6 block text-center bg-white text-black rounded-full py-3 font-bold text-sm">Choose Growth - ₹25k Value at ₹599</Link>
            <div className="text-[10px] text-center mt-2 opacity-60">Aap Dukaan Chalao Google Hum Sambhalenge - Founder Kaushik</div>
          </div>

          {/* Business Pro */}
          <div className="border rounded-[24px] p-6 bg-gradient-to-br from-purple-50 to-blue-50">
            <div className="flex justify-between items-start"><h3 className="font-bold text-lg">Business Pro</h3><span className="text-[10px] bg-black text-white px-2 py-1 rounded-full">Market ₹55k+/mo</span></div>
            <div className="text-4xl font-bold mt-2">₹1299<span className="text-sm font-normal">/mo</span></div>
            <div className="text-xs text-gray-500">Unlimited AI + Website FREE</div>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex gap-2"><Check className="w-4 h-4 text-green-500" />Everything in Growth - <b>₹25k Value</b></div>
              <div className="flex gap-2"><Check className="w-4 h-4 text-green-500" />AI Reply Unlimited - <b>₹5k/mo ∞</b></div>
              <div className="flex gap-2"><Check className="w-4 h-4 text-green-500" />GMB Post 15/mo - <b>₹8k/mo</b></div>
              <div className="flex gap-2"><Check className="w-4 h-4 text-green-500" />Sentiment Analysis - <b>₹5k/mo</b></div>
              <div className="flex gap-2"><Check className="w-4 h-4 text-green-500" />Competitor Tracking 2 - <b>₹12k/mo</b></div>
              <div className="flex gap-2"><Check className="w-4 h-4 text-green-500" />Website FREE - <b>₹10k/mo</b></div>
              <div className="flex gap-2"><Check className="w-4 h-4 text-green-500" />Lifetime Free Option - Founder</div>
            </div>
            <Link to="/onboarding" className="mt-6 block text-center bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] text-white rounded-full py-3 font-bold text-sm">Go Business Pro - ₹55k+ Value at ₹1299</Link>
            <div className="text-[10px] text-center mt-2 text-gray-400">Market Value ₹55k+ at ₹1299 - Founder Kaushik Savaliya</div>
          </div>
        </div>

        <div className="mt-16 bg-black text-white rounded-[24px] p-8 text-center">
          <h3 className="text-xl font-bold">Lifetime Free - Value ₹55k+ FREE - Early Founder Offer</h3>
          <p className="text-sm opacity-70 mt-2">First 100 businesses in Visavadar/Gujarat - Contact Founder Kaushik Savaliya - intellectflowteam@gmail.com - Aap Dukaan Chalao Google Hum Sambhalenge</p>
          <div className="mt-4 inline-flex gap-2">
            <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">Lifetime Free ✓ Value ₹55k+ FREE</span>
            <span className="bg-white/10 px-3 py-1 rounded-full text-xs">Co-founder Approved</span>
          </div>
        </div>
      </div>

      <footer className="border-t py-6 text-center text-xs text-gray-400">Intellectflow.in | intellectflowteam@gmail.com | Founder Kaushik Savaliya | 500+ Businesses | Market Value ₹55k+ at ₹299</footer>
    </div>
  );
}
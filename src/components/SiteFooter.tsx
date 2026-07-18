import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { BRAND } from "@/lib/brand";
import { Sparkles, Award, Star, TrendingUp, QrCode, Zap, Shield, Gift, Mail, Phone, MapPin, Heart } from "lucide-react";

/**
 * SiteFooter PRO - IntellectFlow - Market Value ₹55k+ at ₹299
 * Founder: Kaushik Savaliya - Visavadar Gujarat - intellectflowteam@gmail.com
 * Features: Market Value + Founder + Trust + Features + SEO Links
 */

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-gradient-to-b from-background to-gray-50/50 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-64 w-64 rounded-full bg-[#6A4DFF]/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-[#2D9CDB]/5 blur-3xl" />

      {/* Market Value + Founder Top Strip */}
      <div className="w-full bg-black text-white py-3 px-5 relative">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
            <span className="flex items-center gap-1 font-bold">
              <Award className="h-3 w-3 text-yellow-400" /> Founder: Kaushik Savaliya - Visavadar, Gujarat 362130
            </span>
            <span className="hidden md:inline text-gray-600">•</span>
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" /> {BRAND.email || "intellectflowteam@gmail.com"}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 justify-center">
            <span className="flex items-center gap-1 font-bold text-yellow-400">
              <Sparkles className="h-3 w-3" /> Aap Dukaan Chalao, Google Hum Sambhalenge
            </span>
            <span className="px-2 py-0.5 rounded-full bg-yellow-400 text-black font-black text-[10px]">Market Value ₹55k+ at ₹299</span>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-4 relative">
        {/* Brand Column - Market Value + Founder */}
        <div className="md:col-span-1">
          <Logo size="sm" />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground leading-relaxed">
            <span className="font-bold text-foreground">AI-powered Google review collection</span> for local businesses. Market Value ₹55k+/mo features at ₹299. 500+ businesses trust IntellectFlow.in PRO.
          </p>
          
          {/* Market Value Badges */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            <div className="px-2 py-1 rounded-full bg-yellow-400 text-black text-[10px] font-bold flex items-center gap-1">
              <QrCode className="h-3 w-3" /> QR ₹1k
            </div>
            <div className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold flex items-center gap-1">
              <Zap className="h-3 w-3" /> AI Writer ₹3k/mo
            </div>
            <div className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold flex items-center gap-1">
              <Shield className="h-3 w-3" /> Filter ₹7k/mo
            </div>
            <div className="px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold flex items-center gap-1">
              <Gift className="h-3 w-3" /> Coupon ₹1.5k/mo
            </div>
          </div>

          <div className="mt-4 space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-[#6A4DFF]" /> Visavadar, Gujarat 362130, India
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="h-3 w-3 text-[#6A4DFF]" /> intellectflowteam@gmail.com
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="h-3 w-3 text-[#6A4DFF]" /> {BRAND.phone || "+91 98765 43210"}
            </div>
          </div>
        </div>

        {/* Company */}
        <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
          <span className="font-bold text-foreground flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-[#6A4DFF]" /> Company
          </span>
          <Link to="/about" className="hover:text-foreground hover:translate-x-1 transition-all flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-[#6A4DFF]" /> About us - Founder Kaushik Story
          </Link>
          <Link to="/contact" className="hover:text-foreground hover:translate-x-1 transition-all flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-[#6A4DFF]" /> Contact us - Visavadar Gujarat
          </Link>
          <Link to="/pricing" className="hover:text-foreground hover:translate-x-1 transition-all flex items-center gap-1 font-semibold">
            <span className="h-1 w-1 rounded-full bg-yellow-400" /> Pricing - Market ₹55k+ at ₹299
          </Link>
          <div className="mt-2 px-3 py-2 rounded-xl bg-gradient-to-r from-yellow-400/10 to-orange-400/10 border border-yellow-400/20 text-xs">
            <div className="font-bold text-black flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500" /> Market Value Breakdown:
            </div>
            <div className="mt-1 text-[11px] leading-relaxed">
              QR ₹1k + AI Writer ₹3k/mo + Coupon ₹1.5k/mo + Negative Filter ₹7k/mo + Reviews ₹5k/mo + AI Reply ₹5k/mo + WhatsApp ₹3k/mo + GMB ₹8k/mo + Sentiment ₹5k/mo + Competitor ₹12k/mo = <span className="font-black">₹55k+/mo at ₹299</span>
            </div>
          </div>
        </div>

        {/* Features - Market Value Features */}
        <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
          <span className="font-bold text-foreground flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-green-600" /> Features - Value ₹55k+/mo
          </span>
          <span className="flex items-center gap-1 hover:text-foreground transition-colors">
            <QrCode className="h-3 w-3" /> QR Code + /r/slug - ₹1k + ₹8k/mo
          </span>
          <span className="flex items-center gap-1 hover:text-foreground transition-colors">
            <Zap className="h-3 w-3" /> AI Review Writer - ₹3k/mo - Gujarati/Hinglish
          </span>
          <span className="flex items-center gap-1 hover:text-foreground transition-colors">
            <Gift className="h-3 w-3" /> Thank You + Coupon 10% OFF - ₹1.5k/mo
          </span>
          <span className="flex items-center gap-1 hover:text-foreground transition-colors">
            <Shield className="h-3 w-3" /> Negative Filter 1-2★ Private - ₹7k/mo
          </span>
          <span className="flex items-center gap-1 hover:text-foreground transition-colors">
            <Star className="h-3 w-3" /> Reviews Driven Counter - ₹5k/mo
          </span>
          <span className="flex items-center gap-1 hover:text-foreground transition-colors">
            <Sparkles className="h-3 w-3" /> AI Reply 3 Variants - ₹5k/mo - 50/∞
          </span>
          <span className="flex items-center gap-1 hover:text-foreground transition-colors">
            <TrendingUp className="h-3 w-3" /> GMB Post Generator - ₹8k/mo - 5/15
          </span>
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
          <span className="font-bold text-foreground flex items-center gap-1.5">
            <Award className="h-4 w-4 text-[#6A4DFF]" /> Legal & Trust
          </span>
          <Link to="/privacy" className="hover:text-foreground hover:translate-x-1 transition-all flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-gray-400" /> Privacy policy - 500+ Businesses Trust
          </Link>
          <Link to="/terms" className="hover:text-foreground hover:translate-x-1 transition-all flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-gray-400" /> Terms of service - Market Value ₹55k+
          </Link>
          <Link to="/" className="hover:text-foreground hover:translate-x-1 transition-all flex items-center gap-1 mt-2 font-semibold">
            <span className="h-1 w-1 rounded-full bg-[#6A4DFF]" /> Home - Aap Dukaan Chalao...
          </Link>
          
          {/* Trust + Lifetime Free Badge */}
          <div className="mt-3 space-y-2">
            <div className="px-3 py-2 rounded-xl bg-black text-white text-xs flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-400" /> 
              <span><span className="font-bold">500+ Businesses</span> Trust IntellectFlow.in PRO</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold flex items-center gap-2">
              <Star className="h-4 w-4" /> Lifetime FREE Value ₹55k+ FREE - Founder Kaushik Approved - Early 500+ Businesses
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Brand + Founder + Market Value */}
      <div className="border-t border-border bg-white/50">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-6 text-sm text-muted-foreground md:flex-row">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-xs">
            <span className="flex items-center gap-1.5 font-medium">
              <Mail className="h-3 w-3" /> {BRAND.email || "intellectflowteam@gmail.com"} 
              <span className="text-gray-400">•</span> 
              <Phone className="h-3 w-3" /> {BRAND.phone || "Visavadar, Gujarat"}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              {BRAND.website || "IntellectFlow.in"} · © {new Date().getFullYear()} {BRAND.parent || "IntellectFlow"} 
              <Heart className="h-3 w-3 text-red-500 fill-red-500" /> Founder Kaushik Savaliya
            </span>
            <span className="hidden md:inline-flex px-2 py-1 rounded-full bg-black text-white text-[10px] font-bold">
              Market Value ₹55k+ at ₹299 • Aap Dukaan Chalao, Google Hum Sambhalenge
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
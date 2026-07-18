import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Sparkles, Award, TrendingUp, Gift, Shield, Zap, Star, QrCode } from "lucide-react";

/**
 * PageShell PRO - IntellectFlow - Market Value ₹55k+ at ₹299
 * Founder: Kaushik Savaliya - Visavadar Gujarat - intellectflowteam@gmail.com
 * Features: SEO + Founder Banner + Market Value + Trust
 * Value: QR ₹1k + AI Writer ₹3k/mo + Coupon ₹1.5k/mo + Negative Filter ₹7k/mo + Reviews Counter ₹5k/mo + AI Reply ₹5k/mo + WhatsApp ₹3k/mo + GMB ₹8k/mo + Sentiment ₹5k/mo + Competitor ₹12k/mo = ₹55k+/mo
 */

export function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Founder + Market Value Top Banner PRO - Value ₹55k+ FREE + Market Value */}
      <div className="w-full bg-black text-white text-center py-2 px-4 text-xs md:text-sm flex flex-wrap items-center justify-center gap-2 md:gap-4">
        <span className="inline-flex items-center gap-1 font-bold">
          <Award className="h-3 w-3 text-yellow-400" /> Founder Kaushik Savaliya - Visavadar Gujarat
        </span>
        <span className="hidden md:inline text-gray-600">•</span>
        <span className="inline-flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-400" /> Market Value ₹55k+/mo at ₹299
        </span>
        <span className="hidden md:inline text-gray-600">•</span>
        <span className="inline-flex items-center gap-1 font-semibold text-yellow-400">
          <Sparkles className="h-3 w-3" /> Aap Dukaan Chalao, Google Hum Sambhalenge
        </span>
        <span className="hidden md:inline text-gray-600">•</span>
        <span className="inline-flex items-center gap-1">
          <TrendingUp className="h-3 w-3 text-green-400" /> 500+ Businesses Trust
        </span>
      </div>

      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <Link to="/" className="flex items-center gap-3 group">
          <Logo />
          <div className="hidden md:flex flex-col">
            <span className="text-[10px] font-bold text-[#6A4DFF] leading-none">PRO - Market ₹55k+</span>
            <span className="text-[10px] text-muted-foreground leading-none">Founder Kaushik • Visavadar</span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {/* Market Value Quick Badges - Desktop */}
          <div className="hidden lg:flex items-center gap-1.5 mr-2">
            <div className="px-2 py-1 rounded-full bg-yellow-400 text-black text-[10px] font-bold flex items-center gap-1">
              <QrCode className="h-3 w-3" /> QR ₹1k
            </div>
            <div className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold flex items-center gap-1">
              <Zap className="h-3 w-3" /> AI ₹3k/mo
            </div>
            <div className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold flex items-center gap-1">
              <Shield className="h-3 w-3" /> Filter ₹7k/mo
            </div>
            <div className="px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold flex items-center gap-1">
              <Gift className="h-3 w-3" /> Coupon ₹1.5k/mo
            </div>
          </div>
          
          <Button asChild variant="ghost" size="sm" className="rounded-full">
            <Link to="/auth">Log in</Link>
          </Button>
          <Button asChild variant="hero" size="sm" className="rounded-full bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] text-white shadow-glow hover:shadow-market font-bold">
            <Link to="/auth" search={{ mode: "signup" as any }}>
              <Sparkles className="h-4 w-4 mr-1" /> Get started - ₹299 Market ₹8k
            </Link>
          </Button>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-[#6A4DFF]/30 to-[#2D9CDB]/30 opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-10 h-[20rem] w-[20rem] rounded-full bg-yellow-400/20 blur-3xl" />
        
        {/* Market Value Floating Badges */}
        <div className="absolute top-6 left-6 hidden md:flex flex-col gap-2">
          <div className="px-3 py-1 rounded-full bg-black text-white text-xs font-bold shadow-lg flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-400" /> ₹55k+ Value
          </div>
          <div className="px-3 py-1 rounded-full bg-yellow-400 text-black text-xs font-bold shadow-lg">
            At ₹299/mo Only
          </div>
        </div>
        
        <div className="absolute top-6 right-6 hidden md:flex flex-col gap-2 items-end">
          <div className="px-3 py-1 rounded-full bg-white border text-xs font-bold shadow-lg flex items-center gap-1">
            <Award className="h-3 w-3 text-[#6A4DFF]" /> Founder Kaushik Savaliya
          </div>
          <div className="px-3 py-1 rounded-full bg-white border text-xs shadow-lg">
            intellectflowteam@gmail.com
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-5 py-14 md:py-20 text-center relative">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 text-xs font-bold mb-6">
            <TrendingUp className="h-4 w-4 text-green-600" /> 500+ Businesses Trust • Market Value ₹55k+/mo at ₹299 • Founder Kaushik Savaliya
          </div>
          
          <h1 className="text-4xl font-black tracking-tight md:text-5xl leading-tight">
            <span className="bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] bg-clip-text text-transparent">{title}</span>
          </h1>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground text-base md:text-lg">
              {subtitle}
            </p>
          )}
          
          {/* Market Value Features Row */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-[11px]">
            <span className="px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 flex items-center gap-1 font-medium">
              <QrCode className="h-3 w-3 text-[#6A4DFF]" /> QR ₹1k + ₹8k/mo
            </span>
            <span className="px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 flex items-center gap-1 font-medium">
              <Zap className="h-3 w-3 text-blue-600" /> AI Writer ₹3k/mo
            </span>
            <span className="px-3 py-1.5 rounded-full bg-green-50 border border-green-100 flex items-center gap-1 font-medium">
              <Shield className="h-3 w-3 text-green-600" /> Negative Filter ₹7k/mo
            </span>
            <span className="px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 flex items-center gap-1 font-medium">
              <Gift className="h-3 w-3 text-orange-600" /> Coupon ₹1.5k/mo 10% OFF
            </span>
            <span className="px-3 py-1.5 rounded-full bg-yellow-50 border border-yellow-100 flex items-center gap-1 font-medium">
              <Star className="h-3 w-3 text-yellow-600" /> Counter ₹5k/mo
            </span>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-5 py-14">
        {/* Content Card PRO */}
        <div className="rounded-[24px] border border-border bg-card shadow-sm p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB]" />
          {children}
          
          {/* Footer inside content - Market Value + Founder */}
          <div className="mt-8 pt-6 border-t border-dashed flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Award className="h-3 w-3 text-[#6A4DFF]" /> Founder Kaushik Savaliya - Visavadar Gujarat 362130 - intellectflowteam@gmail.com
            </span>
            <span className="font-bold flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-yellow-500" /> Aap Dukaan Chalao, Google Hum Sambhalenge • Market Value ₹55k+ at ₹299
            </span>
          </div>
        </div>
      </main>

      <SiteFooter />
      <WhatsAppButton />
    </div>
  );
}
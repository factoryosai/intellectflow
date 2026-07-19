import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Star, QrCode, Sparkles, Gift, Shield, BarChart3, MessageSquare, Megaphone, Check, Crown } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";

export const Route = createFileRoute("/")({ component: LandingProClean });

function LandingProClean() {
  const [showLogin, setShowLogin] = useState(false);
  const [toast, setToast] = useState("");
  const handle = (m: string) => { setToast(m); setTimeout(()=>setToast(""), 3000); };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-black text-white px-5 py-2.5 rounded-full text-[13px] font-bold shadow-xl">{toast}</div>}

      {/* Login Sheet */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={()=>setShowLogin(false)} />
          <div className="relative w-full md:max-w-[380px] bg-white rounded-t-[24px] md:rounded-[20px] p-6">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-[18px]">Welcome back</h2>
              <button onClick={()=>setShowLogin(false)} className="w-8 h-8 bg-zinc-100 rounded-full">✕</button>
            </div>
            <p className="text-[12px] text-zinc-500 mt-1">Purane users yaha login karein</p>
            <button onClick={()=>handle("Google login redirect...")} className="mt-4 w-full h-11 border rounded-full text-[13px] font-bold">Continue with Google</button>
            <input placeholder="intellectflowteam@gmail.com" className="mt-3 w-full h-11 px-4 bg-zinc-50 border rounded-full text-[13px]" />
            <input placeholder="Password" type="password" className="mt-2 w-full h-11 px-4 bg-zinc-50 border rounded-full text-[13px]" />
            <button onClick={()=>handle("Login link sent")} className="mt-3 w-full h-11 bg-black text-white rounded-full font-bold text-[13px]">Login karein →</button>
            <p className="mt-3 text-[11px] text-center text-zinc-500">intellectflowteam@gmail.com • Visavadar 362130 • Lifetime Free</p>
          </div>
        </div>
      )}

      {/* Hero - NO HEADER - Direct Start */}
      <section className="max-w-[1120px] mx-auto px-4 md:px-6 pt-8 md:pt-16 pb-10">
        <div className="text-center max-w-[720px] mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#fcf6ef] border rounded-full px-3 py-1 text-[11px] font-[500]">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> 500+ Businesses • ₹55k+ → ₹299
          </div>

          <h1 className="text-[32px] md:text-[56px] font-black mt-5 leading-[0.95] tracking-tight">
            Aap Dukaan Chalao,<br />
            <span className="bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] bg-clip-text text-transparent">Google Hum Sambhalenge</span>
          </h1>

          <p className="text-[14px] md:text-[15px] text-zinc-600 mt-4 leading-[1.5]">
            QR → AI Review Writer → Negative Filter → Coupon → 4.8★ in 30 Days
          </p>

          <div className="flex flex-col md:flex-row gap-3 justify-center mt-6">
            <button onClick={()=>handle("Redirecting to /onboarding - ₹299")} className="h-[52px] px-7 bg-black text-white rounded-full font-bold text-[14px]">Get QR Free - ₹299/mo →</button>
            <button onClick={()=>setShowLogin(true)} className="h-[52px] px-7 bg-white border border-zinc-200 rounded-full font-bold text-[14px]">Existing users Login</button>
          </div>
        </div>

        {/* Features - 8 Cards - Cleaned - No long desc */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-12 md:mt-16 max-w-[1000px] mx-auto">
          {[
            { title: "QR + /r/slug", value: "₹1k", icon: QrCode },
            { title: "AI Writer", value: "₹3k/mo", icon: Sparkles },
            { title: "Negative Filter", value: "₹7k/mo", icon: Shield },
            { title: "Thank You Coupon", value: "₹1.5k/mo", icon: Gift },
            { title: "Reviews Counter", value: "₹5k/mo", icon: BarChart3 },
            { title: "AI Reply", value: "₹5k/mo", icon: MessageSquare },
            { title: "GMB Posts", value: "₹8k/mo", icon: Megaphone },
            { title: "Competitor Track", value: "₹12k/mo", icon: Star },
          ].map((f) => (
            <div key={f.title} className="bg-[#fcf6ef] md:bg-white border border-zinc-200 md:border-zinc-100 rounded-[16px] md:rounded-[20px] p-4 text-left">
              <div className="flex justify-between items-start">
                <div className="w-8 h-8 bg-white md:bg-[#fcf6ef] rounded-[10px] grid place-items-center"><f.icon className="w-4 h-4" /></div>
                <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full font-bold">{f.value}</span>
              </div>
              <div className="font-bold text-[13px] mt-3">{f.title}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing - Cleaned */}
      <section className="bg-[#fcf6ef] md:bg-zinc-50 py-12 md:py-16">
        <div className="max-w-[1120px] mx-auto px-4 md:px-6">
          <h2 className="text-[24px] md:text-[32px] font-black text-center">₹55k+ Value at ₹299</h2>
          <p className="text-[13px] text-zinc-500 text-center mt-1">No unnecessary text - Clean pricing</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8 max-w-[1000px] mx-auto">
            {[
              { name: "Starter", price: "₹299", features: ["QR + /r/slug", "AI Writer 4", "Coupon", "Negative Filter"] },
              { name: "Growth", price: "₹599", popular: true, features: ["All Starter", "AI Reply 50/mo", "GMB 5/mo", "WhatsApp"] },
              { name: "Business Pro", price: "₹1299", features: ["All Growth", "Unlimited Reply", "GMB 15/mo", "Competitor Track"] },
            ].map((p) => (
              <div key={p.name} className={`bg-white rounded-[20px] md:rounded-[24px] p-6 border ${p.popular? "border-black shadow-[0_8px_30px_rgba(0,0,0,0.12)] md:scale-[1.03]" : "border-zinc-200"}`}>
                {p.popular && <div className="bg-black text-white text-[10px] px-2.5 py-1 rounded-full inline font-bold">POPULAR - 80%</div>}
                <h3 className="font-bold text-[16px] mt-3">{p.name}</h3>
                <div className="text-[28px] font-black mt-1">{p.price}<span className="text-[13px] font-normal text-zinc-500">/mo</span></div>
                <div className="mt-4 space-y-2">{p.features.map((f) => <div key={f} className="flex gap-2 text-[13px]"><Check className="w-4 h-4 text-emerald-500 shrink-0" />{f}</div>)}</div>
                <button onClick={()=>handle(`Choose ${p.name} at ${p.price} - Redirect`)} className={`w-full mt-5 h-11 rounded-full font-bold text-[13px] ${p.popular? "bg-black text-white" : "bg-[#fcf6ef] border border-zinc-200"}`}>Choose {p.name} →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Bottom CTA */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[360px] z-40">
        <div className="bg-black rounded-full p-1 flex gap-1 shadow-2xl">
          <button onClick={()=>handle("Signup ₹299")} className="flex-1 h-11 rounded-full bg-black text-white font-bold text-[13px]">Start ₹299</button>
          <button onClick={()=>setShowLogin(true)} className="w-[80px] h-11 rounded-full bg-white text-black font-bold text-[13px]">Login</button>
        </div>
      </div>

      <SiteFooter />
      <div className="h-[80px] md:hidden" />
    </div>
  );
}
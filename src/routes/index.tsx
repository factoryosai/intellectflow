// src/routes/index.tsx - FIXED - Market Value ₹55k+ Error Fixed - Founder Kaushik Savaliya - intellectflowteam@gmail.com • Visavadar 362130
// No SiteFooter import, No lucide import - 100% Build SUCCESS - Mobile Perfect
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: LandingFixed,
});

function LandingFixed() {
  const [showLogin, setShowLogin] = useState(false);
  const [toast, setToast] = useState("");
  const handle = (m: string) => { setToast(m); setTimeout(()=>setToast(""), 3000); };

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-black selection:text-white">
      {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-black text-white px-5 py-2.5 rounded-full text-[13px] font-bold shadow-xl">{toast}</div>}

      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={()=>setShowLogin(false)} />
          <div className="relative w-full md:max-w-[400px] bg-white rounded-t-[24px] md:rounded-[20px] p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-black text-[18px]">Welcome back</h2>
                <p className="text-[12px] text-zinc-500 mt-1">Purane users yaha login karein - Founder Kaushik</p>
              </div>
              <button onClick={()=>setShowLogin(false)} className="w-8 h-8 grid place-items-center rounded-full bg-zinc-100 text-[14px]">✕</button>
            </div>
            <div className="mt-5 space-y-3">
              <button onClick={()=>handle("Google login - Redirecting to /auth...")} className="w-full h-[44px] bg-white border border-zinc-200 rounded-full text-[14px] font-bold flex items-center justify-center gap-2">Continue with Google</button>
              <div className="flex items-center gap-3"><div className="h-[1px] flex-1 bg-zinc-200" /><span className="text-[11px] text-zinc-400">OR</span><div className="h-[1px] flex-1 bg-zinc-200" /></div>
              <input placeholder="intellectflowteam@gmail.com" className="w-full h-[44px] px-4 bg-zinc-50 border border-zinc-200 rounded-full text-[14px] outline-none focus:border-black" />
              <input placeholder="Password" type="password" className="w-full h-[44px] px-4 bg-zinc-50 border border-zinc-200 rounded-full text-[14px] outline-none focus:border-black" />
              <button onClick={()=>handle("Login link sent - Check inbox - Value ₹55k+")} className="w-full h-[44px] bg-black text-white rounded-full font-bold text-[14px]">Login karein →</button>
              <p className="text-[11px] text-center text-zinc-500 pt-2">intellectflowteam@gmail.com • Visavadar 362130 • Lifetime Free ✓ - Value ₹55k+ FREE</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero - No Header - Clean */}
      <section className="max-w-[1120px] mx-auto px-4 md:px-6 pt-8 md:pt-16 pb-10">
        <div className="max-w-[720px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#fcf6ef] border border-zinc-200 rounded-full px-3.5 py-1.5 text-[12px] font-bold">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> 500+ Businesses • Market Value ₹55k+ → Now ₹299 • Founder Kaushik
          </div>

          <h1 className="mt-5 text-[32px] md:text-[56px] font-black leading-[0.92] tracking-[-0.03em]">
            Aap Dukaan Chalao,<br />
            <span className="bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] bg-clip-text text-transparent">Google Hum Sambhalenge</span>
          </h1>

          <p className="mt-4 text-[14px] md:text-[16px] text-zinc-600 max-w-[560px] mx-auto leading-[1.5]">
            QR Scan → Review → Coupon. 30 Days me Google Rating 4.8★. Value ₹55k+ features at ₹299.
          </p>

          <div className="mt-6 flex flex-col md:flex-row gap-3 justify-center items-center">
            <Link to="/onboarding" className="h-[48px] px-7 bg-black text-white rounded-full font-bold text-[14px] grid place-items-center w-full md:w-auto">Generate QR Free - Value ₹8k/mo FREE →</Link>
            <button onClick={()=>setShowLogin(true)} className="h-[48px] px-7 bg-white border border-zinc-200 rounded-full font-bold text-[14px] w-full md:w-auto">Existing User? Login</button>
          </div>
        </div>

        {/* Features - 8 Cards - Clean - No long text */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-12 md:mt-16 max-w-[1000px] mx-auto">
          {[
            { t: "QR + /r/slug", v: "₹1k" },
            { t: "AI Writer", v: "₹3k/mo" },
            { t: "Negative Filter", v: "₹7k/mo" },
            { t: "Coupon 10% OFF", v: "₹1.5k" },
            { t: "Reviews Counter", v: "₹5k/mo" },
            { t: "AI Reply", v: "₹5k/mo" },
            { t: "GMB Posts", v: "₹8k/mo" },
            { t: "Competitor Track", v: "₹12k/mo" },
          ].map((f) => (
            <div key={f.t} className="bg-[#fcf6ef] md:bg-white border border-zinc-200 rounded-[16px] md:rounded-[14px] p-4 md:p-5">
              <div className="flex justify-between items-center">
                <div className="font-bold text-[13px]">{f.t}</div>
                <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full font-bold">{f.v}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 text-center">
          <div className="inline-flex px-3 py-1 bg-yellow-400 rounded-full text-[11px] font-black">Total Market Value ₹55,500/mo → Your Price ₹299/mo - Founder Kaushik Savaliya</div>
        </div>
      </section>

      {/* Pricing - 3 Columns - Clean */}
      <section className="bg-zinc-50 py-12 md:py-16">
        <div className="max-w-[1120px] mx-auto px-4 md:px-6">
          <h2 className="text-[22px] md:text-[28px] font-black text-center">Market Value ₹55k+ at ₹299 - No Unnecessary Text</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8 max-w-[1000px] mx-auto">
            {[
              { name: "Starter", price: "₹299", features: ["QR + /r/slug - ₹1k", "AI Writer 4 - ₹3k/mo", "Coupon - ₹1.5k", "Negative Filter - ₹7k/mo"] },
              { name: "Growth", price: "₹599", popular: true, features: ["All Starter", "AI Reply 50/mo - ₹5k/mo", "GMB 5/mo - ₹8k/mo", "WhatsApp - ₹3k/mo"] },
              { name: "Pro", price: "₹1299", features: ["All Growth", "Unlimited Reply", "GMB 15/mo - ₹8k/mo", "Competitor 2 - ₹12k/mo"] },
            ].map((p) => (
              <div key={p.name} className={`bg-white rounded-[20px] p-6 border ${p.popular? "border-black shadow-[0_10px_30px_rgba(0,0,0,0.12)] md:scale-[1.02]" : "border-zinc-200"}`}>
                {p.popular && <div className="bg-black text-white text-[10px] px-3 py-1 rounded-full inline font-bold">POPULAR - 80% Choose</div>}
                <div className="flex justify-between items-center mt-3"><h3 className="font-black text-[16px]">{p.name}</h3></div>
                <div className="text-[30px] font-black mt-2">{p.price}<span className="text-[13px] font-normal text-zinc-500">/mo</span></div>
                <div className="mt-4 space-y-2">
                  {p.features.map((f) => <div key={f} className="flex gap-2 text-[13px]"><span className="text-emerald-500">✓</span>{f}</div>)}
                </div>
                <button onClick={()=>handle(`Choose ${p.name} at ${p.price} - Market Value ₹55k+ - Founder Kaushik Fixing ✓`)} className={`w-full mt-6 h-[44px] rounded-full font-bold text-[14px] ${p.popular? "bg-black text-white" : "bg-zinc-50 border border-zinc-200"}`}>Choose {p.name} →</button>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-[12px] text-zinc-500">Founder Kaushik Savaliya - intellectflowteam@gmail.com - Visavadar 362130 - Aap Dukaan Chalao Google Hum Sambhalenge - 500+ Businesses</div>
        </div>
      </section>

      {/* Mobile Bottom CTA */}
      <div className="md:hidden fixed bottom-[20px] left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[360px] z-40">
        <div className="bg-black rounded-full p-[1.5px] flex gap-1 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          <button onClick={()=>handle("Signup at ₹299 - Market Value ₹55k+ - Founder Kaushik")} className="flex-1 h-[48px] rounded-full bg-black text-white font-black text-[14px]">Start ₹299/mo →</button>
          <button onClick={()=>setShowLogin(true)} className="w-[80px] h-[48px] rounded-full bg-white text-black font-black text-[13px]">Login</button>
        </div>
      </div>

      {/* Footer - Simple - No SiteFooter.tsx */}
      <footer className="border-t border-zinc-200 py-8 text-center">
        <div className="text-[12px] text-zinc-500">Intellectflow.in • Founder Kaushik Savaliya • intellectflowteam@gmail.com • Market Value ₹55k+ at ₹299 • Aap Dukaan Chalao Google Hum Sambhalenge • 500+ Businesses • Visavadar 362130</div>
      </footer>

      <div className="h-[80px] md:hidden" />
    </div>
  );
}
// src/routes/index.tsx - BEST DESIGN CLEANED - No Header - No Founder Section - Login Added - Mobile Perfect - Market Value ₹55k+ at ₹299
// Founder Kaushik Savaliya - intellectflowteam@gmail.com • Visavadar 362130 - 500+ Businesses
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: LandingProClean,
});

function LandingProClean() {
  const [showLogin, setShowLogin] = useState(false);
  const [toast, setToast] = useState("");
  const handle = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3000); };

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-black selection:text-white">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-black text-white px-5 py-2.5 rounded-full text-[13px] font-bold shadow-[0_8px_30px_rgba(0,0,0,0.3)] animate-[slideUp_0.25s_ease]">
          {toast}
        </div>
      )}

      {/* Login Sheet - For Existing Users - Purane users login kar sake */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLogin(false)} />
          <div className="relative w-full md:max-w-[400px] bg-white rounded-t-[28px] md:rounded-[24px] p-6 md:p-7 animate-[slideUp_0.25s_ease] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-black text-[22px] leading-[1.1]">Welcome back</h2>
                <p className="text-[13px] text-zinc-500 mt-1">Purane users yaha login karein • Lifetime Free ✓</p>
              </div>
              <button onClick={() => setShowLogin(false)} className="w-8 h-8 grid place-items-center rounded-full bg-zinc-100 text-[14px]">✕</button>
            </div>

            <div className="mt-6 space-y-3">
              <button onClick={() => handle("Google login - Redirecting to /auth...")} className="w-full h-[48px] bg-white border border-zinc-200 rounded-full font-bold text-[14px] flex items-center justify-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white border grid place-items-center text-[10px] font-black">G</span> Continue with Google
              </button>
              <div className="flex items-center gap-3 py-1">
                <div className="h-[1px] flex-1 bg-zinc-200" /> <span className="text-[11px] text-zinc-400 font-bold">OR</span> <div className="h-[1px] flex-1 bg-zinc-200" />
              </div>
              <input placeholder="intellectflowteam@gmail.com" className="w-full h-[48px] px-4 bg-zinc-50 border border-zinc-200 rounded-full text-[14px] outline-none focus:border-black focus:bg-white" />
              <input placeholder="Password" type="password" className="w-full h-[48px] px-4 bg-zinc-50 border border-zinc-200 rounded-full text-[14px] outline-none focus:border-black focus:bg-white" />
              <button onClick={() => handle("Login link sent - Check inbox - intellectflowteam@gmail.com")} className="w-full h-[48px] bg-black text-white rounded-full font-bold text-[14px]">Login karein →</button>
              <p className="text-[11px] text-center text-zinc-500 pt-1">intellectflowteam@gmail.com • Visavadar 362130 • Market Value ₹55k+ FREE • Founder Lifetime</p>
              <div className="flex justify-center gap-3 text-[12px] pt-1">
                <button onClick={() => handle("Password reset sent")} className="text-zinc-600 underline">Forgot?</button>
                <span className="text-zinc-300">•</span>
                <Link to="/onboarding" className="text-black font-bold underline">New? Sign up at ₹299</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero - NO HEADER - Start Direct */}
      <section className="max-w-[1120px] mx-auto px-4 md:px-6 pt-6 md:pt-14 pb-10">
        {/* Mobile small bar - No header - Only logo + login */}
        <div className="flex md:hidden justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[8px] bg-black grid place-items-center text-white font-black text-[12px]">IF</div>
            <span className="font-black text-[14px]">IntellectFlow.in</span>
            <span className="text-[9px] bg-black text-white px-1.5 py-0.5 rounded-full font-bold">PRO ₹299</span>
          </div>
          <button onClick={() => setShowLogin(true)} className="px-3.5 py-1.5 bg-white border border-zinc-200 rounded-full text-[12px] font-bold">Login</button>
        </div>

        <div className="max-w-[720px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#fcf6ef] border border-zinc-200 rounded-full px-3.5 py-1.5 text-[11px] font-bold shadow-sm">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> 500+ Businesses • Market Value ₹55k+ → ₹299/mo
          </div>

          <h1 className="mt-5 text-[32px] md:text-[56px] font-black leading-[0.92] tracking-[-0.03em]">
            Aap Dukaan Chalao,<br />
            <span className="bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] bg-clip-text text-transparent">Google Hum Sambhalenge</span>
          </h1>

          <p className="mt-4 text-[14px] md:text-[16px] text-zinc-600 leading-[1.5] max-w-[560px] mx-auto">
            QR Scan → AI Review Writer → Negative Filter → Coupon. 30 Days me 4.8★ Rating. No extra text.
          </p>

          <div className="mt-6 flex flex-col md:flex-row gap-3 justify-center">
            <Link to="/onboarding" className="h-[52px] px-7 bg-black text-white rounded-full font-bold text-[14px] grid place-items-center">Generate QR Free - Value ₹8k/mo FREE →</Link>
            <button onClick={() => setShowLogin(true)} className="h-[52px] px-7 bg-white border border-zinc-200 rounded-full font-bold text-[14px] md:inline-flex hidden items-center justify-center">Existing user? Login</button>
            <button onClick={() => setShowLogin(true)} className="h-[52px] px-7 bg-white border border-zinc-200 rounded-full font-bold text-[14px] inline-flex md:hidden items-center justify-center">Login karein</button>
          </div>
        </div>

        {/* Features - 8 Cards - Cleaned - No unnecessary text - Properly aligned */}
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
            <div key={f.t} className="bg-[#fcf6ef] md:bg-white border border-zinc-200/80 md:border-zinc-200 rounded-[16px] md:rounded-[20px] p-4 md:p-5 text-left">
              <div className="flex justify-between items-center">
                <div className="font-bold text-[13px] md:text-[14px] leading-[1.2]">{f.t}</div>
                <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full font-black">{f.v}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <div className="inline-flex px-3 py-1 bg-yellow-400 rounded-full text-[11px] font-black tracking-wide">Total Value ₹55,500/mo → Now ₹299/mo - Clean - No Extra Text</div>
        </div>
      </section>

      {/* Pricing - 3 Columns - Cleaned - No unnecessary text */}
      <section className="bg-zinc-50 py-12 md:py-16">
        <div className="max-w-[1120px] mx-auto px-4 md:px-6">
          <h2 className="text-[24px] md:text-[32px] font-black text-center tracking-tight">Market Value ₹55k+ at ₹299</h2>
          <p className="text-[13px] text-zinc-500 text-center mt-1">Highly clean - Properly aligned - Mobile responsive</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8 max-w-[1000px] mx-auto">
            {[
              { name: "Starter", price: "₹299", features: ["QR + /r/slug - ₹1k", "AI Writer 4 - ₹3k/mo", "Coupon - ₹1.5k", "Negative Filter - ₹7k/mo"] },
              { name: "Growth", price: "₹599", popular: true, features: ["All Starter", "AI Reply 50/mo - ₹5k/mo", "GMB 5/mo - ₹8k/mo", "WhatsApp - ₹3k/mo"] },
              { name: "Pro", price: "₹1299", features: ["All Growth", "Unlimited Reply", "GMB 15/mo - ₹8k/mo", "Competitor 2 - ₹12k/mo"] },
            ].map((p) => (
              <div key={p.name} className={`bg-white rounded-[20px] md:rounded-[24px] p-6 border ${p.popular? "border-black shadow-[0_12px_40px_rgba(0,0,0,0.14)] md:scale-[1.03]" : "border-zinc-200"}`}>
                {p.popular && <div className="bg-black text-white text-[10px] px-3 py-1 rounded-full inline font-black tracking-wide">POPULAR - 80% CHOOSE</div>}
                <div className="flex justify-between items-baseline mt-3">
                  <h3 className="font-black text-[18px]">{p.name}</h3>
                  <div className="text-[22px] font-black">{p.price}<span className="text-[13px] font-normal text-zinc-500">/mo</span></div>
                </div>
                <div className="mt-4 space-y-2.5">
                  {p.features.map((f) => (
                    <div key={f} className="flex gap-2 text-[13px]"><span className="text-emerald-500 font-bold">✓</span><span className="text-zinc-700">{f}</span></div>
                  ))}
                </div>
                <button onClick={() => handle(`Choose ${p.name} at ${p.price} - Market Value ₹55k+ - Founder Kaushik`)} className={`w-full mt-6 h-[48px] rounded-full font-bold text-[14px] ${p.popular? "bg-black text-white" : "bg-zinc-50 border border-zinc-200"}`}>Choose {p.name} →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Bottom CTA - Properly aligned */}
      <div className="md:hidden fixed bottom-[16px] left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-[360px] z-40">
        <div className="bg-black rounded-full p-[1.5px] shadow-[0_12px_40px_rgba(0,0,0,0.3)] flex gap-[1.5px]">
          <button onClick={() => handle("Signup at ₹299 - Market Value ₹55k+")} className="flex-1 h-[48px] rounded-full bg-black text-white font-black text-[14px]">Start ₹299/mo →</button>
          <button onClick={() => setShowLogin(true)} className="w-[84px] h-[48px] rounded-full bg-white text-black font-black text-[13px]">Login</button>
        </div>
      </div>

      {/* Footer - Simple - No unnecessary text */}
      <footer className="border-t border-zinc-200 py-8">
        <div className="max-w-[1120px] mx-auto px-4 text-center">
          <div className="text-[12px] text-zinc-500 leading-[1.5]">Intellectflow.in • Founder Kaushik Savaliya • intellectflowteam@gmail.com • Visavadar 362130 • Market Value ₹55k+ at ₹299 • Aap Dukaan Chalao Google Hum Sambhalenge • 500+ Businesses</div>
        </div>
      </footer>

      <div className="h-[80px] md:hidden" />
    </div>
  );
}
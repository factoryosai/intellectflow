// src/routes/index.tsx - BEST DESIGN - Cleaned - No Header - No Kaushik Section - Login Added - Mobile Responsive
// Founder Kaushik Savaliya - intellectflowteam@gmail.com - Visavadar 362130 - Market Value ₹55k+ at ₹299
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({ component: LandingClean });

function LandingClean() {
  const [showLogin, setShowLogin] = useState(false);
  const [toast, setToast] = useState("");
  const handle = (m: string) => { setToast(m); setTimeout(()=>setToast(""), 3000); };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-black text-white px-5 py-2.5 rounded-full text-[13px] font-bold shadow-xl">{toast}</div>}

      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-black/60" onClick={()=>setShowLogin(false)} />
          <div className="relative w-full md:max-w-[380px] bg-white rounded-t-[24px] md:rounded-[20px] p-6">
            <div className="flex justify-between items-center">
              <div><h2 className="font-black text-[18px]">Welcome back</h2><p className="text-[12px] text-zinc-500">Purane users login karein</p></div>
              <button onClick={()=>setShowLogin(false)} className="w-8 h-8 bg-zinc-100 rounded-full grid place-items-center">✕</button>
            </div>
            <button onClick={()=>handle("Google login - Redirecting...")} className="mt-5 w-full h-[44px] border border-zinc-200 rounded-full font-bold text-[14px]">Continue with Google</button>
            <div className="flex items-center gap-3 my-3"><div className="h-[1px] flex-1 bg-zinc-200"/><span className="text-[10px] text-zinc-400">OR</span><div className="h-[1px] flex-1 bg-zinc-200"/></div>
            <input placeholder="intellectflowteam@gmail.com" className="w-full h-[44px] px-4 bg-zinc-50 border border-zinc-200 rounded-full text-[14px] outline-none focus:border-black" />
            <input placeholder="Password" type="password" className="mt-3 w-full h-[44px] px-4 bg-zinc-50 border border-zinc-200 rounded-full text-[14px] outline-none focus:border-black" />
            <button onClick={()=>handle("Login link sent - Check inbox")} className="mt-4 w-full h-[44px] bg-black text-white rounded-full font-bold text-[14px]">Login karein →</button>
            <p className="text-[11px] text-center text-zinc-500 mt-3">intellectflowteam@gmail.com • Visavadar 362130 • Lifetime Free ✓</p>
          </div>
        </div>
      )}

      <section className="max-w-[1120px] mx-auto px-4 md:px-6 pt-8 md:pt-16 pb-10">
        <div className="max-w-[720px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#fcf6ef] border border-zinc-200 rounded-full px-3 py-1 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"/>500+ Businesses • ₹55k+ → ₹299
          </div>
          <h1 className="mt-5 text-[32px] md:text-[52px] font-black leading-[0.92] tracking-[-0.03em]">
            Aap Dukaan Chalao,<br/>
            <span className="bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] bg-clip-text text-transparent">Google Hum Sambhalenge</span>
          </h1>
          <p className="mt-4 text-[14px] md:text-[15px] text-zinc-600 max-w-[520px] mx-auto leading-[1.5]">QR → Review → Coupon. 30 Days me 4.8★ Rating. Clean, no extra text.</p>
          <div className="mt-6 flex flex-col md:flex-row gap-3 justify-center">
            <Link to="/onboarding" className="h-[48px] px-7 bg-black text-white rounded-full font-bold text-[14px] grid place-items-center">Generate QR Free →</Link>
            <button onClick={()=>setShowLogin(true)} className="h-[48px] px-7 bg-white border border-zinc-200 rounded-full font-bold text-[14px]">Existing users? Login</button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-12 max-w-[1000px] mx-auto">
          {[
            {t:"QR + /r/slug", v:"₹1k"},
            {t:"AI Writer", v:"₹3k/mo"},
            {t:"Negative Filter", v:"₹7k/mo"},
            {t:"Coupon 10% OFF", v:"₹1.5k"},
            {t:"Reviews Counter", v:"₹5k/mo"},
            {t:"AI Reply", v:"₹5k/mo"},
            {t:"GMB Posts", v:"₹8k/mo"},
            {t:"Competitor Track", v:"₹12k/mo"},
          ].map(f => (
            <div key={f.t} className="bg-[#fcf6ef] md:bg-white border border-zinc-200 rounded-[14px] md:rounded-[16px] p-4">
              <div className="flex justify-between items-center"><div className="font-bold text-[13px]">{f.t}</div><span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full font-bold">{f.v}</span></div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center"><span className="inline-flex px-3 py-1 bg-yellow-400 rounded-full text-[11px] font-black">Total ₹55,500/mo → Now ₹299/mo</span></div>
      </section>

      <section className="bg-zinc-50 py-12">
        <div className="max-w-[1000px] mx-auto px-4 md:px-6">
          <h2 className="text-[22px] md:text-[28px] font-black text-center">Pricing - Clean - No Extra Text</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {[
              {name:"Starter", price:"₹299", features:["QR + /r/slug","AI Writer 4","Coupon","Negative Filter"]},
              {name:"Growth", price:"₹599", pop:true, features:["All Starter","AI Reply 50/mo","GMB 5/mo","WhatsApp"]},
              {name:"Pro", price:"₹1299", features:["All Growth","Unlimited Reply","GMB 15/mo","Competitor 2"]},
            ].map(p => (
              <div key={p.name} className={`bg-white rounded-[20px] p-6 border ${p.pop?"border-black shadow-xl md:scale-[1.02]":"border-zinc-200"}`}>
                {p.pop && <div className="bg-black text-white text-[10px] px-2.5 py-1 rounded-full inline font-bold">POPULAR</div>}
                <div className="flex justify-between items-baseline mt-3"><h3 className="font-black">{p.name}</h3><div className="text-[22px] font-black">{p.price}<span className="text-[12px] font-normal text-zinc-500">/mo</span></div></div>
                <div className="mt-4 space-y-2">{p.features.map(f => <div key={f} className="flex gap-2 text-[13px]"><span className="text-emerald-500">✓</span>{f}</div>)}</div>
                <button onClick={()=>handle(`Choose ${p.name} - ${p.price}`)} className={`w-full mt-5 h-[44px] rounded-full font-bold text-[14px] ${p.pop?"bg-black text-white":"bg-zinc-50 border"}`}>Choose {p.name} →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-[360px] z-40">
        <div className="bg-black rounded-full p-[1.5px] flex gap-[1.5px] shadow-xl">
          <button onClick={()=>handle("Signup ₹299")} className="flex-1 h-[44px] rounded-full bg-black text-white font-bold text-[14px]">Start ₹299/mo →</button>
          <button onClick={()=>setShowLogin(true)} className="w-[80px] h-[44px] rounded-full bg-white font-bold text-[13px]">Login</button>
        </div>
      </div>

      <footer className="border-t py-8 text-center text-[11px] text-zinc-500">
        Intellectflow.in • Founder Kaushik Savaliya • intellectflowteam@gmail.com • Visavadar 362130 • Market Value ₹55k+ at ₹299 • 500+ Businesses
      </footer>
      <div className="h-[80px] md:hidden" />
    </div>
  );
}
// src/routes/index.tsx - LIVE PROFESSIONAL - Reference Design Exact - Intellect Flow Logo + Big Tagline + Free Demo
// Founder Kaushik Savaliya - intellectflowteam@gmail.com - Visavadar 362130 - Market Value ₹55k+ at ₹299 - 500+ Businesses
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({ component: LandingLive });

function LandingLive() {
  const [showLogin, setShowLogin] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [toast, setToast] = useState("");
  const handle = (m: string) => { setToast(m); setTimeout(()=>setToast(""), 3000); };

  return (
    <div className="min-h-screen bg-[#fdf6ef] text-zinc-900 selection:bg-black selection:text-white">
      {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-zinc-900 text-white px-5 py-3 rounded-full text- font-bold shadow-2xl">{toast}</div>}

      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm" onClick={()=>setShowLogin(false)} />
          <div className="relative w-full md:max-w-[420px] bg-white rounded-t- md:rounded- p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center"><div><h2 className="font-black text-">Welcome back</h2><p className="text- text-zinc-500 mt-1">Purane users yaha login karein • Lifetime Free ✓</p></div><button onClick={()=>setShowLogin(false)} className="w-8 h-8 grid place-items-center rounded-full bg-zinc-100">✕</button></div>
            <button onClick={()=>handle("Google login - Redirecting to /auth...")} className="mt-6 w-full h-11 bg-white border border-zinc-200 rounded- font-bold text-">Continue with Google</button>
            <input placeholder="intellectflowteam@gmail.com" className="mt-3 w-full h-11 px-4 bg-[#fcfaf8] border border-zinc-200 rounded- text- outline-none focus:border-black" />
            <input placeholder="Password" type="password" className="mt-3 w-full h-11 px-4 bg-[#fcfaf8] border border-zinc-200 rounded- text- outline-none focus:border-black" />
            <button onClick={()=>handle("Login link sent - Check inbox")} className="mt-4 w-full h-11 bg-black text-white rounded- font-bold text-">Login karein →</button>
            <p className="text- text-center text-zinc-500 mt-3">intellectflowteam@gmail.com • Visavadar 362130 • Founder Kaushik Savaliya</p>
          </div>
        </div>
      )}

      {showDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm" onClick={()=>setShowDemo(false)} />
          <div className="relative w-full max-w-[720px] bg-white rounded- p-0 overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b"><h3 className="font-black text-">Free Demo - Kaise kaam karta hai</h3><button onClick={()=>setShowDemo(false)} className="w-8 h-8 bg-zinc-100 rounded-full grid place-items-center">✕</button></div>
            <div className="aspect-video bg-zinc-900 grid place-items-center text-white"><div className="text-center"><div className="w-16 h-16 bg-white/20 rounded-full grid place-items-center mx-auto text-2xl">▶</div><p className="mt-3 font-bold">Demo Video - 2 min</p><p className="text- opacity-70">QR Scan → Review → Coupon → Google 4.8★</p></div></div>
            <div className="p-6 grid grid-cols-3 gap-3 text-"><div className="bg-[#fdf6ef] p-3 rounded-"><div className="font-bold">1. QR Scan</div><div className="text- text-zinc-500">Customer scans at shop</div></div><div className="bg-[#fdf6ef] p-3 rounded-"><div className="font-bold">2. Review</div><div className="text- text-zinc-500">AI writer helps</div></div><div className="bg-[#fdf6ef] p-3 rounded-"><div className="font-bold">3. Google ★</div><div className="text- text-zinc-500">4.8★ in 30 days</div></div></div>
          </div>
        </div>
      )}

      <section className="max-w-[1120px] mx-auto px-4 pt-6 md:pt-10 pb-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-black rounded-[9px] grid place-items-center text-white font-black text-">IF</div>
            <span className="font-black text- tracking-tight">IntellectFlow</span>
            <span className="hidden md:inline-flex ml-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text- font-bold text-emerald-700">LIVE • 500+ using</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=>setShowDemo(true)} className="hidden md:inline-flex h-9 px-4 bg-white border border-zinc-200 rounded-full text- font-bold">Free Demo</button>
            <button onClick={()=>setShowLogin(true)} className="h-9 px-4 bg-white border border-zinc-200 rounded-full text- font-bold shadow-sm">Login</button>
          </div>
        </div>

        <div className="max-w-[720px] mx-auto text-center mt-10 md:mt-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-zinc-200 text- font-[500] shadow-sm">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            500+ Businesses • ₹55k+ → ₹299
          </div>

          <h1 className="mt-6 text- md:text- font-black leading-[0.9] tracking-[-0.04em]">
            Aap Dukaan Chalao,<br/>
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 bg-clip-text text-transparent">Google Hum</span><br/>
            <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">Sambhalenge</span>
          </h1>

          <p className="mt-5 text- md:text- text-zinc-600 leading-[1.5] max-w-[560px] mx-auto">
            QR se Google Review tak full automation. <b className="text-zinc-900">₹55,500/mo market value</b> ke tools sirf <b className="text-zinc-900">₹299/mo</b> me. Lifetime Free for founder businesses.
          </p>

          <div className="mt-7 flex flex-col gap-3 max-w-[360px] mx-auto md:max-w-none md:flex-row md:justify-center">
            <button onClick={()=>handle("Redirecting to signup at ₹299 - Founder Kaushik")} className="h- px-7 bg-zinc-900 text-white rounded- font-bold text- shadow-xl w-full md:w-auto">Start at ₹299/mo →</button>
            <div className="flex gap-3 w-full md:w-auto">
              <button onClick={()=>setShowLogin(true)} className="flex-1 md:flex-none h- px-5 bg-white border border-zinc-200 rounded- font-bold text- shadow-sm">Login karein</button>
              <button onClick={()=>setShowDemo(true)} className="flex-1 md:flex-none h- px-5 bg-white border border-zinc-200 rounded- font-bold text- shadow-sm">Dekho kaise kaam karta hai</button>
            </div>
          </div>

          <div className="mt-10 max-w-[640px] mx-auto bg-white rounded- border border-zinc-200 p-4 md:p-5 flex gap-4 items-center text-left shadow-sm">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-zinc-900 rounded- grid place-items-center text-white font-black text- shrink-0">QR</div>
            <div className="flex-1">
              <div className="font-black text- md:text- leading-[1.2]">Customer scans → Review → Coupon</div>
              <div className="text- md:text- text-zinc-500 mt-1 leading-[1.4]">Negative reviews go to WhatsApp (₹7k/mo value), Positive → Google. Auto GMB posts ₹8k/mo value.</div>
              <div className="mt-2.5 inline-flex px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text- font-bold text-emerald-700">Live - 500+ businesses using</div>
            </div>
          </div>
        </div>

        <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-[1000px] mx-auto">
          {[
            {t:"QR + /r/slug", v:"₹1k", d:"Custom slug + QR"},
            {t:"AI Writer", v:"₹3k/mo", d:"Gujarati + Hinglish"},
            {t:"Negative Filter", v:"₹7k/mo", d:"1-3★ Private"},
            {t:"Coupon Engine", v:"₹1.5k", d:"Auto 10% OFF"},
            {t:"Reviews Inbox", v:"₹5k/mo", d:"All reviews one place"},
            {t:"AI Reply", v:"₹5k/mo", d:"Instant replies"},
            {t:"GMB Manager", v:"₹8k/mo", d:"Posts + Q&A"},
            {t:"Standee FREE", v:"₹1.5k FREE", d:"Each plan 1 FREE"},
          ].map(f => (
            <div key={f.t} className="bg-white rounded- border border-zinc-200 p-4">
              <div className="flex justify-between items-start"><span className="font-bold text-">{f.t}</span><span className="text- bg-black text-white px-2 py-0.5 rounded-full font-bold">{f.v}</span></div>
              <div className="text- text-zinc-500 mt-1">{f.d}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-4 max-w-[1080px] mx-auto">
          {[
            {name:"Starter", price:"₹299", market:"Market ₹8k/mo", features:["QR + /r/slug ₹1k","AI Writer 4 ₹3k/mo","Negative Filter ₹7k/mo","Coupon ₹1.5k","Reviews ₹5k/mo","1 Poster FREE","1 Standee FREE ₹1.5k"], cta:"Start Free - Value ₹8k/mo"},
            {name:"Growth", price:"₹599", market:"Market ₹25k/mo - 80% Popular", pop:true, features:["All Starter + Standee","AI Reply 50/mo ₹5k/mo","GMB 5/mo ₹8k/mo","WhatsApp ₹3k/mo","Stickers 20+ ₹2k/mo","5 Pages ₹5k/mo","1 Standee FREE ₹3k"], cta:"Choose Growth - ₹25k Value"},
            {name:"Business Pro", price:"₹1299", market:"Market ₹55k+/mo - Best Value", features:["All Growth + Standee","Unlimited Reply ₹5k/mo","GMB 15/mo ₹8k/mo","Sentiment ₹5k/mo","Competitor 2 ₹12k/mo","Website FREE ₹10k/mo","Premium Standee + Table Stand ₹4.5k FREE"], cta:"Go Business Pro - ₹55k+ Value"},
          ].map(p => (
            <div key={p.name} className={`rounded- p-6 border-2 ${p.pop?"bg-black text-white border-black shadow-2xl md:scale-[1.02]":"bg-white border-zinc-200"}`}>
              <div className="flex justify-between"><span className="font-black text-">{p.name}</span><span className={`text- px-2 py-1 rounded-full font-bold ${p.pop?"bg-white text-black":"bg-yellow-400 text-black"}`}>{p.market}</span></div>
              <div className="text- font-black mt-3">{p.price}<span className={`text- font-normal ${p.pop?"text-zinc-400":"text-zinc-500"}`}>/mo</span></div>
              <div className="mt-4 space-y-2">{p.features.map(f => <div key={f} className="flex gap-2 text-"><span className={p.pop?"text-white":"text-emerald-500"}>✓</span><span className={p.pop?"text-zinc-300":"text-zinc-700"}>{f}</span></div>)}</div>
              <button onClick={()=>handle(`${p.name} at ${p.price} - ${p.market} - 1 Standee FREE`)} className={`w-full mt-6 h-12 rounded- font-bold text- ${p.pop?"bg-white text-black":"bg-black text-white"}`}>{p.cta} →</button>
            </div>
          ))}
        </div>
      </section>

      <div className="md:hidden fixed bottom- left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[360px] z-40">
        <div className="bg-black rounded-full p-[1.5px] flex gap-[1.5px] shadow-2xl"><button onClick={()=>handle("Signup ₹299 - Market Value ₹55k+")} className="flex-1 h-12 rounded-full bg-black text-white font-bold text-">Start ₹299</button><button onClick={()=>setShowLogin(true)} className="w- h-12 rounded-full bg-white text-black font-bold text-">Login</button></div>
      </div>

      <footer className="border-t border-zinc-200 py-8 text-center"><div className="max-w-[1120px] mx-auto px-4"><div className="flex justify-center items-center gap-2"><div className="w-7 h-7 bg-black rounded- grid place-items-center text-white font-black text-">IF</div><span className="font-black">IntellectFlow</span><span className="text- text-zinc-500">• Founder Kaushik Savaliya • intellectflowteam@gmail.com • Visavadar 362130 • Market Value ₹55k+ at ₹299 • 500+ Businesses</span></div></div></footer>
      <div className="h- md:hidden" />
    </div>
  );
}
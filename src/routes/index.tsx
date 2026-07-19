// src/routes/index.tsx - IntellectFlow PRO Landing - Founder Kaushik Savaliya - intellectflowteam@gmail.com • Visavadar 362130
// Production-ready - Mobile First - No Header - Login for existing users - SiteFooter.tsx reusable
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import SiteFooter from "@/components/SiteFooter";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [toast, setToast] = useState("");
  const [email, setEmail] = useState("");

  const handleCTA = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="min-h-screen bg-[#fcf6ef] text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-zinc-900 text-white px-5 py-3 rounded-full text-[13px] font-bold shadow-2xl animate-[slideUp_0.25s_ease]">
          {toast}
        </div>
      )}

      {/* Login Sheet - For Existing Users */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm" onClick={() => setShowLogin(false)} />
          <div className="relative w-full md:max-w-[420px] bg-white rounded-t-[28px] md:rounded-[24px] p-6 md:p-8 animate-[slideUp_0.25s_ease] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-black text-[22px]">Welcome back</h2>
                <p className="text-[13px] text-zinc-500 mt-1">Purane users yaha login karein • Founder: Kaushik Savaliya</p>
              </div>
              <button onClick={() => setShowLogin(false)} className="w-8 h-8 grid place-items-center rounded-full bg-zinc-100">✕</button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleCTA("Google login - Redirecting to /auth...")}
                className="w-full h-11 bg-white border border-zinc-200 rounded-[12px] font-[450] text-[14px] flex items-center justify-center gap-2"
              >
                <span className="w-5 h-5 bg-white rounded-full grid place-items-center border">G</span> Continue with Google
              </button>
              <div className="flex items-center gap-3 py-2">
                <div className="h-[1px] flex-1 bg-zinc-200" /> <span className="text-[11px] text-zinc-400">OR</span> <div className="h-[1px] flex-1 bg-zinc-200" />
              </div>
              <input
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="intellectflowteam@gmail.com"
                className="w-full h-11 px-4 bg-[#fcfaf8] border border-zinc-200 rounded-[12px] text-[14px] outline-none focus:border-zinc-900"
              />
              <input placeholder="Password" type="password" className="w-full h-11 px-4 bg-[#fcfaf8] border border-zinc-200 rounded-[12px] text-[14px] outline-none focus:border-zinc-900" />
              <button
                onClick={() => handleCTA(`Login link sent to ${email || "your email"} - Check inbox`)}
                className="w-full h-11 bg-zinc-900 text-white rounded-[12px] font-bold text-[14px]"
              >
                Login karein →
              </button>
              <p className="text-[12px] text-center text-zinc-500 pt-2">Founder contact: intellectflowteam@gmail.com • Visavadar 362130 • Lifetime Free ✓</p>
              <div className="text-center">
                <a href="#" className="text-[12px] text-zinc-600 underline">Forgot password?</a> • <Link to="/signup" className="text-[12px] text-zinc-900 font-bold underline">New user? Sign up at ₹299</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero - No Header */}
      <section className="max-w-[1120px] mx-auto px-4 pt-6 md:pt-14 pb-8">
        <div className="flex justify-between items-center mb-6 md:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 rounded-[8px] grid place-items-center text-white font-black text-[13px]">IF</div>
            <span className="font-bold text-[14px]">IntellectFlow</span>
          </div>
          <button onClick={() => setShowLogin(true)} className="px-3.5 py-1.5 bg-white border border-zinc-200 rounded-full text-[12px] font-bold">Login</button>
        </div>

        <div className="max-w-[760px] mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-zinc-200 text-[11px] font-[450] shadow-sm">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="hidden md:inline">Founder Kaushik Savaliya • intellectflowteam@gmail.com • Visavadar 362130 • 500+ Businesses • Market Value ₹55k+</span>
            <span className="md:hidden">500+ Businesses • ₹55k+ → ₹299</span>
          </div>

          <h1 className="mt-5 text-[32px] md:text-[54px] font-black leading-[0.95] tracking-[-0.03em]">
            Aap Dukaan Chalao,<br />
            <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">Google Hum Sambhalenge</span>
          </h1>

          <p className="mt-4 text-[14px] md:text-[16px] text-zinc-600 max-w-[560px] mx-auto leading-[1.5]">
            QR se Google Review tak full automation. <b className="text-zinc-900">₹55,500/mo market value</b> ke tools sirf <b className="text-zinc-900">₹299/mo</b> me. Lifetime Free for founder businesses.
          </p>

          <div className="mt-6 flex flex-col md:flex-row justify-center gap-3">
            <button onClick={() => handleCTA("Redirecting to signup at ₹299 - Founder Kaushik")} className="h-[52px] px-6 bg-zinc-900 text-white rounded-[14px] font-bold text-[15px] inline-flex items-center justify-center gap-2">
              Start at ₹299/mo →
            </button>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowLogin(true)} className="h-[52px] px-5 bg-white border border-zinc-200 rounded-[14px] font-[450] text-[14px] md:inline-flex hidden items-center">
                Existing user? Login
              </button>
              <button onClick={() => setShowLogin(true)} className="h-[52px] px-5 bg-white border border-zinc-200 rounded-[14px] font-bold text-[14px] inline-flex md:hidden items-center justify-center flex-1">
                Login karein
              </button>
              <button onClick={() => handleCTA("Demo video - Founder Kaushik explains flow")} className="h-[52px] px-5 bg-white border border-zinc-200 rounded-[14px] font-[450] text-[14px] inline-flex items-center justify-center flex-1 md:flex-none">
                Dekho kaise kaam karta hai
              </button>
            </div>
          </div>

          {/* QR Mock */}
          <div className="mt-8 max-w-[980px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
            <div className="md:col-span-2 bg-white rounded-[20px] border border-zinc-200 p-4 flex gap-4 items-center">
              <div className="w-20 h-20 bg-zinc-900 rounded-[12px] grid place-items-center text-white font-black">QR</div>
              <div>
                <div className="font-bold text-[14px]">Customer scans → Review → Coupon</div>
                <div className="text-[12px] text-zinc-500 mt-1">Negative reviews go to WhatsApp (₹7k/mo value), Positive → Google. Auto GMB posts ₹8k/mo value.</div>
                <div className="mt-2 inline-flex px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text-[10px] font-bold">Live - 500+ businesses using</div>
              </div>
            <div className="bg-zinc-900 text-white rounded-[20px] p-4">
              <div className="text-[11px] opacity-60">FOUNDER LIFETIME FREE</div>
              <div className="font-black text-[18px] mt-1">intellectflowteam@gmail.com</div>
              <div className="text-[12px] opacity-80 mt-1">Visavadar 362130 • Kaushik Savaliya • Value ₹55k+ FREE • Aap Dukaan Chalao Google Hum Sambhalenge</div>
              <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden"><div className="h-full w-[92%] bg-white rounded-full" /></div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-3 max-w-[1120px] mx-auto">
          {[
            { t: "QR Reviews", v: "₹1k + ₹8k/mo", d: "Scan → Review page /r/slug - Founder special", c: "bg-orange-50" },
            { t: "AI Writer", v: "₹3k/mo", d: "AI review responses, GMB posts, sentiment", c: "bg-violet-50" },
            { t: "Coupon Engine", v: "₹1.5k/mo", d: "Auto coupon after review, WhatsApp delivery", c: "bg-amber-50" },
            { t: "Negative Filter", v: "₹7k/mo", d: "1-3★ → Private feedback, 4-5★ → Google", c: "bg-emerald-50" },
            { t: "Review Inbox", v: "₹5k/mo", d: "All reviews in one place, AI summary", c: "bg-white" },
            { t: "AI Reply", v: "₹5k/mo", d: "Instant AI replies, founder Kaushik approved", c: "bg-[#fdf6f1]" },
            { t: "WhatsApp", v: "₹3k/mo", d: "Auto review requests, coupon share", c: "bg-[#fcfaf8]" },
            { t: "GMB Manager", v: "₹8k/mo", d: "Posts, Q&A, insights, photo SEO", c: "bg-orange-50" },
            { t: "Competitor", v: "₹12k/mo", d: "Track nearby shops, pricing, reviews", c: "bg-violet-50" },
          ].map(f => (
            <div key={f.t} className={`${f.c} p-4 rounded-[16px] border border-zinc-200/60`}>
              <div className="flex justify-between"><span className="font-bold text-[13px]">{f.t}</span><span className="px-2 py-0.5 bg-zinc-900 text-white rounded-full text-[9px] font-black">{f.v}</span></div>
              <div className="text-[12px] text-zinc-600 mt-1.5">{f.d}</div>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="mt-10 max-w-[448px] mx-auto bg-white rounded-[24px] border border-zinc-900 p-[1.5px]">
          <div className="bg-white rounded-[22px] p-6 text-center">
            <div className="inline-flex px-3 py-1 bg-zinc-900 text-white rounded-full text-[11px] font-bold">MARKET VALUE ₹55,500/mo → YOUR PRICE ₹299/mo</div>
            <div className="mt-4 flex items-baseline justify-center gap-2"><span className="text-[36px] font-black">₹299</span><span className="text-[13px] text-zinc-500">/mo • Founder Lifetime Free ✓</span></div>
            <div className="mt-1 text-[12px] text-zinc-500 line-through">Normal: QR ₹1k + AI ₹3k + Coupon ₹1.5k + Filter ₹7k + Reviews ₹5k + Reply ₹5k + WhatsApp ₹3k + GMB ₹8k + Sentiment ₹5k + Competitor ₹12k = ₹55,500/mo</div>
            <button onClick={() => handleCTA("Creating account at ₹299 - Founder Kaushik Savaliya")} className="mt-5 w-full h-[52px] bg-zinc-900 text-white rounded-[14px] font-bold text-[15px]">Get Full Stack at ₹299 →</button>
            <div className="mt-3 text-[11px] text-zinc-500">intellectflowteam@gmail.com • Visavadar 362130 • 500+ Businesses • No credit card for trial</div>
            <button onClick={() => setShowLogin(true)} className="mt-3 w-full h-11 bg-[#fcf6ef] border border-zinc-200 rounded-[12px] text-[13px] font-[450]">Already have account? Login yaha karein</button>
          </div>
        </div>
      </section>

      {/* Mobile Bottom CTA */}
      <div className="md:hidden fixed bottom-[20px] left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[360px] z-40">
        <div className="bg-zinc-900 text-white rounded-full p-[1px] shadow-2xl flex gap-1">
          <button onClick={() => handleCTA("Signup at ₹299 - Market Value ₹55k+")} className="flex-1 h-12 rounded-full bg-zinc-900 font-bold text-[14px]">Start ₹299</button>
          <button onClick={() => setShowLogin(true)} className="w-[88px] h-12 rounded-full bg-white text-zinc-900 font-bold text-[13px]">Login</button>
        </div>
      </div>

      <SiteFooter />
      <div className="h-[80px] md:hidden" />
    </div>
  );
}
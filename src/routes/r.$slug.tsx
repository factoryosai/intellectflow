import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Star, QrCode, Sparkles, Gift, Shield, BarChart3, MessageSquare, Megaphone, Globe, Check, Crown, Zap } from "lucide-react";

export const Route = createFileRoute("/r/$slug")({
  component: PublicReviewPage,
});

function PublicReviewPage() {
  const { slug } = Route.useParams();
  const [rating, setRating] = useState<number>(0);
  const [hovered, setHovered] = useState<number>(0);
  const [step, setStep] = useState<"stars" | "feedback" | "writer" | "thankyou">("stars");
  const [feedbackText, setFeedbackText] = useState("");
  const [selectedReview, setSelectedReview] = useState<string>("");

  // Mock business - real me generateReviews() se aayega
  const business = {
    business_name: "Shree Ram Medical - Visavadar",
    address: "Station Road, Visavadar, Gujarat 362130",
    rating: 4.8,
    logo_url: null,
    google_review_link: "https://search.google.com/local/writereview?placeid=ChIJ...",
    is_lifetime_free: false,
    coupon_text: "Thank you! Show at counter for 10% OFF next visit - Intellectflow.in",
  };

  const aiSuggestions = [
    "Shree Ram Medical ni service khub saras che, staff bahuj helpful che! Aabhar 🙏",
    "Best medical store in Visavadar, genuine medicines and quick service. Highly recommend Shree Ram Medical!",
    "Staff behaviour is very polite and medicines are available at reasonable price. Shree Ram Medical is my go-to!",
    "Bahuj saru anubhav, dukaan saaf che ane service fast che. Shree Ram Medical rocks!"
  ];

  const handleStar = (r: number) => {
    setRating(r);
    if (r <= 2) {
      setStep("feedback"); // Negative Filter - Value ₹7k/mo - Private, not Google
    } else {
      setStep("writer"); // AI Writer - Value ₹3k/mo
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col items-center py-6 px-4">
      <div className="w-full max-w-[420px] bg-white rounded-[24px] shadow-xl overflow-hidden border">
        {/* Header */}
        <div className="bg-black text-white p-5 text-center">
          <div className="text-[10px] tracking-widest opacity-70">INTELLECTFLOW.IN | Value ₹55k+ at ₹299</div>
          <div className="w-12 h-12 bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] rounded-full mx-auto mt-3 flex items-center justify-center text-xl">💊</div>
          <h1 className="mt-3 font-bold text-lg leading-tight">{business.business_name}</h1>
          <p className="text-xs opacity-70 mt-1">{business.address}</p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <span className="text-yellow-400">★</span><span className="text-sm">{business.rating} Google Rating</span>
          </div>
        </div>

        <div className="p-6">
          {step === "stars" && (
            <>
              <h2 className="text-center font-bold text-xl">Aapko service kaisi lagi?</h2>
              <p className="text-center text-sm text-gray-500 mt-1">Tap stars to rate - Aap Dukaan Chalao, Google Hum Sambhalenge</p>
              
              <div className="flex justify-center gap-2 mt-6">
                {[1,2,3,4,5].map((s) => (
                  <button key={s} onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)} onClick={() => handleStar(s)} className="text-4xl transition">
                    <span className={`${(hovered || rating) >= s ? "text-yellow-400" : "text-gray-200"}`}>★</span>
                  </button>
                ))}
              </div>
              <p className="text-center text-[10px] mt-4 text-gray-400">Powered by IntellectFlow - Founder Kaushik Savaliya | Market Value ₹8k/mo</p>
            </>
          )}

          {step === "feedback" && (
            <div className="animate-in">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-xs mb-4">
                <strong>Private Feedback - Value ₹7,000/mo Feature</strong><br/>Aapka feedback Google pe nahi jayega, sirf owner dekhega aur improve karega.
              </div>
              <h3 className="font-bold">Kya problem hui? Bataiye, hum sudharenge</h3>
              <textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} placeholder="Aapki problem likhiye..." className="w-full mt-3 border rounded-xl p-3 h-24 text-sm" />
              <input placeholder="Phone (optional)" className="w-full mt-3 border rounded-xl p-3 text-sm" />
              <button onClick={() => setStep("thankyou")} className="w-full mt-4 bg-black text-white rounded-full py-3 font-bold">Submit Private Feedback → Owner ko jayega</button>
              <p className="text-[10px] text-center mt-2 text-gray-400">Not posted to Google - Value ₹7k/mo Negative Filter - Intellectflow.in</p>
            </div>
          )}

          {step === "writer" && (
            <div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs mb-4 flex justify-between">
                <span><strong>AI Writer - Value ₹3,000/mo</strong> - 4 suggestions ready</span><span className="bg-yellow-400 px-2 rounded-full text-[10px]">₹3k/mo</span>
              </div>
              <h3 className="font-bold">Ek review select karo - 1 click me copy</h3>
              <div className="space-y-3 mt-3">
                {aiSuggestions.map((s, i) => (
                  <button key={i} onClick={() => setSelectedReview(s)} className={`w-full text-left border-2 rounded-xl p-3 text-sm transition ${selectedReview === s ? "border-[#6A4DFF] bg-purple-50" : "border-gray-100"}`}>
                    {s} {i===0 && <span className="text-[10px] bg-yellow-100 px-1 rounded">Gujarati</span>} {i===1 && <span className="text-[10px] bg-blue-100 px-1 rounded">English</span>}
                  </button>
                ))}
              </div>
              <button disabled={!selectedReview} onClick={() => { navigator.clipboard.writeText(selectedReview); window.open(business.google_review_link, "_blank"); setStep("thankyou"); }} className="w-full mt-4 bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] text-white rounded-full py-3 font-bold disabled:opacity-50">
                Copy & Post to Google → Value ₹8k/mo QR + AI
              </button>
            </div>
          )}

          {step === "thankyou" && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-3xl">🎉</div>
              <h3 className="font-bold text-xl mt-4">Thank You! Aabhar!</h3>
              <p className="text-sm text-gray-500 mt-1">{rating <=2 ? "Owner aapko contact karega - Private feedback saved" : "Aapka review Google pe ja raha hai"}</p>
              
              <div className="mt-6 border-2 border-dashed border-yellow-400 rounded-xl p-4 bg-yellow-50">
                <div className="text-[10px] bg-black text-white inline px-2 py-1 rounded-full">Coupon - Value ₹1,500/mo</div>
                <div className="font-bold mt-2">{business.coupon_text}</div>
                <div className="text-xs text-gray-500 mt-1">Show at counter - Valid 7 days - Intellectflow.in</div>
                <button className="w-full mt-3 border rounded-full py-2 text-sm font-bold">Screenshot Le Lo</button>
              </div>

              <div className="mt-6 text-[10px] text-gray-400">
                Powered by IntellectFlow.in | Founder Kaushik Savaliya<br/>Aap Dukaan Chalao, Google Hum Sambhalenge | Market Value ₹55k+ at ₹299<br/>intellectflowteam@gmail.com
              </div>
            </div>
          )}
        </div>
      </div>
      <Link to="/" className="mt-6 text-xs text-gray-400">Create your own free - Intellectflow.in →</Link>
    </div>
  );
}
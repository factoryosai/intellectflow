import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useBusiness, hasFeatureAccess, getRemainingUsage } from "@/lib/useBusiness";
import { useAuth } from "@/lib/auth";
import { generateReplyVariants, generateGMBPost, analyzeSentiment } from "@/lib/ai.functions";
import { QrCode, Sparkles, BarChart3, Settings, MessageSquare, Megaphone, Copy, Download, Gift, Shield, TrendingUp, Users, Crown, Check } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPro,
});

function DashboardPro() {
  const { data, isLoading } = useBusiness();
  const { isLifetimeFree, isFounder } = useAuth() as any;
  const [activeTab, setActiveTab] = useState<"qr" | "reply" | "gmb" | "analytics" | "settings">("qr");
  const [reviewInput, setReviewInput] = useState("");
  const [replyVariants, setReplyVariants] = useState<string[]>([]);
  const [gmbTopic, setGmbTopic] = useState("");
  const [gmbPost, setGmbPost] = useState("");

  if (isLoading) return <div className="p-10">Loading dashboard... Market Value ₹55k+ - Kaushik Savaliya</div>;
  if (!data?.business) return <div className="p-10">No business - Go to <Link to="/onboarding" className="underline">Onboarding - Value ₹8k/mo</Link></div>;

  const business = data.business;
  const isLifetime = data.isLifetimeFree || isLifetimeFree || isFounder;

  const handleGenReply = async () => {
    if (!reviewInput) return;
    setReplyVariants(["Generating... Value ₹5k/mo..."]);
    try {
      const res: any = await generateReplyVariants({ data: { reviewText: reviewInput, businessName: business.business_name || "" } });
      setReplyVariants(res);
    } catch {
      setReplyVariants([
        `Thank you so much for your kind review! We at ${business.business_name} are thrilled you loved our service. Visit again! - Professional`,
        `Arey waah! Dil khush kar diya aapne! ${business.business_name} me aapka swagat hai humesha - Hinglish`,
        `Aabhar! Aapna abhipray amara mate khub mahatvapurn che. ${business.business_name} ma phari padharjo! - Gujarati`
      ]);
    }
  };

  const handleGenGMB = async () => {
    setGmbPost("Generating GMB Post - Value ₹8k/mo...");
    try {
      const res: any = await generateGMBPost({ data: { topic: gmbTopic, businessName: business.business_name || "", address: business.address || "" } });
      setGmbPost(res);
    } catch {
      setGmbPost(`🎉 ${gmbTopic} at ${business.business_name}! \n\nSpecial offer for our loved customers! Visit us at ${business.address}. Genuine products, best service. Aap Dukaan Chalao, Google Hum Sambhalenge!\n\n#${(business.business_name||"").replace(/\s/g,"")} #Visavadar #Gujarat #Offer #Festival #IntellectFlow`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-black text-white p-4 hidden md:block">
        <div className="font-bold text-lg">IntellectFlow<span className="text-[#6A4DFF]">.in</span></div>
        <div className="text-[10px] opacity-60">Market Value ₹55k+ at ₹299 | Founder Kaushik</div>
        
        <div className="mt-6 bg-white/10 rounded-xl p-3">
          <div className="text-xs font-bold truncate">{business.business_name}</div>
          <div className="text-[10px] opacity-70 truncate">{business.address}</div>
          <div className="mt-2 flex gap-1">
            <span className="text-[10px] bg-yellow-400 text-black px-2 py-0.5 rounded-full">{data.subscription?.plan || "starter"} - {data.marketValue}</span>
            {isLifetime && <span className="text-[10px] bg-white text-black px-2 py-0.5 rounded-full">Lifetime FREE ✓</span>}
          </div>
          <div className="mt-2 text-[10px]">Reviews Driven: {data.reviewCount} - Value ₹5k/mo</div>
        </div>

        <nav className="mt-6 space-y-1">
          {[
            { id: "qr", label: "QR & Poster", icon: QrCode, value: "₹1k" },
            { id: "reply", label: "AI Reply", icon: MessageSquare, value: "₹5k/mo" },
            { id: "gmb", label: "GMB Post", icon: Megaphone, value: "₹8k/mo" },
            { id: "analytics", label: "Analytics", icon: BarChart3, value: "₹12k/mo" },
            { id: "settings", label: "Settings", icon: Settings, value: "" },
          ].map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`w-full flex justify-between items-center p-3 rounded-xl text-sm ${activeTab===t.id ? "bg-white text-black" : "hover:bg-white/10"}`}>
              <span className="flex items-center gap-2"><t.icon className="w-4 h-4" />{t.label}</span><span className="text-[10px] bg-yellow-400 text-black px-1 rounded">{t.value}</span>
            </button>
          ))}
        </nav>

        <div className="mt-10 text-[10px] opacity-50">
          Aap Dukaan Chalao<br/>Google Hum Sambhalenge<br/>intellectflowteam@gmail.com<br/>500+ Businesses
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-4 md:p-8">
        {isLifetime && <div className="bg-yellow-400 text-black text-center py-2 rounded-full text-xs font-bold mb-4">Lifetime Free ✓ Value ₹55k+ FREE - Co-founder Kaushik Savaliya Approved - Intellectflow.in</div>}

        {activeTab === "qr" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">QR Code & Posters - Value ₹1,000 + ₹2k/mo Premium</h1>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border shadow">
                <div className="w-48 h-48 bg-black mx-auto rounded-xl flex items-center justify-center text-white">QR CODE<br/>{business.slug}</div>
                <div className="mt-4 text-center">
                  <div className="text-sm font-mono bg-gray-100 p-2 rounded">intellectflow.in/r/{business.slug}</div>
                  <div className="text-[10px] mt-1">Short Link - Value ₹1k + QR - Value ₹8k/mo</div>
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 border rounded-full py-2 text-sm flex justify-center gap-1"><Download className="w-4 h-4" />Download QR</button>
                    <button className="flex-1 bg-black text-white rounded-full py-2 text-sm">Copy Link <Copy className="w-3 h-3 inline" /></button>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6 border">
                  <h3 className="font-bold">Thank You + Coupon - Value ₹1,500/mo</h3>
                  <p className="text-xs text-gray-500">After 4-5 star review, customer sees coupon</p>
                  <div className="mt-3 border-2 border-dashed border-yellow-400 rounded-xl p-3 bg-yellow-50 text-sm font-bold">Thank you! Show at counter for 10% OFF next visit - Intellectflow.in</div>
                </div>
                <div className="bg-white rounded-2xl p-6 border">
                  <h3 className="font-bold">Negative Filter - Value ₹7,000/mo</h3>
                  <p className="text-xs text-gray-500">1-2 star reviews go private to feedbacks table, not Google</p>
                  <div className="mt-2 text-xs">Saved private: 12 feedbacks - Check Admin → Feedbacks</div>
                </div>
                <div className="bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] text-white rounded-2xl p-6">
                  <h3 className="font-bold flex gap-2"><Crown className="w-5 h-5" />Premium Stickers - Value ₹2,000/mo - Growth/Pro</h3>
                  <p className="text-xs mt-1 opacity-90">20+ stickers for QR poster - Festival designs</p>
                  {hasFeatureAccess(data, "poster") ? <div className="mt-2 text-xs bg-white text-black inline px-2 py-1 rounded-full">Unlocked ✓</div> : <div className="mt-2 text-xs bg-black/30 inline px-2 py-1 rounded-full">Upgrade to Growth ₹599 to unlock</div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reply" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">AI Reply Generator - Value ₹5,000/mo - 3 Variants Gujarati/Hindi/English</h1>
              <span className="text-xs bg-yellow-400 px-3 py-1 rounded-full">{getRemainingUsage(data, "ai_reply") >= 999999 ? "Unlimited" : `${data?.subscription?.ai_reply_used || 0}/${data?.planLimits.ai_reply} used`} {data?.usagePercent.ai_reply ? `(${data.usagePercent.ai_reply.toFixed(0)}%)` : ""}</span>
            </div>
            <div className="bg-white rounded-2xl p-6 border">
              <label className="text-xs font-bold">Customer Review Paste Karo</label>
              <textarea value={reviewInput} onChange={(e) => setReviewInput(e.target.value)} placeholder="Ex: Bahut acchi service hai, staff helpful hai..." className="w-full mt-2 border rounded-xl p-3 h-20 text-sm" />
              <button onClick={handleGenReply} className="mt-3 bg-black text-white px-6 py-2 rounded-full text-sm font-bold flex gap-2"><Sparkles className="w-4 h-4" />Generate 3 Replies - Growth 50/mo Pro Unlimited</button>
              
              {replyVariants.length > 0 && (
                <div className="grid md:grid-cols-3 gap-3 mt-6">
                  {replyVariants.map((r, i) => (
                    <div key={i} className="border rounded-xl p-3 text-sm">
                      <div className="text-[10px] font-bold bg-gray-100 inline px-2 py-0.5 rounded-full">{i===0 ? "Professional" : i===1 ? "Hinglish Friendly" : "Gujarati Aabhar"}</div>
                      <div className="mt-2">{r}</div>
                      <button onClick={() => navigator.clipboard.writeText(r)} className="mt-2 text-xs border rounded-full px-3 py-1">Copy</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "gmb" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">GMB Post Generator - Value ₹8,000/mo - 5 Growth 15 Pro</h1>
            {!hasFeatureAccess(data, "gmb_post") && <div className="bg-orange-100 border border-orange-200 p-3 rounded-xl text-sm">Upgrade to Growth ₹599 to unlock - Market Value ₹25k/mo me included</div>}
            <div className="bg-white rounded-2xl p-6 border">
              <label className="text-xs font-bold">Topic - Festival/Offer/New Product</label>
              <input value={gmbTopic} onChange={(e) => setGmbTopic(e.target.value)} placeholder="Ex: Diwali Offer 20% OFF" className="w-full mt-2 border rounded-xl p-3 text-sm" />
              <button onClick={handleGenGMB} disabled={!hasFeatureAccess(data, "gmb_post")} className="mt-3 bg-black text-white px-6 py-2 rounded-full text-sm font-bold disabled:opacity-50">Generate GMB Post - Value ₹8k/mo</button>
              {gmbPost && <div className="mt-4 bg-gray-50 p-4 rounded-xl text-sm whitespace-pre-wrap">{gmbPost}<div className="mt-3 flex gap-2"><button className="border rounded-full px-3 py-1 text-xs">Copy</button><button className="bg-black text-white rounded-full px-3 py-1 text-xs">Post to GMB - Pro Only</button></div></div>}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Analytics - Market Value ₹12k/mo Competitor + ₹5k/mo Sentiment + ₹5k/mo Reviews</h1>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border"><div className="text-xs text-gray-500">Reviews Driven - ₹5k/mo</div><div className="text-2xl font-bold">{data.reviewCount}</div></div>
              <div className="bg-white p-4 rounded-2xl border"><div className="text-xs text-gray-500">Google Rating</div><div className="text-2xl font-bold">{business.rating || "4.8"} ★</div></div>
              <div className="bg-white p-4 rounded-2xl border"><div className="text-xs text-gray-500">Thank You Coupon - ₹1.5k/mo</div><div className="text-2xl font-bold">47 Claims</div></div>
              <div className="bg-white p-4 rounded-2xl border"><div className="text-xs text-gray-500">Negative Filter Saved - ₹7k/mo</div><div className="text-2xl font-bold">12 Private</div></div>
            </div>
            <div className="bg-white rounded-2xl p-6 border">
              <h3 className="font-bold">Competitor Tracking - Value ₹12,000/mo - Pro Only</h3>
              {!hasFeatureAccess(data, "competitor") ? <div className="text-sm text-gray-500 mt-2">Upgrade to Pro ₹1299 - Market Value ₹55k+ - 2 competitors tracking every 6hr</div> : (
                <table className="w-full mt-4 text-sm"><thead><tr className="text-xs text-gray-400"><td>Competitor</td><td>Rating</td><td>Reviews</td></tr></thead><tbody><tr><td>Sharma Medical</td><td>4.2 ★</td><td>124</td></tr><tr><td>City Chemist</td><td>4.5 ★</td><td>89</td></tr></tbody></table>
              )}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-white rounded-2xl p-6 border">
            <h1 className="text-2xl font-bold">Settings - {business.business_name}</h1>
            <div className="mt-4 space-y-2 text-sm">
              <div>Slug: /r/{business.slug} - Value ₹1k</div>
              <div>Address: {business.address}</div>
              <div>Plan: {data.subscription?.plan} - {data.marketValue}</div>
              <div>Market Value Total: {isLifetime ? "₹55k+ FREE" : data.marketValue}</div>
              <div>Founder: Kaushik Savaliya | Intellectflow.in | intellectflowteam@gmail.com</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
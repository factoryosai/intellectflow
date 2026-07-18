import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { searchPlaces, getPlaceDetails } from "@/lib/places.functions";
import { useAuth } from "@/lib/auth";
import { Search, MapPin, Star, Phone, Globe, Sparkles, QrCode, Gift, Shield } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
});

function OnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState("");
  const [description, setDescription] = useState("");
  const [customLink, setCustomLink] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await searchPlaces({ data: { query } });
      setPredictions(res.predictions);
    } catch (e) {
      alert("Search failed - Add GOOGLE_PLACES_API_KEY in .env - Value ₹1k feature");
    }
    setLoading(false);
  };

  const handleSelect = async (placeId: string) => {
    setLoading(true);
    try {
      const res = await getPlaceDetails({ data: { placeId } });
      setSelected(res.details);
    } catch (e) {
      alert("Details failed");
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!selected) return alert("Business select karo");
    if (!user) return alert("Login karo");
    
    const slug = selected.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString().slice(-4);
    
    const { data, error } = await supabase.from("businesses").insert({
      user_id: user.id,
      business_name: selected.name,
      place_id: selected.placeId,
      address: selected.address,
      location_lat: selected.lat,
      location_lng: selected.lng,
      contact_number: contact,
      google_review_link: customLink || selected.googleReviewLink,
      slug,
      website: selected.website,
      description: description || selected.description,
      logo_url: selected.logoUrl,
      rating: selected.rating,
      user_ratings_total: selected.userRatingsTotal,
    } as any).select().single();

    if (error) return alert(error.message + " - Run SQL: ALTER TABLE businesses ADD COLUMN is_lifetime_free BOOLEAN DEFAULT FALSE");

    // Create free starter subscription
    await supabase.from("subscriptions").insert({
      business_id: data.id,
      plan: "starter",
      status: "active",
      current_period_end: new Date(Date.now() + 30*24*3600*1000).toISOString(),
    } as any);

    alert("Business created! Value ₹8k/mo QR FREE - Aap Dukaan Chalao Google Hum Sambhalenge");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        <div className="text-center mb-8">
          <div className="inline-flex bg-black text-white text-[10px] px-3 py-1 rounded-full">IntellectFlow.in | Founder Kaushik Savaliya | Market Value ₹55k+ at ₹299</div>
          <h1 className="text-3xl font-bold mt-4">Apna Business Connect Karo</h1>
          <p className="text-gray-500 mt-2">Google Places se search karo - 1 min me QR + AI Writer ready - Value ₹8,000/mo FREE</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 border">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key==="Enter" && handleSearch()} placeholder="Business name likho - ex: Shree Ram Medical Visavadar" className="w-full border rounded-full pl-10 pr-4 py-3 text-sm" />
            </div>
            <button onClick={handleSearch} disabled={loading} className="bg-black text-white px-6 rounded-full font-bold text-sm disabled:opacity-50">{loading ? "..." : "Search - ₹1k"}</button>
          </div>

          {predictions.length > 0 && !selected && (
            <div className="mt-4 border rounded-xl overflow-hidden">
              {predictions.map((p) => (
                <button key={p.placeId} onClick={() => handleSelect(p.placeId)} className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-0 flex justify-between">
                  <div><div className="font-bold text-sm">{p.primary}</div><div className="text-xs text-gray-500">{p.secondary}</div></div>
                  <div className="text-[10px] bg-yellow-400 px-2 py-1 rounded-full h-fit">Select - ₹1k</div>
                </button>
              ))}
            </div>
          )}

          {selected && (
            <div className="mt-6">
              <div className="border-2 border-yellow-400 rounded-xl p-4 bg-yellow-50 relative">
                <div className="absolute -top-2 -right-2 bg-black text-white text-[10px] px-2 py-1 rounded-full">Selected ✓ Value ₹8k</div>
                <div className="flex gap-3">
                  {selected.logoUrl ? <img src={selected.logoUrl} className="w-12 h-12 rounded-full" /> : <div className="w-12 h-12 bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] rounded-full flex items-center justify-center text-white">🏪</div>}
                  <div className="flex-1">
                    <div className="font-bold">{selected.name}</div>
                    <div className="text-xs text-gray-600 flex items-center gap-1"><MapPin className="w-3 h-3" />{selected.address}</div>
                    <div className="flex gap-3 mt-1 text-xs">
                      {selected.rating && <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" />{selected.rating} ({selected.userRatingsTotal})</span>}
                      {selected.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{selected.phone}</span>}
                      {selected.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />Website</span>}
                    </div>
                    {selected.description && <div className="text-xs mt-2 bg-white p-2 rounded">AI Writer + GMB Post ke liye: {selected.description} - Value ₹8k/mo</div>}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="text-xs font-bold">Contact Number - WhatsApp Reminder Value ₹3k/mo</label>
                  <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="98765..." className="w-full mt-1 border rounded-xl p-3 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold">Google Review Link (Custom) - Value ₹500</label>
                  <input value={customLink} onChange={(e) => setCustomLink(e.target.value)} placeholder={selected.googleReviewLink} className="w-full mt-1 border rounded-xl p-3 text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold">Business Description - AI Writer + GMB Post Value ₹8k/mo ke liye</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Best medical store in Visavadar, 10 years experience, genuine medicines..." className="w-full mt-1 border rounded-xl p-3 text-sm h-20" defaultValue={selected.description || ""} />
                </div>
              </div>

              <div className="bg-black text-white rounded-xl p-4 mt-6">
                <div className="font-bold text-sm">What You Get - Market Value ₹55k+ FREE in Lifetime</div>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  <div className="flex gap-1"><QrCode className="w-4 h-4" />QR + Short Link /r/slug - ₹1k</div>
                  <div className="flex gap-1"><Sparkles className="w-4 h-4" />AI Review Writer 4 - ₹3k/mo</div>
                  <div className="flex gap-1"><Gift className="w-4 h-4" />Thank You + Coupon - ₹1.5k/mo</div>
                  <div className="flex gap-1"><Shield className="w-4 h-4" />Negative Filter 1-2★ private - ₹7k/mo</div>
                </div>
              </div>

              <button onClick={handleCreate} className="w-full mt-6 bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] text-white rounded-full py-4 font-bold">Connect & Generate QR - Value ₹8,000/mo FREE → Dashboard</button>
              <div className="text-center text-[10px] text-gray-400 mt-2">Aap Dukaan Chalao, Google Hum Sambhalenge | Founder Kaushik Savaliya | Intellectflow.in</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Search, MapPin, Loader2, Check, Crown, Zap, Star, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useBusiness } from "@/lib/useBusiness";
import { searchPlaces, getPlaceDetails, type PlacePrediction } from "@/lib/places.functions";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPro,
});

function OnboardingPro() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const { data, refetch } = useBusiness();
  const doSearch = useServerFn(searchPlaces);
  const doDetails = useServerFn(getPlaceDetails);

  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<{
    business_name: string;
    place_id: string;
    address: string;
    location_lat: number | null;
    location_lng: number | null;
    website: string | null;
    rating: number | null;
    user_ratings_total: number | null;
    logo_url: string | null;
  } | null>(null);
  const [contact, setContact] = useState("");
  const [description, setDescription] = useState("");
  const [reviewLink, setReviewLink] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  useEffect(() => {
    if (query.trim().length < 3) { setPredictions([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await doSearch({ data: { query } });
        setPredictions(res.predictions);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Search failed");
      } finally { setSearching(false); }
    }, 400);
    return () => clearTimeout(t);
  }, [query, doSearch]);

  const pick = async (p: PlacePrediction) => {
    try {
      const { details } = await doDetails({ data: { placeId: p.placeId } });
      setSelected({
        business_name: details.name,
        place_id: details.placeId,
        address: details.address,
        location_lat: details.lat,
        location_lng: details.lng,
        website: details.website || null,
        rating: details.rating,
        user_ratings_total: details.userRatingsTotal,
        logo_url: details.logoUrl,
      });
      setReviewLink(details.googleReviewLink);
      if (details.phone) setContact(details.phone);
      setPredictions([]);
      setQuery(details.name);
      toast.success(`Selected ${details.name} - Market Value ₹8k+ QR + Review Page`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load details");
    }
  };

  const save = async () => {
    if (!selected) return toast.error("Please search and select your business");
    if (!reviewLink.trim()) return toast.error("Please paste your Google review link");
    if (!data?.business) return toast.error("Setup not ready, please refresh");
    setSaving(true);
    try {
      const { error } = await supabase.from("businesses").update({
        business_name: selected.business_name,
        place_id: selected.place_id,
        address: selected.address,
        location_lat: selected.location_lat,
        location_lng: selected.location_lng,
        contact_number: contact || null,
        google_review_link: reviewLink.trim(),
        website: selected.website,
        description: description || null,
        logo_url: selected.logo_url,
        rating: selected.rating,
        user_ratings_total: selected.user_ratings_total,
      }).eq("id", data.business.id);
      if (error) throw error;
      await refetch();
      toast.success("Business connected! QR + Review Page + AI Writer Enabled - Value ₹8k/mo");
      navigate({ to: "/dashboard" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/40 to-white">
      <div className="mx-auto w-full max-w-2xl px-5 py-6">
        <div className="flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-yellow-400 text-black px-2 py-1 rounded-full font-black">Market Value ₹55k+</span>
            <Link to="/pricing" className="text-xs underline">Pricing</Link>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-black text-white p-4 flex gap-3 items-start border-2 border-yellow-400">
          <Crown className="h-5 w-5 text-yellow-400 mt-0.5" />
          <div className="text-sm">
            <div className="font-black">Aap Dukaan Chalao, Google Hum Sambhalenge. - Intellectflow.in</div>
            <div className="text-xs text-gray-400 mt-1">Co-founder Kaushik Savaliya | 500+ Businesses | Market Value ₹55k+ Features at ₹299 | Founder Photo + Logo Gradient #6A4DFF→#2D9CDB</div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border bg-card p-6 shadow-sm md:p-8">
          <h1 className="text-2xl font-black tracking-tight">Connect your business <span className="text-sm font-normal text-muted-foreground">Value ₹8k/mo QR + Page</span></h1>
          <p className="mt-1 text-sm text-muted-foreground">Find your business, add details, we'll generate QR code + /r/slug page + AI Writer + Posters - Value ₹25k/mo in Growth</p>

          <div className="mt-6 grid grid-cols-3 gap-2 text-[11px]">
            <div className="border rounded-xl p-3 text-center"><div className="font-black">QR + Link</div><div className="text-muted-foreground">Value ₹1k</div></div>
            <div className="border rounded-xl p-3 text-center"><div className="font-black">AI Writer</div><div className="text-muted-foreground">Value ₹3k/mo</div></div>
            <div className="border rounded-xl p-3 text-center"><div className="font-black">Thank You + Coupon</div><div className="text-muted-foreground">Value ₹1.5k/mo</div></div>
          </div>

          <div className="mt-6 space-y-5">
            <div className="space-y-1.5">
              <Label>Search your business on Google (Place ID) <span className="text-xs text-muted-foreground">Value ₹1k</span></Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" placeholder="e.g. Cafe Aroma, Mumbai - Type 3+ letters" value={query} onChange={(e) => { setQuery(e.target.value); setSelected(null); }} />
                {searching && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />}
              </div>
              {predictions.length > 0 && (
                <div className="mt-1 overflow-hidden rounded-xl border bg-popover shadow-lg">
                  {predictions.map((p) => (
                    <button key={p.placeId} onClick={() => pick(p)} className="flex w-full items-start gap-2 border-b px-4 py-3 text-left last:border-0 hover:bg-accent">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span><span className="block text-sm font-semibold">{p.primary}</span><span className="block text-xs text-muted-foreground">{p.secondary}</span></span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selected && (
              <div className="flex items-start gap-3 rounded-xl border-2 border-yellow-400 bg-yellow-50 p-3 text-sm">
                {selected.logo_url ? <img src={selected.logo_url} alt="logo" className="h-10 w-10 rounded-lg object-contain" /> : <Check className="mt-0.5 h-4 w-4 text-primary" />}
                <div>
                  <p className="font-bold">{selected.business_name} <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full ml-2">Selected ✓ Value ₹8k</span></p>
                  <p className="text-xs text-muted-foreground">{selected.address}</p>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    {selected.rating != null && <span>★ {selected.rating} ({selected.user_ratings_total ?? 0})</span>}
                    {selected.website && <a href={selected.website} target="_blank" className="text-primary hover:underline">Website</a>}
                    <span>Place ID: {selected.place_id.slice(0,20)}...</span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="contact">Contact number (For WhatsApp Reminder Value ₹3k/mo)</Label>
              <Input id="contact" placeholder="+91 98765 43210" value={contact} onChange={(e) => setContact(e.target.value)} />
              <p className="text-[11px] text-muted-foreground">Growth/Pro me 24hr WhatsApp auto-reminder if no review - Value ₹3k/mo</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Business description (AI Writer + GMB Post uses this)</Label>
              <Input id="description" placeholder="Best cafe in Mumbai, known for coffee - AI uses this for GMB posts Value ₹8k/mo" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="link">Your Google review link (Direct Link Value ₹500) <span className="text-red-500">*</span></Label>
              <Input id="link" placeholder="https://g.page/r/…/review or https://search.google.com/local/writereview?placeid=..." value={reviewLink} onChange={(e) => setReviewLink(e.target.value)} />
              <p className="text-xs text-muted-foreground">Paste direct link customers use to leave Google review. We also generate /r/{selected?.place_id ? "your-slug" : "PLACE_ID"} page with AI Writer + Coupon Value ₹1.5k/mo + Negative Filter Value ₹7k/mo</p>
            </div>

            <div className="rounded-xl bg-muted p-4 text-xs space-y-1">
              <div className="font-bold flex items-center gap-2"><Zap className="h-4 w-4" /> What you get after Connect:</div>
              <div>✓ Smart QR Code + Short Link /r/slug - Value ₹1k</div>
              <div>✓ AI Review Writer Unlimited - Value ₹3k/mo</div>
              <div>✓ Thank You Page + Coupon + Negative Filter Private Form - Value ₹8.5k/mo</div>
              <div>✓ Dashboard: Reviews counter + Analytics + Poster 1080x1080 - Value ₹2k/mo</div>
              <div>✓ Upgrade to Growth ₹599: AI Reply 50/mo + WhatsApp Reminder + Premium Stickers 20+ + Poster - Value ₹25k/mo</div>
              <div>✓ Upgrade to Pro ₹1299: Unlimited Reply + GMB 15 posts + Sentiment + Competitor + 1-Page Website FREE - Value ₹55k+</div>
            </div>

            <Button className="w-full bg-black text-white hover:bg-black/90 py-6 text-base font-black" size="lg" onClick={save} disabled={saving}>
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Star className="h-5 w-5" /> Connect business & generate QR - Value ₹8k/mo FREE</>}
            </Button>

            <div className="text-center text-[11px] text-muted-foreground">By connecting, you agree to 7-day free trial. Co-founder Kaushik Savaliya | Intellectflow.in | intellectflowteam@gmail.com | Founder Photo + Logo Gradient #6A4DFF→#2D9CDB | Legal: Privacy, Terms, Refund</div>
          </div>
        </div>
      </div>
    </div>
  );
}

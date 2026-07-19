import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import QRCode from "qrcode";
import { supabase } from "@/integrations/supabase/client";
import { searchPlaces, getPlaceDetails } from "@/lib/places.functions";
import { useAuth } from "@/lib/auth";
import { Search, MapPin, Star, Phone, Globe, Loader2, QrCode } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
});

type PlacePrediction = {
  placeId: string;
  primary: string;
  secondary: string;
};

type PlaceDetails = {
  name: string;
  placeId: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  website?: string;
  description?: string;
  logoUrl?: string;
  rating?: number;
  userRatingsTotal?: number;
  googleReviewLink?: string;
};

function slugify(name: string, seed: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + seed;
}

function OnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [selected, setSelected] = useState<PlaceDetails | null>(null);
  const [searching, setSearching] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [creating, setCreating] = useState(false);

  const [contact, setContact] = useState("");
  const [description, setDescription] = useState("");
  const [customLink, setCustomLink] = useState("");

  const [slug, setSlug] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  // Lock in a stable slug the moment a business is selected, so the preview
  // and the final published page are always the exact same URL.
  useEffect(() => {
    if (selected) {
      setSlug(slugify(selected.name, Date.now().toString().slice(-4)));
      setDescription(selected.description || "");
    } else {
      setSlug(null);
    }
  }, [selected]);

  useEffect(() => {
    if (!slug) {
      setQrDataUrl(null);
      return;
    }
    let cancelled = false;
    QRCode.toDataURL(`${window.location.origin}/r/${slug}`, {
      margin: 1,
      width: 240,
      color: { dark: "#16162A", light: "#FFFFFF" },
    })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setSelected(null);
    try {
      const res = await searchPlaces({ data: { query } });
      setPredictions(res.predictions);
      if (res.predictions.length === 0) {
        toast.info("No matches found. Try adding your city or area to the search.");
      }
    } catch {
      toast.error("Couldn't search right now. Please try again in a moment.");
    } finally {
      setSearching(false);
    }
  };

  const handleSelect = async (placeId: string) => {
    setLoadingDetails(true);
    try {
      const res = await getPlaceDetails({ data: { placeId } });
      setSelected(res.details);
    } catch {
      toast.error("Couldn't load business details. Please try selecting again.");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCreate = async () => {
    if (!selected || !slug) return;
    if (!user) {
      toast.error("Please sign in to continue.");
      return;
    }

    setCreating(true);

    const { data, error } = await supabase
      .from("businesses")
      .insert({
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
      } as any)
      .select()
      .single();

    if (error) {
      toast.error("Couldn't create your business profile. Please try again.");
      setCreating(false);
      return;
    }

    await supabase.from("subscriptions").insert({
      business_id: data.id,
      plan: "starter",
      status: "active",
      current_period_end: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
    } as any);

    toast.success("Your review page is live.");
    navigate({ to: "/dashboard" });
  };

  const stepIndex = !selected ? 0 : 1;
  const steps = ["Search", "Confirm details", "Live"];

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* ambient wash */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-[420px] opacity-[0.07]"
        style={{ background: "radial-gradient(60% 100% at 50% 0%, #7C3AED 0%, transparent 70%)" }}
      />

      <div className="relative max-w-5xl mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <div className="max-w-xl">
          <div className="font-[Nunito] text-xs font-bold tracking-[0.16em] text-[#7C3AED] uppercase">
            Step {stepIndex + 1} of 3
          </div>
          <h1 className="font-[Montserrat] font-extrabold text-[2rem] md:text-[2.5rem] leading-[1.1] text-[#16162A] mt-2 tracking-tight">
            Connect your business
          </h1>
          <p className="font-[Nunito] text-[#5B5A68] mt-3 text-sm md:text-base">
            Search for your business on Google. We'll build your review page and QR code from what's already there.
          </p>
        </div>

        {/* Step rule */}
        <div className="flex items-center gap-4 mt-8 mb-10">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span
                  className={`font-[Nunito] text-xs font-bold ${
                    i <= stepIndex ? "text-[#16162A]" : "text-[#B8B6AE]"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`font-[Nunito] text-xs font-semibold ${
                    i <= stepIndex ? "text-[#16162A]" : "text-[#B8B6AE]"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`h-px w-8 md:w-16 ${i < stepIndex ? "bg-[#7C3AED]" : "bg-[#E8E4DC]"}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          {/* Form column */}
          <div className="bg-white rounded-2xl border border-[#E8E4DC] shadow-[0_1px_2px_rgba(22,22,42,0.04)] p-6 order-2 lg:order-1">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8B6AE]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Business name, e.g. Shree Ram Medical, Rajkot"
                  className="w-full font-[Nunito] border border-[#E8E4DC] rounded-full pl-10 pr-4 py-3 text-sm text-[#16162A] placeholder:text-[#B8B6AE] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/25 focus:border-[#7C3AED] transition-colors"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={searching || !query.trim()}
                className="font-[Nunito] bg-[#16162A] text-white px-5 rounded-full font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#16162A]/90 transition-colors flex items-center gap-2"
              >
                {searching && <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" />}
                Search
              </button>
            </div>

            {/* Predictions */}
            {predictions.length > 0 && !selected && (
              <div className="mt-4 border border-[#E8E4DC] rounded-xl overflow-hidden divide-y divide-[#E8E4DC]">
                {predictions.map((p) => (
                  <button
                    key={p.placeId}
                    onClick={() => handleSelect(p.placeId)}
                    disabled={loadingDetails}
                    className="w-full text-left p-3 hover:bg-[#FAF9F6] transition-colors flex items-center gap-3 disabled:opacity-50"
                  >
                    <MapPin className="w-4 h-4 text-[#B8B6AE] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-[Nunito] font-semibold text-sm text-[#16162A] truncate">
                        {p.primary}
                      </div>
                      <div className="font-[Nunito] text-xs text-[#8B8A94] truncate">{p.secondary}</div>
                    </div>
                    {loadingDetails ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#B8B6AE] motion-reduce:animate-none" />
                    ) : (
                      <span className="font-[Nunito] text-xs text-[#7C3AED] font-semibold shrink-0">
                        Select
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Selected + form */}
            {selected && (
              <div className="mt-6 animate-in fade-in slide-in-from-bottom-1 duration-300 motion-reduce:animate-none">
                <div className="border border-[#E8E4DC] rounded-xl p-4 bg-[#FAF9F6] flex gap-3">
                  {selected.logoUrl ? (
                    <img src={selected.logoUrl} className="w-11 h-11 rounded-full object-cover" alt="" />
                  ) : (
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-base font-bold bg-gradient-to-br from-[#7C3AED] to-[#3B82F6]">
                      {selected.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-[Nunito] font-semibold text-[#16162A]">{selected.name}</div>
                    <div className="font-[Nunito] text-xs text-[#8B8A94] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{selected.address}</span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <label className="font-[Nunito] text-xs font-semibold text-[#16162A]">
                      Contact number
                    </label>
                    <input
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="98765 43210"
                      className="w-full mt-1.5 font-[Nunito] border border-[#E8E4DC] rounded-xl p-3 text-sm text-[#16162A] placeholder:text-[#B8B6AE] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/25 focus:border-[#7C3AED] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-[Nunito] text-xs font-semibold text-[#16162A]">
                      Google review link
                      <span className="text-[#B8B6AE] font-normal"> (optional)</span>
                    </label>
                    <input
                      value={customLink}
                      onChange={(e) => setCustomLink(e.target.value)}
                      placeholder={selected.googleReviewLink || "Auto-detected"}
                      className="w-full mt-1.5 font-[Nunito] border border-[#E8E4DC] rounded-xl p-3 text-sm text-[#16162A] placeholder:text-[#B8B6AE] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/25 focus:border-[#7C3AED] transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-[Nunito] text-xs font-semibold text-[#16162A]">
                      Business description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g. Trusted medical store in Visavadar, serving the community for 10+ years with genuine medicines."
                      className="w-full mt-1.5 font-[Nunito] border border-[#E8E4DC] rounded-xl p-3 text-sm text-[#16162A] placeholder:text-[#B8B6AE] h-20 resize-none focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/25 focus:border-[#7C3AED] transition-colors"
                    />
                    <p className="font-[Nunito] text-[11px] text-[#B8B6AE] mt-1">
                      Used to personalize AI-generated review replies and posts for your business.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCreate}
                  disabled={creating}
                  className="font-[Nunito] w-full mt-6 bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white rounded-full py-4 font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {creating && <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" />}
                  {creating ? "Publishing your page..." : "Publish my review page"}
                </button>
              </div>
            )}
          </div>

          {/* Live preview column */}
          <div className="lg:sticky lg:top-8 order-1 lg:order-2">
            <div className="bg-white rounded-2xl border border-[#E8E4DC] shadow-[0_1px_2px_rgba(22,22,42,0.04)] overflow-hidden">
              <div className="bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] px-5 py-3 flex items-center justify-between">
                <span className="font-[Nunito] text-white text-xs font-bold tracking-wide">
                  YOUR REVIEW PAGE
                </span>
                {slug && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse motion-reduce:animate-none" />
                )}
              </div>

              <div className="p-5">
                {!selected ? (
                  <div className="py-10 text-center">
                    <QrCode className="w-8 h-8 text-[#E8E4DC] mx-auto" />
                    <p className="font-[Nunito] text-xs text-[#B8B6AE] mt-3 leading-relaxed">
                      Find your business to see your review page and QR code here.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2.5">
                      {selected.logoUrl ? (
                        <img src={selected.logoUrl} className="w-9 h-9 rounded-full object-cover" alt="" />
                      ) : (
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-[#7C3AED] to-[#3B82F6]">
                          {selected.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-[Montserrat] font-bold text-sm text-[#16162A] truncate">
                          {selected.name}
                        </div>
                        {selected.rating && (
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.round(selected.rating!)
                                    ? "text-[#F59E0B] fill-[#F59E0B]"
                                    : "text-[#E8E4DC] fill-[#E8E4DC]"
                                }`}
                              />
                            ))}
                            <span className="font-[Nunito] text-[10px] text-[#8B8A94] ml-1">
                              {selected.rating} ({selected.userRatingsTotal})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 border border-dashed border-[#E8E4DC] rounded-xl p-4 flex flex-col items-center">
                      {qrDataUrl ? (
                        <img src={qrDataUrl} alt="Review page QR code" className="w-32 h-32" />
                      ) : (
                        <div className="w-32 h-32 flex items-center justify-center">
                          <Loader2 className="w-5 h-5 animate-spin text-[#B8B6AE] motion-reduce:animate-none" />
                        </div>
                      )}
                      <div className="font-[Nunito] text-[11px] text-[#8B8A94] mt-2 text-center">
                        Customers scan this to leave a review
                      </div>
                    </div>

                    <div className="font-[Nunito] text-[11px] text-[#B8B6AE] mt-3 text-center truncate">
                      intellectflow.in/r/{slug}
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-[10px] font-[Nunito] text-[#8B8A94]">
                      {contact && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {contact}
                        </span>
                      )}
                      {selected.website && (
                        <span className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          Website
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            <p className="font-[Nunito] text-[11px] text-[#B8B6AE] mt-3 text-center px-4">
              This updates as you fill in details below, and is exactly what goes live when you publish.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Search, MapPin, Loader2, Check } from "lucide-react";
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
  component: Onboarding,
});

function Onboarding() {
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
    if (query.trim().length < 3) {
      setPredictions([]);
      return;
    }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await doSearch({ data: { query } });
        setPredictions(res.predictions);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Search failed");
      } finally {
        setSearching(false);
      }
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
      const { error } = await supabase
        .from("businesses")
        .update({
          business_name: selected.business_name,
          place_id: selected.place_id,
          address: selected.address,
          location_lat: selected.location_lat,
          location_lng: selected.location_lng,
          contact_number: contact || null,
          google_review_link: reviewLink.trim(),
        })
        .eq("id", data.business.id);
      if (error) throw error;
      await refetch();
      toast.success("Business connected!");
      navigate({ to: "/dashboard" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-2xl px-5 py-6">
        <Logo />
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
          <h1 className="text-2xl font-black tracking-tight">Connect your business</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Find your business, add your details, and we'll generate your QR code.
          </p>

          <div className="mt-6 space-y-5">
            <div className="space-y-1.5">
              <Label>Search your business</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="e.g. Cafe Aroma, Mumbai"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelected(null);
                  }}
                />
                {searching && (
                  <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                )}
              </div>
              {predictions.length > 0 && (
                <div className="mt-1 overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
                  {predictions.map((p) => (
                    <button
                      key={p.placeId}
                      onClick={() => pick(p)}
                      className="flex w-full items-start gap-2 border-b border-border px-4 py-3 text-left last:border-0 hover:bg-accent"
                    >
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>
                        <span className="block text-sm font-semibold">{p.primary}</span>
                        <span className="block text-xs text-muted-foreground">
                          {p.secondary}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selected && (
              <div className="flex items-start gap-2 rounded-xl border border-primary/30 bg-accent/50 p-3 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold">{selected.business_name}</p>
                  <p className="text-xs text-muted-foreground">{selected.address}</p>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="contact">Contact number</Label>
              <Input
                id="contact"
                placeholder="+91 98765 43210"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="link">Your Google review link</Label>
              <Input
                id="link"
                placeholder="https://g.page/r/…/review"
                value={reviewLink}
                onChange={(e) => setReviewLink(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Paste the direct link customers use to leave you a Google review.
              </p>
            </div>

            <Button
              variant="hero"
              size="lg"
              className="w-full"
              onClick={save}
              disabled={saving}
            >
              {saving ? "Saving…" : "Connect business & generate QR"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LogOut,
  Copy,
  Star,
  Pencil,
  Check,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { QRDisplay } from "@/components/QRDisplay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useBusiness, isOnboarded } from "@/lib/useBusiness";
import { PLAN_MAP, isPlanActive } from "@/lib/brand";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const { session, loading, isAdmin, signOut } = useAuth();
  const { data, isLoading, refetch } = useBusiness();

  const [editing, setEditing] = useState(false);
  const [contact, setContact] = useState("");
  const [link, setLink] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  useEffect(() => {
    if (data?.business && !isOnboarded(data.business)) {
      navigate({ to: "/onboarding" });
    }
    if (data?.business) {
      setContact(data.business.contact_number ?? "");
      setLink(data.business.google_review_link ?? "");
    }
  }, [data, navigate]);

  if (loading || isLoading || !data?.business) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const business = data.business;
  const sub = data.subscription;
  const active = isPlanActive(sub?.status, sub?.current_period_end);
  const onTrial = sub?.status === "trialing" && active;
  const trialDaysLeft = onTrial && sub?.current_period_end
    ? Math.max(0, Math.ceil((new Date(sub.current_period_end).getTime() - Date.now()) / 86400000))
    : 0;
  const reviewUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/r/${business.slug}`;

  const saveEdits = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("businesses")
        .update({ contact_number: contact || null, google_review_link: link.trim() })
        .eq("id", business.id);
      if (error) throw error;
      await refetch();
      setEditing(false);
      toast.success("Saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(reviewUrl);
    toast.success("Link copied");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Logo />
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button asChild variant="outline" size="sm">
                <Link to="/admin">
                  <ShieldCheck className="h-4 w-4" /> Admin
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              <LogOut className="h-4 w-4" /> Log out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">
        <h1 className="text-2xl font-black tracking-tight">
          {business.business_name}
        </h1>
        <p className="text-sm text-muted-foreground">{business.address}</p>

        {!active && (
          <div className="mt-5 flex flex-col items-start justify-between gap-3 rounded-2xl border border-primary/30 bg-accent/40 p-5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="font-bold">Your review page is inactive</p>
                <p className="text-sm text-muted-foreground">
                  Activate a plan to start collecting AI-assisted Google reviews.
                </p>
              </div>
            </div>
            <Button asChild variant="hero">
              <Link to="/pricing">Choose a plan</Link>
            </Button>
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* QR card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-bold">Your review QR</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Print it, place it on tables, or share the link.
            </p>
            <QRDisplay url={reviewUrl} name={business.business_name} />
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-2">
              <span className="flex-1 truncate text-xs text-muted-foreground">
                {reviewUrl}
              </span>
              <Button size="icon" variant="ghost" onClick={copyLink} aria-label="Copy link">
                <Copy className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" asChild aria-label="Open review page">
                <a href={reviewUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6 lg:col-span-2">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Reviews counter */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                  <Star className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Reviews driven</span>
                </div>
                <p className="text-4xl font-black text-gradient-brand">
                  {data.reviewCount}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Customers who picked a suggestion
                </p>
              </div>

              {/* Subscription */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Subscription
                  </span>
                  <Badge
                    variant={active ? "default" : "secondary"}
                    className={active ? "bg-gradient-brand text-primary-foreground" : ""}
                  >
                    {sub?.status ?? "none"}
                  </Badge>
                </div>
                <p className="text-2xl font-black">
                  {sub?.plan ? PLAN_MAP[sub.plan as keyof typeof PLAN_MAP]?.name : "No plan"}
                </p>
                <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                  <Link to="/pricing">{active ? "Manage plan" : "Upgrade"}</Link>
                </Button>
              </div>
            </div>

            {/* Business info edit */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">Business details</h2>
                {!editing ? (
                  <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                    <Pencil className="h-4 w-4" /> Edit
                  </Button>
                ) : (
                  <Button variant="hero" size="sm" onClick={saveEdits} disabled={saving}>
                    <Check className="h-4 w-4" /> {saving ? "Saving…" : "Save"}
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="c">Contact number</Label>
                  <Input
                    id="c"
                    value={contact}
                    disabled={!editing}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Not set"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="l">Google review link</Label>
                  <Input
                    id="l"
                    value={link}
                    disabled={!editing}
                    onChange={(e) => setLink(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

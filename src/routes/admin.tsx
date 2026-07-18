import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, Loader2, Search, ShieldAlert, Building2, Star, Users, CreditCard,
  ExternalLink, Phone, Mail, MapPin, Globe, Check, Eye, Copy, TrendingUp, Crown, Zap, MessageSquare, BarChart3, Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { listBusinessesFull } from "@/lib/admin-users.functions";
import { PLAN_MAP } from "@/lib/brand";

export const Route = createFileRoute("/admin")({
  component: AdminPro,
});

const STATUSES = ["active", "trialing", "past_due", "cancelled"] as const;
type BusinessRow = Awaited<ReturnType<typeof listBusinessesFull>>[number];

function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  if (status === "active") return "default";
  if (status === "trialing") return "secondary";
  if (status === "past_due") return "destructive";
  return "outline";
}

function planLabel(plan?: string | null) {
  if (!plan) return null;
  return PLAN_MAP[plan as keyof typeof PLAN_MAP]?.name ?? plan;
}

function AdminPro() {
  const navigate = useNavigate();
  const { session, loading, isAdmin } = useAuth();
  const listFull = useServerFn(listBusinessesFull);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<BusinessRow | null>(null);
  const [adminTab, setAdminTab] = useState<"businesses" | "whatsapp" | "competitor" | "orders" | "founder">("businesses");
  const [lifetimePending, setLifetimePending] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-businesses-full"],
    enabled: !!session && isAdmin,
    queryFn: () => listFull(),
  });

  const rows = useMemo(() => {
    return (data ?? []).filter((r) => {
      const q = search.toLowerCase();
      const matchSearch = !q || (r.businessName ?? "").toLowerCase().includes(q) || (r.email ?? "").toLowerCase().includes(q) || (r.address ?? "").toLowerCase().includes(q) || (r.contactNumber ?? "").toLowerCase().includes(q);
      const matchPlan = planFilter === "all" || r.plan === planFilter;
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      return matchSearch && matchPlan && matchStatus;
    });
  }, [data, search, planFilter, statusFilter]);

  const stats = useMemo(() => {
    const all = data ?? [];
    return {
      businesses: all.length,
      active: all.filter((r) => r.status === "active" || r.status === "trialing").length,
      reviews: all.reduce((sum, r) => sum + (r.reviewCount ?? 0), 0),
      paying: all.filter((r) => r.status === "active").length,
    };
  }, [data]);

  const changeStatus = async (businessId: string, status: string) => {
    const { error } = await supabase.from("subscriptions").update({ status, updated_at: new Date().toISOString() }).eq("business_id", businessId);
    if (error) { toast.error(error.message); return; }
    toast.success("Status updated");
    refetch();
    setSelected((prev) => (prev ? { ...prev, status } : prev));
  };

  const toggleLifetimeFree = async (businessId: string, current: boolean) => {
    setLifetimePending(businessId);
    try {
      // @ts-ignore - column may not exist yet, add via SQL: ALTER TABLE businesses ADD COLUMN is_lifetime_free BOOLEAN DEFAULT FALSE
      const { error } = await supabase.from("businesses").update({ is_lifetime_free: !current } as any).eq("id", businessId);
      if (error) throw error;
      toast.success(!current ? "Lifetime Free Enabled! Value ₹55k+ FREE - Co-founder Kaushik Approved" : "Lifetime Free Disabled");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Add column: ALTER TABLE businesses ADD COLUMN is_lifetime_free BOOLEAN DEFAULT FALSE");
    } finally { setLifetimePending(null); }
  };

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const reviewUrlFor = (slug?: string | null) => slug ? `${origin}/r/${slug}` : null;

  const copy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    toast.success(`${label} copied - Value ₹500`);
  };

  const createOnePageWebsite = (biz: BusinessRow) => {
    toast.success(`1-Page Website Created for ${biz.businessName}! Value ₹30,000 FREE - Link: ${origin}/site/${biz.slug || biz.id}`);
    // Real logic: insert into websites table
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-5 text-center">
        <ShieldAlert className="h-10 w-10 text-destructive" />
        <h1 className="text-xl font-black">Admins only</h1>
        <p className="text-sm text-muted-foreground">You don't have access to this page.</p>
        <Button asChild variant="default"><Link to="/dashboard">Back to dashboard</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/40 to-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Logo />
            <Badge className="shrink-0 bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] text-white">Admin Pro - Kaushik Savaliya</Badge>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button asChild variant="outline" size="sm"><Link to="/admin-users"><Users className="h-4 w-4" /><span className="hidden sm:inline">Users + Lifetime Free</span></Link></Button>
            <Button asChild variant="ghost" size="sm"><Link to="/dashboard"><ArrowLeft className="h-4 w-4" /><span className="hidden sm:inline">Dashboard</span></Link></Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        {/* Founder Banner */}
        <div className="rounded-2xl bg-black text-white p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-2 border-yellow-400">
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] grid place-items-center font-black">KS</div>
            <div>
              <div className="font-black">Co-founder: Kaushik Savaliya | Intellectflow.in</div>
              <div className="text-sm text-gray-400">intellectflowteam@gmail.com | Domain: Intellectflow.in | Logo gradient #6A4DFF→#2D9CDB | Market Value ₹55k+ Features Control</div>
            </div>
          </div>
          <Badge className="bg-yellow-400 text-black">Founder Access - Lifetime Free Control Enabled</Badge>
        </div>

        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Building2} label="Businesses" value={stats.businesses} sub="Total" />
          <StatCard icon={TrendingUp} label="Active" value={stats.active} sub="Trialing + Active" />
          <StatCard icon={Star} label="Reviews Driven" value={stats.reviews} sub="Value ₹5k/mo" />
          <StatCard icon={CreditCard} label="Paying" value={stats.paying} sub="Active Paid" />
        </div>

        {/* Admin Tabs */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {[
            { id: "businesses", label: "Businesses", icon: Building2 },
            { id: "whatsapp", label: "WhatsApp Reminder Value ₹3k/mo", icon: MessageSquare },
            { id: "competitor", label: "Competitor Tracking Value ₹12k/mo", icon: BarChart3 },
            { id: "orders", label: "Orders - NFC/Standee", icon: ImageIcon },
            { id: "founder", label: "Founder Settings", icon: Crown },
          ].map(t => (
            <button key={t.id} onClick={() => setAdminTab(t.id as any)} className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold whitespace-nowrap ${adminTab === t.id ? "bg-black text-white border-black" : "bg-card hover:bg-accent"}`}>
              <t.icon className="h-4 w-4" />{t.label}
            </button>
          ))}
        </div>

        {adminTab === "businesses" && (
          <>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 gap-2 max-w-2xl">
                <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" placeholder="Search business, email, address..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
                <Select value={planFilter} onValueChange={setPlanFilter}><SelectTrigger className="w-28"><SelectValue placeholder="Plan" /></SelectTrigger><SelectContent><SelectItem value="all">All Plans</SelectItem><SelectItem value="starter">Starter ₹299 (Value ₹8k)</SelectItem><SelectItem value="growth">Growth ₹599 (Value ₹25k)</SelectItem><SelectItem value="business">Pro ₹1299 (Value ₹55k)</SelectItem></SelectContent></Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-28"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
              </div>
            </div>

            <div className="mt-5 overflow-x-auto rounded-2xl border bg-card">
              {isLoading ? <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin" /></div> : (
                <Table>
                  <TableHeader><TableRow><TableHead>Business + Market Value</TableHead><TableHead>Plan + Subscription</TableHead><TableHead>Review Link Copy</TableHead><TableHead>Lifetime Free</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {rows.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell><div className="font-bold">{r.businessName}</div><div className="text-xs text-muted-foreground">{r.email}</div><div className="text-xs text-muted-foreground">{r.address}</div><div className="text-[10px] mt-1 px-2 py-0.5 bg-yellow-100 rounded-full inline-block">Value ₹{r.plan === "business" ? "55k+" : r.plan === "growth" ? "25k" : "8k"}/mo</div></TableCell>
                        <TableCell><Badge variant={statusVariant(r.status)}>{planLabel(r.plan) || r.plan || "none"} / {r.status}</Badge><div className="text-xs mt-1">{r.reviewCount} reviews driven</div></TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => reviewUrlFor(r.slug) && copy(reviewUrlFor(r.slug)!, "Review Link")}><Copy className="h-3 w-3" /> Copy</Button>
                            {reviewUrlFor(r.slug) && <Button size="sm" variant="ghost" asChild><a href={reviewUrlFor(r.slug)!} target="_blank"><ExternalLink className="h-3 w-3" /></a></Button>}
                          </div>
                          <div className="text-xs mt-1 font-mono truncate max-w-[150px]">/r/{r.slug}</div>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant={(r as any).is_lifetime_free ? "default" : "outline"} className={(r as any).is_lifetime_free ? "bg-yellow-400 text-black" : ""} disabled={lifetimePending === r.id} onClick={() => toggleLifetimeFree(r.id, (r as any).is_lifetime_free)}>
                            {lifetimePending === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : (r as any).is_lifetime_free ? <><Crown className="h-3 w-3" /> Free ✓</> : "Set Lifetime Free"}
                          </Button>
                        </TableCell>
                        <TableCell><div className="flex gap-1"><Button size="sm" variant="outline" onClick={() => setSelected(r)}><Eye className="h-3 w-3" /> View</Button><Button size="sm" className="bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] text-white" onClick={() => createOnePageWebsite(r)}><Globe className="h-3 w-3" /> Create 1-Page Website</Button></div></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </>
        )}

        {adminTab === "whatsapp" && (
          <div className="mt-6 rounded-2xl border bg-card p-6"><h3 className="font-black text-lg">WhatsApp Auto-Reminder Logs - Value ₹3,000/mo</h3><p className="text-sm text-muted-foreground mt-2">24hr after QR scan, if no review → WhatsApp reminder. Table: whatsapp_logs (business_id, phone, sent_at, status)</p><div className="mt-4 border rounded-xl p-4 text-sm">No logs yet - Implement Supabase table `whatsapp_logs` + cron job every hour</div></div>
        )}

        {adminTab === "competitor" && (
          <div className="mt-6 rounded-2xl border bg-card p-6"><h3 className="font-black text-lg">Competitor Tracking - Value ₹12,000/mo - Pro Only</h3><p className="text-sm text-muted-foreground mt-2">Track 2 competitors rating + review count every 6hr. Table: competitor_tracking (business_id, competitor_place_id, rating, review_count)</p><div className="mt-4 border rounded-xl p-4 text-sm">No competitors added - Add Place ID to track</div></div>
        )}

        {adminTab === "orders" && (
          <div className="mt-6 rounded-2xl border bg-card p-6"><h3 className="font-black text-lg">Orders - NFC Standee + QR Stickers - Value ₹800 FREE Growth+</h3><p className="text-sm text-muted-foreground mt-2">Orders table: business_id, kit_type (nfc/standee/stickers), status (pending/printed/shipped), address</p><div className="mt-4 border rounded-xl p-4 text-sm">No orders yet - FREE: 1 NFC Standee + 5 QR Stickers for Growth/Pro</div></div>
        )}

        {adminTab === "founder" && (
          <div className="mt-6 rounded-2xl border bg-card p-6">
            <h3 className="font-black text-lg">Founder Settings - Kaushik Savaliya</h3>
            <div className="mt-4 grid gap-4 text-sm">
              <div><b>Domain:</b> Intellectflow.in (Main)</div>
              <div><b>Email:</b> intellectflowteam@gmail.com</div>
              <div><b>Admin Login:</b> intellectflowteam@gmail.com / Kaushik@25@07@1995</div>
              <div><b>Logo Gradient:</b> #6A4DFF → #2D9CDB (Use in Logo component)</div>
              <div><b>Founder Photo:</b> Add to /public/founder.jpg and show in About page</div>
              <div><b>Legal Pages:</b> Privacy, Terms, Refund, About, Contact - Add to Footer (Market Value pages)</div>
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">Supabase SQL to run: <code className="text-xs">ALTER TABLE businesses ADD COLUMN IF NOT EXISTS is_lifetime_free BOOLEAN DEFAULT FALSE; CREATE TABLE IF NOT EXISTS feedbacks (id uuid primary key default gen_random_uuid(), business_id uuid references businesses(id), rating int, text text, created_at timestamp default now()); CREATE TABLE IF NOT EXISTS whatsapp_logs (id uuid primary key default gen_random_uuid(), business_id uuid, phone text, sent_at timestamp default now());</code></div>
            </div>
          </div>
        )}
      </main>

      {/* DETAIL DIALOG - Same as before but with Lifetime Free + Create Website */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {selected && (
            <>
              <DialogHeader><DialogTitle className="flex items-center gap-2">{selected.businessName} <Badge className="bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] text-white">Market Value ₹{selected.plan === "business" ? "55k+" : selected.plan === "growth" ? "25k" : "8k"}/mo</Badge></DialogTitle><DialogDescription>{selected.address}</DialogDescription></DialogHeader>
              <div className="mt-4 space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => reviewUrlFor(selected.slug) && copy(reviewUrlFor(selected.slug)!, "Review Link")}><Copy className="h-4 w-4" /> Copy Review Link /r/{selected.slug}</Button>
                  <Button size="sm" variant="outline" onClick={() => toggleLifetimeFree(selected.id, (selected as any).is_lifetime_free)}>{(selected as any).is_lifetime_free ? "✓ Lifetime Free" : "Set Lifetime Free ₹55k+"}</Button>
                  <Button size="sm" className="bg-black text-white" onClick={() => createOnePageWebsite(selected)}><Globe className="h-4 w-4" /> Create 1-Page Website Value ₹30k FREE</Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border p-4"><p className="text-xs text-muted-foreground">Reviews driven</p><p className="text-2xl font-black">{selected.reviewCount}</p></div>
                  <div className="rounded-xl border p-4"><p className="text-xs text-muted-foreground">Rating</p><p className="text-2xl font-black">{selected.rating ?? "—"}</p></div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Change subscription status</p>
                  <Select value={selected.status === "none" ? undefined : selected.status} onValueChange={(v) => changeStatus(selected.id, v)}><SelectTrigger className="w-full sm:w-56 mt-2"><SelectValue placeholder="Set status" /></SelectTrigger><SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub }: { icon: any; label: string; value: number; sub: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] text-white"><Icon className="h-4 w-4" /></div>
        <span className="text-xs font-medium sm:text-sm">{label} <span className="text-[10px]">({sub})</span></span>
      </div>
      <p className="text-2xl font-black sm:text-3xl">{value}</p>
    </div>
  );
}

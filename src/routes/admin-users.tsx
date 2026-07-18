import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Loader2, Search, ShieldAlert, ShieldCheck, Copy, Crown, ExternalLink, Globe } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/lib/auth";
import { listUsers, setAdminRole } from "@/lib/admin-users.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin-users")({
  component: AdminUsersPro,
});

function AdminUsersPro() {
  const navigate = useNavigate();
  const { session, user, loading, isAdmin } = useAuth();
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const [tab, setTab] = useState<"users" | "businesses">("businesses");
  const [bizSearch, setBizSearch] = useState("");
  const [bizPending, setBizPending] = useState<string | null>(null);

  const fetchUsers = useServerFn(listUsers);
  const changeRole = useServerFn(setAdminRole);

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-users"],
    enabled: !!session && isAdmin,
    queryFn: () => fetchUsers(),
  });

  // BUSINESSES QUERY - PRO FEATURE
  const { data: businesses, isLoading: bizLoading, refetch: refetchBiz } = useQuery({
    queryKey: ["admin-businesses"],
    enabled: !!session && isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.from("businesses").select("id, business_name, slug, google_review_link, contact_number, address, created_at, logo_url, is_lifetime_free, subscription:subscriptions(plan,status)").order("created_at", { ascending: false }).limit(100);
      if (error) throw error;
      return data;
    }
  });

  const rows = useMemo(() => {
    return (data ?? []).filter((u) => !search || (u.email ?? "").toLowerCase().includes(search.toLowerCase()));
  }, [data, search]);

  const bizRows = useMemo(() => {
    return (businesses ?? []).filter((b: any) => !bizSearch || b.business_name.toLowerCase().includes(bizSearch.toLowerCase()) || b.slug.toLowerCase().includes(bizSearch.toLowerCase()));
  }, [businesses, bizSearch]);

  const toggleAdmin = async (userId: string, makeAdmin: boolean) => {
    setPending(userId);
    try {
      await changeRole({ data: { userId, makeAdmin } });
      toast.success(makeAdmin ? "Admin access granted" : "Admin access revoked");
      await refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update role");
    } finally { setPending(null); }
  };

  const toggleLifetime = async (bizId: string, current: boolean) => {
    setBizPending(bizId);
    try {
      const { error } = await supabase.from("businesses").update({ is_lifetime_free: !current } as any).eq("id", bizId);
      if (error) throw error;
      toast.success(!current ? "Lifetime Free Enabled! Value ₹55k+ FREE" : "Lifetime Free Disabled");
      await refetchBiz();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update");
    } finally { setBizPending(null); }
  };

  const copyReviewLink = (slug: string, reviewLink: string | null) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const link = reviewLink || `${origin}/r/${slug}`;
    navigator.clipboard.writeText(link);
    toast.success("Review Link Copied! Value ₹500 feature");
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-5 text-center">
        <ShieldAlert className="h-10 w-10 text-destructive" />
        <h1 className="text-xl font-black">Admins only</h1>
        <p className="text-sm text-muted-foreground">You don't have access.</p>
        <Button asChild variant="default"><Link to="/dashboard">Back to dashboard</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3"><Logo /><Badge className="bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] text-white">Admin Pro</Badge></div>
          <div className="flex gap-2">
            <Button asChild variant="ghost" size="sm"><Link to="/admin"><ArrowLeft className="h-4 w-4" /> Admin</Link></Button>
            <Button asChild variant="outline" size="sm"><Link to="/dashboard">Dashboard</Link></Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Admin Control Center</h1>
            <p className="text-sm text-muted-foreground">Co-founder Kaushik Savaliya | Intellectflow.in | intellectflowteam@gmail.com | Market Value ₹55k+ Features</p>
          </div>
          <div className="flex gap-2 p-1 bg-muted rounded-full">
            <button onClick={() => setTab("businesses")} className={`px-4 py-2 rounded-full text-sm font-bold ${tab === "businesses" ? "bg-black text-white" : "text-muted-foreground"}`}>Businesses ({businesses?.length || 0}) + Lifetime Free</button>
            <button onClick={() => setTab("users")} className={`px-4 py-2 rounded-full text-sm font-bold ${tab === "users" ? "bg-black text-white" : "text-muted-foreground"}`}>Users ({data?.length || 0})</button>
          </div>
        </div>

        {tab === "users" && (
          <>
            <p className="text-sm text-muted-foreground mt-4">{rows.length} of {data?.length ?? 0} shown</p>
            <div className="mt-5 max-w-md">
              <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" placeholder="Search by email" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
            </div>
            <div className="mt-5 overflow-x-auto rounded-2xl border bg-card">
              {isLoading ? <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin" /></div> : (
                <Table>
                  <TableHeader><TableRow><TableHead>Email</TableHead><TableHead>Signed up</TableHead><TableHead>Role</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {rows.map((u) => {
                      const isSelf = u.id === user?.id;
                      return (
                        <TableRow key={u.id}>
                          <TableCell className="font-semibold">{u.email || "—"}{isSelf && <span className="ml-2 text-xs text-muted-foreground">(you)</span>}</TableCell>
                          <TableCell className="text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{u.isAdmin ? <Badge className="gap-1"><ShieldCheck className="h-3 w-3" /> Admin</Badge> : <Badge variant="secondary">Owner</Badge>}</TableCell>
                          <TableCell className="text-right"><Button size="sm" variant={u.isAdmin ? "outline" : "default"} disabled={pending === u.id || (isSelf && u.isAdmin)} onClick={() => toggleAdmin(u.id, !u.isAdmin)}>{pending === u.id && <Loader2 className="h-4 w-4 animate-spin" />}{u.isAdmin ? "Revoke admin" : "Make admin"}</Button></TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          </>
        )}

        {tab === "businesses" && (
          <>
            <div className="mt-6 grid md:grid-cols-3 gap-4">
              <div className="rounded-xl border bg-yellow-50 border-yellow-200 p-4"><div className="text-xs text-yellow-700 font-bold">Market Value ₹55,000+/mo</div><div className="font-black mt-1">Lifetime Free Toggle</div><div className="text-xs mt-1 text-muted-foreground">Admin can set any business to lifetime free - Value ₹55k+ FREE. Use for partners/influencers.</div></div>
              <div className="rounded-xl border bg-purple-50 border-purple-200 p-4"><div className="text-xs text-purple-700 font-bold">Value ₹500/mo</div><div className="font-black mt-1">Review Link Copy</div><div className="text-xs mt-1 text-muted-foreground">One-click copy Google review link + /r/slug link for QR</div></div>
              <div className="rounded-xl border bg-green-50 border-green-200 p-4"><div className="text-xs text-green-700 font-bold">Value ₹30,000</div><div className="font-black mt-1">1-Page Website Creator</div><div className="text-xs mt-1 text-muted-foreground">Create AI website + Review widget for Pro users - button in actions</div></div>
            </div>

            <div className="mt-6 max-w-md">
              <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" placeholder="Search business / slug" value={bizSearch} onChange={(e) => setBizSearch(e.target.value)} /></div>
            </div>

            <div className="mt-5 overflow-x-auto rounded-2xl border bg-card">
              {bizLoading ? <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin" /></div> : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Business</TableHead>
                      <TableHead>Place ID / Slug</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Lifetime Free</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bizRows.map((b: any) => {
                      const sub = Array.isArray(b.subscription) ? b.subscription[0] : b.subscription;
                      return (
                        <TableRow key={b.id}>
                          <TableCell>
                            <div className="font-bold">{b.business_name}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">{b.address}</div>
                            <div className="text-xs text-muted-foreground">{b.contact_number}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs font-mono bg-muted px-2 py-1 rounded">{b.slug}</div>
                            <div className="text-xs mt-1 text-muted-foreground truncate max-w-[200px]">{b.google_review_link || "No G link"}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={sub?.status === "active" ? "default" : "secondary"} className={sub?.status === "active" ? "bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] text-white" : ""}>{sub?.plan || "none"} / {sub?.status || "none"}</Badge>
                            <div className="text-xs mt-1 text-muted-foreground">Value ₹{sub?.plan === "business" ? "55k" : sub?.plan === "growth" ? "25k" : "8k"}/mo</div>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant={(b as any).is_lifetime_free ? "default" : "outline"} className={(b as any).is_lifetime_free ? "bg-yellow-400 text-black hover:bg-yellow-300" : ""} disabled={bizPending === b.id} onClick={() => toggleLifetime(b.id, (b as any).is_lifetime_free)}>
                              {bizPending === b.id ? <Loader2 className="h-4 w-4 animate-spin" /> : (b as any).is_lifetime_free ? <><Crown className="h-4 w-4" /> Lifetime Free ✓</> : "Set Lifetime Free"}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => copyReviewLink(b.slug, b.google_review_link)}><Copy className="h-3 w-3" /> Copy Link</Button>
                              <Button size="sm" variant="ghost" asChild><a href={`/r/${b.slug}`} target="_blank"><ExternalLink className="h-3 w-3" /> View /r/{b.slug}</a></Button>
                              <Button size="sm" variant="ghost" asChild><Link to={`/admin` as any}><Globe className="h-3 w-3" /> Create Website</Link></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

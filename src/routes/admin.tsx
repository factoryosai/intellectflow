import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Loader2,
  Search,
  ShieldAlert,
  Building2,
  Star,
  Users,
  CreditCard,
  ExternalLink,
  Phone,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { listBusinessesFull } from "@/lib/admin-users.functions";
import { PLAN_MAP } from "@/lib/brand";

export const Route = createFileRoute("/admin")({
  component: Admin,
});

const STATUSES = ["active", "trialing", "past_due", "cancelled"] as const;

function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  if (status === "active") return "default";
  if (status === "trialing") return "secondary";
  if (status === "past_due") return "destructive";
  return "outline";
}

function Admin() {
  const navigate = useNavigate();
  const { session, loading, isAdmin } = useAuth();
  const listFull = useServerFn(listBusinessesFull);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

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
      const matchSearch =
        !q ||
        (r.businessName ?? "").toLowerCase().includes(q) ||
        (r.email ?? "").toLowerCase().includes(q) ||
        (r.address ?? "").toLowerCase().includes(q) ||
        (r.contactNumber ?? "").toLowerCase().includes(q);
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
    const { error } = await supabase
      .from("subscriptions")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("business_id", businessId);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Status updated");
    refetch();
  };

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-5 text-center">
        <ShieldAlert className="h-10 w-10 text-destructive" />
        <h1 className="text-xl font-black">Admins only</h1>
        <p className="text-sm text-muted-foreground">
          You don't have access to this page.
        </p>
        <Button asChild variant="hero">
          <Link to="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <Logo />
            <Badge variant="secondary">Admin</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/admin-users">Manage users</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4" /> Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        <h1 className="text-2xl font-black tracking-tight">Admin dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Full overview of every business, owner, and subscription.
        </p>

        {/* Stat cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Building2} label="Businesses" value={stats.businesses} />
          <StatCard icon={Users} label="Active accounts" value={stats.active} />
          <StatCard icon={CreditCard} label="Paying" value={stats.paying} />
          <StatCard icon={Star} label="Reviews driven" value={stats.reviews} />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search name, email, phone or location"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All plans</SelectItem>
              <SelectItem value="starter">Starter</SelectItem>
              <SelectItem value="growth">Growth</SelectItem>
              <SelectItem value="pro">Business</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="trialing">Trialing</SelectItem>
              <SelectItem value="past_due">Past due</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="none">No subscription</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="mt-3 text-sm text-muted-foreground">
          {rows.length} of {data?.length ?? 0} shown
        </p>

        <div className="mt-3 overflow-x-auto rounded-2xl border border-border bg-card">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Google rating</TableHead>
                  <TableHead>Reviews driven</TableHead>
                  <TableHead>Review page</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => {
                  const reviewUrl = r.slug ? `${origin}/r/${r.slug}` : null;
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="align-top">
                        <div className="font-semibold">
                          {r.businessName || (
                            <span className="text-muted-foreground">— not set —</span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Joined {new Date(r.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {r.email || "—"}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {r.contactNumber || "—"}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-48 align-top text-xs text-muted-foreground">
                        {r.address || "—"}
                      </TableCell>
                      <TableCell className="align-top">
                        {r.rating != null ? (
                          <div className="flex items-center gap-1 text-sm font-semibold">
                            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                            {r.rating}
                            <span className="text-xs font-normal text-muted-foreground">
                              ({r.userRatingsTotal ?? 0})
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="align-top font-semibold">
                        {r.reviewCount}
                      </TableCell>
                      <TableCell className="align-top">
                        {reviewUrl ? (
                          <a
                            href={reviewUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            /r/{r.slug} <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="align-top">
                        {r.plan ? (
                          <Badge variant="outline">
                            {PLAN_MAP[r.plan as keyof typeof PLAN_MAP]?.name ?? r.plan}
                          </Badge>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="align-top">
                        <Select
                          value={r.status === "none" ? undefined : r.status}
                          onValueChange={(v) => changeStatus(r.id, v)}
                        >
                          <SelectTrigger className="h-8 w-32">
                            <SelectValue
                              placeholder={
                                <Badge variant="outline">none</Badge>
                              }
                            >
                              <Badge variant={statusVariant(r.status)}>{r.status}</Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                      No businesses match your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-3xl font-black text-gradient-brand">{value}</p>
    </div>
  );
}

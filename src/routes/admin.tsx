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
  MapPin,
  Globe,
  Check,
  Eye,
  Copy,
  TrendingUp,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { listBusinessesFull } from "@/lib/admin-users.functions";
import { PLAN_MAP } from "@/lib/brand";

export const Route = createFileRoute("/admin")({
  component: Admin,
});

const STATUSES = ["active", "trialing", "past_due", "cancelled"] as const;

type BusinessRow = Awaited<ReturnType<typeof listBusinessesFull>>[number];

function statusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "active") return "default";
  if (status === "trialing") return "secondary";
  if (status === "past_due") return "destructive";
  return "outline";
}

function planLabel(plan?: string | null) {
  if (!plan) return null;
  return PLAN_MAP[plan as keyof typeof PLAN_MAP]?.name ?? plan;
}

function Admin() {
  const navigate = useNavigate();
  const { session, loading, isAdmin } = useAuth();
  const listFull = useServerFn(listBusinessesFull);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<BusinessRow | null>(null);

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
      active: all.filter((r) => r.status === "active" || r.status === "trialing")
        .length,
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
    setSelected((prev) => (prev ? { ...prev, status } : prev));
  };

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const reviewUrlFor = (slug?: string | null) =>
    slug ? `${origin}/r/${slug}` : null;

  const copy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    toast.success(`${label} copied`);
  };

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
    <div className="min-h-screen bg-gradient-to-b from-muted/40 to-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Logo />
            <Badge variant="secondary" className="shrink-0">
              Admin
            </Badge>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/admin-users">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Manage users</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-5 sm:py-8">
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
          Admin dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Full overview of every business, owner, and subscription.
        </p>

        {/* Stat cards */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard icon={Building2} label="Businesses" value={stats.businesses} />
          <StatCard icon={Users} label="Active accounts" value={stats.active} />
          <StatCard icon={CreditCard} label="Paying" value={stats.paying} />
          <StatCard icon={TrendingUp} label="Reviews driven" value={stats.reviews} />
        </div>

        {/* Quick actions */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button
            onClick={() => refetch()}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition hover:border-primary/50 hover:shadow-md"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-brand text-primary-foreground">
              <Loader2 className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold">Refresh</span>
              <span className="block truncate text-xs text-muted-foreground">Reload latest data</span>
            </span>
          </button>
          <Link
            to="/admin-users"
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition hover:border-primary/50 hover:shadow-md"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-brand text-primary-foreground">
              <Users className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold">Manage users</span>
              <span className="block truncate text-xs text-muted-foreground">Roles &amp; access</span>
            </span>
          </Link>
          <button
            onClick={() => {
              setStatusFilter("active");
              setPlanFilter("all");
            }}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition hover:border-primary/50 hover:shadow-md"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-brand text-primary-foreground">
              <CreditCard className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold">Paying only</span>
              <span className="block truncate text-xs text-muted-foreground">Filter active subs</span>
            </span>
          </button>
          <button
            onClick={() => {
              setStatusFilter("trialing");
              setPlanFilter("all");
            }}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition hover:border-primary/50 hover:shadow-md"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-brand text-primary-foreground">
              <Star className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold">Trials</span>
              <span className="block truncate text-xs text-muted-foreground">Filter trialing</span>
            </span>
          </button>
        </div>

        {/* Filters */}
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
          <div className="grid grid-cols-2 gap-3 sm:flex">
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
        </div>

        <p className="mt-3 text-sm text-muted-foreground">
          {rows.length} of {data?.length ?? 0} shown
        </p>

        {isLoading ? (
          <div className="mt-4 flex items-center justify-center rounded-2xl border border-border bg-card py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : rows.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-border bg-card py-16 text-center text-muted-foreground">
            No businesses match your filters.
          </div>
        ) : (
          <>
            {/* Mobile: cards */}
            <div className="mt-4 grid gap-3 lg:hidden">
              {rows.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className="rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition hover:border-primary/50 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-bold">
                        {r.businessName || (
                          <span className="text-muted-foreground">— not set —</span>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                        <Mail className="h-3 w-3 shrink-0" />
                        <span className="truncate">{r.email || "—"}</span>
                      </div>
                    </div>
                    <Badge variant={statusVariant(r.status)} className="shrink-0">
                      {r.status}
                    </Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    {planLabel(r.plan) && (
                      <Badge variant="outline">{planLabel(r.plan)}</Badge>
                    )}
                    {r.rating != null && (
                      <span className="inline-flex items-center gap-1 font-semibold">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        {r.rating}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <TrendingUp className="h-3.5 w-3.5" />
                      {r.reviewCount} reviews
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-border bg-card lg:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Google rating</TableHead>
                    <TableHead>Reviews</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="align-top">
                        <div className="font-semibold">
                          {r.businessName || (
                            <span className="text-muted-foreground">
                              — not set —
                            </span>
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
                        {planLabel(r.plan) ? (
                          <Badge variant="outline">{planLabel(r.plan)}</Badge>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="align-top">
                        <Badge variant={statusVariant(r.status)}>{r.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right align-top">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelected(r)}
                        >
                          <Eye className="h-4 w-4" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </main>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-black">
                  {selected.businessName || "Business details"}
                </DialogTitle>
                <DialogDescription>
                  Joined {new Date(selected.createdAt).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5">
                {/* Subscription */}
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={statusVariant(selected.status)}>
                    {selected.status}
                  </Badge>
                  {planLabel(selected.plan) && (
                    <Badge variant="outline">
                      {planLabel(selected.plan)} plan
                    </Badge>
                  )}
                  {selected.currentPeriodEnd && (
                    <span className="text-xs text-muted-foreground">
                      Renews{" "}
                      {new Date(
                        selected.currentPeriodEnd,
                      ).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {/* Owner + contact */}
                <div className="grid gap-3 rounded-xl border border-border bg-muted/30 p-4 sm:grid-cols-2">
                  <DetailRow icon={Mail} label="Email" value={selected.email} />
                  <DetailRow
                    icon={Phone}
                    label="Contact"
                    value={selected.contactNumber}
                  />
                  <DetailRow
                    icon={MapPin}
                    label="Address"
                    value={selected.address}
                    className="sm:col-span-2"
                  />
                  <DetailRow
                    icon={Globe}
                    label="Website"
                    value={selected.website}
                    href={selected.website ?? undefined}
                  />
                  <DetailRow
                    icon={Star}
                    label="Google rating"
                    value={
                      selected.rating != null
                        ? `${selected.rating} (${selected.userRatingsTotal ?? 0} reviews)`
                        : null
                    }
                  />
                </div>

                {selected.description && (
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Description
                    </p>
                    <p className="text-sm">{selected.description}</p>
                  </div>
                )}

                {/* Review page link */}
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Review page
                  </p>
                  {reviewUrlFor(selected.slug) ? (
                    <div className="flex items-center gap-2">
                      <code className="flex-1 truncate rounded-lg bg-muted px-3 py-2 text-xs">
                        {reviewUrlFor(selected.slug)}
                      </code>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          copy(reviewUrlFor(selected.slug)!, "Review link")
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" asChild>
                        <a
                          href={reviewUrlFor(selected.slug)!}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not set up yet.</p>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border p-4">
                    <p className="text-xs text-muted-foreground">Reviews driven</p>
                    <p className="text-2xl font-black text-gradient-brand">
                      {selected.reviewCount}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border p-4">
                    <p className="text-xs text-muted-foreground">Google rating</p>
                    <p className="text-2xl font-black text-gradient-brand">
                      {selected.rating ?? "—"}
                    </p>
                  </div>
                </div>

                {/* Plan features */}
                {selected.plan &&
                  PLAN_MAP[selected.plan as keyof typeof PLAN_MAP] && (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {planLabel(selected.plan)} plan features
                      </p>
                      <ul className="grid gap-1.5 sm:grid-cols-2">
                        {PLAN_MAP[
                          selected.plan as keyof typeof PLAN_MAP
                        ].features.map((f) => (
                          <li
                            key={f}
                            className="flex items-start gap-2 text-sm"
                          >
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Change status */}
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Change subscription status
                  </p>
                  <Select
                    value={selected.status === "none" ? undefined : selected.status}
                    onValueChange={(v) => changeStatus(selected.id, v)}
                  >
                    <SelectTrigger className="w-full sm:w-56">
                      <SelectValue placeholder="Set status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
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
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-brand text-white">
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-xs font-medium sm:text-sm">{label}</span>
      </div>
      <p className="text-2xl font-black text-gradient-brand sm:text-3xl">{value}</p>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  href,
  className,
}: {
  icon: typeof Mail;
  label: string;
  value?: string | null;
  href?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-0.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </p>
      {value ? (
        href ? (
          <a
            href={href.startsWith("http") ? href : `https://${href}`}
            target="_blank"
            rel="noreferrer"
            className="break-words text-sm text-primary hover:underline"
          >
            {value}
          </a>
        ) : (
          <p className="break-words text-sm">{value}</p>
        )
      ) : (
        <p className="text-sm text-muted-foreground">—</p>
      )}
    </div>
  );
}

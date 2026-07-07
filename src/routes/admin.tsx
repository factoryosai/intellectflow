import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Loader2, Search, ShieldAlert } from "lucide-react";
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

export const Route = createFileRoute("/admin")({
  component: Admin,
});

interface AdminRow {
  id: string;
  business_name: string | null;
  address: string | null;
  contact_number: string | null;
  google_review_link: string | null;
  created_at: string;
  plan: string | null;
  status: string;
  subId: string | null;
}

const STATUSES = ["active", "past_due", "cancelled"] as const;

function Admin() {
  const navigate = useNavigate();
  const { session, loading, isAdmin } = useAuth();
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-businesses"],
    enabled: !!session && isAdmin,
    queryFn: async () => {
      const { data: businesses, error } = await supabase
        .from("businesses")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const { data: subs } = await supabase
        .from("subscriptions")
        .select("id, business_id, plan, status");
      const subMap = new Map(
        (subs ?? []).map((s) => [s.business_id, s]),
      );
      return (businesses ?? []).map((b): AdminRow => {
        const s = subMap.get(b.id);
        return {
          id: b.id,
          business_name: b.business_name,
          address: b.address,
          contact_number: b.contact_number,
          google_review_link: b.google_review_link,
          created_at: b.created_at,
          plan: s?.plan ?? null,
          status: s?.status ?? "none",
          subId: s?.id ?? null,
        };
      });
    },
  });

  const rows = useMemo(() => {
    return (data ?? []).filter((r) => {
      const matchSearch =
        !search ||
        (r.business_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (r.address ?? "").toLowerCase().includes(search.toLowerCase());
      const matchPlan = planFilter === "all" || r.plan === planFilter;
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      return matchSearch && matchPlan && matchStatus;
    });
  }, [data, search, planFilter, statusFilter]);

  const changeStatus = async (row: AdminRow, status: string) => {
    if (!row.subId) {
      toast.error("This business has no subscription record to update.");
      return;
    }
    const { error } = await supabase
      .from("subscriptions")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", row.subId);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Status updated");
    refetch();
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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <Logo />
            <Badge variant="secondary">Admin</Badge>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        <h1 className="text-2xl font-black tracking-tight">All businesses</h1>
        <p className="text-sm text-muted-foreground">
          {rows.length} of {data?.length ?? 0} shown
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by name or location"
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
              <SelectItem value="pro">Pro</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="past_due">Past due</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="none">No subscription</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-border bg-card">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Signed up</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-semibold">
                      {r.business_name || <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="max-w-48 truncate text-muted-foreground">
                      {r.address || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.contact_number || "—"}
                    </TableCell>
                    <TableCell className="capitalize">{r.plan || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={r.status}
                        onValueChange={(v) => changeStatus(r, v)}
                        disabled={!r.subId}
                      >
                        <SelectTrigger className="h-8 w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {r.status === "none" && (
                            <SelectItem value="none" disabled>
                              none
                            </SelectItem>
                          )}
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
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

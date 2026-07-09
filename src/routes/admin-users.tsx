import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Loader2, Search, ShieldAlert, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/lib/auth";
import { listUsers, setAdminRole } from "@/lib/admin-users.functions";

export const Route = createFileRoute("/admin-users")({
  component: AdminUsers,
});

function AdminUsers() {
  const navigate = useNavigate();
  const { session, user, loading, isAdmin } = useAuth();
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState<string | null>(null);

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

  const rows = useMemo(() => {
    return (data ?? []).filter(
      (u) => !search || (u.email ?? "").toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  const toggleAdmin = async (userId: string, makeAdmin: boolean) => {
    setPending(userId);
    try {
      await changeRole({ data: { userId, makeAdmin } });
      toast.success(makeAdmin ? "Admin access granted" : "Admin access revoked");
      await refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update role");
    } finally {
      setPending(null);
    }
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
            <Badge variant="secondary">Users</Badge>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin">
              <ArrowLeft className="h-4 w-4" /> Admin
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        <h1 className="text-2xl font-black tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">
          {rows.length} of {data?.length ?? 0} shown
        </p>

        <div className="mt-5 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
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
                  <TableHead>Email</TableHead>
                  <TableHead>Signed up</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((u) => {
                  const isSelf = u.id === user?.id;
                  return (
                    <TableRow key={u.id}>
                      <TableCell className="font-semibold">
                        {u.email || <span className="text-muted-foreground">—</span>}
                        {isSelf && (
                          <span className="ml-2 text-xs text-muted-foreground">(you)</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(u.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {u.isAdmin ? (
                          <Badge className="gap-1">
                            <ShieldCheck className="h-3 w-3" /> Admin
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Owner</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant={u.isAdmin ? "outline" : "hero"}
                          disabled={pending === u.id || (isSelf && u.isAdmin)}
                          onClick={() => toggleAdmin(u.id, !u.isAdmin)}
                        >
                          {pending === u.id && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          )}
                          {u.isAdmin ? "Revoke admin" : "Make admin"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                      No users match your search.
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

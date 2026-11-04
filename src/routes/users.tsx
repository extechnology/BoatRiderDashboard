import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, User, RefreshCw } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ExportToolbar } from "@/components/ExportToolbar";
import { useUsersQuery } from "@/features/users/hooks.users";
import { type DateFilter, filterByDate } from "@/lib/export-utils";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { TableRowSkeleton } from "@/components/ui/skeleton-loaders";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/users")({
  component: UsersPage,
});

function UsersPage() {
  const { data: usersData, isLoading, isError, error, refetch, isRefetching } = useUsersQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter | "all">("all");
  const [customDate, setCustomDate] = useState("");

  const allUsers = usersData?.results ?? [];

  const filteredUsers = allUsers.filter((u: any) =>
    (u.username?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (u.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  ).filter((u: any) => {
    if (dateFilter === "all") return true;
    const filtered = filterByDate([u], dateFilter, "date_joined", customDate);
    return filtered.length > 0;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Users</h1>
            <p className="text-sm text-muted-foreground">{filteredUsers.length} total users found</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isRefetching || isLoading}
              className="gap-1.5 text-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by username or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-4 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:w-64"
              />
            </div>
            <div className="flex items-center gap-1 rounded-md border border-border bg-secondary/50 p-0.5">
              {(["all", "today", "this-month", "custom"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setDateFilter(f)}
                  className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                    dateFilter === f
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f === "all" ? "All" : f === "today" ? "Today" : f === "this-month" ? "This Month" : "Custom"}
                </button>
              ))}
            </div>
            {dateFilter === "custom" && (
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            )}
            <ExportToolbar data={filteredUsers} filename="users" dateField="date_joined" showFilter={false} />
          </div>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="rounded-lg border border-border bg-card">
            <TableRowSkeleton cols={6} rows={6} />
          </div>
        )}

        {/* Error Fallback */}
        {!isLoading && isError && (
          <ErrorState
            error={error}
            title="Unable to Load Users"
            onRetry={() => refetch()}
            isRetrying={isRefetching}
          />
        )}

        {/* Empty State */}
        {!isLoading && !isError && allUsers.length === 0 && (
          <EmptyState
            icon={User}
            title="No Users Registered"
            description="There are currently no registered users in the database."
          />
        )}

        {/* Filtered Empty State */}
        {!isLoading && !isError && allUsers.length > 0 && filteredUsers.length === 0 && (
          <EmptyState
            icon={Search}
            title="No Users Found"
            description={`No users matched your search query "${searchQuery}".`}
            actionText="Clear Search"
            onAction={() => {
              setSearchQuery("");
              setDateFilter("all");
            }}
          />
        )}

        {/* Real Table */}
        {!isLoading && !isError && filteredUsers.length > 0 && (
          <div className="rounded-lg border border-border bg-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Phone</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                  <th className="px-5 py-3 font-medium text-center">Orders</th>
                  <th className="px-5 py-3 font-medium">Spent</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u: any) => (
                  <tr key={u.unique_id} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <User className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-foreground">{u.username}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-5 py-3 text-muted-foreground">{u.phone || "N/A"}</td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {new Date(u.date_joined).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3 text-center font-medium text-foreground">{u.total_orders}</td>
                    <td className="px-5 py-3 font-semibold text-foreground">
                      ₹{Number(u.total_amount_spend || 0).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

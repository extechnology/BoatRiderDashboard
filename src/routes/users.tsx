import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, User } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ExportToolbar } from "@/components/ExportToolbar";
import { useUsersQuery } from "@/features/users/hooks.users";

export const Route = createFileRoute("/users")({
  component: UsersPage,
});

function UsersPage() {
  const { data: usersData, isLoading } = useUsersQuery();
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading users...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const allUsers = usersData?.results ?? [];

  const filteredUsers = allUsers.filter((u: any) =>
    (u.username?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (u.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Users</h1>
            <p className="text-sm text-muted-foreground">{filteredUsers.length} total users found</p>
          </div>
          <div className="flex items-center gap-3">
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
            <ExportToolbar data={filteredUsers} filename="users" />
          </div>
        </div>

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
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u: any) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
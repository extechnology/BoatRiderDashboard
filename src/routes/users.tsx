import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ExportToolbar } from "@/components/ExportToolbar";
import { users } from "@/lib/mock-data";

export const Route = createFileRoute("/users")({
  component: UsersPage,
});

function UsersPage() {
  const exportData = users.map((u) => ({
    ...u,
    date: u.joined,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Users</h1>
            <p className="text-sm text-muted-foreground">{users.length} registered users</p>
          </div>
          <ExportToolbar data={exportData as any} filename="users" />
        </div>
        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium">Orders</th>
                <th className="px-5 py-3 font-medium">Total Spent</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border/50 last:border-0">
                  <td className="px-5 py-3 text-foreground">{u.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-5 py-3 text-muted-foreground">{u.joined}</td>
                  <td className="px-5 py-3 text-foreground">{u.orders}</td>
                  <td className="px-5 py-3 text-foreground">${u.totalSpent.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      u.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                    }`}>{u.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
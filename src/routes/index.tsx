import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { ExportToolbar } from "@/components/ExportToolbar";
import { orders, salesData } from "@/lib/mock-data";
import { DollarSign, ShoppingCart, Package, Users, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const totalSales = salesData.reduce((s, d) => s + d.sales, 0);
  const totalOrders = salesData.reduce((s, d) => s + d.orders, 0);
  const recentOrders = orders.slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back to CycleHub</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={DollarSign} title="Total Revenue" value={`$${(totalSales / 1000).toFixed(0)}K`} change="+12.5% from last month" changeType="positive" />
          <StatCard icon={ShoppingCart} title="Orders" value={String(totalOrders)} change="+8.2% from last month" changeType="positive" />
          <StatCard icon={Package} title="Products" value="8" change="2 low stock" changeType="negative" />
          <StatCard icon={Users} title="Customers" value="6" change="+3 this month" changeType="positive" />
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="mb-4 text-sm font-medium text-foreground">Revenue Overview</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.75 0.15 185)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.75 0.15 185)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 260)" />
                <XAxis dataKey="month" stroke="oklch(0.60 0.02 260)" fontSize={12} />
                <YAxis stroke="oklch(0.60 0.02 260)" fontSize={12} tickFormatter={(v) => `$${v / 1000}K`} />
                <Tooltip contentStyle={{ backgroundColor: "oklch(0.17 0.02 260)", border: "1px solid oklch(0.25 0.02 260)", borderRadius: 8, color: "oklch(0.93 0.01 260)" }} />
                <Area type="monotone" dataKey="sales" stroke="oklch(0.75 0.15 185)" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="mb-4 text-sm font-medium text-foreground">Orders per Month</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 260)" />
                <XAxis dataKey="month" stroke="oklch(0.60 0.02 260)" fontSize={12} />
                <YAxis stroke="oklch(0.60 0.02 260)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "oklch(0.17 0.02 260)", border: "1px solid oklch(0.25 0.02 260)", borderRadius: 8, color: "oklch(0.93 0.01 260)" }} />
                <Bar dataKey="orders" fill="oklch(0.70 0.18 280)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="rounded-lg border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
            <h3 className="text-sm font-medium text-foreground">Recent Orders</h3>
            <ExportToolbar data={orders as any} filename="orders" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-border/50 last:border-0">
                    <td className="px-5 py-3 font-mono text-foreground">{o.id}</td>
                    <td className="px-5 py-3 text-foreground">{o.customer}</td>
                    <td className="px-5 py-3 text-muted-foreground">{o.product}</td>
                    <td className="px-5 py-3 text-foreground">${o.amount.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        o.status === "completed" ? "bg-success/10 text-success" :
                        o.status === "shipped" ? "bg-primary/10 text-primary" :
                        o.status === "pending" ? "bg-warning/10 text-warning" :
                        "bg-destructive/10 text-destructive"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

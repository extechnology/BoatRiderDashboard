import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { IndianRupee, ShoppingCart, Package, Users } from "lucide-react";
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
import { useStatisticsQuery, useRecentOrdersQuery } from "@/features/dashboard/hooks.dashboard";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { MetricCardSkeleton } from "@/components/ui/skeleton-loaders";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const {
    data: statisticsData,
    isLoading: isStatsLoading,
    isError: isStatsError,
    error: statsError,
    refetch: refetchStats,
  } = useStatisticsQuery();

  const {
    data: recentOrdersData,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    error: ordersError,
    refetch: refetchOrders,
  } = useRecentOrdersQuery();

  const isLoading = isStatsLoading || isOrdersLoading;

  if (isStatsError && isOrdersError) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
            <p className="text-sm text-muted-foreground">Welcome back to BoatRider Admin</p>
          </div>
          <ErrorState
            title="Failed to Load Dashboard Metrics"
            message="Unable to communicate with the Boatrider backend server. Please verify your connection or staff session."
            error={statsError || ordersError}
            onRetry={() => {
              refetchStats();
              refetchOrders();
            }}
          />
        </div>
      </DashboardLayout>
    );
  }

  const stats = statisticsData ?? {};
  const recentOrders = recentOrdersData?.slice(0, 5) ?? [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground">Welcome back to BoatRider Admin</p>
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={IndianRupee}
              title="Total Revenue"
              value={`₹${(stats.total_revenue ?? 0).toLocaleString("en-IN")}`}
              change="Overall revenue generated"
              changeType="positive"
            />

            <StatCard
              icon={ShoppingCart}
              title="Total Orders"
              value={String(stats.total_orders ?? 0)}
              change="Orders received"
              changeType="positive"
            />

            <StatCard
              icon={Package}
              title="Products"
              value={String(stats.total_products ?? 0)}
              change="Products listed"
              changeType="positive"
            />

            <StatCard
              icon={Users}
              title="Customers"
              value={String(stats.total_users ?? 0)}
              change="Registered users"
              changeType="positive"
            />
          </div>
        )}

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Revenue Chart */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="mb-4 text-sm font-medium text-foreground">Monthly Revenue</h3>

            {isLoading ? (
              <div className="flex h-60 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : (stats.revenue_overview?.length ?? 0) === 0 ? (
              <div className="flex h-60 items-center justify-center text-sm text-muted-foreground">
                No revenue records available for chart.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={stats.revenue_overview ?? []}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.75 0.15 185)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.75 0.15 185)" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 260)" />

                  <XAxis dataKey="name" stroke="oklch(0.60 0.02 260)" fontSize={12} />

                  <YAxis
                    stroke="oklch(0.60 0.02 260)"
                    fontSize={12}
                    tickFormatter={(v) => `₹${v / 1000}K`}
                  />

                  <Tooltip
                    formatter={(value: any) => `₹${Number(value).toLocaleString("en-IN")}`}
                    contentStyle={{
                      backgroundColor: "oklch(0.17 0.02 260)",
                      border: "1px solid oklch(0.25 0.02 260)",
                      borderRadius: 8,
                      color: "oklch(0.93 0.01 260)",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="oklch(0.75 0.15 185)"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Orders Chart */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="mb-4 text-sm font-medium text-foreground">Monthly Orders</h3>

            {isLoading ? (
              <div className="flex h-60 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : (stats.orders_per_month?.length ?? 0) === 0 ? (
              <div className="flex h-60 items-center justify-center text-sm text-muted-foreground">
                No monthly order statistics found.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.orders_per_month ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 260)" />

                  <XAxis dataKey="name" stroke="oklch(0.60 0.02 260)" fontSize={12} />

                  <YAxis stroke="oklch(0.60 0.02 260)" fontSize={12} />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.17 0.02 260)",
                      border: "1px solid oklch(0.25 0.02 260)",
                      borderRadius: 8,
                      color: "oklch(0.93 0.01 260)",
                    }}
                  />

                  <Bar dataKey="orders" fill="oklch(0.70 0.18 280)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h3 className="text-sm font-medium text-foreground">Recent Orders</h3>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Loading recent orders...</p>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  title="No recent orders found"
                  description="When customers place orders, they will appear here in real-time."
                />
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Order ID</th>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Product</th>
                    <th className="px-5 py-3 font-medium">Amount</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o: any) => (
                    <tr key={o.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30">
                      <td className="px-5 py-3 font-mono text-xs text-foreground">
                        {o.order_id?.split("-")[1] ?? o.id}
                      </td>
                      <td className="px-5 py-3 font-medium text-foreground">{o.customer}</td>
                      <td className="px-5 py-3 text-muted-foreground">{o.product}</td>
                      <td className="px-5 py-3 text-foreground font-semibold">
                        ₹{Number(o.amount).toLocaleString("en-IN")}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            o.status?.toLowerCase() === "completed"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : o.status?.toLowerCase() === "processing"
                                ? "bg-primary/10 text-primary"
                                : o.status?.toLowerCase() === "pending"
                                  ? "bg-amber-500/10 text-amber-600"
                                  : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {new Date(o.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

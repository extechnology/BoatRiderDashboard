import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ExportToolbar } from "@/components/ExportToolbar";
import { orders } from "@/lib/mock-data";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Orders</h1>
            <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
          </div>
          <ExportToolbar data={orders as any} filename="orders" />
        </div>
        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-border/50 last:border-0">
                  <td className="px-5 py-3 font-mono text-foreground">{o.id}</td>
                  <td className="px-5 py-3 text-foreground">{o.customer}</td>
                  <td className="px-5 py-3 text-muted-foreground">{o.email}</td>
                  <td className="px-5 py-3 text-muted-foreground">{o.product}</td>
                  <td className="px-5 py-3 text-foreground">${o.amount.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      o.status === "completed" ? "bg-success/10 text-success" :
                      o.status === "shipped" ? "bg-primary/10 text-primary" :
                      o.status === "pending" ? "bg-warning/10 text-warning" :
                      "bg-destructive/10 text-destructive"
                    }`}>{o.status}</span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
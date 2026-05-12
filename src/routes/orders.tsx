import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ExternalLink, Package, Clock, CreditCard, Download, User, MapPin } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ExportToolbar } from "@/components/ExportToolbar";
import { useOrders } from "@/features/orders/hooks.orders";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useOrderStatusUpdate } from "@/features/orders/hooks.orders";
import { toast } from "sonner";
import { type DateFilter, filterByDate } from "@/lib/export-utils";

const orderStatuses = ["pending", "processing", "shipped", "delivered", "cancelled", "failed"];

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  const { data: ordersData, isLoading } = useOrders();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState<DateFilter | "all">("all");
  const [customDate, setCustomDate] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const { mutate: updateStatus, isPending: isUpdating } = useOrderStatusUpdate();

  const handleStatusUpdate = (newStatus: string) => {
    if (!selectedOrder) return;
    updateStatus(
      { id: selectedOrder.unique_id, status: newStatus },
      {
        onSuccess: () => {
          toast.success(`Order status updated to ${newStatus}`);
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        },
        onError: () => {
          toast.error("Failed to update order status");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading orders...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const allOrders = ordersData?.results ?? [];

  const filteredOrders = allOrders.filter((o: any) => {
    const searchLower = searchQuery.toLowerCase().trim();
    if (!searchLower) return true;

    const shortId = o.unique_id.split("-")[1] || "";
    const amountStr = o.total_amount?.toString() || "";
    const cleanSearch = searchLower.replace(/[₹,]/g, "");

    const matchesSearch =
      o.unique_id.toLowerCase().includes(searchLower) ||
      shortId.toLowerCase().includes(searchLower) ||
      o.status.toLowerCase().includes(searchLower) ||
      (o.user?.toString().toLowerCase() || "").includes(searchLower) ||
      amountStr.includes(cleanSearch) ||
      (o.all_products?.some((p: any) => 
        (p.bike?.name || "").toLowerCase().includes(searchLower) ||
        (p.accessory?.name || "").toLowerCase().includes(searchLower) ||
        (p.bike?.brand || "").toLowerCase().includes(searchLower) ||
        (p.accessory?.brand || "").toLowerCase().includes(searchLower)
      ));
      
    return matchesSearch;
  }).filter((o: any) => {
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    if (!matchesStatus) return false;

    if (dateFilter === "all") return true;
    const filtered = filterByDate([o], dateFilter, "created_at", customDate);
    return filtered.length > 0;
  });

  const statuses = ["All", ...orderStatuses.map(s => s.charAt(0).toUpperCase() + s.slice(1))];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Orders</h1>
            <p className="text-sm text-muted-foreground">{filteredOrders.length} total orders found</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by ID, status, customer or product..."
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
            <ExportToolbar data={filteredOrders} filename="orders" dateField="created_at" showFilter={false} />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                statusFilter === status
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-5 py-3 font-medium">Order ID</th>
                <th className="px-5 py-3 font-medium">Items</th>
                <th className="px-5 py-3 font-medium">Products</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                    No orders found matching your search.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o: any) => (
                  <tr
                    key={o.id}
                    onClick={() => setSelectedOrder(o)}
                    className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3 font-mono text-xs text-foreground">
                      {o.unique_id.split("-")[1] || o.unique_id}
                    </td>
                    <td className="px-5 py-3 text-foreground">{o.total_items}</td>
                    <td className="px-5 py-3 text-muted-foreground">
                      <div className="max-w-[200px] truncate">
                        {o.all_products?.[0]?.bike?.name || o.all_products?.[0]?.accessory?.name || "Order Item"}
                        {(o.all_products?.length ?? 0) > 1 && ` +${o.all_products.length - 1} more`}
                      </div>
                    </td>
                    <td className="px-5 py-3 font-medium text-foreground">
                      ₹{Number(o.total_amount).toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        o.status?.toLowerCase() === "delivered" || o.status?.toLowerCase() === "completed" ? "bg-success/10 text-success" :
                        o.status?.toLowerCase() === "processing" ? "bg-primary/10 text-primary" :
                        o.status?.toLowerCase() === "shipped" ? "bg-info/10 text-info" :
                        o.status?.toLowerCase() === "pending" ? "bg-warning/10 text-warning" :
                        "bg-destructive/10 text-destructive"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {new Date(o.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Sheet open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-xl">Order Details</SheetTitle>
            <SheetDescription className="font-mono text-xs">
              {selectedOrder?.unique_id}
            </SheetDescription>
          </SheetHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Status Section */}
              <div className="flex flex-col gap-3 rounded-lg border border-border p-4 bg-secondary/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="text-sm font-semibold text-foreground capitalize">{selectedOrder.status}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                    selectedOrder.payment_status ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                  }`}>
                    {selectedOrder.payment_status ? "PAID" : "UNPAID"}
                  </span>
                </div>
                
                <div className="mt-2 space-y-2">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Update Order Status</p>
                  <div className="flex flex-wrap gap-1.5">
                    {orderStatuses.map((status) => (
                      <button
                        key={status}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(status);
                        }}
                        disabled={selectedOrder.status === status || isUpdating}
                        className={`rounded-md px-2 py-1 text-[10px] font-medium transition-all ${
                          selectedOrder.status === status
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-background border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                        } disabled:opacity-50`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Package className="h-4 w-4" />
                  Order Items ({selectedOrder.total_items})
                </h3>
                <div className="space-y-3">
                  {selectedOrder.all_products?.map((item: any) => (
                    <div key={item.id} className="flex gap-4 rounded-lg border border-border/50 p-3">
                      <div className="h-16 w-16 overflow-hidden rounded-md bg-secondary/20 flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt="product" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                            <Package className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {item.bike?.name || item.accessory?.name || "Product"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.bike?.brand || item.accessory?.brand} {item.size && `· Size: ${item.size}`} {item.color && `· ${item.color}`}
                        </p>
                        <div className="mt-1 flex items-center justify-between">
                          <p className="text-xs font-semibold text-foreground">
                            ₹{Number(item.price).toLocaleString("en-IN")} <span className="font-normal text-muted-foreground">x {item.quantity}</span>
                          </p>
                          <p className="text-sm font-bold text-primary">
                            ₹{Number(item.subtotal).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer & Payment Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <User className="h-3 w-3" /> Customer ID
                  </p>
                  <p className="text-sm font-semibold text-foreground">{selectedOrder.user}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <CreditCard className="h-3 w-3" /> Total Amount
                  </p>
                  <p className="text-sm font-bold text-foreground">₹{Number(selectedOrder.total_amount).toLocaleString("en-IN")}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 space-y-3">
                {selectedOrder.invoice && (
                  <a
                    href={selectedOrder.invoice}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download Invoice
                  </a>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                  <Clock className="h-3 w-3" />
                  Ordered on {new Date(selectedOrder.created_at).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short"
                  })}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}

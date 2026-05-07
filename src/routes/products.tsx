import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { products } from "@/lib/mock-data";
import { Search, Bike } from "lucide-react";

export const Route = createFileRoute("/products")({
  component: ProductsPage,
});

function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((p) => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Products</h1>
            <p className="text-sm text-muted-foreground">{filteredProducts.length} bikes in catalog</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-4 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:w-64"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((p) => (
            <div key={p.id} className="rounded-lg border border-border bg-card p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{p.name}</h3>
                  <p className="text-xs text-muted-foreground">{p.brand} · {p.model}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Bike className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-md bg-secondary/50 px-2.5 py-1.5">
                  <span className="text-muted-foreground">Category</span>
                  <p className="font-medium text-foreground">{p.category}</p>
                </div>
                <div className="rounded-md bg-secondary/50 px-2.5 py-1.5">
                  <span className="text-muted-foreground">Price</span>
                  <p className="font-medium text-foreground">₹{p.price.toLocaleString()}</p>
                </div>
                <div className="rounded-md bg-secondary/50 px-2.5 py-1.5">
                  <span className="text-muted-foreground">Suspension</span>
                  <p className="font-medium text-foreground">{p.suspension}</p>
                </div>
                <div className="rounded-md bg-secondary/50 px-2.5 py-1.5">
                  <span className="text-muted-foreground">Frame</span>
                  <p className="font-medium text-foreground">{p.frameMaterial}</p>
                </div>
                <div className="rounded-md bg-secondary/50 px-2.5 py-1.5">
                  <span className="text-muted-foreground">Wheel</span>
                  <p className="font-medium text-foreground">{p.wheelSize}</p>
                </div>
                <div className="rounded-md bg-secondary/50 px-2.5 py-1.5">
                  <span className="text-muted-foreground">Gears</span>
                  <p className="font-medium text-foreground">{p.gears}-speed</p>
                </div>
              </div>
              <div>
                <p className="mb-1.5 text-xs text-muted-foreground">Accessories</p>
                <div className="flex flex-wrap gap-1">
                  {p.accessories.map((a) => (
                    <span key={a} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{a}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className={`text-xs font-medium ${p.stock < 6 ? "text-destructive" : "text-success"}`}>
                  {p.stock} in stock
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
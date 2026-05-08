import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Search, Bike } from "lucide-react";
import { useProductsQuery } from "@/features/products/hooks.products";

export const Route = createFileRoute("/products")({
  component: ProductsPage,
});

function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: productsData, isLoading } = useProductsQuery();

  const results = productsData?.results || [];

  const filteredProducts = results.filter((p: any) => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Bikes</h1>
            <p className="text-sm text-muted-foreground">{filteredProducts.length} bikes in catalog</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search bikes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-4 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:w-64"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p: any) => (
                <div key={p.name + p.brand} className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-md">
                  <div className="aspect-[16/10] w-full overflow-hidden bg-muted">
                    {p.image_url ? (
                      <img 
                        src={p.image_url} 
                        alt={p.name} 
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Bike className="h-12 w-12 text-muted-foreground/20" />
                      </div>
                    )}
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-foreground leading-tight">{p.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{p.brand} · {p.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">₹{Number(p.price).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Material</p>
                        <p className="text-xs font-medium text-foreground">{Array.isArray(p.material) ? p.material.join(", ") : p.material}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Wheel Size</p>
                        <p className="text-xs font-medium text-foreground">{Array.isArray(p.wheel_size) ? p.wheel_size.join(", ") : p.wheel_size}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Suspension</p>
                        <p className="text-xs font-medium text-foreground">{Array.isArray(p.suspension) ? p.suspension.join(", ") : p.suspension}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Status</p>
                        <span className={`text-xs font-bold ${p.stock < 5 ? "text-destructive" : "text-success"}`}>
                          {p.stock} in stock
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4">
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                <Bike className="mb-4 h-12 w-12 text-muted-foreground/20" />
                <h3 className="text-lg font-medium text-foreground">No bikes found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your search query.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}


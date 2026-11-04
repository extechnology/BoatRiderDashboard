import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Search, Bike, RefreshCw } from "lucide-react";
import { useProductsQuery } from "@/features/products/hooks.products";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/products")({
  component: ProductsPage,
});

function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: productsData, isLoading, isError, error, refetch, isRefetching } = useProductsQuery();

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
          <div className="flex items-center gap-2">
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
                placeholder="Search bikes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-4 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-4 animate-pulse">
                <div className="aspect-[16/10] w-full rounded-lg bg-muted/70" />
                <div className="h-4 w-2/3 rounded bg-muted/80" />
                <div className="h-3 w-1/3 rounded bg-muted/60" />
                <div className="h-10 w-full rounded bg-muted/40" />
              </div>
            ))}
          </div>
        )}

        {/* Network or Server Error Fallback */}
        {!isLoading && isError && (
          <ErrorState
            error={error}
            title="Unable to Load Bikes Catalog"
            onRetry={() => refetch()}
            isRetrying={isRefetching}
          />
        )}

        {/* Empty Catalog */}
        {!isLoading && !isError && results.length === 0 && (
          <EmptyState
            icon={Bike}
            title="No Bikes in Catalog"
            description="There are currently no bikes available in the product catalog."
          />
        )}

        {/* Filter / Search yielded 0 results */}
        {!isLoading && !isError && results.length > 0 && filteredProducts.length === 0 && (
          <EmptyState
            icon={Search}
            title="No Bikes Found"
            description={`No bikes matched your search query "${searchQuery}".`}
            actionText="Clear Search"
            onAction={() => setSearchQuery("")}
          />
        )}

        {/* Real Product Cards */}
        {!isLoading && !isError && filteredProducts.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((p: any) => (
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
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

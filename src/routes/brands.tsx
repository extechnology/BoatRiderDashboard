import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Building2 } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useBrandsQuery } from "@/features/brands/hooks.brands";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";

export const Route = createFileRoute("/brands")({
  component: BrandsPage,
});

function BrandsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: brandsData, isLoading, isError, error, refetch } = useBrandsQuery();

  const allBrands = brandsData?.results ?? [];

  const filteredBrands = allBrands.filter((b: any) =>
    (b.brand_name?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Brands</h1>
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Loading partner brands..." : `${filteredBrands.length} partner brands found`}
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-4 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:w-64"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-border bg-card p-6 space-y-4">
                <div className="h-16 w-16 mx-auto rounded-full bg-muted" />
                <div className="h-5 w-1/2 mx-auto rounded bg-muted" />
                <div className="h-3 w-3/4 mx-auto rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <ErrorState
            title="Failed to Load Brands"
            message="Could not retrieve the partner brand list from the server."
            error={error}
            onRetry={() => refetch()}
          />
        ) : filteredBrands.length === 0 ? (
          <EmptyState
            title="No Brands Found"
            description={
              searchQuery
                ? `No brands match your search query "${searchQuery}".`
                : "No partner brands are currently registered in the database."
            }
            actionLabel={searchQuery ? "Clear Search" : undefined}
            onAction={searchQuery ? () => setSearchQuery("") : undefined}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBrands.map((b: any) => (
              <div
                key={b.id || b.brand_name}
                className="group flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center transition-all hover:shadow-md"
              >
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 p-2">
                  {b.brand_logo ? (
                    <img
                      src={b.brand_logo}
                      alt={b.brand_name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <Building2 className="h-8 w-8 text-muted-foreground/30" />
                  )}
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {b.brand_name}
                </h3>
                {b.description && (
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                    {b.description}
                  </p>
                )}
                {b.product_count !== undefined && (
                  <span className="mt-4 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {b.product_count} Products
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

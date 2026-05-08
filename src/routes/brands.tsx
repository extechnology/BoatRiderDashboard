import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Building2 } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useBrandsQuery } from "@/features/brands/hooks.brands";

export const Route = createFileRoute("/brands")({
  component: BrandsPage,
});

function BrandsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: brandsData, isLoading } = useBrandsQuery();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading brands...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
            <p className="text-sm text-muted-foreground">{filteredBrands.length} partner brands found</p>
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

        {filteredBrands.length === 0 ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-10 text-center">
            <Building2 className="h-10 w-10 text-muted-foreground/50 mb-3" />
            <h3 className="text-lg font-medium text-foreground">No brands found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search query.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {filteredBrands.map((b: any) => (
              <div key={b.brand_name} className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 text-center transition-all hover:border-primary/50 hover:shadow-md">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-lg bg-secondary/30 p-2 group-hover:scale-105 transition-transform">
                  {b.brand_image ? (
                    <img
                      src={b.brand_image}
                      alt={b.brand_name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Building2 className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                <h3 className="font-semibold text-foreground text-sm line-clamp-1">{b.brand_name}</h3>
                {b.brand_description && (
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{b.brand_description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
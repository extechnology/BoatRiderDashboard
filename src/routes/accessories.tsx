import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Search, Wrench } from "lucide-react";
import { useAccessoriesQuery } from "@/features/accessories/hooks.accessories";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";

export const Route = createFileRoute("/accessories")({
  component: AccessoriesPage,
});

function AccessoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: accessoriesData, isLoading, isError, error, refetch } = useAccessoriesQuery();

  const results = accessoriesData?.results || [];

  const filteredAccessories = results.filter((a: any) =>
    (a.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (a.brand && a.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (a.sub_category?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Accessories</h1>
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Loading accessories..." : `${filteredAccessories.length} accessories in catalog`}
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search accessories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-4 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:w-64"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-border bg-card p-4 space-y-3">
                <div className="aspect-square w-full rounded-lg bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <ErrorState
            title="Failed to Load Accessories"
            message="Could not retrieve the accessories catalog from the server."
            error={error}
            onRetry={() => refetch()}
          />
        ) : filteredAccessories.length === 0 ? (
          <EmptyState
            title="No Accessories Found"
            description={
              searchQuery
                ? `No accessories match your search term "${searchQuery}".`
                : "No accessories are currently available in the catalog."
            }
            actionLabel={searchQuery ? "Clear Search" : undefined}
            onAction={searchQuery ? () => setSearchQuery("") : undefined}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAccessories.map((a: any) => (
              <div
                key={a.id || `${a.name}-${a.brand}`}
                className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-md"
              >
                <div className="aspect-square w-full overflow-hidden bg-muted">
                  {a.image_url ? (
                    <img
                      src={a.image_url}
                      alt={a.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Wrench className="h-10 w-10 text-muted-foreground/20" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  {a.brand && (
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                      {a.brand}
                    </span>
                  )}
                  <h3 className="line-clamp-1 font-semibold text-foreground group-hover:text-primary transition-colors">
                    {a.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">
                      ₹{Number(a.price || 0).toLocaleString("en-IN")}
                    </span>
                    {a.sub_category && (
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                        {a.sub_category}
                      </span>
                    )}
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

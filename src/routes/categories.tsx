import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Search, FolderOpen } from "lucide-react";
import { useCategoriesQuery } from "@/features/categories/hooks.categories";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";

export const Route = createFileRoute("/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: categoriesData, isLoading, isError, error, refetch } = useCategoriesQuery();

  const results = categoriesData?.results || [];

  const filteredCategories = results.filter((c: any) =>
    (c.category_name?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Categories</h1>
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Loading categories..." : `${filteredCategories.length} categories`}
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-4 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:w-64"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-border bg-card p-4 space-y-3">
                <div className="aspect-video w-full rounded-lg bg-muted" />
                <div className="h-5 w-1/2 rounded bg-muted" />
                <div className="h-4 w-1/3 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <ErrorState
            title="Failed to Load Categories"
            message="Could not retrieve the product categories from the server."
            error={error}
            onRetry={() => refetch()}
          />
        ) : filteredCategories.length === 0 ? (
          <EmptyState
            title="No Categories Found"
            description={
              searchQuery
                ? `No categories match "${searchQuery}".`
                : "No categories have been created yet."
            }
            actionLabel={searchQuery ? "Clear Search" : undefined}
            onAction={searchQuery ? () => setSearchQuery("") : undefined}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((c: any) => (
              <div
                key={c.id || c.category_name}
                className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-md"
              >
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  {c.category_image ? (
                    <img
                      src={c.category_image}
                      alt={c.category_name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <FolderOpen className="h-10 w-10 text-muted-foreground/20" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {c.category_name}
                  </h3>
                  {c.product_count !== undefined && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {c.product_count} {c.product_count === 1 ? "Product" : "Products"}
                    </p>
                  )}
                  {c.sub_categories && Array.isArray(c.sub_categories) && c.sub_categories.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {c.sub_categories.map((sub: any) => (
                        <span
                          key={sub.name || sub}
                          className="rounded-md bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground"
                        >
                          {sub.name || sub}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

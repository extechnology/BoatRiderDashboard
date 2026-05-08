import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Search, FolderOpen } from "lucide-react";
import { useCategoriesQuery } from "@/features/categories/hooks.categories";

export const Route = createFileRoute("/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: categoriesData, isLoading } = useCategoriesQuery();

  const results = categoriesData?.results || [];

  const filteredCategories = results.filter((c: any) =>
    c.category_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Categories</h1>
            <p className="text-sm text-muted-foreground">{filteredCategories.length} categories</p>
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
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((c: any) => (
                <div key={c.category_name} className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-md">
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
                  <div className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <FolderOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{c.category_name}</h3>
                        <p className="text-xs text-muted-foreground">
                          Created {new Date(c.created).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                <FolderOpen className="mb-4 h-12 w-12 text-muted-foreground/20" />
                <h3 className="text-lg font-medium text-foreground">No categories found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your search query.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
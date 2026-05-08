import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Search, Wrench } from "lucide-react";
import { useAccessoriesQuery } from "@/features/accessories/hooks.accessories";

export const Route = createFileRoute("/accessories")({
  component: AccessoriesPage,
});

function AccessoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: accessoriesData, isLoading } = useAccessoriesQuery();

  const results = accessoriesData?.results || [];

  const filteredAccessories = results.filter((a: any) => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.brand && a.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
    a.sub_category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Accessories</h1>
            <p className="text-sm text-muted-foreground">{filteredAccessories.length} accessories in catalog</p>
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
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAccessories.length > 0 ? (
              filteredAccessories.map((a: any) => (
                <div key={a.name + a.brand} className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-md">
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
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-foreground" title={a.name}>{a.name}</h3>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{a.brand || "Generic"} · {a.sub_category}</p>
                      </div>
                      <p className="shrink-0 font-bold text-primary">₹{Number(a.price).toLocaleString()}</p>
                    </div>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[2.5rem]">
                      {a.description}
                    </p>

                    <div className="flex items-center justify-between border-t border-border pt-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.stock < 10 ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
                        {a.stock} in stock
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                <Wrench className="mb-4 h-12 w-12 text-muted-foreground/20" />
                <h3 className="text-lg font-medium text-foreground">No accessories found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your search query.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
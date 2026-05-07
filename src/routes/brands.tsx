import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { brands } from "@/lib/mock-data";

export const Route = createFileRoute("/brands")({
  component: BrandsPage,
});

function BrandsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBrands = brands.filter((b) => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Brands</h1>
            <p className="text-sm text-muted-foreground">{filteredBrands.length} partner brands</p>
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredBrands.map((b) => (
            <div key={b.id} className="rounded-lg border border-border bg-card p-5 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-2xl">
                {b.logo}
              </div>
              <h3 className="font-semibold text-foreground">{b.name}</h3>
              <p className="text-xs text-muted-foreground">{b.country}</p>
              <p className="mt-2 text-sm text-primary">{b.products} products</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { brands } from "@/lib/mock-data";

export const Route = createFileRoute("/brands")({
  component: BrandsPage,
});

function BrandsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Brands</h1>
          <p className="text-sm text-muted-foreground">{brands.length} partner brands</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {brands.map((b) => (
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
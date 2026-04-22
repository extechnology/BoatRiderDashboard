import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { accessories } from "@/lib/mock-data";
import { Wrench } from "lucide-react";

export const Route = createFileRoute("/accessories")({
  component: AccessoriesPage,
});

function AccessoriesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Accessories</h1>
          <p className="text-sm text-muted-foreground">{accessories.length} accessories</p>
        </div>
        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Compatible With</th>
              </tr>
            </thead>
            <tbody>
              {accessories.map((a) => (
                <tr key={a.id} className="border-b border-border/50 last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{a.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{a.category}</td>
                  <td className="px-5 py-3 text-foreground">${a.price}</td>
                  <td className="px-5 py-3">
                    <span className={`${a.stock < 20 ? "text-destructive" : "text-success"}`}>{a.stock}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {a.compatible.map((c) => (
                        <span key={c} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">{c}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { events } from "@/lib/mock-data";
import { Calendar } from "lucide-react";

export const Route = createFileRoute("/events")({
  component: EventsPage,
});

function EventsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Events</h1>
          <p className="text-sm text-muted-foreground">{events.length} events</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <div key={e.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  e.type === "sale" ? "bg-success/10" :
                  e.type === "launch" ? "bg-primary/10" :
                  e.type === "workshop" ? "bg-warning/10" :
                  "bg-destructive/10"
                }`}>
                  <Calendar className={`h-5 w-5 ${
                    e.type === "sale" ? "text-success" :
                    e.type === "launch" ? "text-primary" :
                    e.type === "workshop" ? "text-warning" :
                    "text-destructive"
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{e.title}</h3>
                  <p className="text-xs text-muted-foreground">{e.location}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{e.date}</span>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  e.status === "upcoming" ? "bg-primary/10 text-primary" :
                  e.status === "ongoing" ? "bg-warning/10 text-warning" :
                  "bg-muted text-muted-foreground"
                }`}>{e.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
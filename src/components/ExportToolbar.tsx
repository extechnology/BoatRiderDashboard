import { useState } from "react";
import { Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type DateFilter, filterByDate, exportToExcel } from "@/lib/export-utils";

interface ExportToolbarProps {
  data: Record<string, unknown>[];
  filename: string;
  dateField?: string;
}

export function ExportToolbar({ data, filename, dateField }: ExportToolbarProps) {
  const [filter, setFilter] = useState<DateFilter | "all">("all");
  const [customDate, setCustomDate] = useState("");

  const handleExport = () => {
    const filtered = filter === "all" ? data : filterByDate(data as any[], filter, customDate);
    if (filtered.length === 0) {
      alert("No data found for the selected filter.");
      return;
    }
    exportToExcel(filtered as Record<string, unknown>[], filename);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1 rounded-md border border-border bg-secondary/50 p-0.5">
        {(["all", "today", "this-month", "custom"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "all" ? "All" : f === "today" ? "Today" : f === "this-month" ? "This Month" : "Custom"}
          </button>
        ))}
      </div>
      {filter === "custom" && (
        <input
          type="date"
          value={customDate}
          onChange={(e) => setCustomDate(e.target.value)}
          className="rounded-md border border-border bg-input px-3 py-1.5 text-xs text-foreground"
        />
      )}
      <Button size="sm" onClick={handleExport} className="gap-1.5">
        <Download className="h-3.5 w-3.5" />
        Export Excel
      </Button>
    </div>
  );
}
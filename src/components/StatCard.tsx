import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative";
  icon: LucideIcon;
}

export function StatCard({ title, value, change, changeType, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
      {change && (
        <p className={`mt-1 text-xs ${changeType === "positive" ? "text-success" : "text-destructive"}`}>
          {change}
        </p>
      )}
    </div>
  );
}
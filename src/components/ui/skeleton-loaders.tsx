import React from "react";
import { cn } from "@/lib/utils";

export function MetricCardSkeleton({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border bg-card p-5 space-y-3 animate-pulse shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="h-3 w-24 rounded bg-muted/80" />
            <div className="h-8 w-8 rounded-lg bg-muted/60" />
          </div>
          <div className="h-7 w-16 rounded bg-muted/90" />
          <div className="h-2 w-32 rounded bg-muted/50" />
        </div>
      ))}
    </div>
  );
}

export function TableRowSkeleton({
  cols = 7,
  rows = 5,
  className,
}: {
  cols?: number;
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn("w-full space-y-3 p-4", className)}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-border/60">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-3.5 flex-1 rounded bg-muted/70 animate-pulse" />
        ))}
      </div>

      {/* Row skeletons */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex items-center justify-between gap-4 py-3 border-b border-border/30 animate-pulse"
        >
          <div className="h-10 w-14 rounded-lg bg-muted/70 shrink-0" />
          <div className="h-4 flex-1 rounded bg-muted/60" />
          <div className="h-4 w-28 rounded bg-muted/50" />
          <div className="h-4 w-24 rounded bg-muted/50" />
          <div className="h-4 w-20 rounded bg-muted/50" />
          <div className="h-5 w-16 rounded-full bg-muted/60" />
          <div className="h-8 w-20 rounded bg-muted/60" />
        </div>
      ))}
    </div>
  );
}

export function DrawerCounterSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border bg-card p-3 space-y-2">
          <div className="h-2.5 w-16 rounded bg-muted/80" />
          <div className="h-6 w-10 rounded bg-muted/90" />
        </div>
      ))}
    </div>
  );
}


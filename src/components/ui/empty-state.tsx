import React from "react";
import { Button } from "@/components/ui/button";
import { type LucideIcon, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionText,
  actionLabel,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  className,
  children,
}: EmptyStateProps) {
  const primaryActionText = actionText || actionLabel;

  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-border bg-card/40 p-10 sm:p-14 text-center shadow-xs transition-all",
        className
      )}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/70 text-muted-foreground mb-3 transition-transform hover:scale-105">
        <Icon className="h-7 w-7" />
      </div>

      <h3 className="text-base font-bold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1.5 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>

      {children && <div className="mt-4">{children}</div>}

      {(primaryActionText || secondaryActionText) && (
        <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
          {primaryActionText && onAction && (
            <Button size="sm" onClick={onAction} className="text-xs font-medium gap-1.5 shadow-xs">
              {primaryActionText}
            </Button>
          )}
          {secondaryActionText && onSecondaryAction && (
            <Button
              size="sm"
              variant="outline"
              onClick={onSecondaryAction}
              className="text-xs font-medium gap-1.5 shadow-xs"
            >
              {secondaryActionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

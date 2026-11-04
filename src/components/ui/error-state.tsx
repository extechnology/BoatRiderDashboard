import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  WifiOff,
  ServerCrash,
  Lock,
  AlertCircle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: Error | unknown;
  onRetry?: () => void;
  isRetrying?: boolean;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function ErrorState({
  title,
  message,
  error,
  onRetry,
  isRetrying = false,
  actionText,
  onAction,
  className,
}: ErrorStateProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Derive error characteristics
  const errString = error instanceof Error ? error.message : typeof error === "string" ? error : "";
  const errStatus = (error as any)?.response?.status;
  const isNetwork =
    (error as any)?.code === "ERR_NETWORK" ||
    !navigator.onLine ||
    errString.toLowerCase().includes("network") ||
    errString.toLowerCase().includes("cors");

  const isAuth =
    errStatus === 401 ||
    errStatus === 403 ||
    errString.toLowerCase().includes("auth") ||
    errString.toLowerCase().includes("unauthorized");

  const isServer = errStatus >= 500 || errString.toLowerCase().includes("server");

  // Determine Icon and defaults
  let Icon = AlertCircle;
  let defaultTitle = "Something Went Wrong";
  let defaultMsg = "An unexpected error occurred while communicating with the service.";
  let badgeColor = "bg-rose-500/10 text-rose-600 border-rose-500/20";

  if (isNetwork) {
    Icon = WifiOff;
    defaultTitle = "Network Connection Error";
    defaultMsg =
      "Unable to reach the server at server.boatridersports.in. Please check your internet connection or backend server status.";
    badgeColor = "bg-amber-500/10 text-amber-600 border-amber-500/20";
  } else if (isAuth) {
    Icon = Lock;
    defaultTitle = "Authentication Required";
    defaultMsg =
      "Your staff login session may have expired or credentials are required to view this section.";
    badgeColor = "bg-blue-500/10 text-blue-600 border-blue-500/20";
  } else if (isServer) {
    Icon = ServerCrash;
    defaultTitle = "Server Error";
    defaultMsg =
      "The server encountered an error while processing the request. Staff administrators have been notified.";
  }

  const finalTitle = title || defaultTitle;
  const finalMessage = message || errString || defaultMsg;

  return (
    <div
      className={cn(
        "rounded-xl border border-destructive/20 bg-card p-8 text-center shadow-xs transition-all",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border mb-3 transition-transform hover:scale-105",
          badgeColor
        )}
      >
        <Icon className="h-7 w-7" />
      </div>

      <h3 className="text-base font-bold text-foreground">{finalTitle}</h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto leading-relaxed">
        {finalMessage}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            disabled={isRetrying}
            className="gap-2 text-xs font-medium"
          >
            <RotateCcw className={cn("h-3.5 w-3.5", isRetrying && "animate-spin")} />
            {isRetrying ? "Retrying..." : "Try Again"}
          </Button>
        )}

        {actionText && onAction && (
          <Button size="sm" onClick={onAction} className="text-xs font-medium">
            {actionText}
          </Button>
        )}

        {isAuth && (
          <Button
            variant="secondary"
            size="sm"
            asChild
            className="text-xs font-medium"
          >
            <a href="/login">
              Go to Login <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </Button>
        )}
      </div>

      {/* Technical Diagnostics Collapsible */}
      {!!error && (
        <div className="mt-5 pt-4 border-t border-border/50 max-w-lg mx-auto">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
          >
            {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {showDetails ? "Hide technical details" : "Show technical details"}
          </button>

          {showDetails && (
            <div className="mt-2 text-left rounded-md bg-muted/60 p-3 font-mono text-[10px] text-muted-foreground overflow-x-auto space-y-1">
              <div>
                <span className="font-semibold text-foreground">Message:</span> {errString || "Unknown"}
              </div>
              {errStatus && (
                <div>
                  <span className="font-semibold text-foreground">HTTP Status:</span> {errStatus}
                </div>
              )}
              <div>
                <span className="font-semibold text-foreground">Client Online:</span>{" "}
                {typeof navigator !== "undefined" && navigator.onLine ? "Yes" : "No"}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Mail, Calendar } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ExportToolbar } from "@/components/ExportToolbar";
import { useContactListQuery } from "@/features/contact/hooks.contact";
import { type DateFilter, filterByDate } from "@/lib/export-utils";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { TableRowSkeleton } from "@/components/ui/skeleton-loaders";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter | "all">("all");
  const [customDate, setCustomDate] = useState("");
  const { data: contactsData, isLoading, isError, error, refetch } = useContactListQuery();

  const results = contactsData?.results || (Array.isArray(contactsData) ? contactsData : []);

  const filteredContacts = results
    .filter((c: any) =>
      (c.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (c.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (c.subject?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (c.phone?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    )
    .filter((c: any) => {
      if (dateFilter === "all") return true;
      const filtered = filterByDate([c], dateFilter, "created", customDate);
      return filtered.length > 0;
    });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Contact Inquiries</h1>
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Loading inquiries..." : `${filteredContacts.length} messages received`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-4 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:w-64"
              />
            </div>
            <div className="flex items-center gap-1 rounded-md border border-border bg-secondary/50 p-0.5">
              {(["all", "today", "this-month", "custom"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setDateFilter(f)}
                  className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                    dateFilter === f
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f === "all" ? "All" : f === "today" ? "Today" : f === "this-month" ? "This Month" : "Custom"}
                </button>
              ))}
            </div>
            {dateFilter === "custom" && (
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="h-9 rounded-md border border-input bg-transparent pl-9 pr-3 text-xs shadow-sm transition-colors"
                />
              </div>
            )}
            {filteredContacts.length > 0 && (
              <ExportToolbar
                data={filteredContacts}
                filename="contact-messages"
                showFilter={false}
              />
            )}
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="rounded-xl border border-border bg-card p-4">
            <TableRowSkeleton cols={5} rows={4} />
          </div>
        ) : isError ? (
          <ErrorState
            title="Failed to Load Contact Inquiries"
            message="Could not retrieve user messages from the server."
            error={error}
            onRetry={() => refetch()}
          />
        ) : filteredContacts.length === 0 ? (
          <EmptyState
            title="No Inquiries Found"
            description={
              searchQuery
                ? `No messages matched "${searchQuery}".`
                : "No customer contact messages have been received yet."
            }
            actionLabel={searchQuery ? "Clear Filter" : undefined}
            onAction={searchQuery ? () => setSearchQuery("") : undefined}
          />
        ) : (
          <div className="space-y-4">
            {filteredContacts.map((c: any) => (
              <div
                key={c.id || `${c.email}-${c.created}`}
                className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-sm space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border/50 pb-3">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{c.subject || "No Subject"}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{c.name}</span>
                      <span>•</span>
                      <a href={`mailto:${c.email}`} className="text-primary hover:underline">
                        {c.email}
                      </a>
                      {c.phone && (
                        <>
                          <span>•</span>
                          <span>{c.phone}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {c.created && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(c.created).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {c.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

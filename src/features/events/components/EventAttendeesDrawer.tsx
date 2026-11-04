import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DashboardEvent,
  EventRegistrationItem,
  RegistrationStatus,
} from "@/types/events";
import {
  useEventRegistrationsQuery,
  useUpdateRegistrationStatusMutation,
  exportAttendeesCsvFile,
} from "@/features/events/hooks.events";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { DrawerCounterSkeleton, TableRowSkeleton } from "@/components/ui/skeleton-loaders";
import { toast } from "sonner";
import {
  Search,
  Download,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  UserCheck,
  SearchX,
  X,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface EventAttendeesDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: DashboardEvent | null;
}

const STATUS_TABS = ["All", "Confirmed", "Attended", "Cancelled", "Waitlist"] as const;

export function EventAttendeesDrawer({
  open,
  onOpenChange,
  event,
}: EventAttendeesDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<typeof STATUS_TABS[number]>("All");
  const [isExporting, setIsExporting] = useState(false);
  const [updatingRegistrationId, setUpdatingRegistrationId] = useState<string | null>(null);

  const eventId = event?.id || "";
  const {
    data: registrationData,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useEventRegistrationsQuery(eventId, {
    search: searchQuery || undefined,
    status: activeTab === "All" ? undefined : activeTab.toLowerCase(),
  });

  const updateStatusMutation = useUpdateRegistrationStatusMutation();

  if (!event) return null;

  const rawAttendees = registrationData?.data || [];

  // Local filtering if searching or switching tabs
  const filteredAttendees = rawAttendees.filter((attendee) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      attendee.full_name?.toLowerCase().includes(q) ||
      attendee.phone?.toLowerCase().includes(q) ||
      attendee.email?.toLowerCase().includes(q) ||
      attendee.ticket_code?.toLowerCase().includes(q) ||
      attendee.registration_number?.toLowerCase().includes(q);

    const matchesStatus =
      activeTab === "All" ||
      attendee.status?.toLowerCase() === activeTab.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Spot counter tallies calculated from actual backend registrations
  const totalRegistrations = rawAttendees.length;
  const confirmedRiders = rawAttendees.filter((r) => r.status === "confirmed").length;
  const attendedRiders = rawAttendees.filter((r) => r.status === "attended").length;
  const cancelledRiders = rawAttendees.filter((r) => r.status === "cancelled").length;
  const filledSpots = confirmedRiders + attendedRiders;
  const spotsLeft = Math.max(0, event.max_spots - filledSpots);

  const handleStatusChange = async (
    registrationId: string,
    newStatus: RegistrationStatus
  ) => {
    setUpdatingRegistrationId(registrationId);
    try {
      await updateStatusMutation.mutateAsync({
        registrationId,
        status: newStatus,
        eventId,
      });

      if (newStatus === "attended") {
        toast.success("Rider marked as attended!");
      } else if (newStatus === "cancelled") {
        toast.info("Registration cancelled. Reserved spot reclaimed automatically.");
      } else if (newStatus === "confirmed") {
        toast.success("Registration re-confirmed!");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to update attendee status");
    } finally {
      setUpdatingRegistrationId(null);
    }
  };

  const handleExportCsv = async () => {
    if (rawAttendees.length === 0) {
      toast.error("No attendees registered yet to export.");
      return;
    }
    setIsExporting(true);
    try {
      await exportAttendeesCsvFile(eventId, event.title);
      toast.success("Marshal roster exported to CSV successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to export attendees CSV");
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3" /> Confirmed
          </span>
        );
      case "attended":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <UserCheck className="h-3 w-3" /> Attended
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <XCircle className="h-3 w-3" /> Cancelled
          </span>
        );
      case "waitlist":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="h-3 w-3" /> Waitlist
          </span>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-4xl p-0 flex flex-col h-full bg-background border-l border-border"
      >
        {/* Header Panel */}
        <div className="p-6 border-b border-border bg-card/60">
          <SheetHeader className="space-y-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <SheetTitle className="text-xl font-bold text-foreground">
                  {event.title}
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                  {event.date} • {event.time} • {event.location}
                </SheetDescription>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isRefetching || isLoading}
                  className="h-8 w-8 p-0"
                  title="Refresh attendees"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`} />
                </Button>

                {/* 1-Click Marshal CSV Export */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCsv}
                  disabled={isExporting || rawAttendees.length === 0}
                  className="gap-2 font-medium text-xs"
                  title={rawAttendees.length === 0 ? "No attendees registered to export" : "Download CSV roster"}
                >
                  {isExporting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="h-3.5 w-3.5 text-primary" />
                  )}
                  {isExporting ? "Exporting..." : "Export Marshal CSV"}
                </Button>
              </div>
            </div>
          </SheetHeader>

          {/* Live Spot Counters */}
          <div className="mt-5">
            {isLoading ? (
              <DrawerCounterSkeleton />
            ) : isError ? (
              <div className="rounded-lg border border-border bg-card/40 p-3 text-xs text-muted-foreground flex items-center justify-between">
                <span>Counters unavailable due to network error</span>
                <Button variant="ghost" size="sm" onClick={() => refetch()} className="h-7 text-xs">
                  Retry
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-lg border border-border bg-background p-3">
                  <span className="text-[11px] font-medium text-muted-foreground">Total Registered</span>
                  <p className="text-lg font-bold text-foreground mt-1">{totalRegistrations}</p>
                </div>
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    Confirmed Riders
                  </span>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    {confirmedRiders}
                  </p>
                </div>
                <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
                  <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
                    Attended Riders
                  </span>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
                    {attendedRiders}
                  </p>
                </div>
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                  <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                    Available Spots Left
                  </span>
                  <p className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-1">
                    {spotsLeft} <span className="text-xs font-normal text-muted-foreground">/ {event.max_spots}</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters & Tabs */}
        <div className="px-6 py-3 border-b border-border bg-card/30 flex flex-wrap items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Input with Clear Button */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search rider, phone, ticket..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 pr-7 text-xs bg-background"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Main Content Area with Fallback UIs */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* 1. Loading Skeleton Fallback UI */}
          {isLoading && (
            <div className="rounded-lg border border-border bg-card p-4">
              <TableRowSkeleton cols={6} rows={5} />
            </div>
          )}

          {/* 2. Error Fallback UI with Network Diagnostics */}
          {!isLoading && isError && (
            <ErrorState
              error={error}
              title="Unable to Load Attendee Roster"
              onRetry={() => refetch()}
              isRetrying={isRefetching}
            />
          )}

          {/* 3. Empty State Fallback UI (Zero total registrations) */}
          {!isLoading && !isError && rawAttendees.length === 0 && (
            <EmptyState
              icon={Users}
              title="No Registrations Yet"
              description="No riders have registered for this event yet. Once riders submit the registration form, their details, ticket numbers, and check-in statuses will appear here."
            />
          )}

          {/* 4. Filter Empty State Fallback UI (Search or tab filter produced 0 matches) */}
          {!isLoading && !isError && rawAttendees.length > 0 && filteredAttendees.length === 0 && (
            <EmptyState
              icon={SearchX}
              title="No Matching Attendees Found"
              description={`No attendees matched "${searchQuery}" ${activeTab !== "All" ? `in "${activeTab}" status` : ""}.`}
              actionText="Clear Search & Filter"
              onAction={() => {
                setSearchQuery("");
                setActiveTab("All");
              }}
            />
          )}

          {/* 5. Attendee Table (When real data is present) */}
          {!isLoading && !isError && filteredAttendees.length > 0 && (
            <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="text-xs font-semibold">Ticket Code</TableHead>
                    <TableHead className="text-xs font-semibold">Rider Info</TableHead>
                    <TableHead className="text-xs font-semibold">Slots</TableHead>
                    <TableHead className="text-xs font-semibold">Bike & Skill</TableHead>
                    <TableHead className="text-xs font-semibold">Emergency Contact</TableHead>
                    <TableHead className="text-xs font-semibold">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendees.map((attendee) => {
                    const isUpdatingThis = updatingRegistrationId === attendee.id;

                    return (
                      <TableRow key={attendee.id} className="text-xs hover:bg-muted/30">
                        {/* Ticket Code */}
                        <TableCell className="font-mono text-[11px] font-semibold text-primary">
                          #{attendee.ticket_code || attendee.registration_number}
                        </TableCell>

                        {/* Rider Info */}
                        <TableCell>
                          <div className="space-y-0.5">
                            <p className="font-semibold text-foreground text-xs">{attendee.full_name}</p>
                            <div className="flex flex-col gap-0.5 text-[11px] text-muted-foreground">
                              {attendee.phone && (
                                <a
                                  href={`tel:${attendee.phone}`}
                                  className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                                >
                                  <Phone className="h-3 w-3" /> {attendee.phone}
                                </a>
                              )}
                              {attendee.email && (
                                <a
                                  href={`mailto:${attendee.email}`}
                                  className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                                >
                                  <Mail className="h-3 w-3" /> {attendee.email}
                                </a>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        {/* Slots */}
                        <TableCell className="whitespace-nowrap font-medium">
                          {attendee.participants || 1} {attendee.participants > 1 ? "Riders" : "Rider"}
                        </TableCell>

                        {/* Bike & Skill */}
                        <TableCell>
                          <div className="space-y-0.5 max-w-[150px]">
                            <p className="font-medium truncate text-foreground">
                              {attendee.bike_type || "Standard Bike"}
                            </p>
                            <p className="text-[10px] text-muted-foreground truncate">
                              {attendee.experience_level || "All Levels"}
                            </p>
                          </div>
                        </TableCell>

                        {/* Emergency Contact & Notes */}
                        <TableCell>
                          <div className="space-y-0.5 max-w-[160px]">
                            <p className="font-medium text-foreground truncate">
                              {attendee.emergency_contact || "N/A"}
                            </p>
                            {attendee.notes && (
                              <p className="text-[10px] text-muted-foreground italic truncate" title={attendee.notes}>
                                Note: {attendee.notes}
                              </p>
                            )}
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="whitespace-nowrap">
                          {getStatusBadge(attendee.status)}
                        </TableCell>

                        {/* Quick Actions */}
                        <TableCell className="text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {isUpdatingThis ? (
                              <div className="flex items-center gap-1 px-3 py-1 text-[11px] text-muted-foreground">
                                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Updating...
                              </div>
                            ) : (
                              <>
                                {attendee.status !== "attended" && attendee.status !== "cancelled" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleStatusChange(attendee.id, "attended")}
                                    disabled={updateStatusMutation.isPending}
                                    className="h-7 px-2 text-[11px] text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                                    title="Mark attended"
                                  >
                                    <UserCheck className="h-3 w-3 mr-1" />
                                    Attended
                                  </Button>
                                )}

                                {attendee.status !== "cancelled" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleStatusChange(attendee.id, "cancelled")}
                                    disabled={updateStatusMutation.isPending}
                                    className="h-7 px-2 text-[11px] text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                    title="Cancel & Reclaim Spot"
                                  >
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Cancel
                                  </Button>
                                )}

                                {attendee.status === "cancelled" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleStatusChange(attendee.id, "confirmed")}
                                    disabled={updateStatusMutation.isPending || spotsLeft <= 0}
                                    className="h-7 px-2 text-[11px] text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                                    title={spotsLeft <= 0 ? "Event is at full capacity" : "Re-activate registration"}
                                  >
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Re-confirm
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

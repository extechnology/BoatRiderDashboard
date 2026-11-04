import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Search,
  Plus,
  Calendar as CalendarIcon,
  MapPin,
  ExternalLink,
  Users,
  Edit3,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  Activity,
  MoreVertical,
  Layers,
  Sparkles,
  TrendingUp,
  RefreshCw,
  SearchX,
  CalendarPlus,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useEventsQuery,
  useUpdateEventMutation,
  exportAttendeesCsvFile,
} from "@/features/events/hooks.events";
import { EventFormDialog } from "@/features/events/components/EventFormDialog";
import { EventAttendeesDrawer } from "@/features/events/components/EventAttendeesDrawer";
import { DeleteEventDialog } from "@/features/events/components/DeleteEventDialog";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { MetricCardSkeleton, TableRowSkeleton } from "@/components/ui/skeleton-loaders";
import { DashboardEvent, EventStatus } from "@/types/events";
import { toast } from "sonner";

export const Route = createFileRoute("/events")({
  component: EventsPage,
});

const CATEGORIES = ["All", "Community", "Trail", "Race", "Workshop"] as const;
const STATUSES = ["All", "Upcoming", "Ongoing", "Completed", "Cancelled"] as const;

function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  // Track async operations per item
  const [updatingPublishId, setUpdatingPublishId] = useState<string | null>(null);
  const [exportingEventId, setExportingEventId] = useState<string | null>(null);

  // Modals & Drawers state
  const [formOpen, setFormOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<DashboardEvent | null>(null);

  const [attendeesOpen, setAttendeesOpen] = useState(false);
  const [selectedEventForAttendees, setSelectedEventForAttendees] = useState<DashboardEvent | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<DashboardEvent | null>(null);

  // Queries & Mutations - real backend data
  const {
    data: eventsData,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useEventsQuery({
    search: searchQuery || undefined,
    category: selectedCategory === "All" ? undefined : selectedCategory,
    status: selectedStatus === "All" ? undefined : selectedStatus.toLowerCase(),
  });

  const updateMutation = useUpdateEventMutation();

  const allEvents = useMemo(() => eventsData || [], [eventsData]);

  // Client-side filtering as safety
  const filteredEvents = useMemo(() => {
    return allEvents.filter((evt) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        evt.title.toLowerCase().includes(q) ||
        evt.location.toLowerCase().includes(q) ||
        evt.description?.toLowerCase().includes(q) ||
        evt.category_label?.toLowerCase().includes(q);

      const matchesCat =
        selectedCategory === "All" || evt.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "All" ||
        evt.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [allEvents, searchQuery, selectedCategory, selectedStatus]);

  // Top KPI Metrics calculated from real data
  const totalEvents = allEvents.length;
  const activeUpcomingRides = allEvents.filter(
    (e) => e.status === "upcoming" && e.is_published
  ).length;
  const totalConfirmedRiders = allEvents.reduce(
    (acc, e) => acc + (e.confirmed_riders || 0),
    0
  );
  const totalFilledSpots = allEvents.reduce((acc, e) => acc + (e.filled_spots || 0), 0);
  const totalMaxSpots = allEvents.reduce((acc, e) => acc + (e.max_spots || 0), 0);
  const overallCapacityPercentage =
    totalMaxSpots > 0 ? Math.round((totalFilledSpots / totalMaxSpots) * 100) : 0;

  const hasActiveFilters =
    searchQuery.trim() !== "" || selectedCategory !== "All" || selectedStatus !== "All";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedStatus("All");
  };

  // Toggle publish handler
  const handleTogglePublish = async (event: DashboardEvent) => {
    const nextPublished = !event.is_published;
    setUpdatingPublishId(event.id);
    try {
      await updateMutation.mutateAsync({
        id: event.id,
        payload: { is_published: nextPublished },
      });
      toast.success(
        nextPublished
          ? `"${event.title}" is now published & open for registrations`
          : `"${event.title}" is now unpublished`
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to update publish state");
    } finally {
      setUpdatingPublishId(null);
    }
  };

  // Download CSV Handler
  const handleDownloadCsv = async (event: DashboardEvent) => {
    setExportingEventId(event.id);
    try {
      await exportAttendeesCsvFile(event.id, event.title);
      toast.success(`Exported marshal roster for "${event.title}"`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to download attendees CSV");
    } finally {
      setExportingEventId(null);
    }
  };

  // Status Badge styling helper
  const renderStatusBadge = (status: EventStatus) => {
    switch (status) {
      case "upcoming":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Clock className="h-3 w-3" /> Upcoming
          </span>
        );
      case "ongoing":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Ongoing
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
            <CheckCircle2 className="h-3 w-3" /> Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            Cancelled
          </span>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Top Header & Primary Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <CalendarIcon className="h-6 w-6 text-primary" /> Events & Registrations
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Create, publish, and manage group rides, trail challenges, live capacity, and marshal rosters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isRefetching || isLoading}
              className="gap-1.5 text-xs"
              title="Refresh events from server"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            <Button
              onClick={() => {
                setEventToEdit(null);
                setFormOpen(true);
              }}
              className="gap-2 shadow-xs font-medium text-xs sm:text-sm"
            >
              <Plus className="h-4 w-4" /> Create New Event
            </Button>
          </div>
        </div>

        {/* 1. Top KPI Metrics Summary Section */}
        {isLoading ? (
          <MetricCardSkeleton count={4} />
        ) : isError ? (
          <div className="rounded-xl border border-border bg-card/60 p-4 text-xs text-muted-foreground flex items-center justify-between">
            <span>Metrics unavailable due to connection error</span>
            <Button variant="ghost" size="sm" onClick={() => refetch()} className="h-7 text-xs">
              Retry
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Events */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Total Events</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Layers className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold text-foreground">{totalEvents}</p>
              <p className="mt-1 text-xs text-muted-foreground">Active and archived catalog</p>
            </div>

            {/* Active Upcoming Rides */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Active Upcoming Rides</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Activity className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold text-foreground">{activeUpcomingRides}</p>
              <p className="mt-1 text-xs text-blue-600 dark:text-blue-400 font-medium">Published & open</p>
            </div>

            {/* Confirmed Riders */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Confirmed Riders</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold text-foreground">{totalConfirmedRiders}</p>
              <p className="mt-1 text-xs text-muted-foreground">Registered participants across events</p>
            </div>

            {/* Overall Capacity Filled */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Overall Capacity Filled</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <p className="text-2xl font-bold text-foreground">{overallCapacityPercentage}%</p>
                <span className="text-xs text-muted-foreground">
                  {totalFilledSpots} / {totalMaxSpots} Spots
                </span>
              </div>
              <div className="mt-2 w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    overallCapacityPercentage > 90
                      ? "bg-rose-500"
                      : overallCapacityPercentage > 75
                      ? "bg-amber-500"
                      : "bg-primary"
                  }`}
                  style={{ width: `${Math.min(100, overallCapacityPercentage)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. Filters & Controls Section */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search events by title, location, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8 h-9 text-xs sm:text-sm bg-background"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Status Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                Status:
              </span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Filter Pills & Active Filters indicator */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-medium text-muted-foreground mr-1">Category:</span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
              >
                <X className="h-3 w-3" /> Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* 3. Main Content Section: Loading, Error, Empty, or Table */}

        {/* 3.1. Loading Shimmer Table Skeleton */}
        {isLoading && (
          <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
            <TableRowSkeleton cols={7} rows={6} />
          </div>
        )}

        {/* 3.2. Error Fallback UI with Network Diagnostics */}
        {!isLoading && isError && (
          <ErrorState
            error={error}
            onRetry={() => refetch()}
            isRetrying={isRefetching}
            actionText="Create New Event"
            onAction={() => {
              setEventToEdit(null);
              setFormOpen(true);
            }}
          />
        )}

        {/* 3.3. Empty State: Zero Events in Entire Catalog */}
        {!isLoading && !isError && allEvents.length === 0 && (
          <EmptyState
            icon={CalendarPlus}
            title="No Events in Catalog"
            description="Your events catalog is currently empty. Create your first community ride, trail challenge, or workshop to start taking registrations."
            actionText="+ Create Your First Event"
            onAction={() => {
              setEventToEdit(null);
              setFormOpen(true);
            }}
          />
        )}

        {/* 3.4. Empty State: Filter or Search returned 0 matches */}
        {!isLoading && !isError && allEvents.length > 0 && filteredEvents.length === 0 && (
          <EmptyState
            icon={SearchX}
            title="No Matching Events Found"
            description={`No events matched "${searchQuery || selectedCategory}" with your selected criteria.`}
            actionText="Reset All Filters"
            onAction={handleResetFilters}
          />
        )}

        {/* 3.5. Real Events Table (Rendered only when real events exist) */}
        {!isLoading && !isError && filteredEvents.length > 0 && (
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="w-[320px] text-xs font-semibold">Event & Details</TableHead>
                    <TableHead className="text-xs font-semibold">Schedule</TableHead>
                    <TableHead className="text-xs font-semibold">Location</TableHead>
                    <TableHead className="text-xs font-semibold">Category & Level</TableHead>
                    <TableHead className="w-[180px] text-xs font-semibold">Capacity / Spots</TableHead>
                    <TableHead className="text-xs font-semibold">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Published</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((evt) => {
                    const capacityPct =
                      evt.max_spots > 0
                        ? Math.min(100, Math.round((evt.filled_spots / evt.max_spots) * 100))
                        : 0;
                    const isUpdatingPublish = updatingPublishId === evt.id;
                    const isExportingThis = exportingEventId === evt.id;

                    return (
                      <TableRow key={evt.id} className="text-xs hover:bg-muted/30">
                        {/* Cover Image & Title */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-16 shrink-0 rounded-lg overflow-hidden bg-muted border border-border flex items-center justify-center">
                              {evt.image ? (
                                <img
                                  src={evt.image}
                                  alt={evt.title}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = "none";
                                  }}
                                />
                              ) : (
                                <CalendarIcon className="h-5 w-5 text-muted-foreground/50" />
                              )}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-foreground text-sm line-clamp-1">
                                  {evt.title}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-1.5">
                                {evt.tag && (
                                  <Badge
                                    variant="secondary"
                                    className="text-[10px] px-1.5 py-0 font-medium"
                                  >
                                    {evt.tag}
                                  </Badge>
                                )}
                                <span className="text-[11px] text-muted-foreground font-mono">
                                  {evt.distance || "Distance TBD"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Date & Schedule */}
                        <TableCell>
                          <div className="space-y-0.5 whitespace-nowrap">
                            <p className="font-medium text-foreground">{evt.date || "Date TBD"}</p>
                            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {evt.time || "Time TBD"}
                            </p>
                          </div>
                        </TableCell>

                        {/* Location */}
                        <TableCell>
                          <div className="space-y-0.5 max-w-[180px]">
                            <p className="font-medium text-foreground truncate">{evt.location}</p>
                            {evt.google_maps_url ? (
                              <a
                                href={evt.google_maps_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                              >
                                View Map <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            ) : (
                              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-2.5 w-2.5" /> On Location
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Category & Difficulty */}
                        <TableCell>
                          <div className="space-y-1 whitespace-nowrap">
                            <span className="inline-block px-2 py-0.5 rounded-md bg-secondary text-[11px] font-medium text-secondary-foreground">
                              {evt.category}
                            </span>
                            <p className="text-[10px] text-muted-foreground">
                              {evt.difficulty}
                            </p>
                          </div>
                        </TableCell>

                        {/* Capacity Bar */}
                        <TableCell>
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-medium text-foreground">
                                {evt.filled_spots || 0} / {evt.max_spots}
                              </span>
                              <span
                                className={`font-semibold px-1.5 py-0.2 rounded text-[10px] ${
                                  evt.spots_left <= 0
                                    ? "bg-rose-500/10 text-rose-600"
                                    : evt.spots_left <= 10
                                    ? "bg-amber-500/10 text-amber-600"
                                    : "bg-emerald-500/10 text-emerald-600"
                                }`}
                              >
                                {evt.spots_left <= 0 ? "Full" : `${evt.spots_left} left`}
                              </span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  capacityPct >= 100
                                    ? "bg-rose-500"
                                    : capacityPct >= 80
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                                }`}
                                style={{ width: `${capacityPct}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>

                        {/* Status Badge */}
                        <TableCell className="whitespace-nowrap">
                          {renderStatusBadge(evt.status)}
                        </TableCell>

                        {/* Publish Toggle */}
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center">
                            {isUpdatingPublish ? (
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            ) : (
                              <Switch
                                checked={evt.is_published}
                                onCheckedChange={() => handleTogglePublish(evt)}
                                disabled={isUpdatingPublish || updateMutation.isPending}
                                title={evt.is_published ? "Unpublish Event" : "Publish Event"}
                              />
                            )}
                          </div>
                        </TableCell>

                        {/* Action Buttons & Dropdown */}
                        <TableCell className="text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            {/* 👥 View Attendees Button */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedEventForAttendees(evt);
                                setAttendeesOpen(true);
                              }}
                              className="h-8 px-2.5 gap-1.5 text-xs font-medium"
                              title="View & manage registered riders"
                            >
                              <Users className="h-3.5 w-3.5 text-primary" />
                              Attendees
                              {evt.total_registrations > 0 && (
                                <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.2 text-[10px] font-semibold text-primary">
                                  {evt.total_registrations}
                                </span>
                              )}
                            </Button>

                            {/* Dropdown Menu for secondary actions */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 text-xs">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setEventToEdit(evt);
                                    setFormOpen(true);
                                  }}
                                  className="cursor-pointer gap-2"
                                >
                                  <Edit3 className="h-3.5 w-3.5" />
                                  Edit Event Details
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() => handleDownloadCsv(evt)}
                                  disabled={isExportingThis}
                                  className="cursor-pointer gap-2"
                                >
                                  {isExportingThis ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Download className="h-3.5 w-3.5" />
                                  )}
                                  Download Marshal CSV
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                  onClick={() => {
                                    setEventToDelete(evt);
                                    setDeleteOpen(true);
                                  }}
                                  className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Archive / Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>

      {/* Event Create / Edit Form Modal */}
      <EventFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        eventToEdit={eventToEdit}
      />

      {/* Event Attendees & Registration Drawer */}
      <EventAttendeesDrawer
        open={attendeesOpen}
        onOpenChange={setAttendeesOpen}
        event={selectedEventForAttendees}
      />

      {/* Archive / Delete Confirmation Dialog */}
      <DeleteEventDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        event={eventToDelete}
      />
    </DashboardLayout>
  );
}

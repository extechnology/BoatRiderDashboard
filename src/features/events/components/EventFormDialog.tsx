import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  DashboardEvent,
  EventCategory,
  EventDifficulty,
  EventStatus,
  ScheduleItem,
} from "@/types/events";
import {
  useCreateEventMutation,
  useUpdateEventMutation,
} from "@/features/events/hooks.events";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  X,
  Sparkles,
  Clock,
  MapPin,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  Calendar as CalendarIcon,
  UploadCloud,
  FileImage,
  Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isValid } from "date-fns";

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventToEdit?: DashboardEvent | null;
}

const CATEGORIES: EventCategory[] = ["Community", "Trail", "Race", "Workshop"];
const DIFFICULTIES: EventDifficulty[] = [
  "All Levels",
  "Beginner Friendly",
  "Intermediate",
  "Advanced",
  "Expert",
];
const STATUSES: EventStatus[] = ["upcoming", "ongoing", "completed", "cancelled"];

export function EventFormDialog({
  open,
  onOpenChange,
  eventToEdit,
}: EventFormDialogProps) {
  const isEditing = !!eventToEdit;
  const createMutation = useCreateEventMutation();
  const updateMutation = useUpdateEventMutation();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<EventCategory>("Community");
  const [categoryLabel, setCategoryLabel] = useState("");
  const [tag, setTag] = useState("");
  const [date, setDate] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [manualDateEntry, setManualDateEntry] = useState(false);
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [distance, setDistance] = useState("");
  const [difficulty, setDifficulty] = useState<EventDifficulty>("All Levels");
  const [maxSpots, setMaxSpots] = useState<number>(50);
  const [fee, setFee] = useState("Free Entry");
  const [isFree, setIsFree] = useState(true);

  // Image Upload state
  const [image, setImage] = useState("");
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadedFileSize, setUploadedFileSize] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [description, setDescription] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [newHighlight, setNewHighlight] = useState("");
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [status, setStatus] = useState<EventStatus>("upcoming");
  const [isPublished, setIsPublished] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Sync state when modal opens or eventToEdit changes
  useEffect(() => {
    setFormError(null);
    setIsDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (eventToEdit) {
      setTitle(eventToEdit.title || "");
      setSlug(eventToEdit.slug || "");
      setCategory(eventToEdit.category || "Community");
      setCategoryLabel(eventToEdit.category_label || "");
      setTag(eventToEdit.tag || "");
      setDate(eventToEdit.date || "");

      // Attempt to parse existing date for calendar view
      if (eventToEdit.date) {
        const parsed = new Date(eventToEdit.date);
        if (isValid(parsed) && !isNaN(parsed.getTime())) {
          setSelectedDate(parsed);
        } else {
          setSelectedDate(undefined);
        }
      } else {
        setSelectedDate(undefined);
      }

      setTime(eventToEdit.time || "");
      setLocation(eventToEdit.location || "");
      setGoogleMapsUrl(eventToEdit.google_maps_url || "");
      setDistance(eventToEdit.distance || "");
      setDifficulty(eventToEdit.difficulty || "All Levels");
      setMaxSpots(eventToEdit.max_spots ?? 50);
      setFee(eventToEdit.fee || "Free Entry");
      setIsFree(eventToEdit.is_free ?? true);
      setImage(eventToEdit.image || "");
      setUploadedFileName(eventToEdit.image ? "Current Cover Image" : "");
      setUploadedFileSize("");
      setImageMode(eventToEdit.image?.startsWith("http") ? "url" : "upload");
      setDescription(eventToEdit.description || "");
      setHighlights(eventToEdit.highlights || []);
      setSchedule(eventToEdit.schedule || []);
      setStatus(eventToEdit.status || "upcoming");
      setIsPublished(eventToEdit.is_published ?? true);
    } else {
      // Clean reset for new event creation
      setTitle("");
      setSlug("");
      setCategory("Community");
      setCategoryLabel("");
      setTag("");
      setDate("");
      setSelectedDate(undefined);
      setManualDateEntry(false);
      setTime("");
      setLocation("");
      setGoogleMapsUrl("");
      setDistance("");
      setDifficulty("All Levels");
      setMaxSpots(50);
      setFee("Free Entry");
      setIsFree(true);
      setImage("");
      setUploadedFileName("");
      setUploadedFileSize("");
      setImageMode("upload");
      setDescription("");
      setHighlights([]);
      setSchedule([]);
      setStatus("upcoming");
      setIsPublished(true);
    }
  }, [eventToEdit, open]);

  // Handle calendar selection
  const handleCalendarSelect = (d: Date | undefined) => {
    setSelectedDate(d);
    if (d) {
      // Format e.g. "Sat, Nov 28, 2026"
      setDate(format(d, "EEE, MMM d, yyyy"));
      setCalendarOpen(false);
    }
  };

  // Process uploaded image file
  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, WEBP, etc.)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit. Please upload a smaller image.");
      return;
    }

    setUploadedFileName(file.name);
    setUploadedFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setImage(result);
        toast.success(`Image "${file.name}" uploaded successfully!`);
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Auto slug generation if user types title when creating
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  };

  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      if (!highlights.includes(newHighlight.trim())) {
        setHighlights([...highlights, newHighlight.trim()]);
      }
      setNewHighlight("");
    }
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const handleAddScheduleItem = () => {
    setSchedule([...schedule, { time: "08:00 AM", activity: "Next Milestone" }]);
  };

  const handleUpdateSchedule = (
    index: number,
    field: "time" | "activity",
    value: string
  ) => {
    const updated = [...schedule];
    updated[index][field] = value;
    setSchedule(updated);
  };

  const handleRemoveScheduleItem = (index: number) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Event title is required");
      return;
    }
    if (!date.trim()) {
      toast.error("Please pick an event date from the calendar");
      return;
    }
    if (!location.trim()) {
      toast.error("Event location is required");
      return;
    }

    const payload: Partial<DashboardEvent> = {
      title: title.trim(),
      slug: slug.trim() || title.trim().toLowerCase().replace(/\s+/g, "-"),
      category,
      category_label: categoryLabel.trim() || category,
      tag: tag.trim(),
      date: date.trim(),
      time: time.trim(),
      location: location.trim(),
      google_maps_url: googleMapsUrl.trim() || null,
      distance: distance.trim(),
      difficulty,
      max_spots: Number(maxSpots) || 50,
      fee: isFree ? "Free Entry" : fee.trim() || "Free Entry",
      is_free: isFree,
      image: image.trim(),
      description: description.trim(),
      highlights,
      schedule,
      status,
      is_published: isPublished,
    };

    setFormError(null);
    try {
      if (isEditing && eventToEdit) {
        await updateMutation.mutateAsync({ id: eventToEdit.id, payload });
        toast.success("Event updated successfully!");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Event created successfully!");
      }
      onOpenChange(false);
    } catch (err: any) {
      const msg = err?.message || "Failed to save event. Please check server connection.";
      setFormError(msg);
      toast.error(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {isEditing ? "Edit Event Details" : "Create New Event"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Configure event schedules, rider spots, route difficulty, and publish status.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Error Banner if API submission fails */}
          {formError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Unable to Save Event</p>
                <p className="mt-0.5 text-destructive/90">{formError}</p>
              </div>
              <button
                type="button"
                onClick={() => setFormError(null)}
                className="text-destructive/80 hover:text-destructive p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" /> General Info
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-medium text-foreground">
                  Event Title <span className="text-destructive">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Wayanad Ghats Challenge 2026"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Slug / URL Identifier</label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="wayanad-ghats-challenge"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Tag / Badge</label>
                <Input
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g. Featured, Popular, Championship"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EventCategory)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Category Sub-Label</label>
                <Input
                  value={categoryLabel}
                  onChange={(e) => setCategoryLabel(e.target.value)}
                  placeholder="e.g. Hill Climb, Brevet"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as EventDifficulty)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {DIFFICULTIES.map((diff) => (
                    <option key={diff} value={diff}>
                      {diff}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Date, Time & Location */}
          <div className="space-y-4 pt-2 border-t border-border">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" /> Date, Time & Location
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Calendar Date Picker */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground">
                    Event Date <span className="text-destructive">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setManualDateEntry(!manualDateEntry)}
                    className="text-[11px] text-primary hover:underline"
                  >
                    {manualDateEntry ? "Calendar" : "Edit Text"}
                  </button>
                </div>

                {manualDateEntry ? (
                  <Input
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. Sat, Nov 28, 2026"
                    className="text-xs h-9"
                    required
                  />
                ) : (
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-9 px-3 text-xs border-input shadow-xs",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-primary shrink-0" />
                        <span className="truncate font-medium">
                          {date || "Pick event date..."}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[100]" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleCalendarSelect}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Time Schedule</label>
                <Input
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 6:00 AM - 1:00 PM"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Distance / Duration</label>
                <Input
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="e.g. 65 km or 3 Hours"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Location Landmark & City <span className="text-destructive">*</span>
                </label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Thamarassery Churam, Wayanad"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Google Maps URL</label>
                <Input
                  type="url"
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                />
              </div>
            </div>
          </div>

          {/* Capacity, Pricing & Status */}
          <div className="space-y-4 pt-2 border-t border-border">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" /> Capacity & Status
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Max Rider Spots</label>
                <Input
                  type="number"
                  min={1}
                  value={maxSpots}
                  onChange={(e) => setMaxSpots(Math.max(1, parseInt(e.target.value) || 1))}
                  placeholder="50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Fee Text</label>
                <Input
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  placeholder="Free Entry"
                  disabled={isFree}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Lifecycle Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EventStatus)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st.charAt(0).toUpperCase() + st.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-1">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is-free-toggle"
                  checked={isFree}
                  onCheckedChange={(checked) => {
                    setIsFree(checked);
                    if (checked) setFee("Free Entry");
                  }}
                />
                <label htmlFor="is-free-toggle" className="text-xs font-medium cursor-pointer">
                  Free Event Entry
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is-published-toggle"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
                <label htmlFor="is-published-toggle" className="text-xs font-medium cursor-pointer">
                  Published & Visible to Public
                </label>
              </div>
            </div>
          </div>

          {/* Media & Narrative with File Upload */}
          <div className="space-y-4 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ImageIcon className="h-4 w-4 text-primary" /> Event Cover Image
              </h3>

              {/* Mode switch pills */}
              <div className="flex items-center rounded-lg border border-border bg-secondary/50 p-0.5">
                <button
                  type="button"
                  onClick={() => setImageMode("upload")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                    imageMode === "upload"
                      ? "bg-background text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <UploadCloud className="h-3.5 w-3.5" /> Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode("url")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                    imageMode === "url"
                      ? "bg-background text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <LinkIcon className="h-3.5 w-3.5" /> Image URL
                </button>
              </div>
            </div>

            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/avif"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* If an image is selected/loaded, show the interactive preview card */}
            {image ? (
              <div className="relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative h-28 w-44 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                    <img
                      src={image}
                      alt="Event Cover Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>

                  <div className="flex-1 space-y-1.5 text-center sm:text-left min-w-0">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
                        Cover Image Ready
                      </span>
                      {uploadedFileSize && (
                        <span className="text-xs text-muted-foreground">{uploadedFileSize}</span>
                      )}
                    </div>

                    <p className="truncate text-xs font-medium text-foreground">
                      {uploadedFileName || (image.startsWith("data:") ? "Uploaded Image File" : image)}
                    </p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-7 text-xs gap-1.5"
                      >
                        <UploadCloud className="h-3.5 w-3.5" /> Change Image
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setImage("");
                          setUploadedFileName("");
                          setUploadedFileSize("");
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : imageMode === "upload" ? (
              /* Drag & Drop File Upload Zone */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all",
                  isDragging
                    ? "border-primary bg-primary/5 scale-[1.01]"
                    : "border-border bg-card/50 hover:border-primary/50 hover:bg-muted/30"
                )}
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  Click to upload event photo or drag & drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports PNG, JPG, JPEG, WEBP or AVIF (Up to 10 MB)
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="mt-4 pointer-events-none text-xs gap-1.5 shadow-xs"
                >
                  <FileImage className="h-3.5 w-3.5" /> Browse Image File
                </Button>
              </div>
            ) : (
              /* Direct Image URL input */
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Public Image URL</label>
                <Input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                />
                <p className="text-[11px] text-muted-foreground">
                  Paste any public HTTPS image link from Unsplash, Cloudinary, or AWS S3.
                </p>
              </div>
            )}

            {/* Description Narrative */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-medium text-foreground">Description</label>
              <Textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail route conditions, marshalling support, scenic highlights, and mandatory gear..."
              />
            </div>
          </div>

          {/* Highlights Tag Chips */}
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">
                Key Highlights & Features
              </label>
              <span className="text-[11px] text-muted-foreground">Press Enter or click +</span>
            </div>

            <div className="flex gap-2">
              <Input
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddHighlight();
                  }
                }}
                placeholder="e.g. 1,200m Elevation Gain, Finisher Medal"
              />
              <Button type="button" variant="secondary" onClick={handleAddHighlight}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>

            {highlights.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {highlights.map((h, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs"
                  >
                    <span>{h}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(i)}
                      className="rounded-full hover:bg-muted p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic Schedule Table */}
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">Ride Schedule / Timeline</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddScheduleItem}
                className="h-7 text-xs"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Milestone
              </Button>
            </div>

            {schedule.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No schedule milestones added yet.</p>
            ) : (
              <div className="space-y-2">
                {schedule.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={item.time}
                      onChange={(e) => handleUpdateSchedule(index, "time", e.target.value)}
                      placeholder="e.g. 06:00 AM"
                      className="w-32 shrink-0 text-xs"
                    />
                    <Input
                      value={item.activity}
                      onChange={(e) => handleUpdateSchedule(index, "activity", e.target.value)}
                      placeholder="e.g. Flag-off & Rider Rollout"
                      className="flex-1 text-xs"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveScheduleItem(index)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="pt-4 border-t border-border flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="min-w-28 gap-2">
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {isEditing ? "Saving..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Create Event"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

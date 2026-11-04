import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DashboardEvent } from "@/types/events";
import { useDeleteEventMutation } from "@/features/events/hooks.events";
import { toast } from "sonner";
import { Archive, Trash2, AlertTriangle, Loader2, AlertCircle } from "lucide-react";

interface DeleteEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: DashboardEvent | null;
}

export function DeleteEventDialog({
  open,
  onOpenChange,
  event,
}: DeleteEventDialogProps) {
  const deleteMutation = useDeleteEventMutation();
  const [isArchiving, setIsArchiving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  if (!event) return null;

  const handleArchive = async () => {
    setActionError(null);
    setIsArchiving(true);
    try {
      await deleteMutation.mutateAsync({ id: event.id, archiveOnly: true });
      toast.success(`"${event.title}" archived and unpublished`);
      onOpenChange(false);
    } catch (err: any) {
      const msg = err?.message || "Failed to archive event";
      setActionError(msg);
      toast.error(msg);
    } finally {
      setIsArchiving(false);
    }
  };

  const handlePermanentDelete = async () => {
    setActionError(null);
    setIsDeleting(true);
    try {
      await deleteMutation.mutateAsync({ id: event.id, archiveOnly: false });
      toast.success(`"${event.title}" deleted permanently`);
      onOpenChange(false);
    } catch (err: any) {
      const msg = err?.message || "Failed to delete event";
      setActionError(msg);
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const isPending = isArchiving || isDeleting || deleteMutation.isPending;

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!isPending) {
          setActionError(null);
          onOpenChange(next);
        }
      }}
    >
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <AlertDialogTitle className="text-center text-lg font-bold">
            Manage Event: {event.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-xs text-muted-foreground">
            Choose whether to archive the ride (unpublish & cancel) to preserve past participant
            records, or permanently remove it from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {actionError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="flex-1">{actionError}</span>
          </div>
        )}

        <div className="my-2 rounded-lg border border-border bg-muted/30 p-3 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date:</span>
            <span className="font-medium text-foreground">{event.date || "TBD"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Registered Riders:</span>
            <span className="font-medium text-foreground">{event.total_registrations || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Current Status:</span>
            <span className="font-medium uppercase text-foreground">{event.status}</span>
          </div>
        </div>

        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
          <AlertDialogCancel disabled={isPending} className="w-full sm:w-auto text-xs">
            Cancel
          </AlertDialogCancel>

          <Button
            type="button"
            variant="outline"
            onClick={handleArchive}
            disabled={isPending}
            className="w-full sm:w-auto text-xs gap-1.5 border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
          >
            {isArchiving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Archive className="h-3.5 w-3.5" />
            )}
            {isArchiving ? "Archiving..." : "Archive / Unpublish"}
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handlePermanentDelete}
            disabled={isPending}
            className="w-full sm:w-auto text-xs gap-1.5"
          >
            {isDeleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            {isDeleting ? "Deleting..." : "Delete Permanently"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

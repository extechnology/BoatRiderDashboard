import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardEventsApi } from "@/services/dashboardEvents";
import { DashboardEvent, EventRegistrationItem, RegistrationStatus } from "@/types/events";

export const useEventsQuery = (params?: {
  search?: string;
  category?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: ["dashboard-events", params],
    queryFn: async () => {
      const res = await dashboardEventsApi.getEvents(params);
      return res.data;
    },
    staleTime: 1000 * 10,
  });
};

export const useEventQuery = (id?: string) => {
  return useQuery({
    queryKey: ["dashboard-event", id],
    queryFn: async () => {
      if (!id) return null;
      return await dashboardEventsApi.getEvent(id);
    },
    enabled: !!id,
  });
};

export const useCreateEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<DashboardEvent>) => {
      const res = await dashboardEventsApi.createEvent(payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-events"] });
    },
  });
};

export const useUpdateEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<DashboardEvent> }) => {
      const res = await dashboardEventsApi.updateEvent(id, payload);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-events"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-event", variables.id] });
    },
  });
};

export const useDeleteEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, archiveOnly = false }: { id: string; archiveOnly?: boolean }) => {
      return await dashboardEventsApi.deleteEvent(id, archiveOnly);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-events"] });
    },
  });
};

export const useEventRegistrationsQuery = (
  eventId?: string,
  params?: { search?: string; status?: string }
) => {
  return useQuery({
    queryKey: ["event-registrations", eventId, params],
    queryFn: async () => {
      if (!eventId) return { data: [], totalRegistrations: 0, eventTitle: "", eventId: "" };
      return await dashboardEventsApi.getEventRegistrations(eventId, params);
    },
    enabled: !!eventId,
  });
};

export const useUpdateRegistrationStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      registrationId,
      status,
      eventId,
    }: {
      registrationId: string;
      status: RegistrationStatus;
      eventId: string;
    }) => {
      const res = await dashboardEventsApi.updateRegistrationStatus(registrationId, status);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate both attendees list and the main events list to reflect reclaimed spots!
      queryClient.invalidateQueries({ queryKey: ["event-registrations", variables.eventId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-events"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-event", variables.eventId] });
    },
  });
};

export const exportAttendeesCsvFile = async (
  eventId: string,
  eventTitle: string
) => {
  await dashboardEventsApi.downloadAttendeesCsv(eventId, eventTitle);
};

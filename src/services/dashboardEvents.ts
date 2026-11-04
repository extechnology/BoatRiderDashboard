import { axiosInstance } from "@/services/axiosInstance";
import { DashboardEvent, EventRegistrationItem, RegistrationStatus } from "@/types/events";

/**
 * Extracts a human-friendly and diagnostic error message from any API error.
 */
export function formatApiError(err: any): string {
  if (!err) return "An unexpected error occurred.";

  if (err.code === "ERR_NETWORK" || (!err.response && typeof navigator !== "undefined" && !navigator.onLine)) {
    return "Network connection offline or unreachable. Please check your internet connection.";
  }

  if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
    return "Request timed out. The server took too long to respond. Please try again.";
  }

  if (err.response) {
    const status = err.response.status;
    const data = err.response.data;

    if (status === 401) {
      return "Authentication session expired or required. Please log in again.";
    }
    if (status === 403) {
      return "Access denied. You do not have permission to perform this event action.";
    }
    if (status === 404) {
      return "The requested event resource was not found on the server.";
    }
    if (status === 409) {
      return data?.message || data?.detail || "Conflict: This event slug or ticket code already exists.";
    }
    if (status === 422 || status === 400) {
      if (typeof data === "string") return data;
      if (data?.message) return data.message;
      if (data?.detail) return data.detail;
      if (data?.error) return data.error;
      // Handle Django / DRF field errors dictionary { field: ["error"] }
      if (typeof data === "object") {
        const firstKey = Object.keys(data)[0];
        const val = data[firstKey];
        if (Array.isArray(val) && val[0]) {
          return `${firstKey}: ${val[0]}`;
        }
        if (typeof val === "string") return `${firstKey}: ${val}`;
      }
      return "Invalid form payload submitted. Please review your input.";
    }
    if (status >= 500) {
      return "Server error (HTTP 500). The backend encountered an unexpected condition.";
    }
  }

  return err.message || "An unexpected error occurred while communicating with the service.";
}

export const dashboardEventsApi = {
  // 1. List events (with search, category, status, and pagination toggles)
  getEvents: async (params?: {
    search?: string;
    category?: string;
    status?: string;
    paginate?: boolean;
    page?: number;
  }): Promise<{ count: number; data: DashboardEvent[] }> => {
    try {
      const cleanParams: Record<string, any> = { paginate: false };
      if (params?.search) cleanParams.search = params.search;
      if (params?.category && params.category !== "All") cleanParams.category = params.category;
      if (params?.status && params.status !== "All") cleanParams.status = params.status.toLowerCase();
      if (params?.page) cleanParams.page = params.page;

      const res = await axiosInstance.get("dashboard/events/", {
        params: cleanParams,
      });
      const raw = res.data;
      if (Array.isArray(raw)) {
        return { count: raw.length, data: raw };
      }
      if (raw && Array.isArray(raw.data)) {
        return { count: raw.count ?? raw.data.length, data: raw.data };
      }
      if (raw && Array.isArray(raw.results)) {
        return { count: raw.count ?? raw.results.length, data: raw.results };
      }
      return { count: 0, data: [] };
    } catch (err: any) {
      throw new Error(formatApiError(err));
    }
  },

  // 2. Fetch single event details for editing
  getEvent: async (id: string): Promise<DashboardEvent> => {
    try {
      const res = await axiosInstance.get(`dashboard/events/${id}/`);
      return res.data?.data || res.data;
    } catch (err: any) {
      throw new Error(formatApiError(err));
    }
  },

  // 3. Create a new event
  createEvent: async (
    payload: Partial<DashboardEvent>
  ): Promise<{ success: boolean; message?: string; data: DashboardEvent }> => {
    try {
      const res = await axiosInstance.post("dashboard/events/", payload);
      return res.data;
    } catch (err: any) {
      throw new Error(formatApiError(err));
    }
  },

  // 4. Update an existing event (partial patch)
  updateEvent: async (
    id: string,
    payload: Partial<DashboardEvent>
  ): Promise<{ success: boolean; message?: string; data: DashboardEvent }> => {
    try {
      const res = await axiosInstance.patch(`dashboard/events/${id}/`, payload);
      return res.data;
    } catch (err: any) {
      throw new Error(formatApiError(err));
    }
  },

  // 5. Delete or Archive an event
  deleteEvent: async (
    id: string,
    archiveOnly = false
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await axiosInstance.delete(`dashboard/events/${id}/`, {
        params: archiveOnly ? { archive: true } : {},
      });
      return res.data;
    } catch (err: any) {
      throw new Error(formatApiError(err));
    }
  },

  // 6. Get all registered riders for an event
  getEventRegistrations: async (
    eventId: string,
    params?: { search?: string; status?: string }
  ): Promise<{
    success: boolean;
    eventId: string;
    eventTitle: string;
    totalRegistrations: number;
    data: EventRegistrationItem[];
  }> => {
    try {
      const cleanParams: Record<string, any> = {};
      if (params?.search) cleanParams.search = params.search;
      if (params?.status && params.status !== "All") cleanParams.status = params.status.toLowerCase();

      const res = await axiosInstance.get(`dashboard/events/${eventId}/registrations/`, {
        params: cleanParams,
      });
      const raw = res.data;
      const items = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw?.results)
        ? raw.results
        : [];
      return {
        success: raw?.success ?? true,
        eventId: raw?.eventId || eventId,
        eventTitle: raw?.eventTitle || "",
        totalRegistrations: raw?.totalRegistrations ?? items.length,
        data: items as EventRegistrationItem[],
      };
    } catch (err: any) {
      throw new Error(formatApiError(err));
    }
  },

  // 7. Update rider registration status (e.g. mark attended or cancelled)
  updateRegistrationStatus: async (
    registrationId: string,
    status: RegistrationStatus
  ): Promise<{ success: boolean; message?: string; data: EventRegistrationItem }> => {
    try {
      const res = await axiosInstance.patch(
        `dashboard/events/registrations/${registrationId}/status/`,
        { status }
      );
      return res.data;
    } catch (err: any) {
      throw new Error(formatApiError(err));
    }
  },

  // 8. Download Marshal CSV Export
  downloadAttendeesCsv: async (eventId: string, eventTitle: string): Promise<void> => {
    try {
      const res = await axiosInstance.get(`dashboard/events/${eventId}/export-csv/`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const safeTitle = (eventTitle || "event").toLowerCase().replace(/[^a-z0-9]+/g, "_");
      link.setAttribute("download", `${safeTitle}_attendees.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      throw new Error(formatApiError(err));
    }
  },
};

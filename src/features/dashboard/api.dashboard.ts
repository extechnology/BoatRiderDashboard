import { axiosInstance } from "@/services/axiosInstance";

export const getStatistics = async () => {
  const response = await axiosInstance.get("dashboard/stats/");
  return response.data;
};

export const getRecentOrders = async () => {
  const response = await axiosInstance.get("dashboard/resend-orders/");
  return response.data;
};
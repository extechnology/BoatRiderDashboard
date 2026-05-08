import { axiosInstance } from "@/services/axiosInstance";

export const getOrders = async () => {
    const response = await axiosInstance.get("dashboard/orders/total-orders/");
    return response.data;
}
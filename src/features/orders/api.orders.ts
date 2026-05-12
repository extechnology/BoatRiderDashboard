import { axiosInstance } from "@/services/axiosInstance";

export const getOrders = async () => {
    const response = await axiosInstance.get("dashboard/orders/total-orders/");
    return response.data;
}

export const orderStatusUpdate = async (id: number, status: string) => {
    const response = await axiosInstance.patch(`dashboard/orders/order-status-update/${id}/`, { status });
    return response.data;
}

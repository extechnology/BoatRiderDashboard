import { axiosInstance } from "@/services/axiosInstance";

export const getAccessories = async () => {
    const response = await axiosInstance.get("dashboard/products/accessories/");
    return response.data;
}
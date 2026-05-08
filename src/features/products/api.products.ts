import { axiosInstance } from "@/services/axiosInstance";

export const getProducts = async () => {
    const response = await axiosInstance.get("dashboard/products/bikes/");
    return response.data;
}
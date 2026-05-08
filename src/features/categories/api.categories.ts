import { axiosInstance } from "@/services/axiosInstance";

export const getCategories = async () => {
    const response = await axiosInstance.get("dashboard/categories/all-categories/");
    return response.data;
}
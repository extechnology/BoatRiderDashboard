import { axiosInstance } from "@/services/axiosInstance";

export const getBrands = async () => {
    const response = await axiosInstance.get("dashboard/brands/list/");
    return response.data;
}
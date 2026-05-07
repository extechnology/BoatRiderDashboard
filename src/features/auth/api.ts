import { AxiosInstance } from "axios";

export const loginUser = async (axiosInstance: AxiosInstance, identifier: string, password: string) => {
    const response = await axiosInstance.post("/auth/login", { identifier, password });
    return response.data;
}

export const logoutUser = async (axiosInstance: AxiosInstance) => {
    const response = await axiosInstance.post("/admin/auth/logout");
    return response.data;
}

export const getCurrentUser = async (axiosInstance: AxiosInstance) => {
    const response = await axiosInstance.get("/admin/auth/me");
    return response.data;
}
import { axiosInstance } from "@/services/axiosInstance";

export const loginUser = async (identifier: string, password: string) => {
    const response = await axiosInstance.post("dashboard/login/", { identifier, password });
    return response.data;
}

export const logoutUser = async () => {
    const response = await axiosInstance.post("dashboard/logout/");
    return response.data;
}

export const getCurrentUser = async () => {
  const response = await axiosInstance.get("dashboard/check-login/");
  return response.data;
};
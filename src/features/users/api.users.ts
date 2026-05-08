import { axiosInstance } from "@/services/axiosInstance";

export const getUsers = async () => {
    const response = await axiosInstance.get("dashboard/users/total_users/");
    return response.data;
}

// export const getActiveUsers = async () => {
//     const response = await axiosInstance.get("dashboard/users/active-users/");
//     return response.data;
// }

// export const getInactiveUsers = async () => {
//     const response = await axiosInstance.get("dashboard/users/inactive-users/");
//     return response.data;
// }

// export const getArchivedUsers = async () => {
//     const response = await axiosInstance.get("dashboard/users/archived-users/");
//     return response.data;
// }
import { axiosInstance } from "@/services/axiosInstance";

export const getContactList = async()=>{
    const response = await axiosInstance.get("dashboard/contact/enquiries/");
    return response.data;
}
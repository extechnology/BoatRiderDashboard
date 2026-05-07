import { useQuery, useMutation } from "@tanstack/react-query";
import { getCurrentUser, loginUser, logoutUser } from "./api";
import { axiosInstance } from "@/services/axiosInstance";

export const useAuthQuery = () => {
    return useQuery({
        queryKey: ["auth" , "current-user"],
        queryFn: () => getCurrentUser(axiosInstance)
    })
}

export const useLogin = () => {
    return useMutation({
        mutationFn: ({identifier, password} : {identifier: string, password: string}) => loginUser(axiosInstance, identifier, password)
    })
}

export const useLogout = () => {
    return useMutation({
        mutationFn: () => logoutUser(axiosInstance)
    })
}
import { getOrders, orderStatusUpdate } from "./api.orders";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useOrders = () => {
    return useQuery({
        queryKey: ["orders"],
        queryFn: () => getOrders(),
    });
}

export const useOrderStatusUpdate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { id: number, status: string }) => orderStatusUpdate(data.id, data.status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        }
    });
}
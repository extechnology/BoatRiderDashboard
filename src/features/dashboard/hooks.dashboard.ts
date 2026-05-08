import { useQuery } from "@tanstack/react-query";
import { getStatistics, getRecentOrders } from "./api.dashboard";

export const useStatisticsQuery = () => {
    return useQuery({
        queryKey: ["statistics"],
        queryFn: () => getStatistics(),
    });
};

export const useRecentOrdersQuery = () => {
    return useQuery({
        queryKey: ["recent-orders"],
        queryFn: () => getRecentOrders(),
    });
};
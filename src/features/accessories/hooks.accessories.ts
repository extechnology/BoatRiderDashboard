import { useQuery } from "@tanstack/react-query";
import { getAccessories } from "./api.accessories";

export const useAccessoriesQuery = () => {
    return useQuery({
        queryKey: ["accessories"],
        queryFn: getAccessories,
    });
}
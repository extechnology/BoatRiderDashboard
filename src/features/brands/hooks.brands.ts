import { useQuery } from "@tanstack/react-query";
import { getBrands } from "./api.brands";

export const useBrandsQuery = () => {
    return useQuery({
        queryKey: ["brands"],
        queryFn: () => getBrands(),
    });
}
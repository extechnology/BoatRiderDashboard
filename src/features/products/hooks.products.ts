import { useQuery } from "@tanstack/react-query";
import { getProducts } from "./api.products";

export const useProductsQuery = () => {
    return useQuery({
        queryKey: ["products"],
        queryFn: () => getProducts(),
    });
}
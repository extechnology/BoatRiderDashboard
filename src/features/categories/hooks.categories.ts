import { useQuery } from "@tanstack/react-query";
import { getCategories } from "./api.categories";

export const useCategoriesQuery = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: () => getCategories(),
    });
}
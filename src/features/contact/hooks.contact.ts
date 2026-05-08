import { useQuery } from "@tanstack/react-query";
import { getContactList } from "./api.contact";

export const useContactListQuery = () => {
    return useQuery({
        queryKey: ["contact"],
        queryFn: () => getContactList(),
    });
}
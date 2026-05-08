import { getUsers } from "./api.users";
import { useQuery } from "@tanstack/react-query";

export const useUsersQuery = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: () => getUsers(),
    });
}

// export const useActiveUsersQuery = () => {
//     return useQuery({
//         queryKey: ["users", "active"],
//         queryFn: () => getActiveUsers(),
//     });
// }

// export const useInactiveUsersQuery = () => {
//     return useQuery({
//         queryKey: ["users", "inactive"],
//         queryFn: () => getInactiveUsers(),
//     });
// }

// export const useArchivedUsersQuery = () => {
//     return useQuery({
//         queryKey: ["users", "archived"],
//         queryFn: () => getArchivedUsers(),
//     });
// }
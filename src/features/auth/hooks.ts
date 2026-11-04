import { useQuery, useMutation } from "@tanstack/react-query";
import { getCurrentUser, loginUser, logoutUser } from "./api";

export const useAuthQuery = () => {
  return useQuery({
    queryKey: ["auth", "current-user"],
    queryFn: async () => {
      try {
        return await getCurrentUser();
      } catch (err: any) {
        // If 401/403 or session not found, return unauthenticated state cleanly
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          return { is_authenticated: false, user: null };
        }
        // If network error, rethrow so ErrorBoundary / UI can report network issue
        throw err;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ identifier, password }: { identifier: string; password: string }) =>
      loginUser(identifier, password),
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: () => logoutUser(),
  });
};

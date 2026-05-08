import { useQuery, useMutation } from "@tanstack/react-query";
import { getCurrentUser, loginUser, logoutUser } from "./api";

export const useAuthQuery = () => {
  return useQuery({
    queryKey: ["auth", "current-user"],
    queryFn: () => getCurrentUser(),
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

import { useMutation, useQuery } from "@tanstack/react-query";
import * as UsersAPI from "../api/endpoints/users";
import useAuthenticationStore from "./authentication.store";
import { getQueryClient } from "./queryClient";

const queryClient = getQueryClient();

export const useCurrentUser = () => {
  const userId = useAuthenticationStore((state) => state.currentUserId);

  return useQuery({
    queryKey: ["users", userId],
    queryFn: () => {
      if (!userId) {
        return Promise.resolve(null);
      }

      return UsersAPI.getUser(userId);
    },
  });
};

export const useMutateCurrentUser = () => {
  const userId = useAuthenticationStore((state) => state.currentUserId);

  return useMutation({
    mutationFn: (data: UsersAPI.IPutUserRequest) => {
      if (!userId) {
        return Promise.resolve(null);
      }

      return UsersAPI.updateUser(userId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", userId] });
    },
  });
};

export const useUserTeams = (userId?: number | string) => {
  return useQuery({
    queryKey: ["users", userId, "teams"],
    queryFn: () => {
      if (!userId) {
        return Promise.resolve(null);
      }

      return UsersAPI.getTeams(userId);
    },
  });
};

export const useCurrentUserRole = () => {
  const userId = useAuthenticationStore((state) => state.currentUserId);
  const currentTeamId = useAuthenticationStore((state) => state.currentTeamId);

  const { data: userTeams } = useUserTeams(userId);

  if (!userTeams) {
    return null;
  }

  const team = userTeams.teams.find(({ id }) => id === currentTeamId);

  if (!team) {
    return null;
  }

  return team.role;
};

export const useNotificationRules = () => {
  const userId = useAuthenticationStore((state) => state.currentUserId);

  return useQuery({
    queryKey: ["users", userId, "notification-rules"],
    queryFn: async () => {
      if (!userId) return [];
      const response = await UsersAPI.getNotificationRules(userId);
      return response.rules ?? [];
    },
    // Polling would overwrite rules the user is editing.
    refetchInterval: false,
  });
};

export const useUpdateNotificationRules = () => {
  const userId = useAuthenticationStore((state) => state.currentUserId);

  return useMutation({
    mutationFn: (rules: UsersAPI.INotificationRule[]) => {
      if (!userId) return Promise.reject(new Error("Not signed in"));
      return UsersAPI.updateNotificationRules(userId, rules);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users", userId, "notification-rules"],
      });
    },
  });
};

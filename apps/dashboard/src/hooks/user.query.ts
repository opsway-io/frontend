import { useMutation, useQuery } from "@tanstack/react-query";
import * as UsersAPI from "../api/endpoints/users";
import useAuthenticationStore from "./authentication.store";
import { getQueryClient } from "./client.query";

const queryClient = getQueryClient();

export const useCurrentUser = () => {
  const userId = useAuthenticationStore((state) => state.currentUserId);

  return useQuery(["users", userId], () => {
    if (!userId) {
      return Promise.resolve(null);
    }

    return UsersAPI.getUser(userId);
  });
};

export const useMutateCurrentUser = () => {
  const userId = useAuthenticationStore((state) => state.currentUserId);

  return useMutation(
    (data: UsersAPI.IPutUserRequest) => {
      if (!userId) {
        return Promise.resolve(null);
      }

      return UsersAPI.updateUser(userId, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["users", userId]);
      },
    }
  );
};

export const deleteUser = async (userId: number | string) => {
  await UsersAPI.deleteUser(userId);
  queryClient.clear();
  localStorage.clear();

  window.location.reload();
};

export const useUserTeams = (userId?: number | string) => {
  return useQuery(["users", userId, "teams"], () => {
    if (!userId) {
      return Promise.resolve(null);
    }

    return UsersAPI.getTeams(userId);
  });
};

export const useCurrentUserRole = () => {
  const userId = useAuthenticationStore((state) => state.currentUserId);
  const currentTeamId = useAuthenticationStore((state) => state.currentTeamId);

  const { data: userTeams } = useUserTeams(userId);

  if (!userTeams) {
    return null;
  }

  const team = userTeams.teams.find((team) => team.id === currentTeamId);

  if (!team) {
    return null;
  }

  return team.role;
};

import { useMutation, useQuery } from "@tanstack/react-query";
import * as TeamsAPI from "../api/endpoints/teams";
import useAuthenticationStore from "./authentication.store";
import { getQueryClient } from "./queryClient";

const queryClient = getQueryClient();

const apiKeysQueryKey = (teamId: number | undefined) => [
  "teams",
  teamId,
  "apikeys",
];

export const useApiKeys = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery({
    queryKey: apiKeysQueryKey(teamId),
    queryFn: () => {
      if (!teamId) return Promise.resolve(null);
      return TeamsAPI.getApiKeys(teamId);
    },
    enabled: !!teamId,
  });
};

export const useCreateApiKey = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation({
    mutationFn: (name: string) => {
      if (!teamId) return Promise.reject(new Error("No team selected"));
      return TeamsAPI.createApiKey(teamId, { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeysQueryKey(teamId) });
    },
  });
};

export const useDeleteApiKey = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation({
    mutationFn: (keyId: number) => {
      if (!teamId) return Promise.reject(new Error("No team selected"));
      return TeamsAPI.deleteApiKey(teamId, keyId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeysQueryKey(teamId) });
    },
  });
};

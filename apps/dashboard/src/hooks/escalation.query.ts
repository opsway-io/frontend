import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as TeamsAPI from "../api/endpoints/teams";
import useAuthenticationStore from "./authentication.store";

export const useEscalationPolicy = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery(
    ["team", teamId, "escalationPolicy"],
    () => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return TeamsAPI.getEscalationPolicy(teamId);
    },
    {
      enabled: !!teamId,
    },
  );
};

export const useUpdateEscalationPolicy = () => {
  const queryClient = useQueryClient();
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation(
    (policy: TeamsAPI.EscalationPolicy) => {
      if (!teamId) {
        return Promise.reject(new Error("Team not found"));
      }
      return TeamsAPI.putEscalationPolicy(teamId, policy);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["team", teamId, "escalationPolicy"]);
      },
    },
  );
};

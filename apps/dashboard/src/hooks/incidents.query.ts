import { useMutation, useQuery } from "@tanstack/react-query";
import * as IncidentsAPI from "../api/endpoints/incidents";
import useAuthenticationStore from "./authentication.store";
import { getQueryClient } from "./client.query";

const queryClient = getQueryClient();


export const useIncidents = (offset = 0, limit = 5) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery(["team", teamId, "checks",
    {
      offset,
      limit,
    },
  ], () => {
    if (!teamId) {
      return Promise.resolve(null);
    }

    return IncidentsAPI.getIncidents(teamId, offset, limit);
  });
};


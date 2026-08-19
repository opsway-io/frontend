import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as IncidentsAPI from "../api/endpoints/incidents";
import useAuthenticationStore from "./authentication.store";
import { getQueryClient } from "./client.query";

const globalQueryClient = getQueryClient();

export const useIncidents = (offset = 0, limit = 5) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery(
    [
      "team",
      teamId,
      "incidents",
      {
        offset,
        limit,
      },
    ],
    () => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return IncidentsAPI.getIncidents(teamId, offset, limit);
    },
  );
};

export const useIncident = (incidentId: number) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery(["team", teamId, "incident", incidentId], () => {
    if (!teamId || !incidentId) {
      return Promise.resolve(null);
    }

    return IncidentsAPI.getIncident(teamId, incidentId);
  });
};

export const useMonitorIncidents = (
  monitorId: number,
  offset = 0,
  limit = 5,
) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery(
    [
      "team",
      teamId,
      "monitor",
      monitorId,
      "incidents",
      {
        offset,
        limit,
      },
    ],
    () => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return IncidentsAPI.getMonitorIncidents(teamId, monitorId, offset, limit);
    },
    {
      refetchInterval: 10000,
    }
  );
};

export const useSolveIncident = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);
  const queryClient = useQueryClient();

  return useMutation(
    (data: { incidentId: number }) => {
      if (!teamId) {
        return Promise.reject(new Error("Team not found"));
      }
      return IncidentsAPI.patchSolveMonitorIncident(teamId, data.incidentId, {
        resolved: true,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["team", teamId]);
        queryClient.invalidateQueries(["teams", teamId]);
      },
    },
  );
};

export const useAcknowledgeIncident = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);
  const queryClient = useQueryClient();

  return useMutation(
    (data: { incidentId: number }) => {
      if (!teamId) {
        return Promise.reject(new Error("Team not found"));
      }
      return IncidentsAPI.patchAcknowledgeMonitorIncident(teamId, data.incidentId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["team", teamId]);
        queryClient.invalidateQueries(["teams", teamId]);
      },
    },
  );
};

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as IncidentsAPI from "../api/endpoints/incidents";
import useAuthenticationStore from "./authentication.store";

export const useIncidents = (resolved?: boolean, offset = 0, limit = 5) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery({
    queryKey: [
      "teams",
      teamId,
      "incidents",
      {
        resolved,
        offset,
        limit,
      },
    ],
    queryFn: () => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return IncidentsAPI.getIncidents(teamId, resolved, offset, limit);
    },
  });
};

export const useIncident = (incidentId: number) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery({
    queryKey: ["teams", teamId, "incident", incidentId],
    queryFn: () => {
      if (!teamId || !incidentId) {
        return Promise.resolve(null);
      }

      return IncidentsAPI.getIncident(teamId, incidentId);
    },
  });
};

export const useMonitorIncidents = (
  monitorId: number,
  offset = 0,
  limit = 5,
) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery({
    queryKey: [
      "teams",
      teamId,
      "monitor",
      monitorId,
      "incidents",
      {
        offset,
        limit,
      },
    ],
    queryFn: () => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return IncidentsAPI.getMonitorIncidents(teamId, monitorId, offset, limit);
    },
    refetchInterval: 10000,
  });
};

export const useSolveIncident = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { incidentId: number }) => {
      if (!teamId) {
        return Promise.reject(new Error("Team not found"));
      }
      return IncidentsAPI.patchSolveMonitorIncident(teamId, data.incidentId, {
        resolved: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams", teamId] });
    },
  });
};

export const useAcknowledgeIncident = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { incidentId: number }) => {
      if (!teamId) {
        return Promise.reject(new Error("Team not found"));
      }
      return IncidentsAPI.patchAcknowledgeMonitorIncident(
        teamId,
        data.incidentId,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams", teamId] });
    },
  });
};

export const useIncidentAlerts = (
  incidentId: number,
  offset = 0,
  limit = 50,
) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery({
    queryKey: [
      "teams",
      teamId,
      "incident",
      incidentId,
      "alerts",
      {
        offset,
        limit,
      },
    ],
    queryFn: () => {
      if (!teamId || !incidentId) {
        return Promise.resolve(null);
      }

      return IncidentsAPI.getIncidentAlerts(teamId, incidentId, offset, limit);
    },
  });
};

export const useIncidentOccurrences = (
  incidentId: number,
  offset?: number,
  limit?: number,
) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery({
    queryKey: [
      "teams",
      teamId,
      "incidents",
      incidentId,
      "occurrences",
      offset,
      limit,
    ],
    queryFn: () => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return IncidentsAPI.getIncidentOccurrences(
        teamId,
        incidentId,
        offset,
        limit,
      );
    },
    enabled: !!teamId,
  });
};

export const useUpdateIncidentVisibility = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      incidentId: number;
      isStatusPageVisible: boolean;
    }) => {
      if (!teamId) {
        return Promise.reject(new Error("Team not found"));
      }
      return IncidentsAPI.patchIncidentVisibility(teamId, data.incidentId, {
        isStatusPageVisible: data.isStatusPageVisible,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams", teamId] });
    },
  });
};

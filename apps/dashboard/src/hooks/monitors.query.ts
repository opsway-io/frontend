import { useMutation, useQuery, keepPreviousData } from "@tanstack/react-query";
import * as MonitorsAPI from "../api/endpoints/monitors";
import useAuthenticationStore from "./authentication.store";
import { getQueryClient } from "./queryClient";

const queryClient = getQueryClient();

export const useCreateMonitor = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation({
    mutationFn: (data: MonitorsAPI.CreateMonitorRequest) => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return MonitorsAPI.createMonitor(teamId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teams", teamId, "monitors"],
      });
    },
  });
};

export const useDeleteMonitor = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation({
    mutationFn: (monitorId: number) => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return MonitorsAPI.deleteMonitor(teamId, monitorId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teams", teamId, "monitors"],
      });
    },
  });
};

export const useUpdateMonitor = (moniterId: number) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation({
    mutationFn: (data: MonitorsAPI.UpdateMonitorRequest) => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return MonitorsAPI.updateMonitor(teamId, moniterId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teams", teamId, "monitors"],
      });
    },
  });
};

export const useUpdateMonitorState = (monitorId: number) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation({
    mutationFn: (state: "ACTIVE" | "INACTIVE") => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return MonitorsAPI.updateMonitorState(teamId, monitorId, state);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teams", teamId, "monitors"],
      });
    },
  });
};

export const useMonitor = (monitorId: number) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery({
    queryKey: ["teams", teamId, "monitors", monitorId],
    queryFn: () => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return MonitorsAPI.getMonitor(teamId, monitorId);
    },
  });
};

export const useMonitors = (offset = 0, limit = 100) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery({
    queryKey: ["teams", teamId, "monitors", { offset, limit }],
    queryFn: () => {
      if (!teamId) {
        return Promise.resolve(null);
      }
      return MonitorsAPI.getMonitors(teamId, offset, limit);
    },
  });
};

export const useMonitorChecks = (monitorId?: number, offset = 0, limit = 5) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery({
    queryKey: [
      "teams",
      teamId,
      "monitors",
      monitorId,
      "checks",
      {
        offset,
        limit,
      },
    ],
    queryFn: () => {
      if (!teamId || !monitorId) {
        return Promise.resolve(null);
      }

      return MonitorsAPI.getMonitorChecks(teamId, monitorId, offset, limit);
    },
    placeholderData: keepPreviousData,
  });
};

export const useMonitorsIncidents = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery({
    queryKey: ["teams", teamId, "monitors", "incidents"],
    queryFn: () => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return MonitorsAPI.getMonitorsIncidents(teamId);
    },
    refetchInterval: 10000,
  });
};

export const useLatestMonitorCheck = (monitorId?: number) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery({
    queryKey: [
      "teams",
      teamId,
      "monitors",
      monitorId,
      "checks",
      {
        offset: 0,
        limit: 1,
      },
    ],
    queryFn: async () => {
      if (!teamId || !monitorId) {
        return Promise.resolve(null);
      }

      const res = await MonitorsAPI.getMonitorChecks(teamId, monitorId, 0, 1);
      if (res?.checks.length > 0) {
        return res.checks[0];
      }

      return null;
    },
  });
};

export const useMonitorCheck = (monitorId: number, checkId: number) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery({
    queryKey: ["teams", teamId, "monitors", monitorId, "checks", checkId],
    queryFn: () => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return MonitorsAPI.getMonitorCheck(teamId, monitorId, checkId);
    },
  });
};

export const useMonitorMetrics = (
  monitorId: number,
  start?: string,
  end?: string,
) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery({
    queryKey: ["teams", teamId, "monitors", monitorId, "metrics", start, end],
    queryFn: () => {
      if (!teamId) {
        return Promise.resolve(null);
      }
      return MonitorsAPI.getMonitorMetrics(teamId, monitorId, start, end);
    },
  });
};

export const useSearchMonitors = (
  offset: number,
  limit: number,
  query: string,
) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery({
    queryKey: ["teams", teamId, "monitors", { offset, query }],
    queryFn: () => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return MonitorsAPI.getMonitors(teamId, offset, limit, query || undefined);
    },
    placeholderData: keepPreviousData,
    refetchInterval: 10000,
  });
};

export const usePreviewOpenAPI = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation({
    mutationFn: (url: string) => {
      if (!teamId) {
        return Promise.reject(new Error("Team not found"));
      }

      return MonitorsAPI.previewOpenAPI(teamId, url);
    },
  });
};

export const useCreateMonitorsBulk = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation({
    mutationFn: (data: MonitorsAPI.CreateMonitorsBulkRequest) => {
      if (!teamId) {
        return Promise.reject(new Error("Team not found"));
      }

      return MonitorsAPI.createMonitorsBulk(teamId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teams", teamId, "monitors"],
      });
    },
  });
};

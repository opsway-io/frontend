import { useMutation, useQuery } from "@tanstack/react-query";
import * as MonitorsAPI from "../api/endpoints/monitors";
import useAuthenticationStore from "./authentication.store";
import { getQueryClient } from "./client.query";

const queryClient = getQueryClient();

export const useCreateMonitor = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation(
    (data: MonitorsAPI.CreateMonitorRequest) => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return MonitorsAPI.createMonitor(teamId, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["teams", teamId, "monitors"]);
      },
    },
  );
};

export const useDeleteMonitor = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation(
    (monitorId: number) => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return MonitorsAPI.deleteMonitor(teamId, monitorId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["teams", teamId, "monitors"]);
      },
    },
  );
};

export const useUpdateMonitor = (moniterId: number) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation(
    (data: MonitorsAPI.UpdateMonitorRequest) => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return MonitorsAPI.updateMonitor(teamId, moniterId, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["teams", teamId, "monitors"]);
      },
    },
  );
};

export const useUpdateMonitorState = (monitorId: number) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation(
    (state: "ACTIVE" | "INACTIVE") => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return MonitorsAPI.updateMonitorState(teamId, monitorId, state);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["teams", teamId, "monitors"]);
      },
    },
  );
};

export const useMonitor = (monitorId: number) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery(["teams", teamId, "monitors", monitorId], () => {
    if (!teamId) {
      return Promise.resolve(null);
    }

    return MonitorsAPI.getMonitor(teamId, monitorId);
  });
};

export const useMonitorChecks = (monitorId?: number, offset = 0, limit = 5) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery(
    [
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
    () => {
      if (!teamId || !monitorId) {
        return Promise.resolve(null);
      }

      return MonitorsAPI.getMonitorChecks(teamId, monitorId, offset, limit);
    },
    {
      keepPreviousData: true,
    },
  );
};

export const useFailedMonitorChecks = (monitorId: number, assertionId: number, offset = 0, limit = 5) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery(
    [
      "teams",
      teamId,
      "monitors",
      monitorId,
      "checks",
      "assertion",
      assertionId,
      {
        offset,
        limit,
      },
    ],
    () => {
      if (!teamId || !monitorId) {
        return Promise.resolve(null);
      }

      return MonitorsAPI.getFailedMonitorChecks(teamId, monitorId, assertionId, offset, limit);
    },
    {
      keepPreviousData: true,
    },
  );
};

export const useMonitorsIncidents = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery(["teams", teamId, "monitors", "incidents"], () => {
    if (!teamId) {
      return Promise.resolve(null);
    }

    return MonitorsAPI.getMonitorsIncidents(teamId);
  });
}


export const useLatestMonitorCheck = (monitorId?: number) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery(
    [
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
    async () => {
      if (!teamId || !monitorId) {
        return Promise.resolve(null);
      }

      const res = await MonitorsAPI.getMonitorChecks(teamId, monitorId, 0, 1);
      if (res?.checks.length > 0) {
        return res.checks[0];
      }

      return null;
    },
  );
};

export const useMonitorCheck = (monitorId: number, checkId: number) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery(
    ["teams", teamId, "monitors", monitorId, "checks", checkId],
    () => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return MonitorsAPI.getMonitorCheck(teamId, monitorId, checkId);
    },
  );
};

export const useMonitorMetrics = (monitorId: number) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery(["teams", teamId, "monitors", monitorId, "metrics"], () => {
    if (!teamId) {
      return Promise.resolve(null);
    }
    return MonitorsAPI.getMonitorMetrics(teamId, monitorId);
  });
};

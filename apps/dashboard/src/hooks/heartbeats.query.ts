import { useMutation, useQuery } from "@tanstack/react-query";
import * as HeartbeatsAPI from "../api/endpoints/heartbeats";
import useAuthenticationStore from "./authentication.store";
import { getQueryClient } from "./client.query";

const queryClient = getQueryClient();

export const useHeartbeats = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery(["teams", teamId, "heartbeats"], () => {
    if (!teamId) return Promise.resolve([]);
    return HeartbeatsAPI.getHeartbeats(teamId);
  });
};

export const useHeartbeat = (heartbeatId: number) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery(["teams", teamId, "heartbeats", heartbeatId], () => {
    if (!teamId) return Promise.resolve(null);
    return HeartbeatsAPI.getHeartbeat(teamId, heartbeatId);
  });
};

export const useCreateHeartbeat = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation(
    (data: HeartbeatsAPI.IPostHeartbeatRequest) => {
      if (!teamId) return Promise.reject(new Error("No team selected"));
      return HeartbeatsAPI.createHeartbeat(teamId, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["teams", teamId, "heartbeats"]);
      },
    },
  );
};

export const useUpdateHeartbeat = (heartbeatId: number) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation(
    (data: HeartbeatsAPI.IPutHeartbeatRequest) => {
      if (!teamId) return Promise.reject(new Error("No team selected"));
      return HeartbeatsAPI.updateHeartbeat(teamId, heartbeatId, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["teams", teamId, "heartbeats"]);
        queryClient.invalidateQueries([
          "teams",
          teamId,
          "heartbeats",
          heartbeatId,
        ]);
      },
    },
  );
};

export const useDeleteHeartbeat = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation(
    (heartbeatId: number) => {
      if (!teamId) return Promise.reject(new Error("No team selected"));
      return HeartbeatsAPI.deleteHeartbeat(teamId, heartbeatId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["teams", teamId, "heartbeats"]);
      },
    },
  );
};

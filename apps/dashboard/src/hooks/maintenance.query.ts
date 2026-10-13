import { useMutation, useQuery } from "@tanstack/react-query";
import * as MaintenanceAPI from "../api/endpoints/maintenance";
import useAuthenticationStore from "./authentication.store";
import { getQueryClient } from "./queryClient";

const queryClient = getQueryClient();

export const useMaintenanceWindows = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery({
    queryKey: ["teams", teamId, "maintenance"],
    queryFn: () => {
      if (!teamId) return Promise.resolve([]);
      return MaintenanceAPI.getMaintenanceWindows(teamId);
    },
  });
};

export const useMaintenanceWindow = (maintenanceId: number) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery({
    queryKey: ["teams", teamId, "maintenance", maintenanceId],
    queryFn: () => {
      if (!teamId) return Promise.resolve(null);
      return MaintenanceAPI.getMaintenanceWindow(teamId, maintenanceId);
    },
  });
};

export const useCreateMaintenanceWindow = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation({
    mutationFn: (data: MaintenanceAPI.IPostMaintenanceWindowRequest) => {
      if (!teamId) return Promise.reject(new Error("No team selected"));
      return MaintenanceAPI.createMaintenanceWindow(teamId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teams", teamId, "maintenance"],
      });
    },
  });
};

export const useUpdateMaintenanceWindow = (maintenanceId: number) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation({
    mutationFn: (data: MaintenanceAPI.IPutMaintenanceWindowRequest) => {
      if (!teamId) return Promise.reject(new Error("No team selected"));
      return MaintenanceAPI.updateMaintenanceWindow(
        teamId,
        maintenanceId,
        data,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teams", teamId, "maintenance"],
      });
    },
  });
};

export const useDeleteMaintenanceWindow = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation({
    mutationFn: (maintenanceId: number) => {
      if (!teamId) return Promise.reject(new Error("No team selected"));
      return MaintenanceAPI.deleteMaintenanceWindow(teamId, maintenanceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teams", teamId, "maintenance"],
      });
    },
  });
};

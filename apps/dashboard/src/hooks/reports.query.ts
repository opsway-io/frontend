import { useMutation, useQuery } from "@tanstack/react-query";
import * as ReportsAPI from "../api/endpoints/reports";
import useAuthenticationStore from "./authentication.store";
import { getQueryClient } from "./queryClient";

const queryClient = getQueryClient();

export const useReports = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery({
    queryKey: ["teams", teamId, "reports"],
    queryFn: () => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return ReportsAPI.getReports(teamId);
    },
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.reports?.some((report) => report.status === "PENDING")) {
        return 5000;
      }
      return false;
    },
  });
};

export const useCreateReport = () => {
  const currentTeamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation({
    mutationFn: (data: ReportsAPI.IPostReportRequest) => {
      if (!currentTeamId) {
        return Promise.reject(new Error("No team selected"));
      }
      return ReportsAPI.createReport(currentTeamId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teams", currentTeamId, "reports"],
      });
    },
  });
};

export const useReport = (reportId: number) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery({
    queryKey: ["teams", teamId, "reports", reportId],
    queryFn: () => {
      if (!teamId || !reportId) {
        return Promise.resolve(null);
      }

      return ReportsAPI.getReport(teamId, reportId);
    },
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === "PENDING") {
        return 5000;
      }
      return false;
    },
  });
};

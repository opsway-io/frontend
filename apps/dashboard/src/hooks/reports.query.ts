import { useMutation, useQuery } from "@tanstack/react-query";
import * as ReportsAPI from "../api/endpoints/reports";
import useAuthenticationStore from "./authentication.store";
import { getQueryClient } from "./client.query";

const queryClient = getQueryClient();

export const useReports = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery(
    ["teams", teamId, "reports"],
    () => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return ReportsAPI.getReports(teamId);
    },
    {
      refetchInterval: (data) => {
        if (data?.reports?.some((report) => report.status === "PENDING")) {
          return 5000;
        }
        return false;
      },
    },
  );
};

export const useCreateReport = () => {
  const currentTeamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation(
    (data: ReportsAPI.IPostReportRequest) => {
      if (!currentTeamId) {
        return Promise.reject(new Error("No team selected"));
      }
      return ReportsAPI.createReport(currentTeamId, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["teams", currentTeamId, "reports"]);
      },
    },
  );
};

export const useReport = (reportId: number) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery(
    ["teams", teamId, "reports", reportId],
    () => {
      if (!teamId || !reportId) {
        return Promise.resolve(null);
      }

      return ReportsAPI.getReport(teamId, reportId);
    },
    {
      refetchInterval: (data) => {
        if (data?.status === "PENDING") {
          return 5000;
        }
        return false;
      },
    },
  );
};

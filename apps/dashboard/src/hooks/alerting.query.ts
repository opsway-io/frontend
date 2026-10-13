import { useMutation, useQuery } from "@tanstack/react-query";
import * as AlertingAPI from "../api/endpoints/alerting";
import useAuthenticationStore from "./authentication.store";
import { getQueryClient } from "./queryClient";

const queryClient = getQueryClient();

export const useAlertRules = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery({
    queryKey: ["teams", teamId, "alerting"],
    queryFn: () => {
      if (!teamId) return Promise.resolve([]);
      return AlertingAPI.getAlertRules(teamId);
    },
  });
};

export const useAlertRule = (ruleId: number) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery({
    queryKey: ["teams", teamId, "alerting", ruleId],
    queryFn: () => {
      if (!teamId) return Promise.resolve(null);
      return AlertingAPI.getAlertRule(teamId, ruleId);
    },
  });
};

export const useCreateAlertRule = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation({
    mutationFn: (data: AlertingAPI.IPostAlertRuleRequest) => {
      if (!teamId) return Promise.reject(new Error("No team selected"));
      return AlertingAPI.createAlertRule(teamId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teams", teamId, "alerting"],
      });
    },
  });
};

export const useUpdateAlertRule = (ruleId: number) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation({
    mutationFn: (data: AlertingAPI.IPutAlertRuleRequest) => {
      if (!teamId) return Promise.reject(new Error("No team selected"));
      return AlertingAPI.updateAlertRule(teamId, ruleId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teams", teamId, "alerting"],
      });
      queryClient.invalidateQueries({
        queryKey: ["teams", teamId, "alerting", ruleId],
      });
    },
  });
};

export const useDeleteAlertRule = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation({
    mutationFn: (ruleId: number) => {
      if (!teamId) return Promise.reject(new Error("No team selected"));
      return AlertingAPI.deleteAlertRule(teamId, ruleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teams", teamId, "alerting"],
      });
    },
  });
};

export const useAlertRuleTriggers = (
  ruleId: number,
  offset = 0,
  limit = 50,
) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery({
    queryKey: [
      "teams",
      teamId,
      "alerting",
      ruleId,
      "triggers",
      { offset, limit },
    ],
    queryFn: () => {
      if (!teamId) return Promise.resolve(null);
      return AlertingAPI.getAlertRuleTriggers(teamId, ruleId, offset, limit);
    },
  });
};

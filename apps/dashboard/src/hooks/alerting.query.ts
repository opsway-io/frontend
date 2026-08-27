import { useMutation, useQuery } from "@tanstack/react-query";
import * as AlertingAPI from "../api/endpoints/alerting";
import useAuthenticationStore from "./authentication.store";
import { getQueryClient } from "./client.query";

const queryClient = getQueryClient();

export const useAlertRules = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery(["teams", teamId, "alerting"], () => {
    if (!teamId) return Promise.resolve([]);
    return AlertingAPI.getAlertRules(teamId);
  });
};

export const useAlertRule = (ruleId: number) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery(["teams", teamId, "alerting", ruleId], () => {
    if (!teamId) return Promise.resolve(null);
    return AlertingAPI.getAlertRule(teamId, ruleId);
  });
};

export const useCreateAlertRule = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation(
    (data: AlertingAPI.IPostAlertRuleRequest) => {
      if (!teamId) return Promise.reject(new Error("No team selected"));
      return AlertingAPI.createAlertRule(teamId, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["teams", teamId, "alerting"]);
      },
    },
  );
};

export const useUpdateAlertRule = (ruleId: number) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation(
    (data: AlertingAPI.IPutAlertRuleRequest) => {
      if (!teamId) return Promise.reject(new Error("No team selected"));
      return AlertingAPI.updateAlertRule(teamId, ruleId, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["teams", teamId, "alerting"]);
        queryClient.invalidateQueries(["teams", teamId, "alerting", ruleId]);
      },
    },
  );
};

export const useDeleteAlertRule = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useMutation(
    (ruleId: number) => {
      if (!teamId) return Promise.reject(new Error("No team selected"));
      return AlertingAPI.deleteAlertRule(teamId, ruleId);
    },
    {
	  onSuccess: () => {
		queryClient.invalidateQueries(["teams", teamId, "alerting"]);
	  },
	},
  );
};

export const useAlertRuleTriggers = (ruleId: number, offset = 0, limit = 50) => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);

  return useQuery(
	["teams", teamId, "alerting", ruleId, "triggers", { offset, limit }],
	() => {
	  if (!teamId) return Promise.resolve(null);
	  return AlertingAPI.getAlertRuleTriggers(teamId, ruleId, offset, limit);
	},
  );
};

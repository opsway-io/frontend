import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthenticationStore from "./authentication.store";
import {
  getAgentConfig,
  getAgentTriggers,
  createAgentTrigger,
  updateAgentTrigger,
  deleteAgentTrigger,
  triggerAgentEvent,
  AgentTriggerRule,
  getEntitlements,
  getIncidentInvestigations,
  getLogSearchServices,
  getServiceCatalog,
  getTeamUsage,
  updateOverageSettings,
  UsageRange,
  triggerInvestigation,
  approveRemediation,
  updateAgentConfig,
  updateEntitlement,
  upsertServiceCatalogItem,
  deleteServiceCatalogItem,
  ServiceCatalogItem,
  AgentConfig,
} from "../api/endpoints/suite";

export function useEntitlements() {
  const currentTeamId = useAuthenticationStore((s) => s.currentTeamId);
  return useQuery({
    queryKey: ["entitlements", currentTeamId],
    queryFn: () => getEntitlements(currentTeamId || 1),
    enabled: !!currentTeamId,
  });
}

export function useUpdateEntitlement() {
  const queryClient = useQueryClient();
  const currentTeamId = useAuthenticationStore((s) => s.currentTeamId);

  return useMutation({
    mutationFn: ({ product, tier, enabled }: { product: string; tier: string; enabled: boolean }) =>
      updateEntitlement(currentTeamId || 1, product, tier, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entitlements", currentTeamId] });
    },
  });
}

export function useServiceCatalog() {
  const currentTeamId = useAuthenticationStore((s) => s.currentTeamId);
  return useQuery({
    queryKey: ["serviceCatalog", currentTeamId],
    queryFn: () => getServiceCatalog(currentTeamId || 1),
    enabled: !!currentTeamId,
  });
}

export function useUpsertServiceCatalogItem() {
  const queryClient = useQueryClient();
  const currentTeamId = useAuthenticationStore((s) => s.currentTeamId);

  return useMutation({
    mutationFn: (item: Partial<ServiceCatalogItem>) =>
      upsertServiceCatalogItem(currentTeamId || 1, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceCatalog", currentTeamId] });
    },
  });
}

export function useDeleteServiceCatalogItem() {
  const queryClient = useQueryClient();
  const currentTeamId = useAuthenticationStore((s) => s.currentTeamId);

  return useMutation({
    mutationFn: (serviceId: number) =>
      deleteServiceCatalogItem(currentTeamId || 1, serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceCatalog", currentTeamId] });
    },
  });
}

export function useAgentConfig() {
  const currentTeamId = useAuthenticationStore((s) => s.currentTeamId);
  return useQuery({
    queryKey: ["agentConfig", currentTeamId],
    queryFn: () => getAgentConfig(currentTeamId || 1),
    enabled: !!currentTeamId,
  });
}

export function useUpdateAgentConfig() {
  const queryClient = useQueryClient();
  const currentTeamId = useAuthenticationStore((s) => s.currentTeamId);

  return useMutation({
    mutationFn: (cfg: Partial<AgentConfig>) =>
      updateAgentConfig(currentTeamId || 1, cfg),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agentConfig", currentTeamId] });
    },
  });
}

export function useIncidentInvestigations(incidentId: number) {
  const currentTeamId = useAuthenticationStore((s) => s.currentTeamId);
  return useQuery({
    queryKey: ["incidentInvestigations", currentTeamId, incidentId],
    queryFn: () => getIncidentInvestigations(currentTeamId || 1, incidentId),
    enabled: !!currentTeamId && incidentId > 0,
    refetchInterval: (query) => {
      const invs = query.state.data?.investigations;
      if (invs && invs.length > 0 && (invs[0].status === "RUNNING" || invs[0].status === "QUEUED")) {
        return 2000;
      }
      return false;
    },
  });
}

export function useTriggerInvestigation(incidentId: number) {
  const queryClient = useQueryClient();
  const currentTeamId = useAuthenticationStore((s) => s.currentTeamId);

  return useMutation({
    mutationFn: (userPrompt?: string) =>
      triggerInvestigation(currentTeamId || 1, incidentId, userPrompt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidentInvestigations", currentTeamId, incidentId] });
      queryClient.invalidateQueries({ queryKey: ["incidents", currentTeamId] });
    },
  });
}

export function useApproveRemediation(incidentId: number) {
  const queryClient = useQueryClient();
  const currentTeamId = useAuthenticationStore((s) => s.currentTeamId);

  return useMutation({
    mutationFn: ({ investigationId, actionId }: { investigationId: number; actionId: number }) =>
      approveRemediation(currentTeamId || 1, investigationId, actionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidentInvestigations", currentTeamId, incidentId] });
      queryClient.invalidateQueries({ queryKey: ["incidents", currentTeamId] });
    },
  });
}

export function useLogSearchServices() {
  const currentTeamId = useAuthenticationStore((s) => s.currentTeamId);
  return useQuery({
    queryKey: ["logSearchServices", currentTeamId],
    queryFn: () => getLogSearchServices(currentTeamId || 1),
    enabled: !!currentTeamId,
  });
}

export function useAgentTriggers() {
  const currentTeamId = useAuthenticationStore((s) => s.currentTeamId);
  return useQuery({
    queryKey: ["agentTriggers", currentTeamId],
    queryFn: () => getAgentTriggers(currentTeamId || 1),
    enabled: !!currentTeamId,
  });
}

export function useCreateAgentTrigger() {
  const queryClient = useQueryClient();
  const currentTeamId = useAuthenticationStore((s) => s.currentTeamId);
  return useMutation({
    mutationFn: (rule: Partial<AgentTriggerRule>) => createAgentTrigger(currentTeamId || 1, rule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agentTriggers", currentTeamId] });
    },
  });
}

export function useUpdateAgentTrigger() {
  const queryClient = useQueryClient();
  const currentTeamId = useAuthenticationStore((s) => s.currentTeamId);
  return useMutation({
    mutationFn: ({ ruleId, rule }: { ruleId: number; rule: Partial<AgentTriggerRule> }) =>
      updateAgentTrigger(currentTeamId || 1, ruleId, rule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agentTriggers", currentTeamId] });
    },
  });
}

export function useDeleteAgentTrigger() {
  const queryClient = useQueryClient();
  const currentTeamId = useAuthenticationStore((s) => s.currentTeamId);
  return useMutation({
    mutationFn: (ruleId: number) => deleteAgentTrigger(currentTeamId || 1, ruleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agentTriggers", currentTeamId] });
    },
  });
}

export function useTriggerAgentEvent() {
  const queryClient = useQueryClient();
  const currentTeamId = useAuthenticationStore((s) => s.currentTeamId);
  return useMutation({
    mutationFn: (payload: Parameters<typeof triggerAgentEvent>[1]) =>
      triggerAgentEvent(currentTeamId || 1, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamInvestigations", currentTeamId] });
      queryClient.invalidateQueries({ queryKey: ["incidents", currentTeamId] });
    },
  });
}

export function useTeamUsage(range: UsageRange = "current_cycle") {
  const currentTeamId = useAuthenticationStore((s) => s.currentTeamId);
  return useQuery({
    queryKey: ["teamUsage", currentTeamId, range],
    queryFn: () => getTeamUsage(currentTeamId || 1, range),
    enabled: !!currentTeamId,
  });
}

export function useUpdateOverageSettings() {
  const queryClient = useQueryClient();
  const currentTeamId = useAuthenticationStore((s) => s.currentTeamId);
  return useMutation({
    mutationFn: ({
      allowOverage,
      overageSpendCapCents,
    }: {
      allowOverage: boolean;
      overageSpendCapCents: number | null;
    }) => updateOverageSettings(currentTeamId || 1, allowOverage, overageSpendCapCents),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamUsage", currentTeamId] });
    },
  });
}

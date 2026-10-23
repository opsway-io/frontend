import client from "../client";

export interface TeamEntitlement {
  id: number;
  teamId: number;
  product: "monitoring" | "log_search" | "pantomath" | "managed_agent";
  tier: "FREE" | "PRO" | "ENTERPRISE";
  enabled: boolean;
  monthlyQuota: number;
  currentUsage: number;
  usageResetAt?: string;
}

export interface ServiceCatalogItem {
  id: number;
  teamId: number;
  slug: string;
  name: string;
  description?: string;
  logSearchServices?: string[];
  monitorIds?: number[];
  repositoryUrl?: string;
  pantomathProduct?: string;
  environmentLabels?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface ExternalMCPServerConfig {
  name: string;
  url: string;
  transport: string;
  authHeader?: string;
  enabled: boolean;
}

export interface RemediationPlaybookConfig {
  id: string;
  name: string;
  triggerPattern: string;
  actionType: string;
  targetUrl: string;
  method: string;
  requiresApproval: boolean;
}

export interface AgentConfig {
  id: number;
  teamId: number;
  enabled: boolean;
  executionMode: "MANAGED" | "BYOA_WEBHOOK" | "BYO_LLM";
  autoTriggerOnConsensus: boolean;
  autoTriggerOnAnomaly: boolean;
  autoTriggerOnLogSpike: boolean;
  minOccurrences: number;
  cooldownMinutes: number;
  remediationLevel: "ADVISORY" | "APPROVAL_REQUIRED" | "AUTONOMOUS";
  byoaWebhookUrl?: string;
  byoaWebhookSecret?: string;
  customLlmProvider?: string;
  customLlmBaseUrl?: string;
  customLlmModel?: string;
  customLlmApiKey?: string;
  externalMcpServers?: ExternalMCPServerConfig[];
  remediationPlaybooks?: RemediationPlaybookConfig[];
}

export interface CorrelatedLogEntry {
  logId: string;
  timestamp: string;
  serviceName: string;
  logLevel: string;
  message: string;
  labels?: Record<string, string>;
  deepLinkUrl?: string;
}

export interface InvestigationStep {
  id: number;
  investigationId: number;
  stepIndex: number;
  stepType: string;
  serverName?: string;
  toolName?: string;
  inputJson?: string;
  outputSummary: string;
  status: string;
  durationMs: number;
  createdAt: string;
}

export interface RemediationAction {
  id: number;
  investigationId: number;
  teamId: number;
  incidentId: number;
  title: string;
  description: string;
  actionType: string;
  targetService?: string;
  diffOrCommand?: string;
  payloadJson?: string;
  status: "SUGGESTED" | "PENDING_APPROVAL" | "APPROVED" | "EXECUTED" | "VERIFIED" | "REJECTED" | "FAILED";
  executedAt?: string;
  verificationSummary?: string;
  createdAt: string;
}

export interface IncidentInvestigation {
  id: number;
  uuid: string;
  teamId: number;
  incidentId: number;
  monitorId?: number;
  serviceName: string;
  triggerSource: string;
  executionMode: string;
  status: "QUEUED" | "RUNNING" | "AWAITING_APPROVAL" | "COMPLETED" | "FAILED";
  userPrompt?: string;
  rootCauseSummary?: string;
  detailedDiagnosis?: string;
  confidenceScore?: number;
  correlatedLogs?: CorrelatedLogEntry[];
  steps?: InvestigationStep[];
  remediationActions?: RemediationAction[];
  tokensUsed: number;
  durationMs: number;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
}

export async function getEntitlements(teamId: number): Promise<{ entitlements: TeamEntitlement[] }> {
  const res = await client.get(`/v1/teams/${teamId}/entitlements`);
  return res.data;
}

export async function updateEntitlement(
  teamId: number,
  product: string,
  tier: string,
  enabled: boolean
): Promise<TeamEntitlement> {
  const res = await client.put(`/v1/teams/${teamId}/entitlements`, { product, tier, enabled });
  return res.data;
}

export async function getServiceCatalog(teamId: number): Promise<{ services: ServiceCatalogItem[] }> {
  const res = await client.get(`/v1/teams/${teamId}/service-catalog`);
  return res.data;
}

export async function upsertServiceCatalogItem(
  teamId: number,
  item: Partial<ServiceCatalogItem>
): Promise<ServiceCatalogItem> {
  if (item.id) {
    const res = await client.put(`/v1/teams/${teamId}/service-catalog/${item.id}`, item);
    return res.data;
  }
  const res = await client.post(`/v1/teams/${teamId}/service-catalog`, item);
  return res.data;
}

export async function deleteServiceCatalogItem(teamId: number, serviceId: number): Promise<void> {
  await client.delete(`/v1/teams/${teamId}/service-catalog/${serviceId}`);
}

export async function getAgentConfig(teamId: number): Promise<AgentConfig> {
  const res = await client.get(`/v1/teams/${teamId}/agent-config`);
  return res.data;
}

export async function updateAgentConfig(teamId: number, cfg: Partial<AgentConfig>): Promise<AgentConfig> {
  const res = await client.put(`/v1/teams/${teamId}/agent-config`, cfg);
  return res.data;
}

export async function getIncidentInvestigations(
  teamId: number,
  incidentId: number
): Promise<{ investigations: IncidentInvestigation[] }> {
  const res = await client.get(`/v1/teams/${teamId}/incidents/${incidentId}/investigations`);
  return res.data;
}

export async function triggerInvestigation(
  teamId: number,
  incidentId: number,
  userPrompt?: string
): Promise<IncidentInvestigation> {
  const res = await client.post(`/v1/teams/${teamId}/incidents/${incidentId}/investigations`, {
    userPrompt,
    triggerSource: "MANUAL_UI",
  });
  return res.data;
}

export async function approveRemediation(
  teamId: number,
  investigationId: number,
  actionId: number
): Promise<IncidentInvestigation> {
  const res = await client.post(
    `/v1/teams/${teamId}/investigations/${investigationId}/remediations/${actionId}/approve`
  );
  return res.data;
}

export async function getLogSearchServices(teamId: number): Promise<{ services: string[] }> {
  const res = await client.get(`/v1/teams/${teamId}/logs/services`);
  return res.data;
}

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

export interface AgentTriggerRule {
  id: number;
  teamId: number;
  product: "monitoring" | "log_search" | "pantomath" | "webhook";
  triggerType: string;
  name: string;
  description?: string;
  enabled: boolean;
  serviceFilter?: string;
  threshold: number;
  windowSeconds: number;
  pattern?: string;
  cooldownMinutes: number;
  createIncident: boolean;
  remediationLevelOverride?: "ADVISORY" | "APPROVAL_REQUIRED" | "AUTONOMOUS" | "";
  createdAt?: string;
  updatedAt?: string;
}

export interface IncidentInvestigation {
  id: number;
  uuid: string;
  teamId: number;
  incidentId?: number;
  monitorId?: number;
  sourceProduct?: string;
  triggerType?: string;
  triggerRuleId?: number;
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

export async function getAgentTriggers(teamId: number): Promise<{ triggers: AgentTriggerRule[] }> {
  const res = await client.get(`/v1/teams/${teamId}/agent-triggers`);
  return res.data;
}

export async function createAgentTrigger(
  teamId: number,
  rule: Partial<AgentTriggerRule>
): Promise<AgentTriggerRule> {
  const res = await client.post(`/v1/teams/${teamId}/agent-triggers`, rule);
  return res.data;
}

export async function updateAgentTrigger(
  teamId: number,
  ruleId: number,
  rule: Partial<AgentTriggerRule>
): Promise<AgentTriggerRule> {
  const res = await client.put(`/v1/teams/${teamId}/agent-triggers/${ruleId}`, rule);
  return res.data;
}

export async function deleteAgentTrigger(teamId: number, ruleId: number): Promise<void> {
  await client.delete(`/v1/teams/${teamId}/agent-triggers/${ruleId}`);
}

export async function triggerAgentEvent(
  teamId: number,
  payload: {
    product: "monitoring" | "log_search" | "pantomath" | "webhook";
    triggerType: string;
    triggerRuleId?: number;
    serviceName: string;
    title: string;
    summary: string;
    createIncident?: boolean;
    force?: boolean;
  }
): Promise<IncidentInvestigation> {
  const res = await client.post(`/v1/teams/${teamId}/agent-events`, payload);
  return res.data;
}

export type UsageRange = "current_cycle" | "7d" | "30d" | "90d";

export interface BillingCycleInfo {
  start: string;
  end: string;
  daysElapsed: number;
  daysTotal: number;
  daysRemaining: number;
}

export interface QuotaItem {
  key: string;
  label: string;
  used: number;
  limit: number; // -1 means unlimited
  unit: string;
  percent: number;
  projected?: number;
  status: "ok" | "warning" | "critical" | "unlimited";
}

export interface MonitoringUsage {
  tier: "FREE" | "PRO" | "ENTERPRISE";
  enabled: boolean;
  quotas: QuotaItem[];
  probeExecutions: number;
  activeHeartbeats: number;
  notificationsSent: number;
  incidentsOpened: number;
  statusPageSubscribers: number;
}

export interface LogSearchUsage {
  tier: "FREE" | "PRO" | "ENTERPRISE";
  enabled: boolean;
  quotas: QuotaItem[];
  eventsIngested: number;
  bytesIngested: number;
  activeServices: number;
  triggerRules: number;
  logTriggeredInvestigations: number;
}

export interface ManagedAgentUsage {
  tier: "FREE" | "PRO" | "ENTERPRISE";
  enabled: boolean;
  quotas: QuotaItem[];
  managedRuns: number;
  byoaRuns: number;
  tokensUsed: number;
  avgDurationMs: number;
  mcpCalls: number;
  remediationsSuggested: number;
  remediationsExecuted: number;
  activeTriggerRules: number;
}

export interface PantomathUsage {
  tier: "FREE" | "PRO" | "ENTERPRISE";
  enabled: boolean;
  quotas: QuotaItem[];
  linkedRepositories: number;
  vectorChunks: number;
  graphEdges: number;
  queriesExecuted: number;
  pantomathTriggeredInvestigations: number;
  mcpCalls: number;
}

export interface PlatformUsage {
  teamSeats: QuotaItem;
  activeMembers: number;
  pendingInvitations: number;
  serviceCatalogCount: number;
  activeApiKeys: number;
  reportsGenerated: number;
}

export interface DailyUsagePoint {
  date: string;
  probes: number;
  logBytes: number;
  logEvents: number;
  agentRuns: number;
  agentTokens: number;
  mcpCalls: number;
  notifications: number;
  incidents: number;
}

export interface TopLogServiceConsumer {
  serviceName: string;
  events: number;
  bytes: number;
  sharePct: number;
}

export interface TopMonitorConsumer {
  monitorId: number;
  name: string;
  probes: number;
  sharePct: number;
}

export interface TopTriggerConsumer {
  triggerSource: string;
  runs: number;
  tokensUsed: number;
  avgDurationMs: number;
}

export interface TopServiceConsumer {
  serviceName: string;
  runs: number;
  tokensUsed: number;
}

export interface TopPantomathProductConsumer {
  product: string;
  repoCount: number;
  vectorChunks: number;
  source: string;
  status?: "active" | "scheduled_delete" | "deleted";
  deleteAt?: string;
}

export type QuotaEnforcementState =
  | "NORMAL"
  | "WARNING"
  | "GRACE"
  | "OVERAGE_BILLING"
  | "THROTTLED";

export interface OverageSettings {
  allowOverage: boolean;
  overageSpendCapCents?: number | null;
  estimatedOverageCents: number;
  eligible: boolean;
}

export interface ProductEnforcementSummary {
  product: "monitoring" | "log_search" | "managed_agent" | "pantomath";
  quotaKey: string;
  label: string;
  state: QuotaEnforcementState;
  used: number;
  limit: number;
  unit: string;
  percent: number;
  graceExpiresAt?: string;
  graceHoursRemaining?: number;
  estimatedOverageCents: number;
  topConsumerHint?: string;
  behaviorSummary: string;
}

export interface TeamUsageResponse {
  teamId: number;
  plan: string;
  rangeStart: string;
  rangeEnd: string;
  billingCycle: BillingCycleInfo;
  overage?: OverageSettings;
  enforcement?: ProductEnforcementSummary[];
  products: {
    monitoring: MonitoringUsage;
    logSearch: LogSearchUsage;
    managedAgent: ManagedAgentUsage;
    pantomath: PantomathUsage;
  };
  platform: PlatformUsage;
  timeseries: DailyUsagePoint[];
  topConsumers: {
    monitors: TopMonitorConsumer[];
    logServices: TopLogServiceConsumer[];
    pantomathProducts: TopPantomathProductConsumer[];
    agentTriggers: TopTriggerConsumer[];
    services: TopServiceConsumer[];
  };
}

export async function getTeamUsage(
  teamId: number,
  range: UsageRange = "current_cycle"
): Promise<TeamUsageResponse> {
  const res = await client.get(`/v1/teams/${teamId}/usage`, {
    params: { range },
  });
  return res.data;
}

export async function updateOverageSettings(
  teamId: number,
  allowOverage: boolean,
  overageSpendCapCents: number | null
): Promise<OverageSettings> {
  const res = await client.put(`/v1/teams/${teamId}/overage-settings`, {
    allowOverage,
    overageSpendCapCents,
  });
  return res.data;
}

export async function setActivePantomathProduct(
  teamId: number,
  product: string
): Promise<{ product: string; status: string }> {
  const res = await client.put(`/v1/teams/${teamId}/pantomath/active-product`, {
    product,
  });
  return res.data;
}

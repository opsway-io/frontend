import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalDialog,
  Option,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  Tab,
  Table,
  TabList,
  Tabs,
  Typography,
} from "@mui/joy";
import { FunctionComponent, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {
  IoCheckmark,
  IoCheckmarkCircle,
  IoChevronDown,
  IoChevronForward,
  IoCodeSlashOutline,
  IoCopyOutline,
  IoHardwareChipOutline,
  IoLayersOutline,
  IoOpenOutline,
  IoPlayOutline,
  IoPulseOutline,
  IoSettingsOutline,
  IoSparklesOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { PiFireSimpleBold, PiTerminalWindowBold } from "react-icons/pi";
import { Link, useSearchParams } from "react-router-dom";
import Container from "../../../components/Container/Container";
import { useIncidents } from "../../../hooks/incidents.query";
import { useMonitors } from "../../../hooks/monitors.query";
import {
  useAgentConfig,
  useApproveRemediation,
  useIncidentInvestigations,
  useTriggerInvestigation,
  useUpdateAgentConfig,
} from "../../../hooks/suite.query";
import PreformattedBlock from "../Incidents/Detail/components/PreformattedBlock";

export const AgentsPage: FunctionComponent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "investigations";

  const { data: incidentsData } = useIncidents(false, 0, 10);
  const { data: resolvedData } = useIncidents(true, 0, 10);
  const { data: monitorsData } = useMonitors(0, 50);

  const activeIncidents = incidentsData?.incidents || [];
  const resolvedIncidents = resolvedData?.incidents || [];
  const allIncidents = [...activeIncidents, ...resolvedIncidents];

  const [selectedIncidentId, setSelectedIncidentId] = useState<number | null>(
    allIncidents.length > 0 ? allIncidents[0].id : 1
  );

  useEffect(() => {
    if (!selectedIncidentId && allIncidents.length > 0) {
      setSelectedIncidentId(allIncidents[0].id);
    }
  }, [allIncidents, selectedIncidentId]);

  return (
    <>
      <Helmet>
        <title>Autonomous Agents | Opsway Platform</title>
      </Helmet>
      <Container>
        <Stack spacing={3} sx={{ py: 3 }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              gap: 2,
              p: 3,
              borderRadius: "lg",
              background:
                "linear-gradient(135deg, rgba(168, 113, 183, 0.15) 0%, rgba(81, 133, 165, 0.12) 100%)",
              border: "1px solid rgba(168, 113, 183, 0.2)",
            }}
          >
            <Box>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: "md",
                    bgcolor: "rgba(168, 113, 183, 0.2)",
                    color: "#c992d9",
                  }}
                >
                  <IoSparklesOutline size={26} />
                </Box>
                <Typography level="h2" sx={{ fontSize: { xs: "xl", md: "2xl" }, fontWeight: 700 }}>
                  Autonomous Agents
                </Typography>
                <Chip size="sm" variant="soft" sx={{ bgcolor: "rgba(168, 113, 183, 0.25)", color: "#e4b4f0" }}>
                  Autonomous SRE
                </Chip>
              </Stack>
              <Typography level="body-sm" sx={{ color: "text.secondary", maxWidth: 720 }}>
                Standalone autonomous investigation & remediation agents. Correlate uptime probe failures, ClickHouse
                telemetry, and microservice logs via the Unified FastMCP Gateway (<code>/v1/mcp</code>).
              </Typography>
            </Box>
            <Button
              component={Link}
              to="?tab=gateway"
              variant="outlined"
              color="neutral"
              startDecorator={<IoHardwareChipOutline />}
            >
              MCP Gateway (<code>/v1/mcp</code>)
            </Button>
          </Box>

          {/* Navigation Tabs */}
          <Tabs
            value={currentTab}
            onChange={(_, val) => setSearchParams({ tab: val as string })}
            sx={{ bgcolor: "transparent" }}
          >
            <TabList
              sx={{
                p: 0.5,
                gap: 1,
                borderRadius: "md",
                bgcolor: "background.surface",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <Tab value="investigations" sx={{ borderRadius: "sm", py: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IoPulseOutline size={18} />
                  <span>Live Activity & Investigations</span>
                </Stack>
              </Tab>
              <Tab value="policies" sx={{ borderRadius: "sm", py: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IoSettingsOutline size={18} />
                  <span>Agent Policies & Autonomy</span>
                </Stack>
              </Tab>
              <Tab value="gateway" sx={{ borderRadius: "sm", py: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IoHardwareChipOutline size={18} />
                  <span>Unified MCP Gateway</span>
                </Stack>
              </Tab>
            </TabList>
          </Tabs>

          {/* Tab 1: Live Activity & Investigations */}
          {currentTab === "investigations" && (
            <InvestigationsView
              allIncidents={allIncidents}
              selectedIncidentId={selectedIncidentId}
              onSelectIncident={setSelectedIncidentId}
            />
          )}

          {/* Tab 2: Agent Policies & Autonomy */}
          {currentTab === "policies" && <PoliciesView />}

          {/* Tab 3: Unified MCP Gateway */}
          {currentTab === "gateway" && <MCPGatewayView />}
        </Stack>
      </Container>
    </>
  );
};

// ----------------------------------------------------------------------
// Subview 1: Investigations & Live Activity
// ----------------------------------------------------------------------
interface InvestigationsViewProps {
  allIncidents: Array<any>;
  selectedIncidentId: number | null;
  onSelectIncident: (id: number) => void;
}

const InvestigationsView: FunctionComponent<InvestigationsViewProps> = ({
  allIncidents,
  selectedIncidentId,
  onSelectIncident,
}) => {
  const activeIncident = allIncidents.find((i) => i.id === selectedIncidentId);
  const targetIncidentId = selectedIncidentId || (allIncidents.length > 0 ? allIncidents[0].id : 1);
  const { data, isPending } = useIncidentInvestigations(targetIncidentId);
  const triggerInvestigation = useTriggerInvestigation(targetIncidentId);
  const approveRemediation = useApproveRemediation(targetIncidentId);

  const [promptModalOpen, setPromptModalOpen] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({});

  const investigations = data?.investigations || [];
  const latest = investigations.length > 0 ? investigations[0] : null;

  const handleTrigger = () => {
    triggerInvestigation.mutate(userPrompt || undefined, {
      onSuccess: () => {
        setPromptModalOpen(false);
        setUserPrompt("");
      },
    });
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Chip size="sm" variant="soft" color="success">COMPLETED</Chip>;
      case "RUNNING":
        return (
          <Chip
            size="sm"
            variant="soft"
            color="primary"
            startDecorator={<CircularProgress size="sm" sx={{ width: 14, height: 14 }} />}
          >
            INVESTIGATING...
          </Chip>
        );
      case "AWAITING_APPROVAL":
        return <Chip size="sm" variant="soft" color="warning">ACTION REQUIRED</Chip>;
      case "FAILED":
        return <Chip size="sm" variant="soft" color="danger">FAILED</Chip>;
      default:
        return <Chip size="sm" variant="soft" color="neutral">{status}</Chip>;
    }
  };

  return (
    <Stack spacing={3}>
      {/* Target incident selector & Trigger Bar */}
      <Card variant="outlined" sx={{ bgcolor: "background.surface", p: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          gap={2}
        >
          <Box sx={{ minWidth: 260 }}>
            <Typography level="body-xs" textColor="text.tertiary" sx={{ mb: 0.5 }}>
              SELECT INCIDENT / MONITOR CONTEXT:
            </Typography>
            <Select
              size="sm"
              value={selectedIncidentId || (allIncidents[0]?.id ?? 1)}
              onChange={(_, val) => val && onSelectIncident(Number(val))}
              sx={{ minWidth: 280 }}
            >
              {allIncidents.map((inc) => (
                <Option key={inc.id} value={inc.id}>
                  #{inc.id}: {inc.title || `Incident on monitor #${inc.monitorId || 1}`}
                </Option>
              ))}
              {allIncidents.length === 0 && (
                <Option value={1}>#1: System Sample Incident (Simulated)</Option>
              )}
            </Select>
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center">
            {activeIncident && (
              <Chip
                size="sm"
                variant="soft"
                color={activeIncident.resolved ? "success" : "danger"}
                startDecorator={<PiFireSimpleBold />}
              >
                {activeIncident.resolved ? "RESOLVED" : "ACTIVE INCIDENT"}
              </Chip>
            )}
            <Button
              variant="solid"
              color="primary"
              size="sm"
              startDecorator={<IoPlayOutline />}
              loading={triggerInvestigation.isPending}
              onClick={() => setPromptModalOpen(true)}
              sx={{ bgcolor: "#A871B7", "&:hover": { bgcolor: "#8f579d" } }}
            >
              Run Autonomous Investigation
            </Button>
          </Stack>
        </Stack>
      </Card>

      {/* Investigation Details Card */}
      {isPending ? (
        <Card variant="outlined" sx={{ p: 4, textAlign: "center", bgcolor: "background.surface" }}>
          <CircularProgress sx={{ mx: "auto", mb: 2 }} />
          <Typography level="body-sm" textColor="text.secondary">
            Loading agent investigation data...
          </Typography>
        </Card>
      ) : latest ? (
        <Card variant="outlined" sx={{ bgcolor: "background.surface", p: 3 }}>
          <Stack spacing={2.5}>
            {/* Header info */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              gap={1}
            >
              <Box>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Typography level="title-lg" sx={{ fontWeight: 700 }}>
                    ReAct Investigation: {latest.serviceName || "Core Services"}
                  </Typography>
                  {getStatusChip(latest.status)}
                </Stack>
                <Typography level="body-xs" textColor="text.tertiary" sx={{ mt: 0.5 }}>
                  Triggered by: <strong>{latest.triggerSource}</strong> • Execution:{" "}
                  <strong>{latest.executionMode}</strong> • Duration:{" "}
                  <strong>{latest.durationMs}ms</strong>
                </Typography>
              </Box>

              {latest.confidenceScore && (
                <Chip size="sm" variant="outlined" color="primary">
                  Confidence: {Math.round(latest.confidenceScore * 100)}%
                </Chip>
              )}
            </Stack>

            <Divider />

            {/* Root Cause Summary */}
            {latest.rootCauseSummary && (
              <Box>
                <Typography level="title-sm" sx={{ mb: 1, fontWeight: 600, color: "text.primary" }}>
                  Diagnostic Root Cause:
                </Typography>
                <PreformattedBlock>{latest.rootCauseSummary}</PreformattedBlock>
              </Box>
            )}

            {/* Detailed Diagnosis */}
            {latest.detailedDiagnosis && (
              <Box>
                <Typography level="body-xs" textColor="text.tertiary" sx={{ mb: 0.5 }}>
                  TECHNICAL ANALYSIS
                </Typography>
                <Typography level="body-sm" sx={{ color: "text.secondary", whiteSpace: "pre-wrap" }}>
                  {latest.detailedDiagnosis}
                </Typography>
              </Box>
            )}

            {/* Proposed Remediation Action */}
            {latest.remediationActions && latest.remediationActions.length > 0 && (
              <Box>
                <Typography level="title-sm" sx={{ mb: 1, fontWeight: 600 }}>
                  Remediation Action Plan:
                </Typography>
                <Stack spacing={1.5}>
                  {latest.remediationActions.map((act) => (
                    <Card
                      key={act.id}
                      variant="outlined"
                      sx={{
                        p: 2,
                        bgcolor: "rgba(255, 255, 255, 0.02)",
                        borderColor:
                          act.status === "PENDING_APPROVAL"
                            ? "warning.400"
                            : act.status === "EXECUTED"
                            ? "success.400"
                            : "divider",
                      }}
                    >
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        gap={1.5}
                      >
                        <Box>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography level="title-sm" sx={{ fontWeight: 600 }}>
                              {act.title}
                            </Typography>
                            <Chip size="sm" variant="soft" color="warning">
                              {act.status}
                            </Chip>
                          </Stack>
                          <Typography level="body-xs" sx={{ color: "text.secondary", mt: 0.5 }}>
                            {act.description}
                          </Typography>
                          {act.diffOrCommand && (
                            <Box sx={{ mt: 1 }}>
                              <PreformattedBlock monospace>{act.diffOrCommand}</PreformattedBlock>
                            </Box>
                          )}
                        </Box>

                        {act.status === "PENDING_APPROVAL" && (
                          <Button
                            size="sm"
                            variant="solid"
                            color="warning"
                            loading={approveRemediation.isPending}
                            onClick={() =>
                              approveRemediation.mutate({
                                investigationId: latest.id,
                                actionId: act.id,
                              })
                            }
                            startDecorator={<IoCheckmarkCircle />}
                          >
                            Approve & Execute
                          </Button>
                        )}
                      </Stack>
                    </Card>
                  ))}
                </Stack>
              </Box>
            )}

            {/* ReAct Step Trace */}
            {latest.steps && latest.steps.length > 0 && (
              <Box>
                <Typography level="title-sm" sx={{ mb: 1, fontWeight: 600 }}>
                  Agent Tool Call Traces ({latest.steps.length} steps):
                </Typography>
                <Stack spacing={1}>
                  {latest.steps.map((step) => {
                    const isExpanded = expandedSteps[step.id] || false;
                    return (
                      <Card
                        key={step.id}
                        variant="outlined"
                        sx={{ p: 1.5, bgcolor: "rgba(255, 255, 255, 0.01)" }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          onClick={() =>
                            setExpandedSteps((prev) => ({
                              ...prev,
                              [step.id]: !isExpanded,
                            }))
                          }
                          sx={{ cursor: "pointer" }}
                        >
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            {isExpanded ? <IoChevronDown size={16} /> : <IoChevronForward size={16} />}
                            <Chip size="sm" variant="soft" color="neutral">
                              Step {step.stepIndex}
                            </Chip>
                            <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                              <code>{step.serverName ? `${step.serverName}.${step.toolName}` : step.toolName}</code>
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography level="body-xs" textColor="text.tertiary">
                              {step.durationMs}ms
                            </Typography>
                            <Chip size="sm" variant="soft" color={step.status === "SUCCESS" ? "success" : "neutral"}>
                              {step.status}
                            </Chip>
                          </Stack>
                        </Stack>

                        {isExpanded && (
                          <Box sx={{ mt: 1.5, pt: 1.5, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                            <Typography level="body-xs" textColor="text.tertiary" sx={{ mb: 0.5 }}>
                              TOOL OUTPUT SUMMARY:
                            </Typography>
                            <PreformattedBlock monospace>{step.outputSummary}</PreformattedBlock>
                          </Box>
                        )}
                      </Card>
                    );
                  })}
                </Stack>
              </Box>
            )}

            {/* Correlated Logs */}
            {latest.correlatedLogs && latest.correlatedLogs.length > 0 && (
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography level="title-sm" sx={{ fontWeight: 600 }}>
                    Correlated ClickHouse Logs ({latest.correlatedLogs.length}):
                  </Typography>
                  <Button
                    component="a"
                    href={`https://logs.opsway.eu?query=service%20%3D%20'${latest.serviceName || "default"}'`}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="sm"
                    variant="plain"
                    endDecorator={<IoOpenOutline />}
                  >
                    Open in Log Search
                  </Button>
                </Stack>
                <Table size="sm" sx={{ bgcolor: "transparent" }}>
                  <thead>
                    <tr>
                      <th style={{ width: 140 }}>Timestamp</th>
                      <th style={{ width: 100 }}>Level</th>
                      <th style={{ width: 120 }}>Service</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latest.correlatedLogs.map((log) => (
                      <tr key={log.logId}>
                        <td style={{ fontSize: "11px", color: "#a3aab7" }}>
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </td>
                        <td>
                          <Chip
                            size="sm"
                            variant="soft"
                            color={log.logLevel === "ERROR" ? "danger" : "neutral"}
                          >
                            {log.logLevel}
                          </Chip>
                        </td>
                        <td style={{ fontSize: "12px", fontWeight: 600 }}>{log.serviceName}</td>
                        <td style={{ fontFamily: "monospace", fontSize: "11px" }}>{log.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Box>
            )}
          </Stack>
        </Card>
      ) : (
        <Card variant="outlined" sx={{ p: 4, textAlign: "center", bgcolor: "background.surface" }}>
          <IoSparklesOutline size={36} color="#A871B7" style={{ margin: "0 auto 12px" }} />
          <Typography level="title-md">No automated investigations yet</Typography>
          <Typography level="body-sm" textColor="text.secondary" sx={{ maxWidth: 450, mx: "auto", mt: 0.5, mb: 2 }}>
            Agents investigate incidents automatically when consensus fails or anomalies are detected. You can also
            trigger one manually.
          </Typography>
          <Button
            variant="solid"
            color="primary"
            onClick={() => setPromptModalOpen(true)}
            sx={{ bgcolor: "#A871B7", mx: "auto", "&:hover": { bgcolor: "#8f579d" } }}
          >
            Trigger Investigation Now
          </Button>
        </Card>
      )}

      {/* Manual Trigger Modal */}
      <Modal open={promptModalOpen} onClose={() => setPromptModalOpen(false)}>
        <ModalDialog sx={{ width: 500, maxWidth: "95vw" }}>
          <DialogTitle>Launch Autonomous Investigation</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Typography level="body-sm">
                The agent will fetch uptime probe traces, query ClickHouse logs via FastMCP, correlate error patterns,
                and generate a root cause analysis with remediation steps.
              </Typography>
              <FormControl>
                <FormLabel>Custom Guidance or Focus (Optional)</FormLabel>
                <Input
                  placeholder="e.g. Focus on database connection pool or 504 timeouts..."
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                />
              </FormControl>
              <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 2 }}>
                <Button variant="outlined" color="neutral" onClick={() => setPromptModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="solid"
                  onClick={handleTrigger}
                  loading={triggerInvestigation.isPending}
                  sx={{ bgcolor: "#A871B7", "&:hover": { bgcolor: "#8f579d" } }}
                >
                  Start Investigation
                </Button>
              </Stack>
            </Stack>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </Stack>
  );
};

// ----------------------------------------------------------------------
// Subview 2: Policies & Autonomy Settings
// ----------------------------------------------------------------------
const PoliciesView: FunctionComponent = () => {
  const { data: config, isPending } = useAgentConfig();
  const updateConfig = useUpdateAgentConfig();

  const [mode, setMode] = useState<"MANAGED" | "BYOA_WEBHOOK" | "BYO_LLM">("MANAGED");
  const [remediationLevel, setRemediationLevel] = useState<"ADVISORY" | "APPROVAL_REQUIRED" | "AUTONOMOUS">(
    "APPROVAL_REQUIRED"
  );
  const [autoConsensus, setAutoConsensus] = useState(true);
  const [autoAnomaly, setAutoAnomaly] = useState(true);
  const [autoLogSpike, setAutoLogSpike] = useState(true);
  const [cooldown, setCooldown] = useState(30);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [llmProvider, setLlmProvider] = useState("openai");
  const [llmModel, setLlmModel] = useState("gpt-4o");
  const [llmApiKey, setLlmApiKey] = useState("");

  useEffect(() => {
    if (config) {
      setMode(config.executionMode || "MANAGED");
      setRemediationLevel(config.remediationLevel || "APPROVAL_REQUIRED");
      setAutoConsensus(config.autoTriggerOnConsensus ?? true);
      setAutoAnomaly(config.autoTriggerOnAnomaly ?? true);
      setAutoLogSpike(config.autoTriggerOnLogSpike ?? true);
      setCooldown(config.cooldownMinutes ?? 30);
      setWebhookUrl(config.byoaWebhookUrl || "");
      setWebhookSecret(config.byoaWebhookSecret || "");
      setLlmProvider(config.customLlmProvider || "openai");
      setLlmModel(config.customLlmModel || "gpt-4o");
    }
  }, [config]);

  const handleSave = () => {
    updateConfig.mutate({
      executionMode: mode,
      remediationLevel,
      autoTriggerOnConsensus: autoConsensus,
      autoTriggerOnAnomaly: autoAnomaly,
      autoTriggerOnLogSpike: autoLogSpike,
      cooldownMinutes: cooldown,
      byoaWebhookUrl: webhookUrl,
      byoaWebhookSecret: webhookSecret,
      customLlmProvider: llmProvider,
      customLlmModel: llmModel,
      ...(llmApiKey ? { customLlmApiKey: llmApiKey } : {}),
    });
  };

  return (
    <Card variant="outlined" sx={{ bgcolor: "background.surface", p: 3 }}>
      <Stack spacing={3}>
        <Box>
          <Typography level="title-lg" sx={{ fontWeight: 700 }}>
            Autonomous Agent Policies
          </Typography>
          <Typography level="body-sm" textColor="text.secondary">
            Configure how AI agents execute across the Opsway suite: native managed agents, Bring Your Own Agent
            (BYOA) via webhooks, or Bring Your Own LLM.
          </Typography>
        </Box>

        <Divider />

        {/* Execution Mode */}
        <FormControl>
          <FormLabel sx={{ fontWeight: 600 }}>Execution Provider Mode</FormLabel>
          <RadioGroup
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
            sx={{ gap: 1.5, mt: 1 }}
          >
            <Card variant="outlined" sx={{ p: 2 }}>
              <Radio
                value="MANAGED"
                label={
                  <Box>
                    <Typography level="title-sm" sx={{ fontWeight: 600 }}>
                      Managed Opsway Agent (Default)
                    </Typography>
                    <Typography level="body-xs" textColor="text.secondary">
                      Full-service autonomous SRE agent powered by Opsway cloud models and zero-configuration tool execution.
                    </Typography>
                  </Box>
                }
              />
            </Card>

            <Card variant="outlined" sx={{ p: 2 }}>
              <Radio
                value="BYOA_WEBHOOK"
                label={
                  <Box>
                    <Typography level="title-sm" sx={{ fontWeight: 600 }}>
                      Bring Your Own Agent (BYOA Webhook)
                    </Typography>
                    <Typography level="body-xs" textColor="text.secondary">
                      Dispatch triggers to your external LangGraph, CrewAI, AutoGen, or custom agent webhook.
                    </Typography>
                  </Box>
                }
              />
            </Card>

            <Card variant="outlined" sx={{ p: 2 }}>
              <Radio
                value="BYO_LLM"
                label={
                  <Box>
                    <Typography level="title-sm" sx={{ fontWeight: 600 }}>
                      Bring Your Own LLM (Direct Keys)
                    </Typography>
                    <Typography level="body-xs" textColor="text.secondary">
                      Use your own OpenAI, Anthropic Claude 3.5 Sonnet, or self-hosted Ollama model instance.
                    </Typography>
                  </Box>
                }
              />
            </Card>
          </RadioGroup>
        </FormControl>

        {mode === "BYOA_WEBHOOK" && (
          <Stack spacing={2} sx={{ p: 2, bgcolor: "rgba(255, 255, 255, 0.02)", borderRadius: "md" }}>
            <FormControl>
              <FormLabel>Webhook Endpoint URL</FormLabel>
              <Input
                placeholder="https://agents.company.com/webhook/opsway"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>HMAC Verification Secret</FormLabel>
              <Input
                type="password"
                placeholder="whsec_..."
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
              />
            </FormControl>
          </Stack>
        )}

        {mode === "BYO_LLM" && (
          <Stack spacing={2} sx={{ p: 2, bgcolor: "rgba(255, 255, 255, 0.02)", borderRadius: "md" }}>
            <FormControl>
              <FormLabel>Model Provider</FormLabel>
              <Select value={llmProvider} onChange={(_, val) => val && setLlmProvider(val as string)}>
                <Option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</Option>
                <Option value="anthropic">Anthropic (Claude 3.5 Sonnet)</Option>
                <Option value="ollama">Self-Hosted Ollama / Local vLLM</Option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Model Identifier</FormLabel>
              <Input value={llmModel} onChange={(e) => setLlmModel(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Provider API Key</FormLabel>
              <Input
                type="password"
                placeholder="sk-..."
                value={llmApiKey}
                onChange={(e) => setLlmApiKey(e.target.value)}
              />
            </FormControl>
          </Stack>
        )}

        <Divider />

        {/* Autonomy Level */}
        <FormControl>
          <FormLabel sx={{ fontWeight: 600 }}>Autonomy & Remediation Policy</FormLabel>
          <RadioGroup
            value={remediationLevel}
            onChange={(e) => setRemediationLevel(e.target.value as any)}
            sx={{ gap: 1.5, mt: 1 }}
          >
            <Card variant="outlined" sx={{ p: 2 }}>
              <Radio
                value="ADVISORY"
                label={
                  <Box>
                    <Typography level="title-sm" sx={{ fontWeight: 600 }}>
                      Advisory Only (Safe Mode)
                    </Typography>
                    <Typography level="body-xs" textColor="text.secondary">
                      Agent investigates root cause and suggests runbooks; never attempts system mutations.
                    </Typography>
                  </Box>
                }
              />
            </Card>

            <Card variant="outlined" sx={{ p: 2 }}>
              <Radio
                value="APPROVAL_REQUIRED"
                label={
                  <Box>
                    <Typography level="title-sm" sx={{ fontWeight: 600 }}>
                      Supervised (Human Approval Required - Recommended)
                    </Typography>
                    <Typography level="body-xs" textColor="text.secondary">
                      Agent investigates, drafts remediation diff/command, and waits for a 1-click engineer approval.
                    </Typography>
                  </Box>
                }
              />
            </Card>

            <Card variant="outlined" sx={{ p: 2 }}>
              <Radio
                value="AUTONOMOUS"
                label={
                  <Box>
                    <Typography level="title-sm" sx={{ fontWeight: 600 }}>
                      Full Autonomy (Self-Healing)
                    </Typography>
                    <Typography level="body-xs" textColor="text.secondary">
                      Automatically executes pre-approved remediation playbooks if agent diagnostic confidence &gt; 90%.
                    </Typography>
                  </Box>
                }
              />
            </Card>
          </RadioGroup>
        </FormControl>

        <Divider />

        {/* Triggers & Cooldown */}
        <Box>
          <Typography level="title-sm" sx={{ fontWeight: 600, mb: 1.5 }}>
            Automated Trigger Conditions
          </Typography>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography level="body-sm" sx={{ fontWeight: 500 }}>
                  Trigger on Probe Consensus Failure
                </Typography>
                <Typography level="body-xs" textColor="text.secondary">
                  Automatically start investigation when 3+ geographical probe locations confirm downtime.
                </Typography>
              </Box>
              <Switch checked={autoConsensus} onChange={(e) => setAutoConsensus(e.target.checked)} />
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography level="body-sm" sx={{ fontWeight: 500 }}>
                  Trigger on Forecaster Anomaly Detection
                </Typography>
                <Typography level="body-xs" textColor="text.secondary">
                  Trigger investigation when response latency or error rates exceed statistical confidence intervals.
                </Typography>
              </Box>
              <Switch checked={autoAnomaly} onChange={(e) => setAutoAnomaly(e.target.checked)} />
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography level="body-sm" sx={{ fontWeight: 500 }}>
                  Trigger on Log Error Rate Spike
                </Typography>
                <Typography level="body-xs" textColor="text.secondary">
                  Correlate incoming 5xx or critical log surges in Log Search ClickHouse database.
                </Typography>
              </Box>
              <Switch checked={autoLogSpike} onChange={(e) => setAutoLogSpike(e.target.checked)} />
            </Stack>
          </Stack>
        </Box>

        <Stack direction="row" justifyContent="flex-end" sx={{ pt: 2 }}>
          <Button
            variant="solid"
            onClick={handleSave}
            loading={updateConfig.isPending}
            sx={{ bgcolor: "#A871B7", "&:hover": { bgcolor: "#8f579d" } }}
          >
            Save Policies
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
};

// ----------------------------------------------------------------------
// Subview 3: Unified MCP Gateway
// ----------------------------------------------------------------------
const MCPGatewayView: FunctionComponent = () => {
  const [copied, setCopied] = useState(false);

  const mcpConfigSnippet = JSON.stringify(
    {
      mcpServers: {
        opsway: {
          url: "https://api.opsway.eu/v1/mcp",
          headers: {
            Authorization: "Bearer YOUR_OPSWAY_API_KEY",
          },
        },
      },
    },
    null,
    2
  );

  const copyConfig = () => {
    navigator.clipboard.writeText(mcpConfigSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card variant="outlined" sx={{ bgcolor: "background.surface", p: 3 }}>
      <Stack spacing={3}>
        <Box>
          <Typography level="title-lg" sx={{ fontWeight: 700 }}>
            Opsway Unified Model Context Protocol (FastMCP) Gateway
          </Typography>
          <Typography level="body-sm" textColor="text.secondary">
            Connect Claude Desktop, Cursor, Windsurf, Cline, or custom agent frameworks to the federated Opsway suite
            via standard Model Context Protocol.
          </Typography>
        </Box>

        <Divider />

        {/* Server Endpoint Card */}
        <Card variant="outlined" sx={{ p: 2, bgcolor: "rgba(255, 255, 255, 0.02)" }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            gap={2}
          >
            <Box>
              <Typography level="body-xs" textColor="text.tertiary">
                STREAMABLE HTTP / SSE MCP ENDPOINT
              </Typography>
              <Typography level="title-md" sx={{ fontFamily: "monospace", mt: 0.5 }}>
                https://api.opsway.eu/v1/mcp
              </Typography>
            </Box>
            <Chip size="sm" variant="soft" color="success">
              ONLINE (FastMCP Protocol 2024-11-05)
            </Chip>
          </Stack>
        </Card>

        {/* Tool Registry */}
        <Box>
          <Typography level="title-sm" sx={{ fontWeight: 600, mb: 1.5 }}>
            Exposed MCP Tools Registry
          </Typography>
          <Table size="sm" sx={{ bgcolor: "transparent" }}>
            <thead>
              <tr>
                <th style={{ width: 220 }}>Tool Name</th>
                <th style={{ width: 140 }}>Service Scope</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>monitoring.list_monitors</code></td>
                <td><Chip size="sm" variant="soft" color="success">Monitoring</Chip></td>
                <td>Retrieve all active endpoints, uptime SLAs, and multi-region probe health.</td>
              </tr>
              <tr>
                <td><code>monitoring.get_incident</code></td>
                <td><Chip size="sm" variant="soft" color="success">Monitoring</Chip></td>
                <td>Fetch full incident details, timeline, affected services, and error codes.</td>
              </tr>
              <tr>
                <td><code>monitoring.get_probe_history</code></td>
                <td><Chip size="sm" variant="soft" color="success">Monitoring</Chip></td>
                <td>Query historical ClickHouse probe metrics, latency distributions, and SSL state.</td>
              </tr>
              <tr>
                <td><code>logs.search_logs</code></td>
                <td><Chip size="sm" variant="soft" color="primary">Log Search</Chip></td>
                <td>Sub-second SQL and semantic search over ClickHouse distributed logs.</td>
              </tr>
              <tr>
                <td><code>logs.get_error_traces</code></td>
                <td><Chip size="sm" variant="soft" color="primary">Log Search</Chip></td>
                <td>Retrieve contextual log lines and stack traces surrounding an incident timestamp.</td>
              </tr>
              <tr>
                <td><code>service_catalog.get_service</code></td>
                <td><Chip size="sm" variant="soft" color="neutral">Opsway Hub</Chip></td>
                <td>Inspect service topology, microservice dependencies, and repository URLs.</td>
              </tr>
            </tbody>
          </Table>
        </Box>

        <Divider />

        {/* Client Configuration */}
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography level="title-sm" sx={{ fontWeight: 600 }}>
              Claude Desktop / Cursor Configuration (<code>claude_desktop_config.json</code>)
            </Typography>
            <Button
              size="sm"
              variant="outlined"
              color="neutral"
              startDecorator={copied ? <IoCheckmark /> : <IoCopyOutline />}
              onClick={copyConfig}
            >
              {copied ? "Copied" : "Copy JSON"}
            </Button>
          </Stack>
          <PreformattedBlock monospace>{mcpConfigSnippet}</PreformattedBlock>
        </Box>
      </Stack>
    </Card>
  );
};

export default AgentsPage;

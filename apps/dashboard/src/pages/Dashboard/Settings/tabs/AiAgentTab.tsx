import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Option,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  Typography,
} from "@mui/joy";
import { FunctionComponent, useEffect, useState } from "react";
import { IoCheckmark, IoCodeSlashOutline, IoCopyOutline, IoSparklesOutline } from "react-icons/io5";
import { useAgentConfig, useUpdateAgentConfig } from "../../../../hooks/suite.query";

const AiAgentTab: FunctionComponent = () => {
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
  const [copied, setCopied] = useState(false);

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
      cooldownMinutes: Number(cooldown) || 30,
      byoaWebhookUrl: webhookUrl || undefined,
      byoaWebhookSecret: webhookSecret || undefined,
      customLlmProvider: llmProvider || undefined,
      customLlmModel: llmModel || undefined,
      customLlmApiKey: llmApiKey || undefined,
    });
  };

  const mcpConfigSnippet = JSON.stringify(
    {
      mcpServers: {
        opsway: {
          url: "https://api.opsway.eu/v1/mcp",
          headers: {
            Authorization: "Bearer <YOUR_OPSWAY_API_KEY>",
          },
        },
        logSearch: {
          url: "https://logs.opsway.eu/mcp",
          headers: {
            Authorization: "Bearer <YOUR_OPSWAY_API_KEY>",
          },
        },
      },
    },
    null,
    2
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(mcpConfigSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isPending) {
    return (
      <Stack direction="row" spacing={1} alignItems="center" p={3}>
        <CircularProgress size="sm" />
        <Typography level="body-sm">Loading AI agent settings...</Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      {/* Execution Mode Card */}
      <Card variant="outlined" sx={{ bgcolor: "background.surface", borderColor: "divider" }}>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <IoSparklesOutline size={20} color="#A871B7" />
              <div>
                <Typography level="title-md">Autonomous Agent Execution Model</Typography>
                <Typography level="body-xs" textColor="text.tertiary">
                  Choose whether Opsway hosts and runs your investigation agents or if you connect your own external agent runtime.
                </Typography>
              </div>
            </Stack>

            <RadioGroup
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
              sx={{ gap: 1.5 }}
            >
              <Card
                variant="outlined"
                sx={{
                  p: 1.5,
                  cursor: "pointer",
                  bgcolor: mode === "MANAGED" ? "background.level2" : "background.surface",
                  borderColor: mode === "MANAGED" ? "primary.solidBg" : "divider",
                }}
                onClick={() => setMode("MANAGED")}
              >
                <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                  <Radio value="MANAGED" />
                  <div>
                    <Typography level="title-sm">Opsway Managed Agent (Turnkey)</Typography>
                    <Typography level="body-xs" textColor="text.secondary">
                      Opsway automatically runs a multi-step ReAct agent on qualified incidents, queries Monitoring and Log-Search via the Unified MCP Gateway, and prepares remediation actions.
                    </Typography>
                  </div>
                </Stack>
              </Card>

              <Card
                variant="outlined"
                sx={{
                  p: 1.5,
                  cursor: "pointer",
                  bgcolor: mode === "BYOA_WEBHOOK" ? "background.level2" : "background.surface",
                  borderColor: mode === "BYOA_WEBHOOK" ? "primary.solidBg" : "divider",
                }}
                onClick={() => setMode("BYOA_WEBHOOK")}
              >
                <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                  <Radio value="BYOA_WEBHOOK" />
                  <div>
                    <Typography level="title-sm">Bring Your Own Agent (BYOA Outbound Webhook)</Typography>
                    <Typography level="body-xs" textColor="text.secondary">
                      Opsway dispatches a signed webhook with an ephemeral 1-hour MCP token to your agent runtime (LangGraph, CrewAI, AutoGen, custom bot), which queries Opsway MCP and reports back.
                    </Typography>
                  </div>
                </Stack>
              </Card>

              <Card
                variant="outlined"
                sx={{
                  p: 1.5,
                  cursor: "pointer",
                  bgcolor: mode === "BYO_LLM" ? "background.level2" : "background.surface",
                  borderColor: mode === "BYO_LLM" ? "primary.solidBg" : "divider",
                }}
                onClick={() => setMode("BYO_LLM")}
              >
                <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                  <Radio value="BYO_LLM" />
                  <div>
                    <Typography level="title-sm">Bring Your Own LLM API Key (Opsway Runner)</Typography>
                    <Typography level="body-xs" textColor="text.secondary">
                      Run Opsway’s agent orchestrator using your own OpenAI, Anthropic, or Azure LLM credentials without paying managed agent investigation fees.
                    </Typography>
                  </div>
                </Stack>
              </Card>
            </RadioGroup>

            {/* Sub-config based on selected mode */}
            {mode === "BYOA_WEBHOOK" && (
              <Stack spacing={2} pt={1}>
                <FormControl>
                  <FormLabel>Agent Webhook Endpoint URL</FormLabel>
                  <Input
                    placeholder="https://your-agent.internal/api/v1/investigate"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Webhook HMAC Signing Secret</FormLabel>
                  <Input
                    placeholder="whsec_..."
                    value={webhookSecret}
                    onChange={(e) => setWebhookSecret(e.target.value)}
                  />
                </FormControl>
              </Stack>
            )}

            {mode === "BYO_LLM" && (
              <Stack spacing={2} pt={1}>
                <FormControl>
                  <FormLabel>Provider</FormLabel>
                  <Select value={llmProvider} onChange={(_, v) => setLlmProvider(v || "openai")}>
                    <Option value="openai">OpenAI (api.openai.com)</Option>
                    <Option value="anthropic">Anthropic (api.anthropic.com)</Option>
                    <Option value="custom">Custom OpenAI-compatible URL</Option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Model</FormLabel>
                  <Input value={llmModel} onChange={(e) => setLlmModel(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel>API Key</FormLabel>
                  <Input
                    type="password"
                    placeholder="sk-..."
                    value={llmApiKey}
                    onChange={(e) => setLlmApiKey(e.target.value)}
                  />
                </FormControl>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Auto-Trigger Gatekeeper Policy */}
      <Card variant="outlined" sx={{ bgcolor: "background.surface", borderColor: "divider" }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography level="title-md">Trigger Policy & Gatekeeper</Typography>
            <Typography level="body-xs" textColor="text.tertiary">
              Configure which monitoring conditions trigger an investigation automatically.
            </Typography>

            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <div>
                  <Typography level="body-sm">Prober Consensus Failures (Target Down / Assertions)</Typography>
                  <Typography level="body-xs" textColor="text.tertiary">
                    Trigger when multi-location consensus is reached (&gt;=3 consecutive failures across locations)
                  </Typography>
                </div>
                <Switch checked={autoConsensus} onChange={(e) => setAutoConsensus(e.target.checked)} />
              </Stack>

              <Divider />

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <div>
                  <Typography level="body-sm">Forecaster Anomaly Incidents</Typography>
                  <Typography level="body-xs" textColor="text.tertiary">
                    Trigger when IsolationForest latency anomaly is detected
                  </Typography>
                </div>
                <Switch checked={autoAnomaly} onChange={(e) => setAutoAnomaly(e.target.checked)} />
              </Stack>

              <Divider />

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <div>
                  <Typography level="body-sm">Log-Search Error Spikes</Typography>
                  <Typography level="body-xs" textColor="text.tertiary">
                    Trigger when error log rate exceeds anomaly threshold in log-search
                  </Typography>
                </div>
                <Switch checked={autoLogSpike} onChange={(e) => setAutoLogSpike(e.target.checked)} />
              </Stack>

              <Divider />

              <FormControl>
                <FormLabel>Per-Incident Cooldown Window (Minutes)</FormLabel>
                <Input
                  type="number"
                  value={cooldown}
                  onChange={(e) => setCooldown(Number(e.target.value) || 0)}
                  sx={{ maxWidth: 200 }}
                />
              </FormControl>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Remediation Autonomy Level */}
      <Card variant="outlined" sx={{ bgcolor: "background.surface", borderColor: "divider" }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography level="title-md">Remediation Autonomy Level</Typography>
            <Typography level="body-xs" textColor="text.tertiary">
              Define what action permissions the agent has when proposing a fix.
            </Typography>

            <RadioGroup
              value={remediationLevel}
              onChange={(e) => setRemediationLevel(e.target.value as any)}
              sx={{ gap: 1 }}
            >
              <Card variant="outlined" sx={{ p: 1.5, bgcolor: "background.surface" }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Radio value="ADVISORY" />
                  <div>
                    <Typography level="title-sm">Level 1: Advisory Only (Default)</Typography>
                    <Typography level="body-xs" textColor="text.secondary">
                      Agent only provides diagnostic reports and suggested commands/diffs. No active executions.
                    </Typography>
                  </div>
                </Stack>
              </Card>

              <Card variant="outlined" sx={{ p: 1.5, bgcolor: "background.surface" }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Radio value="APPROVAL_REQUIRED" />
                  <div>
                    <Typography level="title-sm">Level 2: Human-in-the-Loop (1-Click Approval)</Typography>
                    <Typography level="body-xs" textColor="text.secondary">
                      Agent stages the fix (e.g. GitHub PR, rolling restart) and pauses for approval in Dashboard or Slack.
                    </Typography>
                  </div>
                </Stack>
              </Card>

              <Card variant="outlined" sx={{ p: 1.5, bgcolor: "background.surface" }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Radio value="AUTONOMOUS" />
                  <div>
                    <Typography level="title-sm">Level 3: Autonomous Auto-Remediation</Typography>
                    <Typography level="body-xs" textColor="text.secondary">
                      Agent automatically executes allowlisted runbook actions, verifies recovery via Log-Search and Monitoring re-check, and auto-resolves the incident.
                    </Typography>
                  </div>
                </Stack>
              </Card>
            </RadioGroup>
          </Stack>
        </CardContent>
      </Card>

      {/* MCP Client Gateway Connection Snippet */}
      <Card variant="outlined" sx={{ bgcolor: "background.surface", borderColor: "divider" }}>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                <IoCodeSlashOutline size={20} color="#79ab5d" />
                <Typography level="title-md">Connect External IDE / Desktop Agents (MCP)</Typography>
              </Stack>
              <Button
                size="sm"
                variant="outlined"
                color="neutral"
                startDecorator={copied ? <IoCheckmark /> : <IoCopyOutline />}
                onClick={handleCopy}
              >
                {copied ? "Copied!" : "Copy Config"}
              </Button>
            </Stack>
            <Typography level="body-xs" textColor="text.tertiary">
              Add this snippet to Claude Desktop, Cursor, or Windsurf to investigate logs and monitors directly from your IDE.
            </Typography>
            <Box
              component="pre"
              sx={{
                p: 2,
                borderRadius: "sm",
                bgcolor: "background.level1",
                border: "1px solid",
                borderColor: "divider",
                fontFamily: "monospace",
                fontSize: "12px",
                overflowX: "auto",
              }}
            >
              {mcpConfigSnippet}
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Stack direction="row" justifyContent="flex-end">
        <Button
          size="md"
          variant="solid"
          color="primary"
          loading={updateConfig.isPending}
          onClick={handleSave}
        >
          Save Agent Configuration
        </Button>
      </Stack>
    </Stack>
  );
};

export default AiAgentTab;

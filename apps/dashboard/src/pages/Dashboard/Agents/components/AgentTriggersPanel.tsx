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
  Grid,
  Input,
  Stack,
  Switch,
  Typography,
} from "@mui/joy";
import { FunctionComponent, ReactNode, useState } from "react";
import {
  IoFlashOutline,
  IoGitNetworkOutline,
  IoPlayOutline,
  IoPulseOutline,
  IoSaveOutline,
  IoTerminalOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";
import { AgentTriggerRule } from "../../../../api/endpoints/suite";
import {
  useAgentTriggers,
  useEntitlements,
  useTriggerAgentEvent,
  useUpdateAgentTrigger,
} from "../../../../hooks/suite.query";

const PRODUCT_META: Record<
  string,
  { label: string; subtitle: string; color: "primary" | "success" | "warning" | "neutral"; icon: ReactNode }
> = {
  monitoring: {
    label: "Opsway Monitoring",
    subtitle: "Trigger autonomous investigations from uptime outages, assertion breaches, and latency anomaly streaks.",
    color: "success",
    icon: <IoPulseOutline size={18} />,
  },
  log_search: {
    label: "Opsway Log Search",
    subtitle: "Trigger standalone or correlated investigations on error spikes, error rate surges, or critical crash patterns (OOM / panic / deadlock).",
    color: "primary",
    icon: <IoTerminalOutline size={18} />,
  },
  pantomath: {
    label: "Agent Context",
    subtitle: "Trigger post-deploy regression checks when code or Kubernetes manifests change.",
    color: "warning",
    icon: <IoGitNetworkOutline size={18} />,
  },
  webhook: {
    label: "External / Inbound Webhooks",
    subtitle: "Trigger investigations from Alertmanager, Grafana, Sentry, or custom cluster events via POST /v1/teams/:teamId/agent-events.",
    color: "neutral",
    icon: <IoFlashOutline size={18} />,
  },
};

const AgentTriggersPanel: FunctionComponent = () => {
  const { data, isPending } = useAgentTriggers();
  const { data: entData } = useEntitlements();
  const updateTrigger = useUpdateAgentTrigger();
  const fireEvent = useTriggerAgentEvent();

  const [drafts, setDrafts] = useState<Record<number, Partial<AgentTriggerRule>>>({});
  const [testSuccess, setTestSuccess] = useState<string | null>(null);

  const triggers = data?.triggers || [];
  const entitlements = entData?.entitlements || [];

  const isProductEnabled = (product: string) => {
    if (product === "webhook") return true;
    if (entitlements.length === 0) return true;
    const ent = entitlements.find((e) => e.product === product);
    return !ent || ent.enabled;
  };

  const getDraft = (rule: AgentTriggerRule): AgentTriggerRule => ({
    ...rule,
    ...drafts[rule.id],
  });

  const patchDraft = (ruleId: number, patch: Partial<AgentTriggerRule>) => {
    setDrafts((prev) => ({
      ...prev,
      [ruleId]: { ...prev[ruleId], ...patch },
    }));
  };

  const handleSave = (rule: AgentTriggerRule) => {
    const merged = getDraft(rule);
    updateTrigger.mutate(
      { ruleId: rule.id, rule: merged },
      {
        onSuccess: () => {
          setDrafts((prev) => {
            const copy = { ...prev };
            delete copy[rule.id];
            return copy;
          });
        },
      }
    );
  };

  const handleToggleEnabled = (rule: AgentTriggerRule, enabled: boolean) => {
    updateTrigger.mutate({
      ruleId: rule.id,
      rule: { ...getDraft(rule), enabled },
    });
  };

  const handleTestTrigger = (rule: AgentTriggerRule) => {
    setTestSuccess(null);
    const merged = getDraft(rule);
    const targetSvc = merged.serviceFilter?.trim() || "api";
    fireEvent.mutate(
      {
        product: rule.product,
        triggerType: rule.triggerType,
        triggerRuleId: rule.id,
        serviceName: targetSvc,
        title: `Test Trigger: ${rule.name}`,
        summary: `Manual test event fired for rule "${rule.name}" (${rule.triggerType}) on service "${targetSvc}".`,
        createIncident: merged.createIncident,
        force: true,
      },
      {
        onSuccess: (inv) => {
          setTestSuccess(
            `Triggered standalone investigation ${inv.uuid} (${rule.product} / ${rule.triggerType}) for "${targetSvc}".`
          );
        },
      }
    );
  };

  if (isPending) {
    return (
      <Stack direction="row" alignItems="center" spacing={1.5} py={4}>
        <CircularProgress size="sm" />
        <Typography level="body-sm" textColor="text.secondary">
          Loading product trigger hooks...
        </Typography>
      </Stack>
    );
  }

  const productOrder: Array<"monitoring" | "log_search" | "pantomath" | "webhook"> = [
    "monitoring",
    "log_search",
    "pantomath",
    "webhook",
  ];

  return (
    <Stack spacing={3}>
      {testSuccess && (
        <Alert color="success" variant="soft">
          {testSuccess}
        </Alert>
      )}

      {productOrder.map((product) => {
        const meta = PRODUCT_META[product];
        const productRules = triggers.filter((t) => t.product === product);
        const enabledInSuite = isProductEnabled(product);

        if (product === "webhook" && productRules.length === 0) {
          return (
            <Card key={product} variant="outlined" sx={{ bgcolor: "background.surface" }}>
              <CardContent>
                <Stack spacing={1}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {meta.icon}
                    <Typography level="title-md">{meta.label}</Typography>
                    <Chip size="sm" variant="soft" color="neutral">
                      Always Available
                    </Chip>
                  </Stack>
                  <Typography level="body-xs" textColor="text.secondary">
                    {meta.subtitle}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          );
        }

        return (
          <Card key={product} variant="outlined" sx={{ bgcolor: "background.surface" }}>
            <CardContent>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  flexWrap="wrap"
                  gap={1}
                >
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {meta.icon}
                      <Typography level="title-md">{meta.label}</Typography>
                      <Chip
                        size="sm"
                        variant="soft"
                        color={enabledInSuite ? meta.color : "neutral"}
                      >
                        {enabledInSuite ? "Connected" : "Add-on Disabled"}
                      </Chip>
                    </Stack>
                    <Typography level="body-xs" textColor="text.secondary" sx={{ mt: 0.5 }}>
                      {meta.subtitle}
                    </Typography>
                  </Box>
                  {!enabledInSuite && (
                    <Button
                      component={Link}
                      to="/settings/billing"
                      size="sm"
                      variant="solid"
                      color="primary"
                    >
                      Enable in Billing
                    </Button>
                  )}
                </Stack>

                <Divider />

                <Stack spacing={2}>
                  {productRules.map((rule) => {
                    const current = getDraft(rule);
                    const hasChanges = Boolean(drafts[rule.id]);
                    return (
                      <Box
                        key={rule.id}
                        sx={{
                          p: 2,
                          borderRadius: "md",
                          border: "1px solid",
                          borderColor: current.enabled ? "divider" : "rgba(255,255,255,0.06)",
                          bgcolor: "background.level1",
                          opacity: enabledInSuite ? 1 : 0.6,
                        }}
                      >
                        <Stack spacing={1.5}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            flexWrap="wrap"
                            gap={1}
                          >
                            <Box>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Typography level="title-sm">{current.name}</Typography>
                                <Chip size="sm" variant="outlined" color="neutral">
                                  <code>{current.triggerType}</code>
                                </Chip>
                              </Stack>
                              {current.description && (
                                <Typography level="body-xs" textColor="text.tertiary" sx={{ mt: 0.25 }}>
                                  {current.description}
                                </Typography>
                              )}
                            </Box>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Button
                                size="sm"
                                variant="outlined"
                                color="neutral"
                                startDecorator={<IoPlayOutline />}
                                loading={fireEvent.isPending}
                                disabled={!enabledInSuite}
                                onClick={() => handleTestTrigger(rule)}
                              >
                                Test Trigger
                              </Button>
                              <Switch
                                checked={current.enabled}
                                disabled={!enabledInSuite || updateTrigger.isPending}
                                onChange={(e) => handleToggleEnabled(rule, e.target.checked)}
                              />
                            </Stack>
                          </Stack>

                          <Grid container spacing={1.5}>
                            <Grid xs={12} sm={3}>
                              <FormControl size="sm">
                                <FormLabel>Threshold</FormLabel>
                                <Input
                                  type="number"
                                  value={current.threshold}
                                  disabled={!enabledInSuite}
                                  onChange={(e) =>
                                    patchDraft(rule.id, { threshold: Number(e.target.value) })
                                  }
                                />
                              </FormControl>
                            </Grid>
                            <Grid xs={12} sm={3}>
                              <FormControl size="sm">
                                <FormLabel>Window (sec)</FormLabel>
                                <Input
                                  type="number"
                                  value={current.windowSeconds}
                                  disabled={!enabledInSuite}
                                  onChange={(e) =>
                                    patchDraft(rule.id, { windowSeconds: Number(e.target.value) })
                                  }
                                />
                              </FormControl>
                            </Grid>
                            <Grid xs={12} sm={3}>
                              <FormControl size="sm">
                                <FormLabel>Cooldown (min)</FormLabel>
                                <Input
                                  type="number"
                                  value={current.cooldownMinutes}
                                  disabled={!enabledInSuite}
                                  onChange={(e) =>
                                    patchDraft(rule.id, { cooldownMinutes: Number(e.target.value) })
                                  }
                                />
                              </FormControl>
                            </Grid>
                            <Grid xs={12} sm={3}>
                              <FormControl size="sm">
                                <FormLabel>Service Filter (optional)</FormLabel>
                                <Input
                                  placeholder="all services"
                                  value={current.serviceFilter || ""}
                                  disabled={!enabledInSuite}
                                  onChange={(e) =>
                                    patchDraft(rule.id, { serviceFilter: e.target.value })
                                  }
                                />
                              </FormControl>
                            </Grid>
                            {current.triggerType === "logs.pattern_match" && (
                              <Grid xs={12}>
                                <FormControl size="sm">
                                  <FormLabel>Regex / Keyword Pattern</FormLabel>
                                  <Input
                                    value={current.pattern || ""}
                                    disabled={!enabledInSuite}
                                    onChange={(e) =>
                                      patchDraft(rule.id, { pattern: e.target.value })
                                    }
                                  />
                                </FormControl>
                              </Grid>
                            )}
                          </Grid>

                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            flexWrap="wrap"
                            gap={1}
                          >
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Switch
                                size="sm"
                                checked={current.createIncident}
                                disabled={!enabledInSuite}
                                onChange={(e) =>
                                  patchDraft(rule.id, { createIncident: e.target.checked })
                                }
                              />
                              <Typography level="body-xs" textColor="text.secondary">
                                Also create a Monitoring Incident (routes through Email / Slack / Escalations)
                              </Typography>
                            </Stack>
                            {hasChanges && (
                              <Button
                                size="sm"
                                variant="solid"
                                color="primary"
                                startDecorator={<IoSaveOutline />}
                                loading={updateTrigger.isPending}
                                onClick={() => handleSave(rule)}
                              >
                                Save Rule
                              </Button>
                            )}
                          </Stack>
                        </Stack>
                      </Box>
                    );
                  })}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
};

export default AgentTriggersPanel;

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
  Input,
  Modal,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy";
import { FunctionComponent, useState } from "react";
import {
  IoCheckmarkCircle,
  IoChevronDown,
  IoChevronForward,
  IoConstructOutline,
  IoOpenOutline,
  IoPlayOutline,
  IoSparklesOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { PiTerminalWindowBold } from "react-icons/pi";
import {
  useApproveRemediation,
  useIncidentInvestigations,
  useTriggerInvestigation,
} from "../../../../../hooks/suite.query";
import PreformattedBlock from "./PreformattedBlock";

interface AgentInvestigationCardProps {
  incidentId: number;
  incidentTitle: string;
}

const AgentInvestigationCard: FunctionComponent<AgentInvestigationCardProps> = ({
  incidentId,
}) => {
  const { data, isPending } = useIncidentInvestigations(incidentId);
  const triggerInvestigation = useTriggerInvestigation(incidentId);
  const approveRemediation = useApproveRemediation(incidentId);

  const [modalOpen, setModalOpen] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({});

  const investigations = data?.investigations || [];
  const latest = investigations.length > 0 ? investigations[0] : null;

  const handleTrigger = () => {
    triggerInvestigation.mutate(userPrompt ? userPrompt : undefined, {
      onSuccess: () => {
        setModalOpen(false);
        setUserPrompt("");
      },
    });
  };

  const toggleStep = (idx: number) => {
    setExpandedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <>
      <Card variant="outlined" sx={{ bgcolor: "background.surface", borderColor: "divider" }}>
        <CardContent>
          <Stack spacing={2}>
            {/* Header */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={1}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    p: 0.75,
                    borderRadius: "sm",
                    bgcolor: "rgba(168, 113, 183, 0.16)",
                    color: "#A871B7",
                    display: "flex",
                  }}
                >
                  <IoSparklesOutline size={20} />
                </Box>
                <div>
                  <Typography level="title-md">AI Agent Investigation & Remediation</Typography>
                  <Typography level="body-xs" textColor="text.tertiary">
                    Cross-product diagnostic correlation via Unified MCP Gateway (Monitoring + Log-Search)
                  </Typography>
                </div>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                {latest && (
                  <Chip
                    size="sm"
                    variant="soft"
                    color={
                      latest.status === "COMPLETED"
                        ? "success"
                        : latest.status === "AWAITING_APPROVAL"
                        ? "warning"
                        : latest.status === "RUNNING"
                        ? "primary"
                        : "danger"
                    }
                  >
                    {latest.status === "AWAITING_APPROVAL"
                      ? "Approval Required"
                      : latest.status}
                  </Chip>
                )}
                <Button
                  size="sm"
                  variant="outlined"
                  color="neutral"
                  startDecorator={
                    triggerInvestigation.isPending ? (
                      <CircularProgress size="sm" />
                    ) : (
                      <IoPlayOutline />
                    )
                  }
                  loading={triggerInvestigation.isPending}
                  onClick={() => setModalOpen(true)}
                >
                  {latest ? "Re-investigate" : "Investigate with AI"}
                </Button>
              </Stack>
            </Stack>

            <Divider />

            {/* State: Loading or No investigation yet */}
            {isPending && (
              <Stack direction="row" alignItems="center" spacing={1.5} py={2}>
                <CircularProgress size="sm" />
                <Typography level="body-sm" textColor="text.secondary">
                  Loading investigation status...
                </Typography>
              </Stack>
            )}

            {!isPending && !latest && (
              <Box sx={{ py: 2, textAlign: "center" }}>
                <Typography level="body-sm" textColor="text.tertiary" sx={{ mb: 1.5 }}>
                  No investigation has been executed for this incident yet.
                </Typography>
                <Button
                  size="sm"
                  variant="solid"
                  color="primary"
                  startDecorator={<IoSparklesOutline />}
                  onClick={() => setModalOpen(true)}
                >
                  Start Agent Investigation
                </Button>
              </Box>
            )}

            {/* State: Active / Completed Investigation */}
            {latest && (
              <Stack spacing={2.5}>
                {/* Executive Root Cause Summary */}
                {latest.rootCauseSummary && (
                  <Alert
                    variant="soft"
                    color="neutral"
                    sx={{
                      bgcolor: "background.level1",
                      borderColor: "divider",
                      alignItems: "flex-start",
                      p: 2,
                    }}
                  >
                    <Box sx={{ width: "100%" }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography level="title-sm" textColor="text.primary">
                          Diagnosed Root Cause
                        </Typography>
                        {latest.confidenceScore && (
                          <Chip size="sm" variant="outlined" color="success">
                            {Math.round(latest.confidenceScore * 100)}% Confidence
                          </Chip>
                        )}
                      </Stack>
                      <Typography level="body-sm" textColor="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
                        {latest.rootCauseSummary}
                      </Typography>
                    </Box>
                  </Alert>
                )}

                {/* Remediation Action Card */}
                {latest.remediationActions && latest.remediationActions.length > 0 && (
                  <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: "md", p: 2 }}>
                    <Stack spacing={1.5}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <IoConstructOutline size={18} color="#f4ac45" />
                          <Typography level="title-sm">Proposed Remediation Action</Typography>
                        </Stack>
                        <Chip
                          size="sm"
                          variant="soft"
                          color={
                            latest.remediationActions[0].status === "VERIFIED"
                              ? "success"
                              : "warning"
                          }
                        >
                          {latest.remediationActions[0].status}
                        </Chip>
                      </Stack>

                      <Typography level="body-sm" textColor="text.secondary">
                        {latest.remediationActions[0].title}: {latest.remediationActions[0].description}
                      </Typography>

                      {latest.remediationActions[0].diffOrCommand && (
                        <PreformattedBlock monospace>
                          {latest.remediationActions[0].diffOrCommand}
                        </PreformattedBlock>
                      )}

                      {latest.remediationActions[0].status === "VERIFIED" &&
                        latest.remediationActions[0].verificationSummary && (
                          <Alert variant="soft" color="success" size="sm" startDecorator={<IoCheckmarkCircle />}>
                            {latest.remediationActions[0].verificationSummary}
                          </Alert>
                        )}

                      {latest.remediationActions[0].status === "PENDING_APPROVAL" && (
                        <Stack direction="row" spacing={1} pt={0.5}>
                          <Button
                            size="sm"
                            variant="solid"
                            color="success"
                            loading={approveRemediation.isPending}
                            onClick={() =>
                              approveRemediation.mutate({
                                investigationId: latest.id,
                                actionId: latest.remediationActions![0].id,
                              })
                            }
                          >
                            Approve & Execute Fix
                          </Button>
                        </Stack>
                      )}
                    </Stack>
                  </Box>
                )}

                {/* Correlated Logs */}
                {latest.correlatedLogs && latest.correlatedLogs.length > 0 && (
                  <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <PiTerminalWindowBold size={18} color="#5185a5" />
                        <Typography level="title-sm">Correlated Logs in Log-Search</Typography>
                      </Stack>
                      {latest.correlatedLogs[0].deepLinkUrl && (
                        <Button
                          component="a"
                          href={latest.correlatedLogs[0].deepLinkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="sm"
                          variant="plain"
                          color="neutral"
                          endDecorator={<IoOpenOutline />}
                        >
                          Open in Log-Search
                        </Button>
                      )}
                    </Stack>

                    <Stack spacing={1}>
                      {latest.correlatedLogs.map((log, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            fontFamily: "monospace",
                            fontSize: "12px",
                            p: 1.25,
                            borderRadius: "sm",
                            bgcolor: "background.level1",
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                            <Typography level="body-xs" textColor="text.tertiary">
                              {log.timestamp}
                            </Typography>
                            <Chip
                              size="sm"
                              variant="soft"
                              color={log.logLevel === "ERROR" ? "danger" : "warning"}
                              sx={{ fontSize: "10px", height: "18px" }}
                            >
                              {log.logLevel}
                            </Chip>
                            <Typography level="body-xs" textColor="text.secondary">
                              {log.serviceName}
                            </Typography>
                          </Stack>
                          <Typography level="body-xs" textColor="text.primary" sx={{ wordBreak: "break-all" }}>
                            {log.message}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* Multi-Step MCP Tool Execution Trace */}
                {latest.steps && latest.steps.length > 0 && (
                  <Box>
                    <Typography level="title-sm" mb={1} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IoTimeOutline /> MCP Investigation Timeline ({latest.steps.length} steps, {latest.durationMs}ms)
                    </Typography>

                    <Stack spacing={1}>
                      {latest.steps.map((st, i) => (
                        <Box
                          key={i}
                          sx={{
                            p: 1.25,
                            borderRadius: "sm",
                            bgcolor: "background.level1",
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ cursor: "pointer" }}
                            onClick={() => toggleStep(i)}
                          >
                            <Stack direction="row" spacing={1} alignItems="center">
                              {expandedSteps[i] ? <IoChevronDown size={14} /> : <IoChevronForward size={14} />}
                              <Typography level="title-sm" textColor="text.primary">
                                Step {st.stepIndex}: {st.toolName || st.stepType}
                              </Typography>
                              {st.serverName && (
                                <Chip size="sm" variant="outlined" sx={{ fontSize: "10px" }}>
                                  {st.serverName}
                                </Chip>
                              )}
                            </Stack>
                            <Typography level="body-xs" textColor="text.tertiary">
                              {st.durationMs}ms
                            </Typography>
                          </Stack>

                          {expandedSteps[i] && (
                            <Box mt={1} pt={1} sx={{ borderTop: "1px solid", borderColor: "divider" }}>
                              <Typography level="body-xs" textColor="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
                                {st.outputSummary}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Trigger Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalDialog sx={{ maxWidth: 500, width: "100%" }}>
          <DialogTitle>Investigate Incident with AI Agent</DialogTitle>
          <DialogContent>
            <Stack spacing={2} pt={1}>
              <Typography level="body-sm" textColor="text.secondary">
                The agent will connect via the Unified MCP Gateway to query ClickHouse probe timings, inspect recent
                error logs in Log-Search, and synthesize a root-cause diagnosis.
              </Typography>
              <Input
                placeholder="Optional operator hint (e.g. check if Redis pool timed out)"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
              />
              <Stack direction="row" spacing={1} justifyContent="flex-end" pt={1}>
                <Button variant="plain" color="neutral" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="solid"
                  color="primary"
                  loading={triggerInvestigation.isPending}
                  onClick={handleTrigger}
                >
                  Start Investigation
                </Button>
              </Stack>
            </Stack>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default AgentInvestigationCard;

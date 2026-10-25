import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/joy";
import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import { AiOutlineTeam } from "react-icons/ai";
import { GoBrowser } from "react-icons/go";
import {
  IoAppsOutline,
  IoArrowForward,
  IoCardOutline,
  IoHardwareChipOutline,
  IoLayersOutline,
  IoPersonOutline,
  IoPulseOutline,
  IoSparklesOutline,
} from "react-icons/io5";
import { PiFireSimpleBold, PiTerminalWindowBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import Container from "../../../components/Container/Container";
import { useIncidents } from "../../../hooks/incidents.query";
import { useMonitors } from "../../../hooks/monitors.query";
import { useAgentConfig, useServiceCatalog } from "../../../hooks/suite.query";
import { useCurrentTeam, useTeamMemberCount } from "../../../hooks/team.query";

export const HubOverviewPage: FunctionComponent = () => {
  const { data: team } = useCurrentTeam();
  const { data: memberCount } = useTeamMemberCount();
  const { data: monitorsData } = useMonitors(0, 50);
  const { data: activeIncidents } = useIncidents(false, 0, 10);
  const { data: serviceCatalog } = useServiceCatalog();
  const { data: agentConfig } = useAgentConfig();

  const totalMonitors = monitorsData?.monitors?.length || 0;
  const incidentCount = activeIncidents?.incidents?.length || 0;
  const serviceCount = serviceCatalog?.services?.length || 0;
  const agentMode = agentConfig?.executionMode || "MANAGED";

  return (
    <>
      <Helmet>
        <title>Opsway Platform Hub | Unified Observability Suite</title>
      </Helmet>
      <Container>
        <Stack spacing={3} sx={{ py: 3 }}>
          {/* Welcome & Platform Header */}
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
                "linear-gradient(135deg, rgba(81, 133, 165, 0.12) 0%, rgba(168, 113, 183, 0.12) 100%)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <Box>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
                <IoAppsOutline size={26} color="#6ba0c2" />
                <Typography level="h2" sx={{ fontSize: { xs: "xl", md: "2xl" }, fontWeight: 700 }}>
                  Opsway Platform Hub
                </Typography>
                <Chip size="sm" variant="soft" color="primary">
                  {team?.displayName || team?.name || "Workspace"}
                </Chip>
              </Stack>
              <Typography level="body-sm" sx={{ color: "text.secondary", maxWidth: 680 }}>
                Unified control center across the Opsway suite. Launch standalone products, configure autonomous
                AI agents, coordinate microservices, and manage team access and billing.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5}>
              <Button
                component={Link}
                to="/team"
                variant="outlined"
                color="neutral"
                size="sm"
                startDecorator={<AiOutlineTeam />}
              >
                Team ({memberCount ?? 1})
              </Button>
              <Button
                component={Link}
                to="/settings/billing"
                variant="outlined"
                color="neutral"
                size="sm"
                startDecorator={<IoCardOutline />}
              >
                Suite Billing
              </Button>
            </Stack>
          </Box>

          {/* Quick Metrics Bar */}
          <Grid container spacing={2}>
            <Grid xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ bgcolor: "background.surface" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography level="body-xs" textColor="text.tertiary">
                      ACTIVE MONITORS
                    </Typography>
                    <Typography level="h3" sx={{ mt: 0.5 }}>
                      {totalMonitors}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: "md",
                      bgcolor: "rgba(121, 171, 93, 0.12)",
                      color: "#79ab5d",
                    }}
                  >
                    <IoPulseOutline size={22} />
                  </Box>
                </Stack>
                <Typography level="body-xs" sx={{ color: "text.secondary", mt: 1 }}>
                  Multi-region probes running
                </Typography>
              </Card>
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ bgcolor: "background.surface" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography level="body-xs" textColor="text.tertiary">
                      OPEN INCIDENTS
                    </Typography>
                    <Typography
                      level="h3"
                      sx={{
                        mt: 0.5,
                        color: incidentCount > 0 ? "danger.400" : "text.primary",
                      }}
                    >
                      {incidentCount}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: "md",
                      bgcolor:
                        incidentCount > 0
                          ? "rgba(203, 79, 79, 0.15)"
                          : "rgba(255, 255, 255, 0.05)",
                      color: incidentCount > 0 ? "#cb4f4f" : "text.secondary",
                    }}
                  >
                    <PiFireSimpleBold size={22} />
                  </Box>
                </Stack>
                <Typography level="body-xs" sx={{ color: "text.secondary", mt: 1 }}>
                  {incidentCount > 0 ? "Requires attention" : "All services operational"}
                </Typography>
              </Card>
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ bgcolor: "background.surface" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography level="body-xs" textColor="text.tertiary">
                      AUTONOMOUS AGENTS
                    </Typography>
                    <Typography level="h3" sx={{ mt: 0.5 }}>
                      Active
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: "md",
                      bgcolor: "rgba(168, 113, 183, 0.15)",
                      color: "#A871B7",
                    }}
                  >
                    <IoSparklesOutline size={22} />
                  </Box>
                </Stack>
                <Typography level="body-xs" sx={{ color: "text.secondary", mt: 1 }}>
                  Mode: {agentMode}
                </Typography>
              </Card>
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ bgcolor: "background.surface" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography level="body-xs" textColor="text.tertiary">
                      CATALOG SERVICES
                    </Typography>
                    <Typography level="h3" sx={{ mt: 0.5 }}>
                      {serviceCount}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: "md",
                      bgcolor: "rgba(81, 133, 165, 0.15)",
                      color: "#5185a5",
                    }}
                  >
                    <IoLayersOutline size={22} />
                  </Box>
                </Stack>
                <Typography level="body-xs" sx={{ color: "text.secondary", mt: 1 }}>
                  Cross-product mappings
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Product Suite Launchers */}
          <Box>
            <Typography level="title-lg" sx={{ mb: 1.5, fontWeight: 700 }}>
              Opsway Products & Services
            </Typography>
            <Grid container spacing={2}>
              {/* Product 1: Monitoring */}
              <Grid xs={12} md={4}>
                <Card
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    bgcolor: "background.surface",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                    transition: "border-color 0.15s ease",
                    "&:hover": { borderColor: "success.400" },
                  }}
                >
                  <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: "md",
                            bgcolor: "rgba(121, 171, 93, 0.15)",
                            color: "#79ab5d",
                          }}
                        >
                          <IoPulseOutline size={24} />
                        </Box>
                        <Box>
                          <Typography level="title-md" sx={{ fontWeight: 700 }}>
                            Opsway Monitoring
                          </Typography>
                          <Typography level="body-xs" textColor="text.tertiary">
                            monitoring.opsway.eu
                          </Typography>
                        </Box>
                      </Stack>
                      <Chip size="sm" variant="soft" color="success">
                        Active
                      </Chip>
                    </Stack>
                    <Typography level="body-sm" sx={{ color: "text.secondary", mb: 2 }}>
                      End-to-end uptime monitoring with distributed multi-region probes, TLS certificate tracking,
                      anomaly detection, incident escalation rules, and integrated <strong>Status Pages</strong>.
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                      <Chip size="sm" variant="outlined">HTTP & TCP Probing</Chip>
                      <Chip size="sm" variant="outlined">Multi-region EU</Chip>
                      <Chip size="sm" variant="outlined">Status Pages</Chip>
                      <Chip size="sm" variant="outlined">SLA Reports</Chip>
                    </Stack>
                  </Box>
                  <Stack spacing={1}>
                    <Button
                      component="a"
                      href="https://monitoring.opsway.eu"
                      variant="solid"
                      color="success"
                      endDecorator={<IoArrowForward />}
                      fullWidth
                    >
                      Open Monitoring
                    </Button>
                    <Stack direction="row" spacing={1}>
                      <Button
                        component="a"
                        href="https://monitoring.opsway.eu/status-pages"
                        variant="outlined"
                        color="neutral"
                        size="sm"
                        startDecorator={<GoBrowser />}
                        sx={{ flex: 1 }}
                      >
                        Status Pages
                      </Button>
                      <Button
                        component="a"
                        href="https://monitoring.opsway.eu/alerting"
                        variant="outlined"
                        color="neutral"
                        size="sm"
                        sx={{ flex: 1 }}
                      >
                        Alerts
                      </Button>
                    </Stack>
                  </Stack>
                </Card>
              </Grid>

              {/* Product 2: Log Search */}
              <Grid xs={12} md={4}>
                <Card
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    bgcolor: "background.surface",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                    transition: "border-color 0.15s ease",
                    "&:hover": { borderColor: "#5185a5" },
                  }}
                >
                  <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: "md",
                            bgcolor: "rgba(81, 133, 165, 0.15)",
                            color: "#5185a5",
                          }}
                        >
                          <PiTerminalWindowBold size={24} />
                        </Box>
                        <Box>
                          <Typography level="title-md" sx={{ fontWeight: 700 }}>
                            Opsway Log Search
                          </Typography>
                          <Typography level="body-xs" textColor="text.tertiary">
                            logs.opsway.eu
                          </Typography>
                        </Box>
                      </Stack>
                      <Chip size="sm" variant="soft" color="primary">
                        Active
                      </Chip>
                    </Stack>
                    <Typography level="body-sm" sx={{ color: "text.secondary", mb: 2 }}>
                      Lightning-fast semantic and SQL log search engine powered by ClickHouse. Stream live logs,
                      filter across microservices, and correlate stack traces during active incidents.
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                      <Chip size="sm" variant="outlined">ClickHouse Powered</Chip>
                      <Chip size="sm" variant="outlined">Sub-second SQL</Chip>
                      <Chip size="sm" variant="outlined">Live Tail Stream</Chip>
                      <Chip size="sm" variant="outlined">Deep Correlation</Chip>
                    </Stack>
                  </Box>
                  <Stack spacing={1}>
                    <Button
                      component="a"
                      href="https://logs.opsway.eu"
                      variant="solid"
                      color="primary"
                      endDecorator={<IoArrowForward />}
                      fullWidth
                      sx={{ bgcolor: "#5185a5", "&:hover": { bgcolor: "#3a6784" } }}
                    >
                      Open Log Search
                    </Button>
                    <Button
                      component={Link}
                      to="/services"
                      variant="outlined"
                      color="neutral"
                      size="sm"
                    >
                      Service Catalog Mappings
                    </Button>
                  </Stack>
                </Card>
              </Grid>

              {/* Product 3: Autonomous Agents (Standalone) */}
              <Grid xs={12} md={4}>
                <Card
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    bgcolor: "background.surface",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                    transition: "border-color 0.15s ease",
                    "&:hover": { borderColor: "#A871B7" },
                  }}
                >
                  <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: "md",
                            bgcolor: "rgba(168, 113, 183, 0.15)",
                            color: "#A871B7",
                          }}
                        >
                          <IoSparklesOutline size={24} />
                        </Box>
                        <Box>
                          <Typography level="title-md" sx={{ fontWeight: 700 }}>
                            Autonomous Agents
                          </Typography>
                          <Typography level="body-xs" textColor="text.tertiary">
                            my.opsway.eu/agents
                          </Typography>
                        </Box>
                      </Stack>
                      <Chip size="sm" variant="soft" sx={{ bgcolor: "rgba(168, 113, 183, 0.2)", color: "#c992d9" }}>
                        Standalone Product
                      </Chip>
                    </Stack>
                    <Typography level="body-sm" sx={{ color: "text.secondary", mb: 2 }}>
                      Autonomous SRE agents that detect anomalies, investigate root causes using MCP tools across
                      monitoring and logs, and propose or execute verified remediation runbooks.
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                      <Chip size="sm" variant="outlined">ReAct Investigations</Chip>
                      <Chip size="sm" variant="outlined">Unified MCP Gateway</Chip>
                      <Chip size="sm" variant="outlined">BYO Agent / LLM</Chip>
                      <Chip size="sm" variant="outlined">1-Click Remediation</Chip>
                    </Stack>
                  </Box>
                  <Stack spacing={1}>
                    <Button
                      component={Link}
                      to="/agents"
                      variant="solid"
                      endDecorator={<IoArrowForward />}
                      fullWidth
                      sx={{
                        bgcolor: "#A871B7",
                        "&:hover": { bgcolor: "#8f579d" },
                      }}
                    >
                      Manage Agents
                    </Button>
                    <Button
                      component={Link}
                      to="/agents?tab=gateway"
                      variant="outlined"
                      color="neutral"
                      size="sm"
                    >
                      MCP Gateway
                    </Button>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Cross-Product Platform Configuration & Administration */}
          <Box>
            <Typography level="title-lg" sx={{ mb: 1.5, fontWeight: 700 }}>
              Platform Administration & Governance
            </Typography>
            <Grid container spacing={2}>
              <Grid xs={12} sm={6} md={3}>
                <Card
                  component={Link}
                  to="/services"
                  variant="outlined"
                  sx={{
                    p: 2,
                    textDecoration: "none",
                    color: "inherit",
                    bgcolor: "background.surface",
                    "&:hover": { borderColor: "primary.500" },
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <IoLayersOutline size={22} color="#5185a5" />
                    <Box>
                      <Typography level="title-sm" sx={{ fontWeight: 600 }}>
                        Service Catalog
                      </Typography>
                      <Typography level="body-xs" textColor="text.tertiary">
                        Map microservices & logs
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>

              <Grid xs={12} sm={6} md={3}>
                <Card
                  component={Link}
                  to="/team"
                  variant="outlined"
                  sx={{
                    p: 2,
                    textDecoration: "none",
                    color: "inherit",
                    bgcolor: "background.surface",
                    "&:hover": { borderColor: "primary.500" },
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <AiOutlineTeam size={22} color="#79ab5d" />
                    <Box>
                      <Typography level="title-sm" sx={{ fontWeight: 600 }}>
                        Team & Access
                      </Typography>
                      <Typography level="body-xs" textColor="text.tertiary">
                        Members, roles, invitations
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>

              <Grid xs={12} sm={6} md={3}>
                <Card
                  component={Link}
                  to="/settings/billing"
                  variant="outlined"
                  sx={{
                    p: 2,
                    textDecoration: "none",
                    color: "inherit",
                    bgcolor: "background.surface",
                    "&:hover": { borderColor: "primary.500" },
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <IoCardOutline size={22} color="#f4ac45" />
                    <Box>
                      <Typography level="title-sm" sx={{ fontWeight: 600 }}>
                        Suite Billing
                      </Typography>
                      <Typography level="body-xs" textColor="text.tertiary">
                        Manage modular plans
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>

              <Grid xs={12} sm={6} md={3}>
                <Card
                  component={Link}
                  to="/account"
                  variant="outlined"
                  sx={{
                    p: 2,
                    textDecoration: "none",
                    color: "inherit",
                    bgcolor: "background.surface",
                    "&:hover": { borderColor: "primary.500" },
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <IoPersonOutline size={22} color="#A871B7" />
                    <Box>
                      <Typography level="title-sm" sx={{ fontWeight: 600 }}>
                        Account & Security
                      </Typography>
                      <Typography level="body-xs" textColor="text.tertiary">
                        Profile, 2FA, API keys
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Unified MCP Gateway Integration Callout */}
          <Card
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: "lg",
              bgcolor: "rgba(255, 255, 255, 0.02)",
              border: "1px dashed rgba(255, 255, 255, 0.15)",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              gap={2}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <IoHardwareChipOutline size={28} color="#A871B7" />
                <Box>
                  <Typography level="title-md" sx={{ fontWeight: 600 }}>
                    Unified Model Context Protocol (FastMCP) Gateway
                  </Typography>
                  <Typography level="body-xs" textColor="text.secondary">
                    Connect Claude Desktop, Cursor, Cline, or custom agent frameworks directly to the Opsway MCP endpoint:{" "}
                    <code>https://api.opsway.eu/v1/mcp</code>
                  </Typography>
                </Box>
              </Stack>
              <Button
                component={Link}
                to="/agents?tab=gateway"
                variant="outlined"
                color="neutral"
                size="sm"
                endDecorator={<IoArrowForward />}
              >
                Configure MCP
              </Button>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </>
  );
};

export default HubOverviewPage;

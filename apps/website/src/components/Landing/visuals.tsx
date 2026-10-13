import { Box, Chip, Stack, Typography } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";
import {
  IoArrowDown,
  IoCheckmarkCircle,
  IoNotifications,
  IoPerson,
  IoWarning,
} from "react-icons/io5";
import { PiWebhooksLogoBold } from "react-icons/pi";
import { Panel, StatusDot, UptimeBars, VisualFrame } from "./primitives";

/*
 * Illustrative visuals for the landing page. These are stylised diagrams of
 * what each feature does — deliberately not product screenshots.
 */

const mono = { fontFamily: "code", fontSize: "0.8125rem" } as const;

const MethodChip: FunctionComponent<{ method: string }> = ({ method }) => (
  <Chip
    size="sm"
    variant="soft"
    color={method === "GET" ? "primary" : "neutral"}
    sx={{ ...mono, fontWeight: 600, borderRadius: "sm", minWidth: 48 }}
  >
    {method}
  </Chip>
);

/* ---------------------------------------------------------------- Hero */

const heroMonitors = [
  { name: "api.example.com", ms: 84, incidents: { 31: "degraded" as const } },
  { name: "checkout.example.com", ms: 132, incidents: {} },
  {
    name: "auth.example.com",
    ms: 61,
    incidents: { 12: "down" as const, 13: "degraded" as const },
  },
  { name: "cdn.example.com", ms: 23, incidents: {} },
];

export const HeroVisual: FunctionComponent = () => (
  <VisualFrame sx={{ p: { xs: 1.5, sm: 2.5, md: 3 } }}>
    <Box
      sx={{
        display: "grid",
        gap: { xs: 1.5, md: 2 },
        gridTemplateColumns: { xs: "1fr", md: "1.6fr 1fr" },
      }}
    >
      <Panel sx={{ p: { xs: 2, md: 2.5 } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography level="title-md">Uptime · last 45 days</Typography>
          <Chip
            size="sm"
            variant="soft"
            color="primary"
            startDecorator={<StatusDot />}
          >
            All checks passing
          </Chip>
        </Stack>
        <Stack spacing={2}>
          {heroMonitors.map((m) => (
            <Box key={m.name}>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mb: 0.75 }}
              >
                <Typography level="body-sm" textColor="text.primary" noWrap>
                  {m.name}
                </Typography>
                <Typography level="body-sm" textColor="text.tertiary">
                  {m.ms} ms
                </Typography>
              </Stack>
              <UptimeBars height={22} incidents={m.incidents} />
            </Box>
          ))}
        </Stack>
      </Panel>

      <Stack spacing={{ xs: 1.5, md: 2 }}>
        <Panel sx={{ p: 2.5 }}>
          <Typography level="body-sm" textColor="text.tertiary">
            Uptime (30 days)
          </Typography>
          <Typography
            textColor="text.primary"
            sx={{ fontSize: "2rem", fontWeight: 600, letterSpacing: "-0.02em" }}
          >
            99.98%
          </Typography>
          <ResponseSparkline />
        </Panel>

        <Panel sx={{ p: 2 }}>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Box sx={{ color: "primary.400", fontSize: 20, mt: "2px" }}>
              <IoCheckmarkCircle />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography level="title-sm">
                auth.example.com recovered
              </Typography>
              <Typography level="body-xs" textColor="text.tertiary">
                Down for 4 min · on-call was notified
              </Typography>
            </Box>
          </Stack>
        </Panel>
      </Stack>
    </Box>
  </VisualFrame>
);

const sparkline = [
  42, 38, 44, 40, 52, 47, 41, 39, 45, 58, 49, 43, 40, 37, 41, 46, 44, 39, 36,
  40,
];

const ResponseSparkline: FunctionComponent = () => {
  const max = Math.max(...sparkline);
  const points = sparkline
    .map(
      (v, i) => `${(i / (sparkline.length - 1)) * 100},${40 - (v / max) * 34}`,
    )
    .join(" ");

  return (
    <Box
      component="svg"
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      aria-hidden
      sx={{ display: "block", width: "100%", height: 48, mt: 1.5 }}
    >
      <polyline
        points={points}
        fill="none"
        stroke="var(--joy-palette-primary-400)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
    </Box>
  );
};

/* ------------------------------------------------------- Multi-step API */

const steps: {
  method: string;
  path: string;
  checks: string[];
  extract?: string;
}[] = [
  {
    method: "POST",
    path: "/v1/auth/login",
    checks: ["status == 200"],
    extract: "token ← $.access_token",
  },
  {
    method: "GET",
    path: "/v1/orders",
    checks: ["status == 200", "$.items.length > 0", "response time < 500 ms"],
  },
];

export const MultiStepVisual: FunctionComponent = () => (
  <VisualFrame>
    <Stack spacing={1} alignItems="stretch">
      {steps.map((step, i) => (
        <Box key={step.path}>
          {i > 0 && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ py: 1, pl: 2.5, color: "text.tertiary" }}
            >
              <IoArrowDown />
              <Typography level="body-xs" sx={mono} textColor="text.tertiary">
                Authorization: Bearer {"{{token}}"}
              </Typography>
            </Stack>
          )}
          <Panel sx={{ p: 2 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography
                level="body-xs"
                textColor="text.tertiary"
                fontWeight={600}
              >
                {i + 1}
              </Typography>
              <MethodChip method={step.method} />
              <Typography
                level="body-sm"
                textColor="text.primary"
                sx={mono}
                noWrap
              >
                {step.path}
              </Typography>
            </Stack>

            <Stack spacing={0.75} sx={{ mt: 1.5, pl: 3.5 }}>
              {step.checks.map((check) => (
                <Stack
                  key={check}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <Box sx={{ color: "primary.400", display: "flex" }}>
                    <IoCheckmarkCircle />
                  </Box>
                  <Typography
                    level="body-xs"
                    textColor="text.secondary"
                    sx={mono}
                  >
                    {check}
                  </Typography>
                </Stack>
              ))}
              {step.extract && (
                <Typography
                  level="body-xs"
                  textColor="text.tertiary"
                  sx={{ ...mono, pl: 3 }}
                >
                  {step.extract}
                </Typography>
              )}
            </Stack>
          </Panel>
        </Box>
      ))}
    </Stack>
  </VisualFrame>
);

/* ------------------------------------------------------------ Incidents */

const timeline: {
  title: string;
  detail: string;
  time: string;
  icon: ReactNode;
  color: string;
}[] = [
  {
    title: "Monitor failed",
    detail: "auth.example.com returned 503 from 2 locations",
    time: "09:41",
    icon: <IoWarning />,
    color: "danger.400",
  },
  {
    title: "On-call notified",
    detail: "Tier 1 · Alex via Slack and email",
    time: "09:41",
    icon: <IoNotifications />,
    color: "warning.400",
  },
  {
    title: "Acknowledged",
    detail: "Alex is investigating",
    time: "09:44",
    icon: <IoPerson />,
    color: "neutral.300",
  },
  {
    title: "Resolved",
    detail: "Checks passing again · 6 min downtime",
    time: "09:47",
    icon: <IoCheckmarkCircle />,
    color: "primary.400",
  },
];

export const IncidentVisual: FunctionComponent = () => (
  <VisualFrame>
    <Panel sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2.5 }}
      >
        <Typography level="title-md">Incident #128</Typography>
        <Chip size="sm" variant="soft" color="primary">
          Resolved
        </Chip>
      </Stack>

      <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0 }}>
        {timeline.map((event, i) => (
          <Stack
            key={event.title}
            component="li"
            direction="row"
            spacing={1.5}
            useFlexGap
            sx={{ position: "relative", pb: i < timeline.length - 1 ? 2.5 : 0 }}
          >
            {i < timeline.length - 1 && (
              <Box
                aria-hidden
                sx={{
                  position: "absolute",
                  left: 13,
                  top: 30,
                  bottom: 2,
                  width: "1px",
                  bgcolor: "neutral.700",
                }}
              />
            )}
            <Box
              sx={{
                width: 28,
                height: 28,
                flexShrink: 0,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                fontSize: 15,
                color: event.color,
                bgcolor: "background.level1",
                border: "1px solid",
                borderColor: "neutral.700",
              }}
            >
              {event.icon}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0, pt: "3px" }}>
              <Stack direction="row" justifyContent="space-between" spacing={1}>
                <Typography level="title-sm">{event.title}</Typography>
                <Typography level="body-xs" textColor="text.tertiary">
                  {event.time}
                </Typography>
              </Stack>
              <Typography level="body-sm" textColor="text.secondary">
                {event.detail}
              </Typography>
            </Box>
          </Stack>
        ))}
      </Box>
    </Panel>
  </VisualFrame>
);

/* --------------------------------------------------------- Status pages */

const components = [
  { name: "Website", incidents: {} },
  { name: "API", incidents: { 33: "degraded" as const } },
  { name: "Payments", incidents: {} },
];

export const StatusPageVisual: FunctionComponent = () => (
  <VisualFrame>
    <Panel sx={{ p: { xs: 2, md: 3 } }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2.5 }}
      >
        <Typography level="body-sm" textColor="text.tertiary" sx={mono}>
          status.example.com
        </Typography>
        <Chip size="sm" variant="outlined" color="neutral">
          Subscribe
        </Chip>
      </Stack>

      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{
          p: 2,
          mb: 3,
          borderRadius: "md",
          bgcolor: "primary.softBg",
          color: "primary.200",
        }}
      >
        <IoCheckmarkCircle size={20} />
        <Typography level="title-md" textColor="inherit">
          All systems operational
        </Typography>
      </Stack>

      <Stack spacing={2.5}>
        {components.map((c) => (
          <Box key={c.name}>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ mb: 0.75 }}
            >
              <Typography level="title-sm">{c.name}</Typography>
              <Typography level="body-xs" textColor="text.tertiary">
                {Object.keys(c.incidents).length ? "99.95%" : "100%"} uptime
              </Typography>
            </Stack>
            <UptimeBars count={40} height={24} incidents={c.incidents} />
          </Box>
        ))}
      </Stack>
    </Panel>

    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{ mt: 2, flexWrap: "wrap", rowGap: 1 }}
    >
      <Typography level="body-xs" textColor="text.tertiary">
        Embed anywhere:
      </Typography>
      <Box
        sx={{
          display: "inline-flex",
          borderRadius: "sm",
          overflow: "hidden",
          fontSize: "0.75rem",
          fontWeight: 600,
          border: "1px solid",
          borderColor: "neutral.700",
        }}
      >
        <Box sx={{ px: 1, py: 0.25, bgcolor: "neutral.700" }}>status</Box>
        <Box sx={{ px: 1, py: 0.25, bgcolor: "primary.600", color: "#fff" }}>
          operational
        </Box>
      </Box>
    </Stack>
  </VisualFrame>
);

/* --------------------------------------------------------------- Alerts */

const notifications: {
  channel: string;
  icon: ReactNode;
  title: string;
  body: string;
  status: "down" | "up";
}[] = [
  {
    channel: "Slack · #ops-alerts",
    icon: (
      <img
        src="https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg"
        alt=""
      />
    ),
    title: "api.example.com is down",
    body: "Assertion failed: status == 200 (got 502)",
    status: "down",
  },
  {
    channel: "Microsoft Teams · On-call",
    icon: (
      <img
        src="https://cdn.worldvectorlogo.com/logos/microsoft-teams-1.svg"
        alt=""
      />
    ),
    title: "Escalated to tier 2",
    body: "Not acknowledged within 15 minutes",
    status: "down",
  },
  {
    channel: "Webhook · POST /hooks/opsway",
    icon: <PiWebhooksLogoBold />,
    title: "api.example.com is back up",
    body: "Downtime 4 min · incident resolved",
    status: "up",
  },
];

export const AlertsVisual: FunctionComponent = () => (
  <VisualFrame>
    <Stack spacing={1.5}>
      {notifications.map((n, i) => (
        <Panel
          key={n.channel}
          sx={{
            p: 2,
            ml: { sm: i === 1 ? 4 : 0 },
            mr: { sm: i === 1 ? 0 : 4 },
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Box
              sx={{
                width: 32,
                height: 32,
                flexShrink: 0,
                borderRadius: "sm",
                display: "grid",
                placeItems: "center",
                fontSize: 16,
                bgcolor: "background.level1",
                border: "1px solid",
                borderColor: "neutral.700",
                "& img": { width: 16, height: 16 },
              }}
            >
              {n.icon}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography level="body-xs" textColor="text.tertiary" noWrap>
                {n.channel}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <StatusDot status={n.status} />
                <Typography level="title-sm" noWrap>
                  {n.title}
                </Typography>
              </Stack>
              <Typography level="body-sm" textColor="text.secondary">
                {n.body}
              </Typography>
            </Box>
          </Stack>
        </Panel>
      ))}
    </Stack>
  </VisualFrame>
);

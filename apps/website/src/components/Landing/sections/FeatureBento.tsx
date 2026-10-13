import { Box, Chip, Container, Stack, Typography } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";
import {
  IoAnalytics,
  IoConstructOutline,
  IoDocumentTextOutline,
  IoEarthOutline,
  IoKeyOutline,
  IoLockClosedOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import { IconTile, SectionHeading, sectionSx } from "../primitives";
import Reveal from "../Reveal";

/* ------------------------------------------------------------ mini visuals */

const LocationsVisual: FunctionComponent = () => {
  const pins = [
    { x: 24, y: 38 },
    { x: 50, y: 30 },
    { x: 79, y: 60 },
  ];

  return (
    <Box
      aria-hidden
      sx={{
        position: "relative",
        height: 132,
        borderRadius: "lg",
        border: "1px solid",
        borderColor: "divider",
        backgroundImage:
          "radial-gradient(var(--joy-palette-neutral-700) 1px, transparent 1px)",
        backgroundSize: "12px 12px",
        overflow: "hidden",
        "@keyframes ping": {
          "0%": { transform: "translate(-50%, -50%) scale(1)", opacity: 0.6 },
          "100%": { transform: "translate(-50%, -50%) scale(3.2)", opacity: 0 },
        },
      }}
    >
      {pins.map((pin, i) => (
        <Box key={i}>
          <Box
            sx={{
              position: "absolute",
              left: `${pin.x}%`,
              top: `${pin.y}%`,
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: "primary.500",
              animation: `ping 2.4s ease-out ${i * 0.8}s infinite`,
              "@media (prefers-reduced-motion: reduce)": { animation: "none" },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              left: `${pin.x}%`,
              top: `${pin.y}%`,
              width: 10,
              height: 10,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              bgcolor: "primary.400",
              border: "2px solid",
              borderColor: "background.level1",
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

const phases = [
  { name: "DNS", ms: 12, color: "var(--joy-palette-neutral-500)" },
  { name: "TCP", ms: 18, color: "var(--joy-palette-primary-700)" },
  { name: "TLS", ms: 26, color: "var(--joy-palette-primary-600)" },
  { name: "Processing", ms: 48, color: "var(--joy-palette-primary-400)" },
  { name: "Transfer", ms: 10, color: "var(--joy-palette-primary-200)" },
];

const TimingVisual: FunctionComponent = () => {
  const total = phases.reduce((sum, p) => sum + p.ms, 0);

  return (
    <Box aria-hidden>
      <Box
        sx={{
          display: "flex",
          height: 12,
          borderRadius: "sm",
          overflow: "hidden",
          gap: "2px",
        }}
      >
        {phases.map((p) => (
          <Box
            key={p.name}
            sx={{ width: `${(p.ms / total) * 100}%`, bgcolor: p.color }}
          />
        ))}
      </Box>
      <Stack
        direction="row"
        flexWrap="wrap"
        useFlexGap
        columnGap={1.5}
        rowGap={0.5}
        sx={{ mt: 1.5 }}
      >
        {phases.map((p) => (
          <Stack
            key={p.name}
            direction="row"
            spacing={0.75}
            alignItems="center"
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "2px",
                bgcolor: p.color,
              }}
            />
            <Typography level="body-xs" textColor="text.tertiary">
              {p.name} {p.ms}ms
            </Typography>
          </Stack>
        ))}
      </Stack>
      <Stack direction="row" spacing={3} sx={{ mt: 2.5 }}>
        {[
          ["P50", "98ms"],
          ["P95", "142ms"],
          ["P99", "201ms"],
        ].map(([label, value]) => (
          <Box key={label}>
            <Typography level="body-xs" textColor="text.tertiary">
              {label}
            </Typography>
            <Typography level="title-lg">{value}</Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

const MaintenanceVisual: FunctionComponent = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <Box
      aria-hidden
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: 0.5,
      }}
    >
      {days.map((day, i) => (
        <Box key={day} sx={{ textAlign: "center" }}>
          <Typography
            level="body-xs"
            textColor="text.tertiary"
            sx={{ mb: 0.75 }}
          >
            {day}
          </Typography>
          <Box
            sx={{
              height: 56,
              borderRadius: "sm",
              bgcolor: "background.body",
              border: "1px solid",
              borderColor: "divider",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {i === 5 && (
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 6,
                  height: 22,
                  bgcolor: "warning.softBg",
                  borderTop: "2px solid",
                  borderColor: "warning.400",
                }}
              />
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

const TlsVisual: FunctionComponent = () => (
  <Box aria-hidden>
    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
      <Typography
        level="body-sm"
        textColor="text.primary"
        sx={{ fontFamily: "code" }}
      >
        *.example.com
      </Typography>
      <Chip size="sm" variant="soft" color="warning">
        12 days left
      </Chip>
    </Stack>
    <Box
      sx={{
        height: 6,
        borderRadius: "xl",
        bgcolor: "background.level2",
        overflow: "hidden",
      }}
    >
      <Box sx={{ width: "87%", height: "100%", bgcolor: "warning.400" }} />
    </Box>
    <Typography level="body-xs" textColor="text.tertiary" sx={{ mt: 1 }}>
      Alert threshold: 14 days before expiry
    </Typography>
  </Box>
);

const RolesVisual: FunctionComponent = () => (
  <Stack aria-hidden spacing={1}>
    {[
      { initials: "AL", name: "Alex", role: "Owner" },
      { initials: "SK", name: "Sam", role: "Admin" },
      { initials: "JO", name: "Jo", role: "Member" },
    ].map((member) => (
      <Stack
        key={member.name}
        direction="row"
        spacing={1.25}
        alignItems="center"
      >
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            fontSize: "0.6875rem",
            fontWeight: 600,
            color: "text.secondary",
            bgcolor: "background.level2",
          }}
        >
          {member.initials}
        </Box>
        <Typography level="body-sm" textColor="text.primary" sx={{ flex: 1 }}>
          {member.name}
        </Typography>
        <Chip
          size="sm"
          variant="outlined"
          color={member.role === "Owner" ? "primary" : "neutral"}
        >
          {member.role}
        </Chip>
      </Stack>
    ))}
  </Stack>
);

const ReportsVisual: FunctionComponent = () => {
  const months = [99.2, 99.9, 99.95, 100, 99.7, 99.98];

  return (
    <Stack
      aria-hidden
      direction="row"
      alignItems="flex-end"
      spacing={1}
      sx={{ height: 96 }}
    >
      {months.map((uptime, i) => (
        <Box key={i} sx={{ flex: 1, textAlign: "center" }}>
          <Box
            sx={{
              height: `${(uptime - 98.5) * 50}px`,
              borderRadius: "4px 4px 0 0",
              bgcolor: i === months.length - 1 ? "primary.400" : "primary.700",
            }}
          />
        </Box>
      ))}
    </Stack>
  );
};

const MetricsVisual: FunctionComponent = () => (
  <Box
    aria-hidden
    component="pre"
    sx={{
      m: 0,
      p: 1.5,
      borderRadius: "md",
      bgcolor: "background.body",
      border: "1px solid",
      borderColor: "divider",
      fontFamily: "code",
      fontSize: "0.75rem",
      lineHeight: 1.7,
      color: "text.secondary",
      overflowX: "auto",
    }}
  >
    <Box component="span" sx={{ color: "text.tertiary" }}>
      # HELP opsway_monitor_up Monitor status
    </Box>
    {"\n"}
    opsway_monitor_up{"{"}name="api"{"}"}{" "}
    <Box component="span" sx={{ color: "primary.300" }}>
      1
    </Box>
    {"\n"}
    opsway_response_ms{"{"}name="api"{"}"}{" "}
    <Box component="span" sx={{ color: "primary.300" }}>
      84
    </Box>
  </Box>
);

/* ------------------------------------------------------------------ layout */

interface BentoItem {
  title: string;
  description: string;
  icon: ReactNode;
  visual: ReactNode;
  span: { xs: number; md: number };
}

const items: BentoItem[] = [
  {
    title: "Multiple locations",
    description:
      "Run checks from several regions to tell real outages from network blips.",
    icon: <IoEarthOutline />,
    visual: <LocationsVisual />,
    span: { xs: 6, md: 3 },
  },
  {
    title: "Response time analytics",
    description:
      "See exactly where time goes, and track P50, P95 and P99 over time.",
    icon: <IoAnalytics />,
    visual: <TimingVisual />,
    span: { xs: 6, md: 3 },
  },
  {
    title: "Maintenance windows",
    description: "Planned work doesn't page anyone or count as downtime.",
    icon: <IoConstructOutline />,
    visual: <MaintenanceVisual />,
    span: { xs: 6, md: 2 },
  },
  {
    title: "TLS monitoring",
    description: "Get warned well before a certificate expires.",
    icon: <IoLockClosedOutline />,
    visual: <TlsVisual />,
    span: { xs: 6, md: 2 },
  },
  {
    title: "Teams & roles",
    description: "Invite your team and decide who can change what.",
    icon: <IoPeopleOutline />,
    visual: <RolesVisual />,
    span: { xs: 6, md: 2 },
  },
  {
    title: "Reports",
    description: "Uptime, performance and incident reports for any time range.",
    icon: <IoDocumentTextOutline />,
    visual: <ReportsVisual />,
    span: { xs: 6, md: 3 },
  },
  {
    title: "API keys & metrics",
    description:
      "Automate opsway with the API and scrape metrics into Prometheus.",
    icon: <IoKeyOutline />,
    visual: <MetricsVisual />,
    span: { xs: 6, md: 3 },
  },
];

const FeatureBento: FunctionComponent = () => (
  <Box sx={{ bgcolor: "background.level1" }}>
    <Container maxWidth="lg" sx={sectionSx}>
      <Reveal>
        <SectionHeading
          eyebrow="And much more"
          title="Built for teams that run production"
          description="All the details that make monitoring trustworthy instead of noisy."
        />
      </Reveal>

      <Box
        sx={{
          display: "grid",
          gap: { xs: 2, md: 3 },
          gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
        }}
      >
        {items.map((item, i) => (
          <Box
            key={item.title}
            sx={{
              gridColumn: {
                xs: `span ${item.span.xs}`,
                md: `span ${item.span.md}`,
              },
            }}
          >
            <Reveal delay={(i % 3) * 80}>
              <Stack
                spacing={3}
                sx={{
                  height: "100%",
                  p: { xs: 2.5, md: 3 },
                  borderRadius: "xl",
                  bgcolor: "background.body",
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "border-color 150ms",
                  "&:hover": { borderColor: "neutral.700" },
                }}
              >
                <Box sx={{ flex: 1 }}>{item.visual}</Box>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <IconTile size={36}>{item.icon}</IconTile>
                  <Box>
                    <Typography level="title-md">{item.title}</Typography>
                    <Typography level="body-sm" textColor="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Reveal>
          </Box>
        ))}
      </Box>
    </Container>
  </Box>
);

export default FeatureBento;

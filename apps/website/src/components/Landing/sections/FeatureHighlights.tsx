import { Box, Container, Stack, Typography } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";
import Reveal from "../Reveal";
import { CheckList, SectionHeading, sectionSx } from "../primitives";
import {
  AlertsVisual,
  IncidentVisual,
  MultiStepVisual,
  StatusPageVisual,
} from "../visuals";

const highlights: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
  visual: ReactNode;
}[] = [
  {
    id: "monitoring",
    eyebrow: "API monitoring",
    title: "Test real user flows, not just a ping",
    description:
      "Chain HTTP requests into multi-step checks. Log in, pass the token on, and verify the response actually contains what your customers expect.",
    points: [
      "Assert on status codes, headers, JSON bodies and response times",
      "Extract variables from one step and reuse them in the next",
      "Import endpoints straight from your OpenAPI spec",
      "Check TLS certificates and get warned before they expire",
    ],
    visual: <MultiStepVisual />,
  },
  {
    id: "incidents",
    eyebrow: "Incidents & on-call",
    title: "The right person knows within seconds",
    description:
      "When a check fails, opsway opens an incident and follows your escalation policy until someone acknowledges it.",
    points: [
      "Escalation policies with on-call rotations and tiers",
      "Acknowledge, investigate and resolve with a full timeline",
      "Maintenance windows silence alerts during planned work",
    ],
    visual: <IncidentVisual />,
  },
  {
    id: "status-pages",
    eyebrow: "Status pages",
    title: "Keep customers informed, automatically",
    description:
      "Publish a status page that updates itself from your monitors, so your support inbox stays quiet during an outage.",
    points: [
      "Host it on your own domain with your own branding",
      "Visitors subscribe via email, webhook or Slack",
      "Embed a status badge or widget in your app",
    ],
    visual: <StatusPageVisual />,
  },
  {
    id: "alerting",
    eyebrow: "Alerting",
    title: "Alerts where your team already works",
    description:
      "Route notifications to the tools you use every day — and get an all-clear when things recover.",
    points: [
      "Slack, Microsoft Teams, Discord and Telegram",
      "Datadog, New Relic and generic webhooks",
      "Rules decide which incidents notify which channels",
    ],
    visual: <AlertsVisual />,
  },
];

const FeatureHighlights: FunctionComponent = () => (
  <Container maxWidth="lg" sx={sectionSx}>
    <SectionHeading
      eyebrow="Features"
      title="Everything you need when things go wrong"
      description="From the first failed check to the all-clear on your status page, opsway covers the whole incident lifecycle."
    />

    <Stack spacing={{ xs: 10, md: 14 }}>
      {highlights.map((h, i) => (
        <Reveal key={h.id}>
          <Box
            id={h.id}
            sx={{
              scrollMarginTop: 96,
              display: "grid",
              gap: { xs: 5, md: 8 },
              alignItems: "center",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            }}
          >
            <Box sx={{ order: { md: i % 2 === 0 ? 0 : 1 } }}>
              <Typography
                level="body-sm"
                fontWeight={600}
                textColor="primary.300"
                sx={{ mb: 1.5 }}
              >
                {h.eyebrow}
              </Typography>
              <Typography
                level="h3"
                sx={{
                  fontSize: { xs: "1.5rem", md: "1.875rem" },
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  mb: 2,
                }}
              >
                {h.title}
              </Typography>
              <Typography
                textColor="text.secondary"
                sx={{ fontSize: { xs: "1rem", md: "1.125rem" }, mb: 4 }}
              >
                {h.description}
              </Typography>
              <CheckList items={h.points} />
            </Box>
            <Box sx={{ minWidth: 0 }}>{h.visual}</Box>
          </Box>
        </Reveal>
      ))}
    </Stack>
  </Container>
);

export default FeatureHighlights;

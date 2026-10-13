import Reveal from "../Reveal";
import { Box, Card, Container, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { SectionHeading, sectionSx } from "../primitives";

const howItWorks = [
  {
    title: "Add your endpoints",
    description:
      "Point opsway at a URL or import your OpenAPI spec. Pick how often to check and from where.",
  },
  {
    title: "Decide who gets woken up",
    description:
      "Connect your channels and set up an escalation policy for your on-call team.",
  },
  {
    title: "Share your status",
    description:
      "Publish a status page so customers can see what's going on and subscribe to updates.",
  },
];

const HowItWorks: FunctionComponent = () => (
  <Container
    id="how-it-works"
    maxWidth="lg"
    sx={{ ...sectionSx, scrollMarginTop: 72 }}
  >
    <SectionHeading eyebrow="How it works" title="Up and running in minutes" />
    <Box
      component="ol"
      sx={{
        listStyle: "none",
        m: 0,
        p: 0,
        display: "grid",
        gap: 3,
        gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
      }}
    >
      {howItWorks.map((step, i) => (
        <Card component="li" key={step.title} sx={{ p: 3, gap: 2 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              fontWeight: 600,
              color: "primary.300",
              bgcolor: "primary.softBg",
            }}
          >
            {i + 1}
          </Box>
          <Box>
            <Typography level="title-lg" sx={{ mb: 0.75 }}>
              {step.title}
            </Typography>
            <Typography level="body-md" textColor="text.secondary">
              {step.description}
            </Typography>
          </Box>
        </Card>
      ))}
    </Box>
  </Container>
);

const RevealedHowItWorks: FunctionComponent = () => (
  <Reveal>
    <HowItWorks />
  </Reveal>
);

export default RevealedHowItWorks;

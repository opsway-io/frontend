import { Box, Container, Stack, Typography } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";
import { IoMailOutline } from "react-icons/io5";
import { PiWebhooksLogoBold } from "react-icons/pi";
import { BsMicrosoftTeams } from "react-icons/bs";
import { FaSlack } from "react-icons/fa6";
import { SiDatadog, SiDiscord, SiNewrelic, SiTelegram } from "react-icons/si";
import { SectionHeading, sectionSx } from "../primitives";
import Reveal from "../Reveal";

const integrations: { name: string; icon: ReactNode; color: string }[] = [
  { name: "Slack", icon: <FaSlack />, color: "#E01E5A" },
  { name: "Microsoft Teams", icon: <BsMicrosoftTeams />, color: "#6264A7" },
  { name: "Discord", icon: <SiDiscord />, color: "#5865F2" },
  { name: "Telegram", icon: <SiTelegram />, color: "#26A5E4" },
  { name: "Datadog", icon: <SiDatadog />, color: "#A06CD5" },
  { name: "New Relic", icon: <SiNewrelic />, color: "#1CE783" },
  { name: "Webhooks", icon: <PiWebhooksLogoBold />, color: "currentColor" },
  { name: "Email", icon: <IoMailOutline />, color: "currentColor" },
];

const Integrations: FunctionComponent = () => (
  <Container maxWidth="lg" sx={sectionSx}>
    <Reveal>
      <SectionHeading
        eyebrow="Integrations"
        title="Plugs into the tools you already use"
        description="Send alerts to your chat, your observability stack or anything that accepts a webhook."
      />
    </Reveal>

    <Reveal>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(4, minmax(0, 1fr))",
          },
          borderTop: "1px solid",
          borderLeft: "1px solid",
          borderColor: "divider",
          borderRadius: "xl",
          overflow: "hidden",
        }}
      >
        {integrations.map((integration) => (
          <Stack
            key={integration.name}
            spacing={1.5}
            alignItems="center"
            justifyContent="center"
            sx={{
              py: { xs: 3.5, md: 5 },
              borderRight: "1px solid",
              borderBottom: "1px solid",
              borderColor: "divider",
              color: "text.secondary",
              transition: "background-color 150ms, color 150ms",
              "& svg": {
                fontSize: { xs: 28, md: 32 },
                transition: "color 150ms",
              },
              "&:hover": {
                bgcolor: "background.level1",
                color: "text.primary",
                "& svg": { color: integration.color },
              },
            }}
          >
            {integration.icon}
            <Typography level="body-sm" fontWeight={500} textColor="inherit">
              {integration.name}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Reveal>
  </Container>
);

export default Integrations;

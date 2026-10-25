import { Box, Button, Chip, Container, Stack, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { IoPulseOutline } from "react-icons/io5";
import { PiTerminalWindowBold, PiSparkleFill } from "react-icons/pi";
import { HeroVisual } from "../visuals";
import { DASHBOARD_URL, GITHUB_URL } from "../constants";

const Hero: FunctionComponent = () => (
  <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 12 } }}>
    <Stack spacing={3} sx={{ alignItems: "center", textAlign: "center" }}>
      <Chip
        component="a"
        href={GITHUB_URL}
        variant="outlined"
        color="neutral"
        size="lg"
        startDecorator={
          <Chip
            size="sm"
            variant="soft"
            color="primary"
            sx={{ fontWeight: 600 }}
          >
            Umbrella Suite
          </Chip>
        }
        endDecorator={<PiSparkleFill color="#A871B7" />}
        sx={{
          pl: 0.5,
          textDecoration: "none",
          fontWeight: 600,
          fontSize: "sm",
          color: "text.secondary",
        }}
      >
        Monitoring + Log Search + Autonomous AI SRE
      </Chip>

      <Typography
        level="h1"
        sx={{
          fontSize: { xs: "2.375rem", sm: "3rem", md: "3.75rem" },
          fontWeight: 600,
          letterSpacing: "-0.025em",
          lineHeight: 1.12,
          maxWidth: 920,
        }}
      >
        The Unified Observability &{" "}
        <Box component="span" sx={{ color: "primary.400" }}>
          Autonomous SRE Suite
        </Box>
      </Typography>

      <Typography
        textColor="text.secondary"
        sx={{ fontSize: { xs: "1.125rem", md: "1.25rem" }, maxWidth: 740 }}
      >
        Real-time uptime and API monitoring, lightning-fast semantic log search, and autonomous
        AI agents that investigate incidents, correlate error logs, and execute remediation in seconds.
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ pt: 1, width: { xs: "100%", sm: "auto" } }}
      >
        <Button
          component="a"
          href="https://monitoring.opsway.eu"
          size="lg"
          variant="solid"
          color="primary"
          startDecorator={<IoPulseOutline />}
        >
          Open Monitoring
        </Button>
        <Button
          component="a"
          href="https://logs.opsway.eu"
          size="lg"
          variant="outlined"
          color="neutral"
          startDecorator={<PiTerminalWindowBold />}
        >
          Explore Log Search
        </Button>
        <Button
          component="a"
          href={DASHBOARD_URL}
          size="lg"
          variant="outlined"
          color="neutral"
          startDecorator={<PiSparkleFill color="#A871B7" />}
        >
          Opsway Hub & AI
        </Button>
      </Stack>

      <Typography level="body-sm" textColor="text.tertiary">
        Independent product subdomains or combined into one unified platform
      </Typography>
    </Stack>

    <Box sx={{ mt: { xs: 6, md: 8 }, mx: "auto", maxWidth: 1024 }}>
      <HeroVisual />
    </Box>
  </Container>
);

export default Hero;

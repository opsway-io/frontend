import { Box, Container, Stack, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { CheckList } from "../primitives";
import Reveal from "../Reveal";

const keyword = { color: "primary.300" } as const;
const muted = { color: "text.tertiary" } as const;
const string = { color: "warning.200" } as const;

const CodeWindow: FunctionComponent = () => (
  <Box
    sx={{
      borderRadius: "xl",
      border: "1px solid",
      borderColor: "divider",
      bgcolor: "background.level1",
      overflow: "hidden",
    }}
  >
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        px: 2,
        py: 1.5,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: "neutral.700",
          }}
        />
      ))}
      <Typography level="body-xs" textColor="text.tertiary" sx={{ pl: 1 }}>
        create-monitor.sh
      </Typography>
    </Stack>

    <Box
      component="pre"
      sx={{
        m: 0,
        p: { xs: 2, md: 3 },
        fontFamily: "code",
        fontSize: { xs: "0.75rem", md: "0.8125rem" },
        lineHeight: 1.8,
        color: "text.secondary",
        overflowX: "auto",
      }}
    >
      <Box component="span" sx={keyword}>
        curl
      </Box>{" "}
      -X POST https://api.opsway.eu/v1/teams/1/monitors \{"\n"}
      {"  "}-H{" "}
      <Box component="span" sx={string}>
        "Authorization: Bearer $OPSWAY_API_KEY"
      </Box>{" "}
      \{"\n"}
      {"  "}-d{" "}
      <Box component="span" sx={string}>
        '{"{"}
      </Box>
      {"\n"}
      <Box component="span" sx={string}>
        {"    "}"name": "Checkout API",{"\n"}
        {"    "}"settings": {"{"} "frequencySeconds": 60 {"}"},{"\n"}
        {"    "}"steps": [{"{"}
        {"\n"}
        {"      "}"method": "GET",{"\n"}
        {"      "}"url": "https://api.example.com/health",{"\n"}
        {"      "}"assertions": [{"\n"}
        {"        "}
        {"{"} "source": "STATUS_CODE", "operator": "EQUAL", "target": "200"{" "}
        {"}"}
        {"\n"}
        {"      "}]{"\n"}
        {"    "}
        {"}"}]{"\n"}
        {"  "}
        {"}"}'
      </Box>
      {"\n\n"}
      <Box component="span" sx={muted}>
        # → 201 Created
      </Box>
    </Box>
  </Box>
);

const ApiSection: FunctionComponent = () => (
  <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 12 } }}>
    <Box
      sx={{
        display: "grid",
        gap: { xs: 5, md: 8 },
        alignItems: "center",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1.1fr" },
      }}
    >
      <Reveal>
        <Typography
          level="body-sm"
          fontWeight={600}
          textColor="primary.300"
          sx={{ mb: 1.5 }}
        >
          Developer friendly
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
          Automate everything with the API
        </Typography>
        <Typography
          textColor="text.secondary"
          sx={{ fontSize: { xs: "1rem", md: "1.125rem" }, mb: 4 }}
        >
          Everything you can do in the dashboard, you can do from a script or
          your CI pipeline.
        </Typography>
        <CheckList
          items={[
            "Create and update monitors from your deploy pipeline",
            "Scoped API keys per team",
            "Scrape metrics into Prometheus and Grafana",
          ]}
        />
      </Reveal>
      <Reveal delay={100}>
        <CodeWindow />
      </Reveal>
    </Box>
  </Container>
);

export default ApiSection;

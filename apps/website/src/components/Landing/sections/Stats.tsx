import Reveal from "../Reveal";
import { Box, Container, Stack, Typography } from "@mui/joy";
import { FunctionComponent } from "react";

const stats = [
  { value: "30s", label: "Fastest check interval" },
  { value: "8", label: "Alert channels" },
  { value: "3", label: "Probe locations" },
  { value: "100%", label: "Open source" },
];

const Stats: FunctionComponent = () => (
  <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 10 } }}>
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
        rowGap: 4,
        borderTop: "1px solid",
        borderBottom: "1px solid",
        borderColor: "divider",
        py: { xs: 4, md: 5 },
      }}
    >
      {stats.map((stat) => (
        <Stack key={stat.label} spacing={0.5} alignItems="center">
          <Typography
            sx={{
              fontSize: { xs: "2.25rem", md: "3rem" },
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "primary.400",
            }}
          >
            {stat.value}
          </Typography>
          <Typography
            level="body-md"
            fontWeight={500}
            textColor="text.secondary"
            textAlign="center"
          >
            {stat.label}
          </Typography>
        </Stack>
      ))}
    </Box>
  </Container>
);

const RevealedStats: FunctionComponent = () => (
  <Reveal>
    <Stats />
  </Reveal>
);

export default RevealedStats;

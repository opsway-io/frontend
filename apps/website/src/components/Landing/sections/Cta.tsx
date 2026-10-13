import Reveal from "../Reveal";
import { Box, Button, Container, Stack, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { DASHBOARD_URL } from "../constants";

const Cta: FunctionComponent = () => (
  <Container maxWidth="lg">
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        gap: 4,
        p: { xs: 4, md: 8 },
        borderRadius: "xl",
        bgcolor: "background.level1",
      }}
    >
      <Stack spacing={1.5}>
        <Typography
          level="h2"
          sx={{
            fontSize: { xs: "1.5rem", md: "1.875rem" },
            fontWeight: 600,
            letterSpacing: "-0.01em",
          }}
        >
          Start monitoring today
        </Typography>
        <Typography
          textColor="text.secondary"
          sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
        >
          Set up your first check in under a minute. It's free.
        </Typography>
      </Stack>

      <Stack
        direction={{ xs: "column-reverse", sm: "row" }}
        spacing={1.5}
        sx={{ width: { xs: "100%", md: "auto" }, flexShrink: 0 }}
      >
        <Button
          component="a"
          href="/pricing"
          size="lg"
          variant="outlined"
          color="neutral"
        >
          See pricing
        </Button>
        <Button
          component="a"
          href={`${DASHBOARD_URL}/login/register`}
          size="lg"
        >
          Get started
        </Button>
      </Stack>
    </Box>
  </Container>
);

const RevealedCta: FunctionComponent = () => (
  <Reveal>
    <Cta />
  </Reveal>
);

export default RevealedCta;

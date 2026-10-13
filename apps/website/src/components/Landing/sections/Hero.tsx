import { Box, Button, Chip, Container, Stack, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { IoArrowForward, IoLogoGithub } from "react-icons/io5";
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
            Open source
          </Chip>
        }
        endDecorator={<IoArrowForward />}
        sx={{
          pl: 0.5,
          textDecoration: "none",
          fontWeight: 600,
          fontSize: "sm",
          color: "text.secondary",
        }}
      >
        Star us on GitHub
      </Chip>

      <Typography
        level="h1"
        sx={{
          fontSize: { xs: "2.375rem", sm: "3rem", md: "3.75rem" },
          fontWeight: 600,
          letterSpacing: "-0.025em",
          lineHeight: 1.12,
          maxWidth: 880,
        }}
      >
        Know it's broken{" "}
        <Box component="span" sx={{ color: "primary.400" }}>
          before your customers do
        </Box>
      </Typography>

      <Typography
        textColor="text.secondary"
        sx={{ fontSize: { xs: "1.125rem", md: "1.25rem" }, maxWidth: 680 }}
      >
        Open source uptime and API monitoring, incident management, on-call and
        status pages — in one place. If something breaks, we'll let you know.
      </Typography>

      <Stack
        direction={{ xs: "column-reverse", sm: "row" }}
        spacing={1.5}
        sx={{ pt: 1, width: { xs: "100%", sm: "auto" } }}
      >
        <Button
          component="a"
          href={GITHUB_URL}
          size="lg"
          variant="outlined"
          color="neutral"
          startDecorator={<IoLogoGithub />}
        >
          View on GitHub
        </Button>
        <Button
          component="a"
          href={`${DASHBOARD_URL}/login/register`}
          size="lg"
          endDecorator={<IoArrowForward />}
        >
          Start for free
        </Button>
      </Stack>

      <Typography level="body-sm" textColor="text.tertiary">
        Free plan available · No credit card required
      </Typography>
    </Stack>

    <Box sx={{ mt: { xs: 6, md: 8 }, mx: "auto", maxWidth: 1024 }}>
      <HeroVisual />
    </Box>
  </Container>
);

export default Hero;

import Reveal from "../Reveal";
import { Box, Button, Container, Stack, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import {
  IoCodeSlash,
  IoLogoGithub,
  IoServerOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { IconTile } from "../primitives";
import { GITHUB_URL } from "../constants";

const OpenSource: FunctionComponent = () => (
  <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 12 } }}>
    <Box
      sx={{
        display: "grid",
        gap: { xs: 4, md: 8 },
        alignItems: "center",
        gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
        p: { xs: 3, md: 6 },
        borderRadius: "xl",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box>
        <IconTile sx={{ mb: 3 }}>
          <IoLogoGithub />
        </IconTile>
        <Typography
          level="h3"
          sx={{
            fontSize: { xs: "1.5rem", md: "1.875rem" },
            fontWeight: 600,
            letterSpacing: "-0.02em",
            mb: 2,
          }}
        >
          Open source, no lock-in
        </Typography>
        <Typography
          textColor="text.secondary"
          sx={{ fontSize: { xs: "1rem", md: "1.125rem" }, mb: 3 }}
        >
          opsway is built in the open. Read the code, open an issue, send a pull
          request — or run the whole stack on your own infrastructure.
        </Typography>
        <Button
          component="a"
          href={GITHUB_URL}
          variant="outlined"
          color="neutral"
          size="lg"
          startDecorator={<IoLogoGithub />}
        >
          Browse the source
        </Button>
      </Box>

      <Stack spacing={1.5}>
        {[
          {
            icon: <IoCodeSlash />,
            title: "Transparent",
            text: "Every check and alert rule is code you can inspect.",
          },
          {
            icon: <IoServerOutline />,
            title: "Self-hostable",
            text: "Keep monitoring data on servers you control.",
          },
          {
            icon: <IoShieldCheckmarkOutline />,
            title: "Community driven",
            text: "Shaped by the people who use it every day.",
          },
        ].map((item) => (
          <Stack
            key={item.title}
            direction="row"
            spacing={2}
            alignItems="flex-start"
            sx={{
              p: 2,
              borderRadius: "lg",
              bgcolor: "background.level1",
            }}
          >
            <IconTile size={40}>{item.icon}</IconTile>
            <Box>
              <Typography level="title-md">{item.title}</Typography>
              <Typography level="body-sm" textColor="text.secondary">
                {item.text}
              </Typography>
            </Box>
          </Stack>
        ))}
      </Stack>
    </Box>
  </Container>
);

const RevealedOpenSource: FunctionComponent = () => (
  <Reveal>
    <OpenSource />
  </Reveal>
);

export default RevealedOpenSource;

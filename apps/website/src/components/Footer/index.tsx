import {
  Box,
  Container,
  Divider,
  Link as JoyLink,
  Stack,
  Typography,
} from "@mui/joy";
import { Link } from "@tanstack/react-router";
import { FunctionComponent } from "react";
import { IoLogoGithub } from "react-icons/io5";

const linkSx = {
  color: "text.secondary",
  fontWeight: 600,
  fontSize: "md",
  "&:hover": { color: "text.primary", textDecoration: "none" },
} as const;

const year = new Date().getFullYear();

const Footer: FunctionComponent = () => {
  return (
    <Box
      component="footer"
      sx={{ borderTop: "1px solid", borderColor: "divider", mt: 10 }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 4, md: 8 }}
          justifyContent="space-between"
        >
          <Stack spacing={2} sx={{ maxWidth: 320 }}>
            <Box component={Link} to="/" sx={{ display: "inline-flex" }}>
              <img src="/img/logo.svg" alt="opsway" style={{ height: 20 }} />
            </Box>
            <Typography level="body-md" textColor="text.secondary">
              Open source monitoring, status pages and alerting for your
              websites and services.
            </Typography>
          </Stack>

          <Stack
            direction="row"
            flexWrap="wrap"
            useFlexGap
            columnGap={4}
            rowGap={1.5}
            alignItems="flex-start"
          >
            <JoyLink component={Link} to="/pricing" sx={linkSx}>
              Pricing
            </JoyLink>
            <JoyLink component={Link} to="/contact" sx={linkSx}>
              Contact
            </JoyLink>
            <JoyLink component={Link} to="/terms-of-service" sx={linkSx}>
              Terms
            </JoyLink>
            <JoyLink component={Link} to="/privacy-policy" sx={linkSx}>
              Privacy
            </JoyLink>
            <JoyLink component={Link} to="/gdpr" sx={linkSx}>
              GDPR
            </JoyLink>
          </Stack>
        </Stack>

        <Divider sx={{ my: { xs: 4, md: 5 } }} />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography level="body-md" textColor="text.tertiary">
            © {year} opsway. All rights reserved.
          </Typography>
          <JoyLink
            href="https://github.com/opsway-io"
            aria-label="opsway on GitHub"
            sx={{
              color: "text.tertiary",
              "&:hover": { color: "text.primary" },
            }}
          >
            <IoLogoGithub size={22} />
          </JoyLink>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;

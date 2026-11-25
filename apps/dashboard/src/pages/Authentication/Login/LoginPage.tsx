import { Box, Button, Card, Divider, Link, Stack, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import {
  IoAppsOutline,
  IoBookOutline,
  IoPulseOutline,
  IoSparklesOutline,
} from "react-icons/io5";
import { PiTerminalWindowBold } from "react-icons/pi";
import { NavLink, useLocation } from "react-router-dom";
import Conditional from "../../../components/Conditional/Conditional";
import ENV from "../../../env";
import AuthCard from "../components/AuthCard";
import LoginForm from "./LoginForm";
import SocialLoginButtons from "./SocialLoginButtons";

const LoginPage: FunctionComponent = () => {
  const location = useLocation();
  const isMonitoringHost =
    typeof window !== "undefined" &&
    window.location.hostname.startsWith("monitoring");

  return (
    <>
      <Helmet>
        <title>Sign in</title>
      </Helmet>

      <AuthCard title="Welcome back" description="Sign in to your account">
        <LoginForm />

        <Conditional value={ENV.SOCIAL_LOGIN}>
          <Divider sx={{ color: "text.tertiary", fontSize: "xs" }}>
            or continue with
          </Divider>
          <SocialLoginButtons />
        </Conditional>

        <Typography
          level="body-sm"
          textColor="text.secondary"
          sx={{ textAlign: "center" }}
        >
          Don&apos;t have an account?{" "}
          <Link
            component={NavLink}
            to={`/login/register${location.search}`}
            fontWeight="md"
          >
            Create a new account
          </Link>
        </Typography>
      </AuthCard>

      {/* Public Product Info Links for Non-Logged-In Visitors */}
      <Card
        variant="outlined"
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 2,
          bgcolor: "background.surface",
          borderColor: "divider",
        }}
      >
        <Stack spacing={1.25}>
          <Stack direction="row" spacing={1} alignItems="center">
            <IoBookOutline size={18} color="#6ba0c2" />
            <Typography level="title-sm" sx={{ fontWeight: 600 }}>
              Explore Product Info &amp; Documentation
            </Typography>
          </Stack>
          <Typography level="body-xs" textColor="text.tertiary">
            Learn what each Opsway product does before signing in, or log in for step-by-step operational playbooks:
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
              pt: 0.5,
            }}
          >
            <Button
              component={NavLink}
              to="/info/monitoring"
              size="sm"
              variant={isMonitoringHost ? "soft" : "outlined"}
              color={isMonitoringHost ? "success" : "neutral"}
              startDecorator={<IoPulseOutline color="#79ab5d" />}
              sx={{ justifyContent: "flex-start", fontSize: "xs" }}
            >
              Monitoring Info
            </Button>
            <Button
              component={NavLink}
              to="/info/logs"
              size="sm"
              variant="outlined"
              color="neutral"
              startDecorator={<PiTerminalWindowBold color="#5185a5" />}
              sx={{ justifyContent: "flex-start", fontSize: "xs" }}
            >
              Log Search Info
            </Button>
            <Button
              component={NavLink}
              to="/info/agents"
              size="sm"
              variant="outlined"
              color="neutral"
              startDecorator={<IoSparklesOutline color="#A871B7" />}
              sx={{ justifyContent: "flex-start", fontSize: "xs" }}
            >
              AI Agents Info
            </Button>
            <Button
              component={NavLink}
              to="/info/hub"
              size="sm"
              variant={!isMonitoringHost ? "soft" : "outlined"}
              color={!isMonitoringHost ? "primary" : "neutral"}
              startDecorator={<IoAppsOutline color="#6ba0c2" />}
              sx={{ justifyContent: "flex-start", fontSize: "xs" }}
            >
              Opsway Hub Info
            </Button>
          </Box>
        </Stack>
      </Card>
    </>
  );
};

export default LoginPage;

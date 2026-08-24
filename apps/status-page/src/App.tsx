import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { FunctionComponent, useEffect, useState } from "react";
import {
  getPublicStatusPage,
  GetPublicStatusPageResponse,
  verifySubscriber,
} from "./api";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Calendar from "./components/Calendar";
import ComponentStatus from "./components/ComponentStatus";
import SubscribeModal from "./components/SubscribeModal";

const currentDomain =
  window.location.hostname === "localhost"
    ? "status.opsway.eu"
    : window.location.hostname;

// Reusable glassmorphic styles
export const glassCardStyle = {
  background: "rgba(30, 41, 59, 0.4)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: "0 4px 24px -4px rgba(0, 0, 0, 0.3)",
  borderRadius: 3,
};

const VerificationView: FunctionComponent = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    const parts = window.location.pathname.split("/");
    const token = parts[parts.length - 1];

    verifySubscriber(currentDomain, token)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, []);

  return (
    <Container component={Stack} spacing={2} marginTop={8} alignItems="center">
      <Card
        sx={{
          ...glassCardStyle,
          padding: 6,
          textAlign: "center",
          maxWidth: 500,
          width: "100%",
        }}
      >
        {status === "loading" && (
          <Typography color="text.secondary">
            Verifying your subscription...
          </Typography>
        )}
        {status === "success" && (
          <Box sx={{ animation: "fadeIn 0.5s ease-out" }}>
            <Typography
              variant="h5"
              color="#10b981"
              gutterBottom
              fontWeight="bold"
            >
              Subscription Verified!
            </Typography>
            <Typography mb={4} color="text.secondary">
              You will now receive updates about incidents and maintenance.
            </Typography>
            <Button
              variant="contained"
              onClick={() => (window.location.href = "/")}
              sx={{
                backgroundColor: "#10b981",
                "&:hover": { backgroundColor: "#059669" },
                borderRadius: 2,
                textTransform: "none",
                px: 4,
              }}
            >
              Return to Status Page
            </Button>
          </Box>
        )}
        {status === "error" && (
          <Box sx={{ animation: "fadeIn 0.5s ease-out" }}>
            <Typography
              variant="h5"
              color="#f43f5e"
              gutterBottom
              fontWeight="bold"
            >
              Verification Failed
            </Typography>
            <Typography mb={4} color="text.secondary">
              The verification link may be invalid or expired.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => (window.location.href = "/")}
              sx={{
                borderColor: "rgba(255,255,255,0.2)",
                color: "white",
                "&:hover": {
                  borderColor: "rgba(255,255,255,0.4)",
                  backgroundColor: "rgba(255,255,255,0.05)",
                },
                borderRadius: 2,
                textTransform: "none",
                px: 4,
              }}
            >
              Return to Status Page
            </Button>
          </Box>
        )}
      </Card>
    </Container>
  );
};

const App: FunctionComponent = () => {
  const [data, setData] = useState<GetPublicStatusPageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

  const isVerificationRoute =
    window.location.pathname.startsWith("/subscribe/verify/");

  useEffect(() => {
    if (isVerificationRoute) return;

    const savedPassword =
      localStorage.getItem(`status_page_password_${currentDomain}`) || "";

    getPublicStatusPage(currentDomain, savedPassword)
      .then((res) => {
        setData(res);
        setLoading(false);
        setUnauthorized(false);
        document.title = res.name;
        if (res.faviconUrl) {
          let link = document.querySelector(
            "link[rel~='icon']",
          ) as HTMLLinkElement;
          if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
          }
          link.href = res.faviconUrl;
        }

        const oldStyle = document.getElementById("custom-statuspage-css");
        if (oldStyle) {
          oldStyle.remove();
        }

        if (res.customCss) {
          const styleEl = document.createElement("style");
          styleEl.id = "custom-statuspage-css";
          styleEl.innerHTML = res.customCss;
          document.head.appendChild(styleEl);
        }
      })
      .catch((err) => {
        if (err.message === "UNAUTHORIZED") {
          setUnauthorized(true);
        } else {
          setError(true);
        }
        setLoading(false);
      });
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    getPublicStatusPage(currentDomain, passwordInput)
      .then((res) => {
        localStorage.setItem(
          `status_page_password_${currentDomain}`,
          passwordInput,
        );
        setData(res);
        setUnauthorized(false);
        document.title = res.name;
        if (res.customCss) {
          const styleEl = document.createElement("style");
          styleEl.id = "custom-statuspage-css";
          styleEl.innerHTML = res.customCss;
          document.head.appendChild(styleEl);
        }
      })
      .catch((err) => {
        if (err.message === "UNAUTHORIZED") {
          setLoginError("Invalid password. Please try again.");
        } else {
          setLoginError("Failed to authenticate. Please try again.");
        }
      });
  };

  if (isVerificationRoute) {
    return <VerificationView />;
  }

  if (loading) {
    return (
      <Box
        p={8}
        textAlign="center"
        color="text.secondary"
        sx={{ animation: "pulse 2s infinite" }}
      >
        <Typography variant="h6" fontWeight="300">
          Loading status page...
        </Typography>
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box p={8} textAlign="center" color="#f43f5e">
        <Typography variant="h6" fontWeight="bold">
          Failed to load status page.
        </Typography>
      </Box>
    );
  }

  if (unauthorized) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          p: 3,
        }}
      >
        <Card
          sx={{
            ...glassCardStyle,
            maxWidth: 420,
            width: "100%",
            textAlign: "center",
            p: 5,
          }}
        >
          <Box sx={{ mb: 3 }}>
            <svg
              fill="none"
              stroke="#10b981"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: 56, height: 56 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              ></path>
            </svg>
          </Box>
          <Typography
            variant="h5"
            sx={{ mb: 1, color: "#fff", fontWeight: 700 }}
          >
            Private Status Page
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 4 }}>
            This status page is password protected. Please enter the password to
            view.
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              type="password"
              label="Password"
              variant="outlined"
              fullWidth
              autoFocus
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "rgba(0,0,0,0.2)",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                  "&.Mui-focused fieldset": { borderColor: "#10b981" },
                },
              }}
              error={!!loginError}
              helperText={loginError}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                py: 1.5,
                fontWeight: 600,
                borderRadius: 2,
                backgroundColor: "#10b981",
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": {
                  backgroundColor: "#059669",
                },
              }}
            >
              Unlock
            </Button>
          </form>
        </Card>
      </Box>
    );
  }

  const hasIncidents = data.activeIncidents && data.activeIncidents.length > 0;
  const hasMaintenance =
    data.activeMaintenance && data.activeMaintenance.length > 0;

  let statusBannerBg =
    "linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(16, 185, 129, 0.1) 100%)";
  let statusBannerBorder = "rgba(16, 185, 129, 0.4)";
  let statusBannerColor = "#10b981"; // Emerald
  let statusText = "All Systems Operational";

  if (hasIncidents) {
    statusBannerBg =
      "linear-gradient(135deg, rgba(244, 63, 94, 0.25) 0%, rgba(244, 63, 94, 0.1) 100%)";
    statusBannerBorder = "rgba(244, 63, 94, 0.4)";
    statusBannerColor = "#f43f5e"; // Rose
    statusText = "Some systems are experiencing issues";
  } else if (hasMaintenance) {
    statusBannerBg =
      "linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(59, 130, 246, 0.1) 100%)";
    statusBannerBorder = "rgba(59, 130, 246, 0.4)";
    statusBannerColor = "#3b82f6"; // Blue
    statusText = "Active Maintenance";
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {data.headerHtml && (
        <div dangerouslySetInnerHTML={{ __html: data.headerHtml }} />
      )}
      <Container
        component={Stack}
        spacing={4}
        sx={{ pt: 6, pb: 8, maxWidth: "800px !important" }}
      >
        {data.customComponentsHtml && (
          <div
            dangerouslySetInnerHTML={{ __html: data.customComponentsHtml }}
          />
        )}

        {/* Header Section */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          alignItems={{ xs: "flex-start", sm: "center" }}
          sx={{ mb: 2 }}
        >
          <Stack direction="row" spacing={2} alignItems="center" flex={1}>
            {data.logoUrl && (
              <a href={data.logoLink || "#"} target="_blank" rel="noreferrer">
                <img
                  src={data.logoUrl}
                  alt={data.name}
                  style={{ maxHeight: 48, borderRadius: 8 }}
                />
              </a>
            )}
            <Typography variant="h4" fontWeight="800" letterSpacing="-0.02em">
              {data.name}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button
              sx={{
                color: "text.secondary",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": { backgroundColor: "rgba(255,255,255,0.05)" },
              }}
            >
              Report a problem
            </Button>
            <Button
              variant="contained"
              onClick={() => setIsSubscribeOpen(true)}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "#fff",
                boxShadow: "none",
                border: "1px solid rgba(255,255,255,0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.15)",
                  boxShadow: "none",
                },
              }}
            >
              Subscribe to updates
            </Button>
          </Stack>
        </Stack>

        <SubscribeModal
          open={isSubscribeOpen}
          onClose={() => setIsSubscribeOpen(false)}
          domain={currentDomain}
        />

        {/* Global Status Banner */}
        <Card
          sx={{
            ...glassCardStyle,
            p: 4,
            background: statusBannerBg,
            borderColor: statusBannerBorder,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5" fontWeight="700" color={statusBannerColor}>
            {statusText}
          </Typography>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: statusBannerColor,
              boxShadow: `0 0 12px ${statusBannerColor}`,
              animation: hasIncidents ? "pulse 2s infinite" : "none",
            }}
          />
        </Card>

        {/* Active Incidents */}
        {data.activeIncidents?.map((incident) => (
          <Card
            key={`incident-${incident.id}`}
            sx={{
              ...glassCardStyle,
              borderColor: "rgba(244, 63, 94, 0.3)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                backgroundColor: "rgba(244, 63, 94, 0.15)",
                px: 3,
                py: 2,
                borderBottom: "1px solid rgba(244, 63, 94, 0.2)",
              }}
            >
              <Typography
                variant="subtitle2"
                color="#f43f5e"
                fontWeight="700"
                textTransform="uppercase"
                letterSpacing="0.05em"
              >
                Active Incident
              </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                {incident.title}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ whiteSpace: "pre-wrap" }}
              >
                {incident.description ||
                  "We are currently investigating this issue."}
              </Typography>
            </CardContent>
          </Card>
        ))}

        {/* Active Maintenance */}
        {data.activeMaintenance?.map((maintenance) => (
          <Card
            key={`maintenance-${maintenance.id}`}
            sx={{
              ...glassCardStyle,
              borderColor: "rgba(59, 130, 246, 0.3)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                backgroundColor: "rgba(59, 130, 246, 0.15)",
                px: 3,
                py: 2,
                borderBottom: "1px solid rgba(59, 130, 246, 0.2)",
              }}
            >
              <Typography
                variant="subtitle2"
                color="#3b82f6"
                fontWeight="700"
                textTransform="uppercase"
                letterSpacing="0.05em"
              >
                Scheduled Maintenance
              </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                {maintenance.title}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ whiteSpace: "pre-wrap" }}
              >
                {maintenance.description || "Ongoing maintenance window."}
              </Typography>
            </CardContent>
          </Card>
        ))}

        {/* Components List */}
        {data.layout !== "SIMPLE" && (
          <Card sx={{ ...glassCardStyle, overflow: "hidden" }}>
            <Box
              sx={{
                px: 3,
                py: 2.5,
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Typography variant="subtitle1" fontWeight="600">
                Platform Components
              </Typography>
            </Box>

            <Box sx={{ px: 1, py: 1 }}>
              {data.monitors.map((m, idx) => (
                <Box
                  key={m.id}
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    transition: "background-color 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.03)",
                    },
                  }}
                >
                  <ComponentStatus
                    name={m.name}
                    status={m.status}
                    layout={data.layout}
                  />
                  {idx < data.monitors.length - 1 && (
                    <Divider sx={{ mt: 1.5, mb: 0, opacity: 0.5 }} />
                  )}
                </Box>
              ))}
            </Box>
          </Card>
        )}

        {/* Calendar */}
        {data.layout !== "SIMPLE" && (
          <Card sx={{ ...glassCardStyle, overflow: "hidden" }}>
            <Box
              sx={{
                px: 3,
                py: 2.5,
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Typography variant="subtitle1" fontWeight="600">
                Maintenance Calendar
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Calendar maintenanceEvents={data.maintenanceEvents || []} />
            </Box>
          </Card>
        )}

        {/* Footer */}
        {data.footerHtml && (
          <div dangerouslySetInnerHTML={{ __html: data.footerHtml }} />
        )}

        {data.showBranding !== false && (
          <Box sx={{ textAlign: "center", pt: 4 }}>
            <Link
              href="https://opsway.eu"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                textDecoration: "none",
                transition: "opacity 0.2s",
                "&:hover": { opacity: 0.8 },
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ opacity: 0.4, fontWeight: 500 }}
              >
                powered by opsway.eu
              </Typography>
            </Link>
          </Box>
        )}
      </Container>
    </LocalizationProvider>
  );
};

export default App;

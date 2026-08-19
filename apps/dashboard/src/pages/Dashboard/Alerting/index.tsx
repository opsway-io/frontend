import { FunctionComponent } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { Helmet } from "react-helmet";
import { IoAdd } from "react-icons/io5";
import Container from "../../../components/Container";
import Placeholder from "../../../components/Placeholder";
import { NavLink, Link } from "react-router-dom";
import { Restrict, Role } from "../../../components/Restrict";
import { useAlertRules } from "../../../hooks/alerting.query";
import moment from "moment";
import {
  MdOutlineMonitor,
  MdNotificationsActive,
  MdWarning,
} from "react-icons/md";

const parseChannels = (channelsStr: string): string[] => {
  try {
    const parsed = JSON.parse(channelsStr);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (e) {
    // ignore
  }
  return channelsStr
    .split(",")
    .map((c) => c.trim())
    .filter((c) => c);
};

const AlertingView: FunctionComponent = () => {
  const { data: rules, isLoading } = useAlertRules();
  const list = rules || [];

  return (
    <>
      <Helmet>
        <title>Alerting</title>
      </Helmet>

      <Container
        header="Alerting"
        description="Configure rules for notifying your team."
        primaryActions={[
          <Restrict min={Role.ADMIN} key="add">
            <Button
              startIcon={<IoAdd />}
              color="secondary"
              sx={{
                span: {
                  color: (t) => t.palette.success.main,
                },
              }}
              component={NavLink}
              to="/alerting/create"
            >
              Create Rule
            </Button>
          </Restrict>,
        ]}
      >
        <Card>
          <CardContent>
            {isLoading ? (
              <Placeholder />
            ) : list.length === 0 ? (
              <Typography align="center" color="text.secondary">
                No alert rules found. Create one to receive notifications.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {list.map((rule) => (
                  <Card
                    key={rule.id}
                    component={Link}
                    to={`${rule.id}`}
                    sx={{ textDecoration: "none" }}
                    variant="outlined"
                  >
                    <CardContent>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                            <Typography variant="h6" color="text.primary">
                              {rule.name}
                            </Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                            {rule.condition === "monitor_down" ? (
                              <MdOutlineMonitor size={18} color="gray" />
                            ) : (
                              <MdWarning size={18} color="gray" />
                            )}
                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              Condition: <strong>{rule.condition}</strong>
                            </Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <MdNotificationsActive size={18} color="gray" />
                            <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                              Channels:
                            </Typography>
                            {parseChannels(rule.channels).map((channel, i) => (
                              <Chip
                                key={i}
                                label={channel}
                                size="small"
                                variant="outlined"
                                color="primary"
                              />
                            ))}
                          </Stack>
                        </Box>
                        <Stack alignItems="flex-end">
                          <Chip
                            label={rule.enabled ? "Enabled" : "Disabled"}
                            color={rule.enabled ? "success" : "default"}
                            size="small"
                          />
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default AlertingView;

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { FunctionComponent, useState } from "react";
import { Helmet } from "react-helmet";
import { IoAdd } from "react-icons/io5";
import Container from "../../../components/Container";
import Placeholder from "../../../components/Placeholder";
import { NavLink, Link } from "react-router-dom";
import Conditional from "../../../components/Conditional";
import { Restrict, Role } from "../../../components/Restrict";
import { useMaintenanceWindows } from "../../../hooks/maintenance.query";
import moment from "moment";

const MaintenanceView: FunctionComponent = () => {
  const [tab, setTab] = useState(0);

  const { data: maintenances, isLoading } = useMaintenanceWindows();
  const windows = maintenances || [];

  const now = moment();

  const activeWindows = windows.filter((w) => {
    const start = moment(w.settings?.startAt);
    const end = moment(w.settings?.endAt);
    return start.isSameOrBefore(now) && end.isAfter(now);
  });

  const scheduledWindows = windows.filter((w) => {
    const start = moment(w.settings?.startAt);
    return start.isAfter(now);
  });

  const endedWindows = windows.filter((w) => {
    const end = moment(w.settings?.endAt);
    return end.isSameOrBefore(now);
  });

  const activeCount = activeWindows.length;
  const scheduledCount = scheduledWindows.length;
  const endedCount = endedWindows.length;

  return (
    <>
      <Helmet>
        <title>Maintenance</title>
      </Helmet>

      <Container
        header="Maintenance"
        description="Schedule maintenance windows to avoid false alerts and notifications."
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
              to="/maintenance/create"
            >
              Schedule a maintenance window
            </Button>
          </Restrict>,
        ]}
      >
        <Card>
          <Box sx={{ width: "100%" }}>
            <Tabs value={tab} onChange={(_, i) => setTab(i)}>
              <Tab
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <span>Active</span>
                    <Chip label={activeCount} color="success" size="small" />
                  </Stack>
                }
              />
              <Tab
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <span>Scheduled</span>
                    <Chip label={scheduledCount} color="info" size="small" />
                  </Stack>
                }
              />
              <Tab
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <span>Ended</span>
                    <Chip label={endedCount} color="secondary" size="small" />
                  </Stack>
                }
              />
            </Tabs>
          </Box>
        </Card>

        <Card>
          <Box hidden={tab !== 0}>
            <CardContent>
              {isLoading ? (
                <Placeholder />
              ) : activeWindows.length === 0 ? (
                <Typography align="center" color="text.secondary">
                  No active maintenance windows
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {activeWindows.map((m) => (
                    <Card
                      key={m.id}
                      component={Link}
                      to={`${m.id}`}
                      sx={{ textDecoration: "none" }}
                      variant="outlined"
                    >
                      <CardContent>
                        <Typography variant="h6" color="text.primary">
                          {m.title || "Untitled Window"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Ends {moment(m.settings?.endAt).fromNow()}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Box>
          <Box hidden={tab !== 1}>
            <CardContent>
              {isLoading ? (
                <Placeholder />
              ) : scheduledWindows.length === 0 ? (
                <Typography align="center" color="text.secondary">
                  No scheduled maintenance windows
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {scheduledWindows.map((m) => (
                    <Card
                      key={m.id}
                      component={Link}
                      to={`${m.id}`}
                      sx={{ textDecoration: "none" }}
                      variant="outlined"
                    >
                      <CardContent>
                        <Typography variant="h6" color="text.primary">
                          {m.title || "Untitled Window"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Starts {moment(m.settings?.startAt).fromNow()}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Box>

          <Box hidden={tab !== 2}>
            <CardContent>
              {isLoading ? (
                <Placeholder />
              ) : endedWindows.length === 0 ? (
                <Typography align="center" color="text.secondary">
                  No ended maintenance windows
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {endedWindows.map((m) => (
                    <Card
                      key={m.id}
                      component={Link}
                      to={`${m.id}`}
                      sx={{ textDecoration: "none" }}
                      variant="outlined"
                    >
                      <CardContent>
                        <Typography variant="h6" color="text.primary">
                          {m.title || "Untitled Window"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Ended {moment(m.settings?.endAt).fromNow()}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Box>
        </Card>
      </Container>
    </>
  );
};

export default MaintenanceView;

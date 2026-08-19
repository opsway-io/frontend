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
import { useHeartbeats } from "../../../hooks/heartbeats.query";
import moment from "moment";

const HeartbeatsView: FunctionComponent = () => {
  const { data: heartbeats, isLoading } = useHeartbeats();
  const list = heartbeats || [];

  return (
    <>
      <Helmet>
        <title>Heartbeats</title>
      </Helmet>

      <Container
        header="Heartbeats"
        description="Monitor cron jobs and background tasks with inbound pings."
        secondaryActions={[
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
              to="/heartbeats/create"
            >
              Create Heartbeat
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
                No heartbeats found. Create one to start monitoring background
                tasks.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {list.map((hb) => (
                  <Card
                    key={hb.id}
                    component={Link}
                    to={`${hb.id}`}
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
                          <Typography variant="h6" color="text.primary">
                            {hb.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Interval: {hb.interval}m | Grace: {hb.grace}m
                          </Typography>
                        </Box>
                        <Stack alignItems="flex-end">
                          <Chip
                            label={hb.status}
                            color={
                              hb.status === "UP"
                                ? "success"
                                : hb.status === "DOWN"
                                  ? "error"
                                  : "default"
                            }
                            size="small"
                          />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                          >
                            Last ping:{" "}
                            {hb.lastPing
                              ? moment(hb.lastPing).fromNow()
                              : "Never"}
                          </Typography>
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

export default HeartbeatsView;

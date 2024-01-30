import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputBase,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { FunctionComponent, memo, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { BsFilterRight } from "react-icons/bs";
import { IoAdd, IoSearch } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import Conditional from "../../../components/Conditional";
import Container from "../../../components/Container";
import useAuthenticationStore from "../../../hooks/authentication.store";
import { useDebounce } from "../../../utilities/debounce";
import MonitorsDataGrid from "./components/MonitorsDataGrid";
import * as MonitorsAPI from "../../../api/endpoints/monitors";
import { useCurrentUserRole } from "../../../hooks/user.query";
import { Role } from "../../../components/Restrict";

const MONITORS_PER_PAGE = 10;

const MonitorsView: FunctionComponent = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);
  const currentRole = useCurrentUserRole();

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 250);

  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setOffset(0);
  }, [query]);

  const { data, isLoading, error } = useQuery(
    ["teams", teamId, "monitors", { offset: offset, query: debouncedQuery }],
    () => {
      if (!teamId) {
        return Promise.resolve(null);
      }

      return MonitorsAPI.getMonitors(
        teamId,
        offset,
        10,
        debouncedQuery ? debouncedQuery : undefined,
      );
    },
    {
      keepPreviousData: true,
    },
  );

  return (
    <>
      <Helmet>
        <title>Monitors</title>
      </Helmet>

      <Container
        loading={isLoading || !currentRole}
        error={
          error ? "Failed to load monitors, try to reload the page." : undefined
        }
        header="Monitors"
        hideHeader={data?.totalCount === 0}
        description="Monitors allow you to actively keep an eye on the uptime of your websites and APIs."
        secondaryActions={[
          <Conditional
            value={
              data?.monitors.length !== 0 &&
              Role.ADMIN.equalOrHigher(currentRole)
            }
          >
            <Button
              startIcon={<IoAdd />}
              color="secondary"
              sx={{
                span: {
                  color: (t) => t.palette.success.main,
                },
              }}
              component={NavLink}
              to="/monitors/create"
            >
              Create monitor
            </Button>
          </Conditional>,
        ]}
        skeleton={
          <>
            <Skeleton variant="rectangular" height={40} />
            <Stack direction="row" spacing={1}>
              <Skeleton
                variant="rectangular"
                height={40}
                sx={{
                  flex: 1,
                }}
              />
              <Skeleton variant="rectangular" height={40} width={75} />
            </Stack>
            <Skeleton variant="rectangular" height={300} />
          </>
        }
      >
        <Conditional value={data?.totalCount === 0}>
          <Card>
            <CardContent>
              <Stack
                spacing={1}
                sx={{
                  padding: 1,
                  textAlign: "left",
                  maxWidth: 600,
                }}
              >
                <Typography variant="h5">
                  You don't have any monitors yet
                </Typography>

                <Typography variant="body1" color="text.secondary">
                  Monitors are used to check the availability of your services.
                  You can create a monitor for a website, API, or any other
                  service that you want to monitor.
                </Typography>

                <Box
                  sx={{
                    paddingTop: 2,
                  }}
                >
                  <Button
                    startIcon={<IoAdd />}
                    variant="gradiant1"
                    color="success"
                    component={NavLink}
                    to="/monitors/create"
                  >
                    Create monitor
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Conditional>

        <Conditional value={data?.monitors.length !== 0}>
          <Card
            sx={{
              backgroundColor: (t) => t.palette.success.main,
              color: (t) => t.palette.success.contrastText,
              textAlign: "center",
              padding: (t) => t.spacing(1),
            }}
          >
            <Typography fontSize={16} fontWeight={500}>
              All checks are passing
            </Typography>
          </Card>

          <Stack direction="row" spacing={1}>
            <Paper
              component="form"
              sx={{
                p: "0px 4px",
                display: "flex",
                alignItems: "center",
                flex: 1,
              }}
              variant="outlined"
            >
              <InputBase
                size="small"
                sx={{ marginLeft: 1, flex: 1, background: "transparent" }}
                placeholder="Search monitors"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <IconButton type="submit" sx={{ p: "10px" }} size="small">
                <IoSearch />
              </IconButton>
            </Paper>

            <Button
              sx={{
                border: (t) => `1px solid ${t.palette.divider}`,
              }}
              endIcon={<BsFilterRight />}
            >
              Filters
            </Button>
          </Stack>

          <Card>
            <MonitorsDataGrid
              monitors={data?.monitors}
              rowCount={data?.totalCount}
              paginationMode="server"
              onPaginationModelChange={(model) => {
                setOffset(model.page * MONITORS_PER_PAGE);
              }}
            />
          </Card>
        </Conditional>
      </Container>
    </>
  );
};

export default memo(MonitorsView);

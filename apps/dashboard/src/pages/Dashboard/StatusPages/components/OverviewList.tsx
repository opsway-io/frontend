import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { FunctionComponent } from "react";
import { IoOpenOutline, IoStatsChart } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

interface StatusPageOverviewListProps {}

import { useStatusPages } from "../../../../hooks/statuspages.query";
import { StatusPage } from "../../../../api/endpoints/statuspages";

interface StatusPageOverviewListProps {}

const StatusPageOverviewList: FunctionComponent<
  StatusPageOverviewListProps
> = () => {
  const { data: statusPages, isLoading, error } = useStatusPages();

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (error || !statusPages) {
    return <Typography color="error">Error loading status pages</Typography>;
  }

  if (statusPages.statusPages.length === 0) {
    return <Typography>No status pages found</Typography>;
  }

  return (
    <Stack spacing={2}>
      {statusPages.statusPages.map((sp) => (
        <OverviewListItem key={sp.id} statusPage={sp} />
      ))}
    </Stack>
  );
};

interface OverviewListItemProps {
  statusPage: StatusPage;
}

const OverviewListItem: FunctionComponent<OverviewListItemProps> = ({
  statusPage,
}) => {
  const navigate = useNavigate();

  return (
    <Stack direction="row" spacing={0.5}>
      <Card
        component={Button}
        sx={{
          display: "block",
          textAlign: "left",
          padding: 0,
          flex: 1,
        }}
      >
        <Stack direction="row">
          <Grid
            container
            alignItems="center"
            p={2}
            columns={{ xs: 1, md: 2 }}
            justifyContent="space-between"
            gap={{ xs: 2, md: 4 }}
            onClick={() => navigate(`/status-pages/${statusPage.id}`)}
          >
            <Grid item>
              <Stack spacing={1}>
                <Typography variant="body2">
                  {statusPage.name} - {statusPage.domain}
                </Typography>

                <Stack direction="row" spacing={1}>
                  {/* Monitors can be fetched and displayed here later */}
                  <Chip size="small" label="api" color="info" />
                </Stack>
              </Stack>
            </Grid>

            <Grid
              item
              direction="row"
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
              gap={2}
            >
              <Stack textAlign={{ xs: "left", md: "right" }}>
                <Typography variant="body2" color="text.secondary">
                  109 visits today
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  1.2k visits this month
                </Typography>
              </Stack>

              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <IoStatsChart size={38} />
              </Box>
            </Grid>
          </Grid>
        </Stack>
      </Card>

      <Tooltip title="Open in a new tab">
        <Card component={Button} color="primary">
          <IoOpenOutline size={18} />
        </Card>
      </Tooltip>
    </Stack>
  );
};

export default StatusPageOverviewList;

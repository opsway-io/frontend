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
import { MonitorIncident } from "../../../../../src/api/endpoints/incidents";

interface MonitorIncidentPageIncidentsListProps {
  incidents?: MonitorIncident[]; 
}

const IncidentPageIncidentsList: FunctionComponent<
MonitorIncidentPageIncidentsListProps
> = ({
    incidents
}) => {
  return (
    <Stack spacing={2}>
      {incidents?.map((incident) => (
        <IncidentsListItem incident={incident} />
      ))}
    </Stack>
  );
};

interface IncidentsListItemProps {
  incident: MonitorIncident;
}

const IncidentsListItem: FunctionComponent<IncidentsListItemProps> = (
  {
    incident,
  }
) => {
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
            onClick={() => navigate(`/incidents/${incident.id}`)} // Navigate to the incident page
          >
            <Grid item>
              <Stack spacing={1}>
                <Typography variant="body2">Assertion failed: {incident.title} {incident.operator} {incident.target}</Typography>

                <Stack direction="row" spacing={1}>
                  <Chip size="small" label="api" color="info" />
                  <Chip size="small" label="login" color="info" />
                  <Chip size="small" label="monitors" color="info" />
                  <Chip size="small" label="foo" color="info" />
                  <Chip size="small" label="bar" color="info" />
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
                  first occurrence {incident.createdAt}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  latest occurrence {incident.updatedAt}
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

export default IncidentPageIncidentsList;

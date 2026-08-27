import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import Placeholder from "../../../../components/Placeholder";
import { useIncidents } from "../../../../hooks/incidents.query";

const HistoryList: FunctionComponent = () => {
  const { data, isLoading } = useIncidents();

  if (isLoading) {
    return <Placeholder />;
  }

  const incidents = data?.incidents || [];

  if (incidents.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary" align="center">
            No incidents found.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={2}>
      {incidents.map((incident) => (
        <Card
          key={incident.id}
          component={Link}
          to={`/incidents/${incident.id}`}
          sx={{ textDecoration: "none", display: "block" }}
          variant="outlined"
        >
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack spacing={1}>
                <Typography variant="subtitle1" color="text.primary">
                  {incident.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {moment(incident.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                </Typography>
              </Stack>
              <Chip
                label={incident.resolved ? "Resolved" : "Active"}
                color={incident.resolved ? "success" : "error"}
                size="small"
              />
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default HistoryList;

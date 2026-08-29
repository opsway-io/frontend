import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { FunctionComponent } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useAlertRuleTriggers } from "../../../../../hooks/alerting.query";
import Placeholder from "../../../../../components/Placeholder";

interface TriggerHistoryCardProps {
  ruleId: number;
}

const TriggerHistoryCard: FunctionComponent<TriggerHistoryCardProps> = ({
  ruleId,
}) => {
  const { data: triggersData, isLoading } = useAlertRuleTriggers(ruleId);

  if (isLoading) {
    return (
      <Card variant="outlined">
        <CardHeader
          title="Trigger History"
          subheader="Recent times this rule sent alerts"
        />
        <CardContent>
          <Placeholder />
        </CardContent>
      </Card>
    );
  }

  const triggers = triggersData?.triggers || [];
  const totalOccurrences = triggersData?.totalCount || triggers.length;

  return (
    <Card variant="outlined">
      <CardHeader
        title="Trigger History"
        subheader={`Recent times this rule sent alerts (${totalOccurrences} occurrence${totalOccurrences === 1 ? "" : "s"})`}
      />
      <CardContent>
        {triggers.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center">
            No triggers found for this rule.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {triggers.map((trigger) => {
              let channels = [];
              try {
                channels = JSON.parse(trigger.channels);
              } catch (e) {
                // ignore
              }

              return (
                <Box
                  key={trigger.id}
                  sx={{
                    p: 2,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack spacing={1}>
                      <Typography variant="subtitle2">
                        {trigger.incidentId ? (
                          <Link
                            to={`/incidents/incident/${trigger.incidentId}`}
                          >
                            View Incident #{trigger.incidentId}
                          </Link>
                        ) : (
                          "Triggered without incident"
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Triggered on{" "}
                        {moment(trigger.createdAt).format(
                          "MMMM Do YYYY, h:mm:ss a",
                        )}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      {channels.map((channel: string) => (
                        <Chip
                          key={channel}
                          label={channel}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default TriggerHistoryCard;

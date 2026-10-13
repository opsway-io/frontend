import { Box, Card, Chip, Link as JoyLink, Stack, Typography } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useAlertRuleTriggers } from "../../../../../hooks/alerting.query";
import Placeholder from "../../../../../components/Placeholder/Placeholder";
import { Timeline, TimelineItem } from "../../../../../components/Timeline";
import { parseChannels } from "../../alertRules";

interface TriggerHistoryCardProps {
  ruleId: number;
}

const CardHeader: FunctionComponent<{ subheader: ReactNode }> = ({
  subheader,
}) => (
  <Box>
    <Typography level="title-md">Trigger History</Typography>
    <Typography level="body-sm" textColor="text.secondary">
      {subheader}
    </Typography>
  </Box>
);

const TriggerHistoryCard: FunctionComponent<TriggerHistoryCardProps> = ({
  ruleId,
}) => {
  const { data: triggersData, isPending: isLoading } =
    useAlertRuleTriggers(ruleId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader subheader="Recent times this rule sent alerts" />
        <Placeholder />
      </Card>
    );
  }

  const triggers = triggersData?.triggers || [];
  const totalOccurrences = triggersData?.totalCount || triggers.length;

  return (
    <Card>
      <CardHeader
        subheader={`Recent times this rule sent alerts (${totalOccurrences} occurrence${totalOccurrences === 1 ? "" : "s"})`}
      />
      {triggers.length === 0 ? (
        <Typography
          level="body-sm"
          textColor="text.tertiary"
          textAlign="center"
          py={2}
        >
          No triggers found for this rule.
        </Typography>
      ) : (
        <Box sx={{ pt: 1 }}>
          <Timeline>
            {triggers.map((trigger) => {
              const channels = parseChannels(trigger.channels);

              return (
                <TimelineItem
                  key={trigger.id}
                  color={trigger.incidentId ? "danger" : "neutral"}
                  title={
                    trigger.incidentId ? (
                      <JoyLink
                        component={Link}
                        to={`/incidents/incident/${trigger.incidentId}`}
                        level="title-sm"
                      >
                        View Incident #{trigger.incidentId}
                      </JoyLink>
                    ) : (
                      "Triggered without incident"
                    )
                  }
                  timestamp={`Triggered on ${moment(trigger.createdAt).format(
                    "MMMM Do YYYY, h:mm:ss a",
                  )}`}
                >
                  {channels.length > 0 && (
                    <Stack
                      direction="row"
                      spacing={0.75}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      {channels.map((channel) => (
                        <Chip key={channel} variant="outlined" color="neutral">
                          {channel}
                        </Chip>
                      ))}
                    </Stack>
                  )}
                </TimelineItem>
              );
            })}
          </Timeline>
        </Box>
      )}
    </Card>
  );
};

export default TriggerHistoryCard;

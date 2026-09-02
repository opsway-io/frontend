import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  timelineOppositeContentClasses,
} from "@mui/lab";
import { FunctionComponent } from "react";
import moment from "moment";
import { useIncidentOccurrences } from "../../../../../hooks/incidents.query";
import Placeholder from "../../../../../components/Placeholder";
import { BiTargetLock } from "react-icons/bi";

interface TriggerHistoryCardProps {
  incidentId: number;
}

const TriggerHistoryCard: FunctionComponent<TriggerHistoryCardProps> = ({
  incidentId,
}) => {
  const { data, isLoading } = useIncidentOccurrences(incidentId, 0, 100);

  if (isLoading) {
    return (
      <Card>
        <CardHeader
          title="Trigger History"
          subheader="Recent probe failures for this incident"
        />
        <CardContent>
          <Placeholder />
        </CardContent>
      </Card>
    );
  }

  const occurrences = data?.occurrences || [];

  return (
    <Card>
      <CardHeader
        title="Trigger History"
        subheader="Recent probe failures for this incident"
      />
      <CardContent>
        {occurrences.length === 0 ? (
          <Typography
            color="text.secondary"
            variant="body2"
            sx={{ textAlign: "center", py: 2 }}
          >
            No recent triggers found.
          </Typography>
        ) : (
          <Timeline
            sx={{
              [`& .${timelineOppositeContentClasses.root}`]: {
                flex: 0.2,
              },
            }}
          >
            {occurrences.map((occ, index) => (
              <TimelineItem key={occ.id}>
                <TimelineOppositeContent color="text.secondary">
                  <Typography variant="body2">
                    {moment(occ.createdAt).format("MMM DD, HH:mm:ss")}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color="error">
                    <BiTargetLock />
                  </TimelineDot>
                  {index < occurrences.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="body2" fontWeight={500}>
                    Check Failed
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Probe assertion triggered incident rules
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </CardContent>
    </Card>
  );
};

export default TriggerHistoryCard;

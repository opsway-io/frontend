import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
  Chip,
  TablePagination,
} from "@mui/material";
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
import { IoNotificationsOutline } from "react-icons/io5";
import { FunctionComponent, useState } from "react";
import moment from "moment";
import { useIncidentAlerts } from "../../../../../hooks/incidents.query";
import Placeholder from "../../../../../components/Placeholder";
import { useAlertRules } from "../../../../../hooks/alerting.query";

interface AlertHistoryCardProps {
  incidentId: number;
}

const AlertHistoryCard: FunctionComponent<AlertHistoryCardProps> = ({
  incidentId,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { data: alertsData, isLoading: alertsLoading } = useIncidentAlerts(
    incidentId,
    page * rowsPerPage,
    rowsPerPage,
  );
  const { data: rulesData, isLoading: rulesLoading } = useAlertRules();

  if (alertsLoading || rulesLoading) {
    return (
      <Card>
        <CardHeader
          title="Alert History"
          subheader="Triggered alerts for this incident"
        />
        <CardContent>
          <Placeholder />
        </CardContent>
      </Card>
    );
  }

  const alerts = alertsData?.alerts || [];
  const rules = rulesData || [];
  const totalOccurrences = alertsData?.totalCount || alerts.length;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Card>
      <CardHeader
        title="Alert History"
        subheader={`Triggered alerts for this incident (${totalOccurrences} occurrence${totalOccurrences === 1 ? "" : "s"})`}
      />
      <CardContent>
        {alerts.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            py={2}
          >
            No alerts triggered.
          </Typography>
        ) : (
          <>
            <Timeline
              sx={{
                [`& .${timelineOppositeContentClasses.root}`]: {
                  flex: 0.2,
                  minWidth: 150,
                },
              }}
            >
              {alerts.map((alert, index) => {
                const rule = rules.find((r) => r.id === alert.alertRuleId);
                let channels = [];
                try {
                  channels = JSON.parse(alert.channels);
                } catch (e) {
                  // ignore
                }

                return (
                  <TimelineItem key={alert.id}>
                    <TimelineOppositeContent
                      color="textSecondary"
                      sx={{ pt: 1.5 }}
                    >
                      {moment(alert.createdAt).format("MMM D, HH:mm:ss")}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color="primary" variant="outlined">
                        <IoNotificationsOutline size={16} />
                      </TimelineDot>
                      {index < alerts.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: "12px", px: 2 }}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle2" component="span">
                          Rule:{" "}
                          {rule ? rule.name : `Rule #${alert.alertRuleId}`}
                        </Typography>
                        {channels.length > 0 && (
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {channels.map((channel: string) => (
                              <Chip
                                key={channel}
                                label={channel}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Stack>
                        )}
                      </Stack>
                    </TimelineContent>
                  </TimelineItem>
                );
              })}
            </Timeline>
            <TablePagination
              component="div"
              count={totalOccurrences}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertHistoryCard;

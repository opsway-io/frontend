import { Chip, Stack } from "@mui/joy";
import moment from "moment";
import { FunctionComponent, useState } from "react";
import { TimelineItem } from "../../../../../components/Timeline";
import { useAlertRules } from "../../../../../hooks/alerting.query";
import { useIncidentAlerts } from "../../../../../hooks/incidents.query";
import HistoryCard from "./HistoryCard";

interface AlertHistoryCardProps {
  incidentId: number;
}

/** Alert channels are stored as a JSON encoded string array. */
const parseChannels = (channels: string): string[] => {
  try {
    const parsed = JSON.parse(channels);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const AlertHistoryCard: FunctionComponent<AlertHistoryCardProps> = ({
  incidentId,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { data: alertsData, isPending: alertsLoading } = useIncidentAlerts(
    incidentId,
    page * rowsPerPage,
    rowsPerPage,
  );
  const { data: rules, isPending: rulesLoading } = useAlertRules();

  const isLoading = alertsLoading || rulesLoading;
  const alerts = alertsData?.alerts ?? [];
  const totalCount = alertsData?.totalCount || alerts.length;

  const ruleName = (ruleId: number) =>
    rules?.find((rule) => rule.id === ruleId)?.name ?? `Rule #${ruleId}`;

  return (
    <HistoryCard
      title="Alert History"
      subheader={
        isLoading
          ? "Triggered alerts for this incident"
          : `Triggered alerts for this incident (${totalCount} occurrence${totalCount === 1 ? "" : "s"})`
      }
      isLoading={isLoading}
      emptyText="No alerts triggered."
      totalCount={totalCount}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={setPage}
      onRowsPerPageChange={setRowsPerPage}
    >
      {alerts.map((alert) => {
        const channels = parseChannels(alert.channels);

        return (
          <TimelineItem
            key={alert.id}
            color="warning"
            title={`Rule: ${ruleName(alert.alertRuleId)}`}
            timestamp={moment(alert.createdAt).format("MMM D, HH:mm:ss")}
          >
            {channels.length > 0 && (
              <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
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
    </HistoryCard>
  );
};

export default AlertHistoryCard;

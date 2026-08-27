import { Card, CardContent, CardHeader, Stack, Typography, Chip, Box } from "@mui/material";
import { FunctionComponent } from "react";
import moment from "moment";
import { useIncidentAlerts } from "../../../../../hooks/incidents.query";
import Placeholder from "../../../../../components/Placeholder";
import { useAlertRules } from "../../../../../hooks/alerting.query";

interface AlertHistoryCardProps {
  incidentId: number;
}

const AlertHistoryCard: FunctionComponent<AlertHistoryCardProps> = ({ incidentId }) => {
  const { data: alertsData, isLoading: alertsLoading } = useIncidentAlerts(incidentId);
  const { data: rulesData, isLoading: rulesLoading } = useAlertRules();

  if (alertsLoading || rulesLoading) {
    return (
      <Card>
        <CardHeader title="Alert History" subheader="Triggered alerts for this incident" />
        <CardContent>
          <Placeholder />
        </CardContent>
      </Card>
    );
  }

  const alerts = alertsData?.alerts || [];
  const rules = rulesData || [];

  return (
    <Card>
      <CardHeader title="Alert History" subheader="Triggered alerts for this incident" />
      <CardContent>
        {alerts.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center">
            No alerts triggered.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {alerts.map((alert) => {
              const rule = rules.find((r) => r.id === alert.alertRuleId);
              let channels = [];
              try {
                channels = JSON.parse(alert.channels);
              } catch (e) {
                // ignore
              }

              return (
                <Box key={alert.id} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack spacing={1}>
                      <Typography variant="subtitle2">
                        Rule: {rule ? rule.name : `Rule #${alert.alertRuleId}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Triggered on {moment(alert.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      {channels.map((channel: string) => (
                        <Chip key={channel} label={channel} size="small" variant="outlined" />
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

export default AlertHistoryCard;

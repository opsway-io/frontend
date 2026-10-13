import { Card, Sheet, Stack, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import Placeholder from "../../../../components/Placeholder/Placeholder";
import { useAlertRules } from "../../../../hooks/alerting.query";
import AlertRuleCard from "../components/AlertRuleCard";

const AlertRulesTab: FunctionComponent = () => {
  const { data: rules = [], isPending: isLoading } = useAlertRules();

  if (isLoading) {
    return (
      <Card>
        <Placeholder />
      </Card>
    );
  }

  if (rules.length === 0) {
    return (
      <Sheet
        variant="outlined"
        sx={{ borderRadius: "lg", p: 4, borderStyle: "dashed" }}
      >
        <Typography
          level="body-sm"
          textColor="text.secondary"
          textAlign="center"
        >
          No alert rules found. Create one to receive notifications.
        </Typography>
      </Sheet>
    );
  }

  return (
    <Stack spacing={1.5}>
      {rules.map((rule) => (
        <AlertRuleCard key={rule.id} rule={rule} />
      ))}
    </Stack>
  );
};

export default AlertRulesTab;

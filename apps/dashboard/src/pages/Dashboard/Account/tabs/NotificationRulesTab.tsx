import { Alert, Skeleton } from "@mui/joy";
import { FunctionComponent } from "react";
import { useNotificationRules } from "../../../../hooks/user.query";
import NotificationRulesForm from "../components/NotificationRulesForm";

const NotificationRulesTab: FunctionComponent = () => {
  const { data: rules, isPending, error } = useNotificationRules();

  if (isPending) {
    return (
      <Skeleton
        variant="rectangular"
        height={240}
        sx={{ borderRadius: "lg" }}
      />
    );
  }

  if (error) {
    return (
      <Alert color="danger" variant="soft">
        Failed to load notification rules
      </Alert>
    );
  }

  return <NotificationRulesForm rules={rules ?? []} />;
};

export default NotificationRulesTab;

import { Alert } from "@mui/joy";
import { FunctionComponent } from "react";
import {
  IoCheckmarkCircleOutline,
  IoInformationCircleOutline,
  IoWarningOutline,
} from "react-icons/io5";
import { MaintenanceStatus } from "../../../../../api/endpoints/maintenance";

interface MaintenanceStatusAlertProps {
  status: MaintenanceStatus;
}

const MaintenanceStatusAlert: FunctionComponent<
  MaintenanceStatusAlertProps
> = ({ status }) => {
  if (status === "ACTIVE") {
    return (
      <Alert
        color="warning"
        variant="soft"
        startDecorator={<IoWarningOutline size={18} />}
      >
        This maintenance window is currently active. Target monitors will not
        trigger incident alerts until it is over.
      </Alert>
    );
  }

  if (status === "ENDED") {
    return (
      <Alert
        color="neutral"
        variant="soft"
        startDecorator={<IoCheckmarkCircleOutline size={18} />}
      >
        This maintenance window has ended.
      </Alert>
    );
  }

  return (
    <Alert
      color="info"
      variant="soft"
      startDecorator={<IoInformationCircleOutline size={18} />}
    >
      This maintenance window is scheduled for the future.
    </Alert>
  );
};

export default MaintenanceStatusAlert;

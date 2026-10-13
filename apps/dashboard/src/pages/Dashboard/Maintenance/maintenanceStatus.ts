import moment from "moment";
import {
  IMaintenanceWindow,
  MaintenanceStatus,
} from "../../../api/endpoints/maintenance";

/** The server provided status, falling back to computing it client side. */
export const getMaintenanceStatus = (
  maintenanceWindow: IMaintenanceWindow,
): MaintenanceStatus => {
  if (maintenanceWindow.status) return maintenanceWindow.status;

  const now = moment();
  if (moment(maintenanceWindow.settings?.startAt).isAfter(now)) {
    return "SCHEDULED";
  }
  if (moment(maintenanceWindow.settings?.endAt).isAfter(now)) {
    return "ACTIVE";
  }
  return "ENDED";
};

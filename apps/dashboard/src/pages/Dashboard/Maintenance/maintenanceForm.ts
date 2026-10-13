import moment from "moment";
import { IMaintenanceWindow } from "../../../api/endpoints/maintenance";

export interface MaintenanceFormValues {
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  monitorIds: number[];
}

/** An empty window starting now and lasting one hour. */
export const createEmptyMaintenanceFormValues = (): MaintenanceFormValues => ({
  title: "",
  description: "",
  startAt: moment().toISOString(),
  endAt: moment().add(1, "hour").toISOString(),
  monitorIds: [],
});

export const toMaintenanceFormValues = (
  maintenanceWindow: IMaintenanceWindow,
): MaintenanceFormValues => {
  const empty = createEmptyMaintenanceFormValues();

  return {
    title: maintenanceWindow.title,
    description: maintenanceWindow.description || "",
    startAt: maintenanceWindow.settings?.startAt
      ? moment(maintenanceWindow.settings.startAt).toISOString()
      : empty.startAt,
    endAt: maintenanceWindow.settings?.endAt
      ? moment(maintenanceWindow.settings.endAt).toISOString()
      : empty.endAt,
    monitorIds: maintenanceWindow.monitors?.map((monitor) => monitor.id) ?? [],
  };
};

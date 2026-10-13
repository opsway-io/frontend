import moment from "moment";
import { useMemo } from "react";
import { useMaintenanceWindows } from "../../../../../hooks/maintenance.query";

/** Whether an active maintenance window covers all monitors or this monitor. */
const useIsMonitorInMaintenance = (monitorId: number) => {
  const { data: maintenances } = useMaintenanceWindows();

  return useMemo(() => {
    if (!maintenances) {
      return false;
    }

    const now = moment();

    return maintenances.some((window) => {
      const start = moment(window.settings?.startAt);
      const end = moment(window.settings?.endAt);
      if (!start.isSameOrBefore(now) || !end.isAfter(now)) {
        return false;
      }

      if (!window.monitors || window.monitors.length === 0) {
        return true;
      }

      return window.monitors.some((m) => m.id === monitorId);
    });
  }, [maintenances, monitorId]);
};

export default useIsMonitorInMaintenance;

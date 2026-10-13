import { Button, ColorPaletteProp, Tab, TabList, Tabs } from "@mui/joy";
import moment from "moment";
import { FunctionComponent, useState } from "react";
import { Helmet } from "react-helmet";
import { IoAdd } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import {
  IMaintenanceWindow,
  MaintenanceStatus,
} from "../../../api/endpoints/maintenance";
import Container from "../../../components/Container/Container";
import { Restrict, Role } from "../../../components/Restrict";
import { useMaintenanceWindows } from "../../../hooks/maintenance.query";
import MaintenanceList from "./components/MaintenanceList";
import MaintenanceTabLabel from "./components/MaintenanceTabLabel";
import { getMaintenanceStatus } from "./maintenanceStatus";

interface MaintenanceTab {
  status: MaintenanceStatus;
  label: string;
  color: ColorPaletteProp;
  emptyText: string;
  subtitle: (maintenanceWindow: IMaintenanceWindow) => string;
}

const tabs: MaintenanceTab[] = [
  {
    status: "ACTIVE",
    label: "Active",
    color: "success",
    emptyText: "No active maintenance windows",
    subtitle: (m) => `Ends ${moment(m.settings?.endAt).fromNow()}`,
  },
  {
    status: "SCHEDULED",
    label: "Scheduled",
    color: "info",
    emptyText: "No scheduled maintenance windows",
    subtitle: (m) => `Starts ${moment(m.settings?.startAt).fromNow()}`,
  },
  {
    status: "ENDED",
    label: "Ended",
    color: "neutral",
    emptyText: "No ended maintenance windows",
    subtitle: (m) => `Ended ${moment(m.settings?.endAt).fromNow()}`,
  },
];

const MaintenancePage: FunctionComponent = () => {
  const [status, setStatus] = useState<MaintenanceStatus>("ACTIVE");

  const { data: maintenanceWindows, isPending } = useMaintenanceWindows();

  const windowsByStatus = (tabStatus: MaintenanceStatus) =>
    (maintenanceWindows ?? []).filter(
      (maintenanceWindow) =>
        getMaintenanceStatus(maintenanceWindow) === tabStatus,
    );

  const currentTab = tabs.find((tab) => tab.status === status) ?? tabs[0];

  return (
    <>
      <Helmet>
        <title>Maintenance</title>
      </Helmet>

      <Container
        header="Maintenance"
        description="Schedule maintenance windows to avoid false alerts and notifications."
        primaryActions={[
          <Restrict min={Role.ADMIN} key="add">
            <Button
              startDecorator={<IoAdd />}
              component={NavLink}
              to="/maintenance/create"
            >
              Schedule a maintenance window
            </Button>
          </Restrict>,
        ]}
      >
        <Tabs
          value={status}
          onChange={(_, value) => setStatus(value as MaintenanceStatus)}
        >
          <TabList>
            {tabs.map((tab) => (
              <Tab key={tab.status} value={tab.status}>
                <MaintenanceTabLabel
                  label={tab.label}
                  count={windowsByStatus(tab.status).length}
                  color={tab.color}
                />
              </Tab>
            ))}
          </TabList>
        </Tabs>

        <MaintenanceList
          loading={isPending}
          windows={windowsByStatus(currentTab.status)}
          emptyText={currentTab.emptyText}
          subtitle={currentTab.subtitle}
        />
      </Container>
    </>
  );
};

export default MaintenancePage;

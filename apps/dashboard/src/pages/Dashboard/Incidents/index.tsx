import { FunctionComponent, useState } from "react";
import { Helmet } from "react-helmet";
import { Box, Tab, Tabs } from "@mui/material";
import Container from "../../../components/Container";
import Placeholder from "../../../components/Placeholder";
import IncidentOverviewList from "./components/OverviewList";
import IncidentsDataGrid from "./components/IncidentsDataGrid";
import { useMonitorsIncidents } from "../../../hooks/monitors.query";
import { useIncidents } from "../../../hooks/incidents.query";

const IncidentsView: FunctionComponent = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const { data: historyIncidentsData } = useIncidents(true, 0, 100);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const { data: monitorsIncidents, isLoading: incidentsAreLoading } =
    useMonitorsIncidents();

  return (
    <>
      <Helmet>
        <title>Incidents</title>
      </Helmet>

      <Container
        header="Incidents"
        description="An overview of active and resolved incidents across your infrastructure."
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            aria-label="incidents tabs"
          >
            <Tab label="Active" />
            <Tab label="History" />
          </Tabs>
        </Box>

        {tabIndex === 0 && (
          <Box>
            {incidentsAreLoading ? (
              <Placeholder />
            ) : (
              <IncidentOverviewList monitors={monitorsIncidents?.monitors} />
            )}
          </Box>
        )}

        {tabIndex === 1 && (
          <Box>
            <IncidentsDataGrid incidents={historyIncidentsData?.incidents} />
          </Box>
        )}
      </Container>
    </>
  );
};

export default IncidentsView;

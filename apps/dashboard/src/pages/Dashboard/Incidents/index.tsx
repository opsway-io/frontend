import { FunctionComponent, useState } from "react";
import { Helmet } from "react-helmet";
import { Box, Tab, Tabs } from "@mui/material";
import Container from "../../../components/Container";
import IncidentsDataGrid from "./components/IncidentsDataGrid";
import { useIncidents } from "../../../hooks/incidents.query";

const IncidentsView: FunctionComponent = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const { data: activeIncidentsData } = useIncidents(false, 0, 100);
  const { data: historyIncidentsData } = useIncidents(true, 0, 100);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <Helmet>
        <title>Incidents</title>
      </Helmet>

      <Container
        header="Incidents"
        description="An overview of action required and resolved incidents across your infrastructure."
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            aria-label="incidents tabs"
          >
            <Tab label="Requires Attention" />
            <Tab label="History" />
          </Tabs>
        </Box>

        {tabIndex === 0 && (
          <Box>
            <IncidentsDataGrid incidents={activeIncidentsData?.incidents} />
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

import { Card, Chip, Stack, Tab, TabList, Tabs } from "@mui/joy";
import { FunctionComponent, useState } from "react";
import { Helmet } from "react-helmet";
import Container from "../../../components/Container/Container";
import { useIncidents } from "../../../hooks/incidents.query";
import IncidentsDataGrid from "./components/IncidentsDataGrid";

type IncidentsTab = "active" | "history";

const IncidentsPage: FunctionComponent = () => {
  const [tab, setTab] = useState<IncidentsTab>("active");

  const { data: activeIncidents } = useIncidents(false, 0, 100);
  const { data: resolvedIncidents } = useIncidents(true, 0, 100);

  const activeCount = activeIncidents?.incidents?.length ?? 0;
  const resolvedCount =
    resolvedIncidents?.totalCount ?? resolvedIncidents?.incidents?.length ?? 0;

  const incidents =
    tab === "active"
      ? activeIncidents?.incidents
      : resolvedIncidents?.incidents;

  return (
    <>
      <Helmet>
        <title>Incidents</title>
      </Helmet>

      <Container
        header="Incidents"
        description="An overview of action required and resolved incidents across your infrastructure."
      >
        <Tabs
          value={tab}
          onChange={(_, value) => setTab(value as IncidentsTab)}
          aria-label="Incidents tabs"
        >
          <TabList>
            <Tab value="active">
              <Stack direction="row" spacing={1} alignItems="center">
                <span>Requires Attention</span>
                {activeCount > 0 && (
                  <Chip size="sm" variant="soft" color="danger">
                    {activeCount}
                  </Chip>
                )}
              </Stack>
            </Tab>
            <Tab value="history">
              <Stack direction="row" spacing={1} alignItems="center">
                <span>History</span>
                {resolvedCount > 0 && (
                  <Chip size="sm" variant="soft" color="neutral">
                    {resolvedCount}
                  </Chip>
                )}
              </Stack>
            </Tab>
          </TabList>
        </Tabs>

        <Card sx={{ p: 0, gap: 0, overflow: "hidden" }}>
          <IncidentsDataGrid key={tab} incidents={incidents} />
        </Card>
      </Container>
    </>
  );
};

export default IncidentsPage;

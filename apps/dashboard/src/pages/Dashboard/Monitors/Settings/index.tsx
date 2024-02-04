import { Card, CardContent, Skeleton, Stack } from "@mui/material";
import { FunctionComponent } from "react";
import { Link, useParams } from "react-router-dom";
import Container from "../../../../components/Container";
import { useMonitor } from "../../../../hooks/monitors.query";
import Placeholder from "../../../../components/Placeholder";
import { Helmet } from "react-helmet";

const MonitorSettingsView: FunctionComponent = () => {
  let params = useParams();

  const monitorId = (params.id as number | undefined) || 0;
  const { data, error, isLoading } = useMonitor(monitorId);

  return (
    <>
      <Helmet>
        <title>
          {isLoading ? "Monitors" : `Monitors | ${data?.name} | Settings`}
        </title>
      </Helmet>

      <Container
        breadcrumbs={[
          <Link to="/monitors">Monitors</Link>,
          isLoading ? (
            <Skeleton width={150} />
          ) : (
            <Link to={`/monitors/${monitorId}`}>{data?.name}</Link>
          ),
          <span>Settings</span>,
        ]}
        loading={isLoading}
        error={error && "Failed to load monitor settings"}
      >
        <Stack spacing={2}>
          <Card>
            <CardContent>
              <Placeholder />
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </>
  );
};

export default MonitorSettingsView;

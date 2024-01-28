import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";
import { FunctionComponent, useState } from "react";
import { Helmet } from "react-helmet";
import { IoAdd } from "react-icons/io5";
import Container from "../../../components/Container";
import Placeholder from "../../../components/Placeholder";
import { NavLink } from "react-router-dom";
import Conditional from "../../../components/Conditional";
import { Restrict, Role } from "../../../components/Restrict";

const MaintenanceView: FunctionComponent = () => {
  const [tab, setTab] = useState(0);

  return (
    <>
      <Helmet>
        <title>Maintenance</title>
      </Helmet>

      <Container
        header="Maintenance"
        description="Schedule maintenance windows to avoid false alerts and notifications."
        primaryActions={[
          <Restrict min={Role.ADMIN}>
            <Button
              startIcon={<IoAdd />}
              color="secondary"
              sx={{
                span: {
                  color: (t) => t.palette.success.main,
                },
              }}
              component={NavLink}
              to="/maintenance/create"
            >
              Schedule a maintenance window
            </Button>
          </Restrict>,
        ]}
      >
        <Card>
          <Box sx={{ width: "100%" }}>
            <Tabs value={tab} onChange={(_, i) => setTab(i)}>
              <Tab
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <span>Active</span>
                    <Chip label="0" color="success" size="small" />
                  </Stack>
                }
              />
              <Tab
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <span>Scheduled</span>
                    <Chip label="1" color="info" size="small" />
                  </Stack>
                }
              />
              <Tab
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <span>Ended</span>
                    <Chip label="20" color="secondary" size="small" />
                  </Stack>
                }
              />
            </Tabs>
          </Box>
        </Card>

        <Card>
          <Box hidden={tab !== 0}>
            <CardContent>
              <Placeholder />
            </CardContent>
          </Box>
          <Box hidden={tab !== 1}>
            <CardContent>
              <Placeholder />
            </CardContent>
          </Box>

          <Box hidden={tab !== 2}>
            <CardContent>
              <Placeholder />
            </CardContent>
          </Box>
        </Card>
      </Container>
    </>
  );
};

export default MaintenanceView;

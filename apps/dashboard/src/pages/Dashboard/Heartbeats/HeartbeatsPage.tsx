import { Button } from "@mui/joy";
import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import { IoAdd } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import Container from "../../../components/Container/Container";
import { Restrict, Role } from "../../../components/Restrict";
import HeartbeatList from "./components/HeartbeatList";

const HeartbeatsPage: FunctionComponent = () => (
  <>
    <Helmet>
      <title>Heartbeats</title>
    </Helmet>

    <Container
      header="Heartbeats"
      description="Monitor cron jobs and background tasks with inbound pings."
      secondaryActions={[
        <Restrict min={Role.ADMIN} key="add">
          <Button
            startDecorator={<IoAdd />}
            component={NavLink}
            to="/heartbeats/create"
          >
            Create Heartbeat
          </Button>
        </Restrict>,
      ]}
    >
      <HeartbeatList />
    </Container>
  </>
);

export default HeartbeatsPage;

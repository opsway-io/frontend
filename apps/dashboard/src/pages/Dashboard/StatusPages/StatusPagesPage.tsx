import { Button } from "@mui/joy";
import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import { IoAdd } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import Container from "../../../components/Container/Container";
import { Restrict, Role } from "../../../components/Restrict";
import StatusPageOverviewList from "./components/StatusPageOverviewList";

const StatusPagesPage: FunctionComponent = () => {
  return (
    <>
      <Helmet>
        <title>Pages</title>
      </Helmet>

      <Container
        header="Pages"
        secondaryActions={[
          <Restrict key="create" min={Role.ADMIN}>
            <Button startDecorator={<IoAdd />} component={NavLink} to="create">
              Create status page
            </Button>
          </Restrict>,
        ]}
      >
        <StatusPageOverviewList />
      </Container>
    </>
  );
};

export default StatusPagesPage;

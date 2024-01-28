import { Button } from "@mui/material";
import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import { IoAdd } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import Container from "../../../components/Container";
import { Restrict, Role } from "../../../components/Restrict";
import StatusPageOverviewList from "./components/OverviewList";

const StatusPagesView: FunctionComponent = () => {
  return (
    <>
      <Helmet>
        <title>Pages</title>
      </Helmet>

      <Container
        header="Pages"
        secondaryActions={[
          <Restrict min={Role.ADMIN}>
            <Button
              startIcon={<IoAdd />}
              sx={{
                span: {
                  color: (t) => t.palette.success.main,
                },
              }}
              color="secondary"
              component={NavLink}
              to="create"
            >
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

export default StatusPagesView;

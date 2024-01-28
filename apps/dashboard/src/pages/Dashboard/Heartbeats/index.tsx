import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import Container from "../../../components/Container";
import Placeholder from "../../../components/Placeholder";
import { Button, Card, Typography } from "@mui/material";
import { IoAdd } from "react-icons/io5";
import { NavLink } from "react-router-dom";

const HeartbeatView: FunctionComponent = () => {
  return (
    <>
      <Helmet>
        <title>Heartbeats</title>
      </Helmet>

      <Container
        header="Heartbeat"
        description="Heartbeats is a simple way to make sure that your scheduled jobs are running as expected and do not miss a beat."
        secondaryActions={[
          <Button
            startIcon={<IoAdd />}
            color="secondary"
            sx={{
              span: {
                color: (t) => t.palette.success.main,
              },
            }}
            component={NavLink}
            to="/heartbeats/create"
          >
            Create heartbeat
          </Button>,
        ]}
      >
        <Card
          sx={{
            backgroundColor: (t) => t.palette.success.main,
            color: (t) => t.palette.success.contrastText,
            textAlign: "center",
            padding: (t) => t.spacing(1),
          }}
        >
          <Typography fontSize={16} fontWeight={500}>
            All heartbeats are passing
          </Typography>
        </Card>
        <Placeholder />
      </Container>
    </>
  );
};

export default HeartbeatView;

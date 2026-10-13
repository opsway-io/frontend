import { Button } from "@mui/joy";
import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import { IoAdd } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import Container from "../../../components/Container/Container";
import { Restrict, Role } from "../../../components/Restrict";
import RouteTabs, { RouteTab } from "../../../components/RouteTabs/RouteTabs";
import { useCurrentUserRole } from "../../../hooks/user.query";

const AlertingPage: FunctionComponent = () => {
  const currentRole = useCurrentUserRole();

  const tabs: RouteTab[] = [{ label: "Rules", path: "/alerting" }];
  if (Role.ADMIN.equalOrHigher(currentRole)) {
    tabs.push({ label: "Escalation", path: "/alerting/escalation" });
  }

  return (
    <>
      <Helmet>
        <title>Alerting</title>
      </Helmet>

      <Container
        header="Alerting"
        description="Configure rules for notifying your team and how alerts are escalated."
        primaryActions={[
          <Restrict min={Role.ADMIN} key="add">
            <Button
              startDecorator={<IoAdd />}
              component={NavLink}
              to="/alerting/create"
            >
              Create Rule
            </Button>
          </Restrict>,
        ]}
      >
        <RouteTabs tabs={tabs} />
      </Container>
    </>
  );
};

export default AlertingPage;

import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import Container from "../../../components/Container";
import Placeholder from "../../../components/Placeholder";

const AlertingView: FunctionComponent = () => {
  return (
    <>
      <Helmet>
        <title>Alerting</title>
      </Helmet>

      <Container
        header="Alerting"
        description="Setup alerting rules to be notified when something happens."
      >
        <Placeholder />
      </Container>
    </>
  );
};

export default AlertingView;

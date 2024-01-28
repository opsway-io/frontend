import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import Container from "../../../components/Container";
import Placeholder from "../../../components/Placeholder";

const IncidentsView: FunctionComponent = () => {
  return (
    <>
      <Helmet>
        <title>Incidents</title>
      </Helmet>

      <Container
        header="Incidents"
        description="An overview active and resolved incidents across your infrastructure."
      >
        <Placeholder />
      </Container>
    </>
  );
};

export default IncidentsView;

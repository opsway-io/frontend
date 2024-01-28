import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Container from "../../../../components/Container";
import Placeholder from "../../../../components/Placeholder";

const StatusPagesDetailView: FunctionComponent = () => {
  return (
    <>
      <Helmet>
        <title>Status pages</title>
      </Helmet>

      <Container
        breadcrumbs={[
          <Link to="/status-pages">Status pages</Link>,
          <span>page</span>,
        ]}
      >
        <Placeholder />
      </Container>
    </>
  );
};

export default StatusPagesDetailView;

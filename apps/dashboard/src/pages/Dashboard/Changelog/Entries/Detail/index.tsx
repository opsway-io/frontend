import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import Container from "../../../../../components/Container";
import Placeholder from "../../../../../components/Placeholder";

const ChangelogEntriesDetailView: FunctionComponent = () => {
  return (
    <>
      <Helmet>
        <title>Changelog | Entries | TODO</title>
      </Helmet>

      <Container header="Changelog Entry">
        <Placeholder />
      </Container>
    </>
  );
};

export default ChangelogEntriesDetailView;

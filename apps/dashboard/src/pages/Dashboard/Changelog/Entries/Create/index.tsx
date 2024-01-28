import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import Container from "../../../../../components/Container";
import Placeholder from "../../../../../components/Placeholder";

const ChangelogEntriesCreateView: FunctionComponent = () => {
  return (
    <>
      <Helmet>
        <title>Changelog | Entries | Create</title>
      </Helmet>

      <Container>
        <Placeholder />
      </Container>
    </>
  );
};

export default ChangelogEntriesCreateView;

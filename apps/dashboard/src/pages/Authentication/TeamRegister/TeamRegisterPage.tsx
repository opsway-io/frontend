import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import AuthCard from "../components/AuthCard";
import TeamRegisterForm from "./TeamRegisterForm";

const TeamRegisterPage: FunctionComponent = () => {
  return (
    <>
      <Helmet>
        <title>Team creation</title>
      </Helmet>

      <AuthCard
        title="Create a new team"
        description="Teams share monitors, status pages and alerting."
        maxWidth={460}
      >
        <TeamRegisterForm />
      </AuthCard>
    </>
  );
};

export default TeamRegisterPage;

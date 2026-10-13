import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import AuthCard from "../components/AuthCard";
import UserRegisterForm from "./UserRegisterForm";

const UserRegisterPage: FunctionComponent = () => {
  return (
    <>
      <Helmet>
        <title>Sign up</title>
      </Helmet>

      <AuthCard
        title="Create your account"
        description="Let's get you up and running!"
      >
        <UserRegisterForm />
      </AuthCard>
    </>
  );
};

export default UserRegisterPage;

import { Divider, Link, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import { NavLink, useLocation } from "react-router-dom";
import Conditional from "../../../components/Conditional/Conditional";
import ENV from "../../../env";
import AuthCard from "../components/AuthCard";
import LoginForm from "./LoginForm";
import SocialLoginButtons from "./SocialLoginButtons";

const LoginPage: FunctionComponent = () => {
  const location = useLocation();

  return (
    <>
      <Helmet>
        <title>Sign in</title>
      </Helmet>

      <AuthCard title="Welcome back" description="Sign in to your account">
        <LoginForm />

        <Conditional value={ENV.SOCIAL_LOGIN}>
          <Divider sx={{ color: "text.tertiary", fontSize: "xs" }}>
            or continue with
          </Divider>
          <SocialLoginButtons />
        </Conditional>

        <Typography
          level="body-sm"
          textColor="text.secondary"
          sx={{ textAlign: "center" }}
        >
          Don't have an account?{" "}
          <Link
            component={NavLink}
            to={`/login/register${location.search}`}
            fontWeight="md"
          >
            Create a new account
          </Link>
        </Typography>
      </AuthCard>
    </>
  );
};

export default LoginPage;

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Fade,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";

import { NavLink } from "react-router-dom";
import Conditional from "../../../components/Conditional";
import ENV from "../../../env";
import LoginForm from "./form";
import SocialLoginForm from "./social";

const LoginView: FunctionComponent = () => {
  return (
    <>
      <Helmet>
        <title>Sign in</title>
      </Helmet>

      <Fade in={true} appear timeout={250}>
        <Card
          elevation={1}
          sx={{
            flex: 1,
            maxWidth: 500,
          }}
        >
          <CardContent
            component={Stack}
            spacing={2}
            sx={{
              marginTop: 2,
              margin: 1,
            }}
          >
            <Typography
              variant="h4"
              textAlign="center"
              sx={{
                fontWeight: 700,
              }}
            >
              Welcome back
            </Typography>

            <Typography
              variant="body2"
              textAlign="center"
              sx={{
                color: "text.secondary",
                marginTop: "0 !important",
                paddingBottom: 2,
              }}
            >
              Sign in to your account
            </Typography>

            <LoginForm />

            <Typography
              sx={{
                textAlign: "center",
                color: "text.secondary",
                // Remove link style
                "& a": {
                  color: "inherit",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                },
              }}
            >
              <Link
                sx={{
                  textDecoration: "underline !important",
                }}
                component={NavLink}
                to="/login/register"
              >
                Create a new account
              </Link>
              {" or "}
              <Link
                sx={{
                  textDecoration: "underline !important",
                }}
                component={NavLink}
                to="/login/forgot-password"
              >
                reset your password?
              </Link>
            </Typography>

            <Conditional value={ENV.SOCIAL_LOGIN}>
              <Divider />
              <SocialLoginForm />
            </Conditional>
          </CardContent>
        </Card>
      </Fade>
    </>
  );
};

export default LoginView;

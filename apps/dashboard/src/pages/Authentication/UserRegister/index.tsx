import { Card, CardContent, Fade, Stack, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import AccountRegistrationForm from "./form";

const RegisterAccountView: FunctionComponent = () => {
  return (
    <>
      <Helmet>
        <title>Sign up</title>
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
              Create your account
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
              Let's get you up and running!
            </Typography>

            <AccountRegistrationForm />
          </CardContent>
        </Card>
      </Fade>
    </>
  );
};

export default RegisterAccountView;

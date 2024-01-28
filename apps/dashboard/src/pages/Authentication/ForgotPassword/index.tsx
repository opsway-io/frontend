import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Fade,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import { validate } from "email-validator";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";

const ForgotPasswordView: FunctionComponent = () => {
  const [email, setEmail] = useState("");

  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (email.length < 1) {
      setButtonDisabled(true);
      return;
    }

    if (!validate(email)) {
      setButtonDisabled(true);
      return;
    }

    setButtonDisabled(false);
  }, [email]);

  const submit = () => {
    // TODO
  };

  return (
    <>
      <Helmet>
        <title>Forgot password</title>
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
              margin: 1,
              marginTop: 2,
            }}
          >
            <Typography
              variant="h4"
              textAlign="center"
              sx={{
                fontWeight: 700,
              }}
            >
              Forgot your password?
            </Typography>

            <Typography
              variant="body2"
              textAlign="center"
              sx={{
                color: "text.secondary",
                paddingBottom: 2,
              }}
            >
              Please enter your registered email address and we will send you a
              link to reset your password.
            </Typography>

            <TextField
              placeholder="Email address"
              type="email"
              variant="outlined"
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />

            <Divider />

            <Button
              variant="contained"
              color="success"
              disabled={buttonDisabled}
              onSubmit={submit}
              size="large"
            >
              Sent reset link
            </Button>

            <Button
              variant="outlined"
              component={NavLink}
              to="/login"
              size="large"
            >
              Back to login
            </Button>
          </CardContent>
        </Card>
      </Fade>
    </>
  );
};

export default ForgotPasswordView;

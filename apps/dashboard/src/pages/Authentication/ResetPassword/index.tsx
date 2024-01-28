import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Fade,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import PasswordStrength from "../../../components/PasswordStrength";

const ResetPasswordView: FunctionComponent = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (password.length < 8) {
      setButtonDisabled(true);
      return;
    }

    if (password !== confirmPassword) {
      setButtonDisabled(true);
      return;
    }

    setButtonDisabled(false);
  }, [password, confirmPassword]);

  const submit = () => {
    // TODO: Submit
  };

  return (
    <>
      <Helmet>
        <title>Reset password</title>
      </Helmet>

      <Fade in={true} appear timeout={250}>
        <Card
          elevation={1}
          sx={{
            flex: 1,
            maxWidth: 500,
          }}
        >
          <CardHeader
            title="Reset password"
            subheader="Please choose your new password"
          />
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="body1">New password</Typography>
              <TextField
                label="Password"
                autoFocus
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={(_) => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
              <PasswordStrength value={password} />

              <TextField
                label="Confirm password"
                type={showConfirmPassword ? "text" : "password"}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={(_) =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />

              <Divider />

              <Button
                variant="contained"
                color="success"
                onSubmit={submit}
                disabled={buttonDisabled}
              >
                Reset password
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Fade>
    </>
  );
};

export default ResetPasswordView;

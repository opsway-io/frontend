import {
  Button,
  Card,
  CardContent,
  Divider,
  Fade,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import useAuthenticationStore from "../../../hooks/authentication.store";
import { toast } from "react-hot-toast";

const ResetPasswordView: FunctionComponent = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  // token is extracted from the URL query params `?token=XYZ`
  // The backend uses the token to find the user in Redis.

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const resetPassword = useAuthenticationStore((state) => state.resetPassword);

  useEffect(() => {
    if (
      !password ||
      !confirmPassword ||
      password !== confirmPassword ||
      password.length < 8
    ) {
      setButtonDisabled(true);
      return;
    }
    setButtonDisabled(false);
  }, [password, confirmPassword]);

  const submit = async () => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setSubmitting(false);
    }
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
              Reset Password
            </Typography>

            {success ? (
              <>
                <Typography
                  variant="body2"
                  textAlign="center"
                  sx={{
                    color: "success.main",
                    paddingBottom: 2,
                  }}
                >
                  Your password has been successfully reset.
                </Typography>
                <Button
                  variant="contained"
                  component={NavLink}
                  to="/login"
                  size="large"
                >
                  Proceed to Login
                </Button>
              </>
            ) : (
              <>
                <Typography
                  variant="body2"
                  textAlign="center"
                  sx={{
                    color: "text.secondary",
                    paddingBottom: 2,
                  }}
                >
                  Please enter your new password below.
                </Typography>

                <TextField
                  placeholder="New password"
                  type="password"
                  variant="outlined"
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={submitting}
                  autoFocus
                />

                <TextField
                  placeholder="Confirm new password"
                  type="password"
                  variant="outlined"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={submitting}
                />

                <Divider />

                <Button
                  variant="contained"
                  color="success"
                  disabled={buttonDisabled || submitting}
                  onClick={submit}
                  size="large"
                >
                  {submitting ? "Resetting..." : "Reset Password"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </Fade>
    </>
  );
};

export default ResetPasswordView;

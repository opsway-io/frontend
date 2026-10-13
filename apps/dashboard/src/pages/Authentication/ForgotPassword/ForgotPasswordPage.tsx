import {
  Alert,
  Button,
  FormControl,
  FormLabel,
  Input,
  Link,
  Stack,
  Typography,
} from "@mui/joy";
import { FunctionComponent, useState } from "react";
import { validate } from "email-validator";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import useAuthenticationStore from "../../../hooks/authentication.store";
import { enqueueSnackbar } from "notistack";
import { getErrorMessage } from "../../../utilities/errors";
import AuthCard from "../components/AuthCard";

const ForgotPasswordPage: FunctionComponent = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const forgotPassword = useAuthenticationStore(
    (state) => state.forgotPassword,
  );

  const canSubmit = validate(email) && !submitting;

  const submit = async () => {
    setSubmitting(true);
    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err, "Failed to send reset link"), {
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot password</title>
      </Helmet>

      <AuthCard
        title="Forgot your password?"
        description={
          success
            ? undefined
            : "Enter your registered email address and we will send you a link to reset your password."
        }
      >
        {success ? (
          <Stack spacing={2}>
            <Alert
              color="success"
              variant="soft"
              startDecorator={<IoCheckmarkCircleOutline size={18} />}
            >
              If an account exists with that email, we have sent a reset link.
            </Alert>
            <Button
              size="md"
              variant="outlined"
              color="neutral"
              fullWidth
              component={NavLink}
              to="/login"
            >
              Back to login
            </Button>
          </Stack>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (canSubmit) {
                submit();
              }
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  placeholder="you@example.com"
                  type="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                  // oxlint-disable-next-line jsx-a11y/no-autofocus -- only field on the page
                  autoFocus
                />
              </FormControl>

              <Button
                size="md"
                type="submit"
                fullWidth
                disabled={!canSubmit}
                loading={submitting}
              >
                Send reset link
              </Button>

              <Typography
                level="body-sm"
                textColor="text.secondary"
                sx={{ textAlign: "center" }}
              >
                Remembered it?{" "}
                <Link
                  component={NavLink}
                  to="/login"
                  fontWeight="md"
                  disabled={submitting}
                >
                  Back to login
                </Link>
              </Typography>
            </Stack>
          </form>
        )}
      </AuthCard>
    </>
  );
};

export default ForgotPasswordPage;

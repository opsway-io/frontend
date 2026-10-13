import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
} from "@mui/joy";
import { FunctionComponent, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import useAuthenticationStore from "../../../hooks/authentication.store";
import { enqueueSnackbar } from "notistack";
import { getErrorMessage } from "../../../utilities/errors";
import AuthCard from "../components/AuthCard";

const ResetPasswordPage: FunctionComponent = () => {
  const [searchParams] = useSearchParams();
  // Reset token from the emailed link (`?token=XYZ`).
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const resetPassword = useAuthenticationStore((state) => state.resetPassword);

  const canSubmit =
    password.length >= 8 && password === confirmPassword && !submitting;

  const submit = async () => {
    if (!token) {
      enqueueSnackbar("Invalid or missing reset token", { variant: "error" });
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err, "Failed to reset password"), {
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const mismatch = confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <>
      <Helmet>
        <title>Reset password</title>
      </Helmet>

      <AuthCard
        title="Reset password"
        description={
          success ? undefined : "Please enter your new password below."
        }
      >
        {success ? (
          <Stack spacing={2}>
            <Alert
              color="success"
              variant="soft"
              startDecorator={<IoCheckmarkCircleOutline size={18} />}
            >
              Your password has been successfully reset.
            </Alert>
            <Button size="md" fullWidth component={NavLink} to="/login">
              Proceed to login
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
                <FormLabel>New password</FormLabel>
                <Input
                  type="password"
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={submitting}
                  // oxlint-disable-next-line jsx-a11y/no-autofocus -- first field of a single-purpose form
                  autoFocus
                />
                <FormHelperText>Must be at least 8 characters.</FormHelperText>
              </FormControl>

              <FormControl error={mismatch}>
                <FormLabel>Confirm new password</FormLabel>
                <Input
                  type="password"
                  autoComplete="new-password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={submitting}
                />
                {mismatch && (
                  <FormHelperText>Passwords do not match.</FormHelperText>
                )}
              </FormControl>

              <Button
                size="md"
                type="submit"
                fullWidth
                disabled={!canSubmit}
                loading={submitting}
              >
                Reset password
              </Button>
            </Stack>
          </form>
        )}
      </AuthCard>
    </>
  );
};

export default ResetPasswordPage;

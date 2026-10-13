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
import { AxiosError } from "axios";
import { validate } from "email-validator";
import { StatusCodes } from "http-status-codes";
import { FunctionComponent, useRef, useState } from "react";
import { IoAlertCircleOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import useAuthenticationStore from "../../../hooks/authentication.store";
import PasswordVisibilityToggle from "../components/PasswordVisibilityToggle";

const LoginForm: FunctionComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [status, setStatus] = useState<StatusCodes>();
  const [error, setError] = useState<AxiosError>();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordField = useRef<HTMLInputElement>(null);

  const logIn = useAuthenticationStore((state) => state.logIn);

  const canSubmit = !loading && validate(email) && password.length > 0;

  const handleLogin = async () => {
    setLoading(true);
    setError(undefined);

    const result = await logIn(email, password);

    if (result.error) {
      setError(result.error);
      setStatus(
        (result.error.response?.status as StatusCodes | undefined) ??
          (result.error.isAxiosError
            ? StatusCodes.INTERNAL_SERVER_ERROR
            : undefined),
      );
    }

    if (!result.success) {
      setPassword("");
      passwordField.current?.focus();
    }

    setLoading(false);
  };

  const requestId = error?.response?.headers["x-request-id"];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
    >
      <Stack spacing={2}>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            // oxlint-disable-next-line jsx-a11y/no-autofocus -- first field of a single-purpose sign-in screen
            autoFocus
          />
        </FormControl>

        <FormControl>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <FormLabel>Password</FormLabel>
            <Link
              component={NavLink}
              to="/login/forgot-password"
              level="body-xs"
              textColor="text.secondary"
              sx={{ mb: 0.75 }}
            >
              Forgot password?
            </Link>
          </Stack>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{ input: { ref: passwordField } }}
            endDecorator={
              <PasswordVisibilityToggle
                visible={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
              />
            }
          />
        </FormControl>

        {status === StatusCodes.UNAUTHORIZED && (
          <Alert
            color="danger"
            variant="soft"
            startDecorator={<IoAlertCircleOutline size={18} />}
          >
            Invalid email or password
          </Alert>
        )}

        {!!status && status !== StatusCodes.UNAUTHORIZED && (
          <Alert
            color="danger"
            variant="soft"
            startDecorator={<IoAlertCircleOutline size={18} />}
            sx={{ alignItems: "flex-start" }}
          >
            <div>
              <Typography level="title-sm" color="danger">
                Unknown login error
              </Typography>

              {requestId && (
                <Typography level="body-xs" color="danger">
                  Request ID: {requestId}
                </Typography>
              )}
            </div>
          </Alert>
        )}

        <Button
          size="md"
          type="submit"
          fullWidth
          loading={loading}
          disabled={!canSubmit}
          sx={{ mt: 0.5 }}
        >
          Sign in
        </Button>
      </Stack>
    </form>
  );
};

export default LoginForm;

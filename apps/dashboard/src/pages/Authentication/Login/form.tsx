import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  AlertTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import { validate } from "email-validator";
import { StatusCodes } from "http-status-codes";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import Conditional from "../../../components/Conditional";
import useAuthenticationStore from "../../../hooks/authentication.store";

const LoginForm: FunctionComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [status, setStatus] = useState<StatusCodes>();
  const [error, setError] = useState<AxiosError>();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginButtonDisabled, setLoginButtonDisabled] = useState(true);

  const passwordField = useRef<HTMLInputElement>(null);

  const logIn = useAuthenticationStore((state) => state.logIn);

  const handleLogin = async () => {
    setLoading(true);
    setError(undefined);

    const { success, error } = await logIn(email, password);

    if (error) {
      setError(error);
    }

    if (error && error.response && error.response.status) {
      setStatus(error.response.status as StatusCodes);
    } else if (error && error.isAxiosError) {
      setStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    if (!success) {
      setPassword("");
      passwordField.current?.focus();
    }

    setLoading(false);
  };

  useEffect(() => {
    if (loading) {
      setLoginButtonDisabled(true);
      return;
    }

    if (!validate(email) || password.length < 1) {
      setLoginButtonDisabled(true);
      return;
    }

    setLoginButtonDisabled(false);
  }, [email, password, loading]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
      style={{
        flex: 1,
      }}
    >
      <Stack spacing={2}>
        <TextField
          id="email"
          type={"text"}
          placeholder="email"
          value={email}
          variant="outlined"
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          autoFocus
        />

        <TextField
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="password"
          value={password}
          variant="outlined"
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            ref: passwordField,
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

        {/* Unauthorized */}
        <Conditional value={status == StatusCodes.UNAUTHORIZED}>
          <Alert severity="error">Invalid email or password</Alert>
        </Conditional>

        {/* Catch all error */}
        <Conditional value={status && status !== StatusCodes.UNAUTHORIZED}>
          <Alert severity="error">
            <AlertTitle>Unknown login error</AlertTitle>

            {error?.response?.headers["x-request-id"] && (
              <Typography variant="caption" component="div">
                <span>
                  Request ID: {error.response.headers["x-request-id"]}
                </span>
              </Typography>
            )}
          </Alert>
        </Conditional>

        <LoadingButton
          color="success"
          variant="contained"
          size="large"
          type="submit"
          onSubmit={() => handleLogin()}
          loading={loading}
          disabled={loginButtonDisabled}
        >
          Login
        </LoadingButton>
      </Stack>
    </form>
  );
};

export default LoginForm;

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
import { validate } from "email-validator";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import useAuthenticationStore from "../../../hooks/authentication.store";
import Conditional from "../../../components/Conditional";
import { AxiosError } from "axios";

const LoginForm: FunctionComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [failure, setFailure] = useState(false);
  const [error, setError] = useState<AxiosError<any> | null>();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginButtonDisabled, setLoginButtonDisabled] = useState(true);

  const passwordField = useRef<HTMLInputElement>(null);

  const logIn = useAuthenticationStore((state) => state.logIn);

  const handleLogin = async () => {
    setFailure(false);
    setError(null);
    setLoading(true);

    const { success, error } = await logIn(email, password);

    if (!success) {
      setPassword("");
      passwordField.current?.focus();

      if (error) {
        setError(error);
      } else {
        setFailure(true);
      }
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

        <Conditional value={failure}>
          <Alert severity="error">Invalid email or password</Alert>
        </Conditional>

        <Conditional value={error}>
          <Alert severity="error">
            <AlertTitle>Unknown login error</AlertTitle>
            <Typography variant="caption" component="div">
              {error?.response?.headers["x-request-id"] && (
                <span>
                  Request ID: {error.response.headers["x-request-id"]}
                </span>
              )}
            </Typography>
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

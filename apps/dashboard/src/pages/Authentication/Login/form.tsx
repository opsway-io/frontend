import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, IconButton, Stack, TextField } from "@mui/material";
import { validate } from "email-validator";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import useAuthenticationStore from "../../../hooks/authentication.store";
import Conditional from "../../../components/Conditional";

const LoginForm: FunctionComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [failure, setFailure] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginButtonDisabled, setLoginButtonDisabled] = useState(true);

  const passwordField = useRef<HTMLInputElement>(null);

  const logIn = useAuthenticationStore((state) => state.logIn);

  const handleLogin = async () => {
    setFailure(false);
    setLoading(true);
    const { success } = await logIn(email, password);

    if (!success) {
      setPassword("");
      setFailure(true);
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

        <Conditional value={failure}>
          <Alert severity="error">Invalid email or password</Alert>
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

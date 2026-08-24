import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Button,
  Divider,
  IconButton,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FunctionComponent, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { NavLink, useLocation } from "react-router-dom";
import PasswordStrength from "../../../components/PasswordStrength";
import { validate } from "email-validator";
import useAuthenticationStore from "../../../hooks/authentication.store";
import { IRegisterRequest } from "../../../api/endpoints/authentication";

interface AccountRegistrationFormProps {}

const AccountRegistrationForm: FunctionComponent<
  AccountRegistrationFormProps
> = () => {
  const [password, setPassword] = useState("");
  const passwordField = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<IRegisterRequest>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const authStore = useAuthenticationStore();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: IRegisterRequest) => {
    setError(null);
    const resp = await authStore.register(data);
    if (!resp.success) {
      if (resp.error?.response?.status === 409) {
        setError("An account with this email already exists.");
      } else {
        setError("Failed to create account. Please try again later.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Your name"
          {...register("name", {
            required: true,
            maxLength: 250,
          })}
        />

        <TextField
          label="Email"
          type="email"
          {...register("email", {
            required: true,
            maxLength: 250,
            validate: (value) => validate(value),
          })}
        />

        <Controller
          render={(props) => {
            return (
              <TextField
                label="Password"
                ref={passwordField}
                type={showPassword ? "text" : "password"}
                onChange={(e) => {
                  setPassword(e.target.value);
                  props.field.onChange(e.target.value);
                }}
                value={props.field.value}
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
            );
          }}
          name="password"
          control={control}
          rules={{
            required: true,
            minLength: 8,
            maxLength: 250,
          }}
        />

        <Typography variant="caption" color="text.secondary">
          Password must be at least 8 characters long.
        </Typography>

        <PasswordStrength value={password} />

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{
            padding: 2,
          }}
        >
          By clicking the button below, you agree to our{" "}
          <Link
            href="#"
            sx={{
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Terms of Service
          </Link>
          {" and "}
          <Link
            href="#"
            sx={{
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Privacy Policy
          </Link>
          .
        </Typography>

        <Button
          variant="contained"
          color="success"
          size="large"
          type="submit"
          disabled={!isValid}
        >
          Create account
        </Button>

        <Button
          variant="outlined"
          component={NavLink}
          to={`/login${location.search}`}
          size="large"
        >
          I already have an account, go to login
        </Button>
      </Stack>
    </form>
  );
};

export default AccountRegistrationForm;

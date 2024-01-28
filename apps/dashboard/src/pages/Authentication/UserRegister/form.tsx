import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
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
import { NavLink } from "react-router-dom";
import PasswordStrength from "../../../components/PasswordStrength";
import { validate } from "email-validator";

interface AccountRegistrationFormProps {}

const AccountRegistrationForm: FunctionComponent<
  AccountRegistrationFormProps
> = () => {
  const [password, setPassword] = useState("");
  const passwordField = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    control,
    formState: { isValid },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  return (
    <Stack spacing={2}>
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
        disabled={!isValid}
      >
        Create account
      </Button>

      <Button variant="outlined" component={NavLink} to="/login" size="large">
        I already have an account, go to login
      </Button>
    </Stack>
  );
};

export default AccountRegistrationForm;

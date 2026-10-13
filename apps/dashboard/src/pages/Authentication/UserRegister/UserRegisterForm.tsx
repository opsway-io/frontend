import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Link,
  Stack,
  Typography,
} from "@mui/joy";
import { validate } from "email-validator";
import { FunctionComponent, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IoAlertCircleOutline } from "react-icons/io5";
import { NavLink, useLocation } from "react-router-dom";
import { IRegisterRequest } from "../../../api/endpoints/authentication";
import PasswordStrength from "../../../components/PasswordStrength/PasswordStrength";
import useAuthenticationStore from "../../../hooks/authentication.store";
import PasswordVisibilityToggle from "../components/PasswordVisibilityToggle";
import TermsNotice from "../components/TermsNotice";

const UserRegisterForm: FunctionComponent = () => {
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const registerAccount = useAuthenticationStore((state) => state.register);

  const {
    register,
    handleSubmit,
    control,
    formState: { isValid, errors, isSubmitting },
  } = useForm<IRegisterRequest>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: IRegisterRequest) => {
    setError(null);
    const result = await registerAccount(data);
    if (result.success) return;

    setError(
      result.error?.response?.status === 409
        ? "An account with this email already exists."
        : "Failed to create account. Please try again later.",
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        {error && (
          <Alert
            color="danger"
            variant="soft"
            startDecorator={<IoAlertCircleOutline size={18} />}
          >
            {error}
          </Alert>
        )}

        <FormControl error={!!errors.name}>
          <FormLabel>Your name</FormLabel>
          <Input
            placeholder="Jane Doe"
            autoComplete="name"
            slotProps={{
              input: register("name", {
                required: true,
                maxLength: 250,
              }),
            }}
          />
        </FormControl>

        <FormControl error={!!errors.email}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            slotProps={{
              input: register("email", {
                required: true,
                maxLength: 250,
                validate: (value) => validate(value),
              }),
            }}
          />
          {errors.email && (
            <FormHelperText>Please enter a valid email address.</FormHelperText>
          )}
        </FormControl>

        <Controller
          name="password"
          control={control}
          rules={{
            required: true,
            minLength: 8,
            maxLength: 250,
          }}
          render={({ field, fieldState }) => (
            <FormControl error={!!fieldState.error}>
              <FormLabel>Password</FormLabel>
              <Input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                value={field.value}
                endDecorator={
                  <PasswordVisibilityToggle
                    visible={showPassword}
                    onToggle={() => setShowPassword(!showPassword)}
                  />
                }
              />
              <Stack spacing={1} sx={{ mt: 1 }}>
                <PasswordStrength value={field.value} />
                <FormHelperText sx={{ mt: 0 }}>
                  Password must be at least 8 characters long.
                </FormHelperText>
              </Stack>
            </FormControl>
          )}
        />

        <TermsNotice />

        <Button
          size="md"
          type="submit"
          fullWidth
          loading={isSubmitting}
          disabled={!isValid}
        >
          Create account
        </Button>

        <Typography
          level="body-sm"
          textColor="text.secondary"
          sx={{ textAlign: "center" }}
        >
          Already have an account?{" "}
          <Link
            component={NavLink}
            to={`/login${location.search}`}
            fontWeight="md"
          >
            Sign in
          </Link>
        </Typography>
      </Stack>
    </form>
  );
};

export default UserRegisterForm;

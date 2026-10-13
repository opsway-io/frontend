import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
} from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent } from "react";
import { useForm, useWatch } from "react-hook-form";
import { updatePassword } from "../../../../api/endpoints/users";
import PasswordStrength from "../../../../components/PasswordStrength/PasswordStrength";
import SettingsCard from "../../../../components/SettingsCard/SettingsCard";
import { useCurrentUser } from "../../../../hooks/user.query";

const MIN_PASSWORD_LENGTH = 8;

interface PasswordFormValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const SecurityTab: FunctionComponent = () => {
  const { data: user } = useCurrentUser();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isValid, isSubmitting, errors },
  } = useForm<PasswordFormValues>({
    mode: "onChange",
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const newPassword = useWatch({ control, name: "newPassword" });

  const onSubmit = handleSubmit(async (values) => {
    if (!user) return;

    try {
      await updatePassword(user.id, values.oldPassword, values.newPassword);
      enqueueSnackbar("Password updated", { variant: "success" });
      reset();
    } catch {
      enqueueSnackbar("Failed to update password", { variant: "error" });
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <SettingsCard
        title="Change password"
        description={`Set a new password for your account. The new password must be at least ${MIN_PASSWORD_LENGTH} characters long.`}
        actions={
          <Button
            type="submit"
            disabled={!isValid || !user}
            loading={isSubmitting}
          >
            Change password
          </Button>
        }
      >
        {user?.hasPassword && (
          <FormControl required>
            <FormLabel>Current password</FormLabel>
            <Input
              type="password"
              autoComplete="current-password"
              slotProps={{
                input: register("oldPassword", { required: true }),
              }}
            />
          </FormControl>
        )}

        <FormControl required error={!!errors.newPassword}>
          <FormLabel>New password</FormLabel>
          <Input
            type="password"
            autoComplete="new-password"
            slotProps={{
              input: register("newPassword", {
                required: true,
                minLength: MIN_PASSWORD_LENGTH,
                // Re-check the confirmation when the new password changes.
                deps: ["confirmPassword"],
              }),
            }}
          />
          <Stack sx={{ mt: 1 }}>
            <PasswordStrength value={newPassword} />
          </Stack>
          {errors.newPassword?.type === "minLength" && (
            <FormHelperText>
              Password must be at least {MIN_PASSWORD_LENGTH} characters long.
            </FormHelperText>
          )}
        </FormControl>

        <FormControl required error={!!errors.confirmPassword}>
          <FormLabel>Repeat new password</FormLabel>
          <Input
            type="password"
            autoComplete="new-password"
            slotProps={{
              input: register("confirmPassword", {
                required: true,
                validate: (value, values) => value === values.newPassword,
              }),
            }}
          />
          {errors.confirmPassword?.type === "validate" && (
            <FormHelperText>Passwords do not match.</FormHelperText>
          )}
        </FormControl>
      </SettingsCard>
    </form>
  );
};

export default SecurityTab;

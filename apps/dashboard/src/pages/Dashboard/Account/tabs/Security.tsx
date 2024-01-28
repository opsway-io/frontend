import { Box, Card, CardContent, Divider, TextField } from "@mui/material";
import { FunctionComponent, useState } from "react";
import {
  CategoryList,
  CategoryListItem,
} from "../../../../components/CategoryList";
import PasswordStrength from "../../../../components/PasswordStrength";
import { updatePassword } from "../../../../api/endpoints/users";
import { useCurrentUser } from "../../../../hooks/user.query";
import { enqueueSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";

type FormValues = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const AccountSecurityTabView: FunctionComponent = () => {
  const { data: user } = useCurrentUser();
  const [isUpdating, setIsUpdating] = useState(false);

  const { register, handleSubmit, reset, getValues, formState } =
    useForm<FormValues>({
      mode: "onChange",
    });

  const onSubmit = handleSubmit(async (data) => {
    if (!user) return;

    setIsUpdating(true);

    try {
      await updatePassword(user.id, data.oldPassword, data.newPassword);
      enqueueSnackbar("Password updated", { variant: "success" });
      reset();
    } catch (e) {
      enqueueSnackbar("Failed to update password", { variant: "error" });
    } finally {
      setIsUpdating(false);
    }
  });

  return (
    <Card>
      <CardContent>
        <form onSubmit={onSubmit}>
          <CategoryList>
            <CategoryListItem
              title="Change password"
              description="Set a new password for your account. The new password must be at least 8 characters long."
            >
              <TextField
                label="Old password"
                type="password"
                {...register("oldPassword", {
                  required: true,
                })}
              />

              <Divider />

              <TextField
                label="New password"
                type="password"
                {...register("newPassword", {
                  required: true,
                  minLength: 8,
                })}
              />
              <PasswordStrength value={""} />

              <TextField
                label="Repeat new password"
                type="password"
                {...register("confirmPassword", {
                  required: true,
                  minLength: 8,
                  validate: (value) => value === getValues("newPassword"),
                })}
              />

              <Divider />

              <Box>
                <LoadingButton
                  variant="contained"
                  color="error"
                  type="submit"
                  disabled={!formState.isValid || !user}
                  loading={isUpdating}
                >
                  Change password
                </LoadingButton>
              </Box>
            </CategoryListItem>
          </CategoryList>
        </form>
      </CardContent>
    </Card>
  );
};

export default AccountSecurityTabView;

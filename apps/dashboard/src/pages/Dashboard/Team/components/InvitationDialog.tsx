import {
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FunctionComponent, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useCurrentTeam } from "../../../../hooks/team.query";
import { Controller, useForm } from "react-hook-form";
import { validate as validateEmail } from "email-validator";

import * as TeamsAPI from "../../../../api/endpoints/teams";
import { enqueueSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import {
  Dialog,
  DialogActions,
  DialogContent,
} from "../../../../components/Dialog";
interface InvitationDialogProps {
  open: boolean;
  onClose?: () => void;
}

const InvitationDialog: FunctionComponent<InvitationDialogProps> = (props) => {
  const { data: team } = useCurrentTeam();

  const [loading, setLoading] = useState(false);

  const {
    register,
    formState: { isValid },
    getValues,
    control,
    reset,
  } = useForm<{ email: string; role: string }>({
    defaultValues: {
      email: "",
      role: "MEMBER",
    },
  });

  const onClose = () => {
    props.onClose?.();
    reset();
  };

  const onSubmit = async () => {
    if (!team) return;

    const { email, role } = getValues();

    try {
      setLoading(true);

      await TeamsAPI.postTeamUserInvite(team?.id, {
        email,
        role,
      });

      enqueueSnackbar(`Invitation sent to ${email}`, {
        variant: "success",
      });

      reset();
    } catch (error: any) {
      if (error?.response?.status === 409) {
        enqueueSnackbar(`User ${email} is already a member of this team`, {
          variant: "info",
        });
        return;
      }

      enqueueSnackbar("Failed to send invitation", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={props.open} onClose={onClose} title="Invite a member">
      <DialogContent sx={{ minWidth: 400 }}>
        <Stack spacing={2}>
          <TextField
            placeholder="foo@bar.com"
            fullWidth
            disabled={loading}
            label="Email"
            {...register("email", {
              required: true,
              validate: (value) => {
                return validateEmail(value);
              },
            })}
          />

          <Controller
            name="role"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField select label="Role" {...field}>
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="MEMBER">Member</MenuItem>
              </TextField>
            )}
          />

          <Typography variant="body2" color="textSecondary">
            Members can see everything in this team, but can't edit or create
            anything. Admins can do everything except manage billing and delete
            the team.
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions>
        <LoadingButton
          variant="contained"
          color="success"
          disabled={!isValid}
          onClick={onSubmit}
          loading={loading}
        >
          Send invite
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default InvitationDialog;

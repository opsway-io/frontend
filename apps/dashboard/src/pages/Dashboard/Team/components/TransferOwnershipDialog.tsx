import { LoadingButton } from "@mui/lab";
import { DialogProps, Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { FunctionComponent } from "react";
import {
  IGetTeamResponse,
  IGetTeamUserResponse,
} from "../../../../api/endpoints/teams";
import {
  Dialog,
  DialogActions,
  DialogContent,
} from "../../../../components/Dialog";
import { Role } from "../../../../components/Restrict";
import { useMutateTeamUser } from "../../../../hooks/team.query";

interface TransferOwnerShipDialogProps extends DialogProps {
  receiver: IGetTeamUserResponse;
  team: IGetTeamResponse;
}

const TransferOwnerShipDialog: FunctionComponent<
  TransferOwnerShipDialogProps
> = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const { mutate, isLoading } = useMutateTeamUser(
    props.team.id,
    props.receiver.id,
  );

  const transferOwnership = () => {
    mutate(
      {
        role: Role.OWNER.name,
      },
      {
        onSuccess: () => {
          props.onClose?.({}, "escapeKeyDown");
        },
        onError: () => {
          enqueueSnackbar("Failed to transfer ownership of team.", {
            variant: "error",
          });
        },
      },
    );
  };

  return (
    <Dialog title={"Transfer team ownership"} {...props}>
      <DialogContent sx={{ minWidth: 400 }}>
        <Stack spacing={2}>
          <Typography variant="body2">
            Are you sure you want to transfer ownership of this team to{" "}
            <b>{props.receiver.name}</b>?
          </Typography>

          <Typography variant="body2">
            You will be downgraded to an admin and will no longer be able to
            transfer ownership.
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Stack direction="row" spacing={1}>
          <LoadingButton
            onClick={() => transferOwnership()}
            variant="contained"
            loading={isLoading}
            color="error"
          >
            Confirm
          </LoadingButton>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default TransferOwnerShipDialog;

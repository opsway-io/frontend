import { Alert, Button, Stack, Typography } from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent } from "react";
import { IoWarningOutline } from "react-icons/io5";
import {
  IGetTeamResponse,
  IGetTeamUserResponse,
} from "../../../../api/endpoints/teams";
import {
  Dialog,
  DialogActions,
  DialogContent,
} from "../../../../components/Dialog/Dialog";
import { Role } from "../../../../components/Restrict";
import { useMutateTeamUser } from "../../../../hooks/team.query";

interface TransferOwnershipDialogProps {
  open: boolean;
  onClose?: () => void;
  receiver: IGetTeamUserResponse;
  team: IGetTeamResponse;
}

const TransferOwnershipDialog: FunctionComponent<
  TransferOwnershipDialogProps
> = ({ open, onClose, receiver, team }) => {
  const { mutate, isPending } = useMutateTeamUser(team.id, receiver.id);

  const transferOwnership = () => {
    mutate(
      { role: Role.OWNER.name },
      {
        onSuccess: () => onClose?.(),
        onError: () => {
          enqueueSnackbar("Failed to transfer ownership of team.", {
            variant: "error",
          });
        },
      },
    );
  };

  return (
    <Dialog
      title="Transfer team ownership"
      open={open}
      onClose={() => onClose?.()}
      maxWidth="sm"
    >
      <DialogContent>
        <Stack spacing={2}>
          <Typography level="body-md">
            Are you sure you want to transfer ownership of this team to{" "}
            <Typography fontWeight={600} textColor="text.primary">
              {receiver.displayName || receiver.name}
            </Typography>
            ?
          </Typography>

          <Alert
            color="warning"
            variant="soft"
            startDecorator={<IoWarningOutline size={18} />}
          >
            You will be downgraded to an admin and will no longer be able to
            transfer ownership.
          </Alert>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="plain" color="neutral" onClick={() => onClose?.()}>
          Cancel
        </Button>
        <Button onClick={transferOwnership} loading={isPending} color="danger">
          Transfer ownership
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransferOwnershipDialog;

import { LoadingButton } from "@mui/lab";
import { Box, DialogProps, Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { FunctionComponent, useState } from "react";
import {
  IGetTeamResponse,
  IGetTeamUserResponse,
} from "../../../../api/endpoints/teams";
import {
  Dialog,
  DialogActions,
  DialogContent,
} from "../../../../components/Dialog";
import { RadioCard, RadioCardGroup } from "../../../../components/RadioCard";
import { useMutateTeamUser } from "../../../../hooks/team.query";
import Avatar from "../../../../components/Avatar";

interface ChangeRoleModalProps extends DialogProps {
  user: IGetTeamUserResponse;
  team: IGetTeamResponse;
}

const ChangeRoleModal: FunctionComponent<ChangeRoleModalProps> = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const { mutate, isLoading } = useMutateTeamUser(props.team.id, props.user.id);

  const [selectedRole, setSelectedRole] = useState(props.user.role);

  const changeRole = (role: string) => {
    mutate(
      {
        role,
      },
      {
        onSuccess: () => {
          props.onClose?.({}, "escapeKeyDown");
        },
        onError: () => {
          enqueueSnackbar("Failed to change role", {
            variant: "error",
          });
        },
      },
    );
  };

  return (
    <Dialog title={"Change role"} {...props}>
      <DialogContent sx={{ minWidth: 400 }}>
        <Stack
          direction="row"
          sx={{
            paddingBottom: 2,
          }}
        >
          <Avatar
            src={props.user.avatarUrl}
            name={props.user.displayName || props.user.name}
            sx={{
              width: 64,
              height: 64,
              marginRight: 2,
            }}
          />
          <Box
            sx={{
              flex: 1,
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="body1" fontWeight={600}>
              {props.user.displayName || props.user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {props.user.email}
            </Typography>
          </Box>
        </Stack>

        <RadioCardGroup
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <RadioCard
            label="Admin"
            value="ADMIN"
            description="Can manage the team, its members and monitors."
          />
          <RadioCard
            label="Member"
            value="MEMBER"
            description="Can view but not edit the team and its monitors."
          />
        </RadioCardGroup>
      </DialogContent>

      <DialogActions>
        <Stack direction="row" spacing={1}>
          <LoadingButton
            onClick={() => changeRole(selectedRole)}
            color="error"
            variant="contained"
          >
            Change role
          </LoadingButton>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeRoleModal;

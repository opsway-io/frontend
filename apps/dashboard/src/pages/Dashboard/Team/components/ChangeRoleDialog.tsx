import {
  Box,
  Button,
  Radio,
  RadioGroup,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent, useState } from "react";
import {
  IGetTeamResponse,
  IGetTeamUserResponse,
} from "../../../../api/endpoints/teams";
import Avatar from "../../../../components/Avatar/Avatar";
import {
  Dialog,
  DialogActions,
  DialogContent,
} from "../../../../components/Dialog/Dialog";
import { useMutateTeamUser } from "../../../../hooks/team.query";
import { ASSIGNABLE_ROLES } from "../teamRoles";

interface ChangeRoleDialogProps {
  open: boolean;
  onClose?: () => void;
  user: IGetTeamUserResponse;
  team: IGetTeamResponse;
}

const ChangeRoleDialog: FunctionComponent<ChangeRoleDialogProps> = ({
  open,
  onClose,
  user,
  team,
}) => {
  const { mutate, isPending } = useMutateTeamUser(team.id, user.id);
  const [selectedRole, setSelectedRole] = useState(user.role);
  const userName = user.displayName || user.name;

  const changeRole = () => {
    mutate(
      { role: selectedRole },
      {
        onSuccess: () => onClose?.(),
        onError: () => {
          enqueueSnackbar("Failed to change role", { variant: "error" });
        },
      },
    );
  };

  return (
    <Dialog
      title="Change role"
      open={open}
      onClose={() => onClose?.()}
      maxWidth="sm"
    >
      <DialogContent>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ pb: 2 }}>
          <Avatar src={user.avatarUrl} name={userName} size="lg" />
          <Box sx={{ minWidth: 0 }}>
            <Typography level="title-md" noWrap>
              {userName}
            </Typography>
            <Typography level="body-sm" textColor="text.secondary" noWrap>
              {user.email}
            </Typography>
          </Box>
        </Stack>

        <RadioGroup
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          sx={{ gap: 1 }}
        >
          {ASSIGNABLE_ROLES.map((role) => (
            <Sheet
              key={role.value}
              variant="outlined"
              sx={{
                p: 1.5,
                borderRadius: "md",
                transition: "border-color 120ms, background-color 120ms",
                ...(selectedRole === role.value && {
                  borderColor: "neutral.400",
                  bgcolor: "background.level1",
                }),
              }}
            >
              <Radio
                overlay
                value={role.value}
                color="neutral"
                label={
                  <Box>
                    <Typography level="title-sm">{role.label}</Typography>
                    <Typography level="body-sm" textColor="text.secondary">
                      {role.description}
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: "flex-start" }}
              />
            </Sheet>
          ))}
        </RadioGroup>
      </DialogContent>

      <DialogActions>
        <Button variant="plain" color="neutral" onClick={() => onClose?.()}>
          Cancel
        </Button>
        <Button
          onClick={changeRole}
          loading={isPending}
          disabled={selectedRole === user.role}
        >
          Change role
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeRoleDialog;

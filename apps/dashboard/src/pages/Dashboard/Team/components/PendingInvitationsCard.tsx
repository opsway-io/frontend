import { Box, Button, Chip, Sheet, Stack, Typography } from "@mui/joy";
import { isAxiosError } from "axios";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent } from "react";
import SettingsCard from "../../../../components/SettingsCard/SettingsCard";
import useAuthenticationStore from "../../../../hooks/authentication.store";
import {
  useRevokeTeamInvitation,
  useTeamInvitations,
} from "../../../../hooks/team.query";
import { formatRole } from "../teamRoles";

const PendingInvitationsCard: FunctionComponent = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId) ?? 0;
  const { data, isPending: isLoading } = useTeamInvitations(teamId);
  const revokeMutation = useRevokeTeamInvitation(teamId);

  const invites = data?.invites ?? [];

  const handleRevoke = async (email: string) => {
    try {
      await revokeMutation.mutateAsync(email);
      enqueueSnackbar(`Revoked invitation for ${email}`, {
        variant: "success",
      });
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      enqueueSnackbar(message || "Failed to revoke invitation", {
        variant: "error",
      });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <Typography level="body-sm" textColor="text.tertiary">
          Loading…
        </Typography>
      );
    }

    if (invites.length === 0) {
      return (
        <Typography
          level="body-sm"
          textColor="text.tertiary"
          sx={{
            py: 3,
            textAlign: "center",
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: "md",
          }}
        >
          No pending invitations.
        </Typography>
      );
    }

    return (
      <Sheet variant="outlined" sx={{ borderRadius: "md", overflow: "hidden" }}>
        {invites.map((invite, index) => (
          <Stack
            key={invite.email}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            sx={{
              px: 2,
              py: 1.5,
              borderTop: index > 0 ? "1px solid" : "none",
              borderColor: "divider",
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography level="title-sm" noWrap>
                  {invite.email}
                </Typography>
                <Chip variant="soft" color="neutral">
                  {formatRole(invite.role)}
                </Chip>
              </Stack>
              <Typography level="body-xs" textColor="text.tertiary">
                Sent {new Date(invite.createdAt).toLocaleString()}
              </Typography>
            </Box>
            <Button
              color="danger"
              variant="outlined"
              onClick={() => handleRevoke(invite.email)}
              disabled={revokeMutation.isPending}
            >
              Revoke
            </Button>
          </Stack>
        ))}
      </Sheet>
    );
  };

  return (
    <SettingsCard
      title="Pending invitations"
      description="Invitations that have been sent but not yet accepted."
    >
      {renderContent()}
    </SettingsCard>
  );
};

export default PendingInvitationsCard;

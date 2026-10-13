import { isAxiosError } from "axios";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import useAuthenticationStore from "../../../hooks/authentication.store";
import { useInviteTeamMember } from "../../../hooks/team.query";

type InvitationResult = "sent" | "upgrade-required" | "failed";

/**
 * Sends team invitations and translates the API errors into user feedback.
 * `upgradeRequired` turns true when the plan's member limit is reached.
 */
const useSendInvitation = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);
  const { mutateAsync, isPending } = useInviteTeamMember(teamId ?? 0);
  const [upgradeRequired, setUpgradeRequired] = useState(false);

  const sendInvitation = async (
    email: string,
    role: string,
  ): Promise<InvitationResult> => {
    try {
      await mutateAsync({ email, role });
      enqueueSnackbar(`Invitation sent to ${email}`, { variant: "success" });
      return "sent";
    } catch (error) {
      const status = isAxiosError(error) ? error.response?.status : undefined;

      if (status === 402) {
        setUpgradeRequired(true);
        return "upgrade-required";
      }

      if (status === 409) {
        enqueueSnackbar(`User ${email} is already a member of this team`, {
          variant: "info",
        });
      } else {
        enqueueSnackbar("Failed to send invitation", { variant: "error" });
      }

      return "failed";
    }
  };

  return {
    sendInvitation,
    isPending,
    upgradeRequired,
    closeUpgradePrompt: () => setUpgradeRequired(false),
  };
};

export default useSendInvitation;

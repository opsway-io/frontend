import { Button, Stack, Typography } from "@mui/joy";
import { FunctionComponent, useState } from "react";
import { Helmet } from "react-helmet";
import { AiOutlineTeam } from "react-icons/ai";
import { FaPaperPlane } from "react-icons/fa";
import Avatar from "../../../components/Avatar/Avatar";
import Container from "../../../components/Container/Container";
import ContainerHeader from "../../../components/Container/ContainerHeader";
import { Restrict, Role } from "../../../components/Restrict";
import RouteTabs, { RouteTab } from "../../../components/RouteTabs/RouteTabs";
import useAuthenticationStore from "../../../hooks/authentication.store";
import { useCurrentTeam, useTeamMemberCount } from "../../../hooks/team.query";
import { useCurrentUserRole } from "../../../hooks/user.query";
import InvitationDialog from "./components/InvitationDialog";

const TeamPage: FunctionComponent = () => {
  const setCurrentTeamID = useAuthenticationStore(
    (state) => state.setCurrentTeamID,
  );
  const currentRole = useCurrentUserRole();

  const {
    data: team,
    isPending: isLoadingTeam,
    error: teamError,
  } = useCurrentTeam();
  const { data: memberCount, error: memberCountError } = useTeamMemberCount();

  const [openInvitationDialog, setOpenInvitationDialog] = useState(false);

  const teamName = team?.displayName || team?.name;

  const tabs: RouteTab[] = [{ label: "People", path: "/team/people" }];
  if (Role.ADMIN.equalOrHigher(currentRole)) {
    tabs.push({ label: "Invitations", path: "/team/invitations" });
  }

  return (
    <>
      <Helmet>{team && <title>Team | {teamName}</title>}</Helmet>

      <Container
        error={(teamError || memberCountError) && "Failed to load team"}
        loading={isLoadingTeam}
        header={
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              src={team?.avatarUrl}
              name={teamName}
              sx={{
                width: 72,
                height: 72,
                borderRadius: "lg",
                fontSize: "xl",
              }}
            />

            <Stack>
              <ContainerHeader>{teamName}</ContainerHeader>
              {memberCount != null && (
                <Typography level="body-sm" textColor="text.secondary">
                  {memberCount} member{memberCount === 1 ? "" : "s"}
                </Typography>
              )}
            </Stack>
          </Stack>
        }
        secondaryActions={[
          <Button
            key="switch-team"
            variant="outlined"
            color="neutral"
            startDecorator={<AiOutlineTeam />}
            onClick={() => setCurrentTeamID(undefined)}
          >
            Switch team
          </Button>,
          <Restrict key="invite" min={Role.ADMIN}>
            <Button
              startDecorator={<FaPaperPlane size={14} />}
              onClick={() => setOpenInvitationDialog(true)}
            >
              Invite people to your team
            </Button>
          </Restrict>,
        ]}
      >
        <RouteTabs tabs={tabs} />
      </Container>

      <InvitationDialog
        open={openInvitationDialog}
        onClose={() => setOpenInvitationDialog(false)}
      />
    </>
  );
};

export default TeamPage;

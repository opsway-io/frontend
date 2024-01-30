import {
  Box,
  Button,
  ButtonBase,
  Card,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { FunctionComponent, Suspense, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, Outlet, useLocation } from "react-router-dom";
import Container from "../../../components/Container";
import ContainerHeader from "../../../components/Container/header";
import DelayedVisibility from "../../../components/DelayedVisibility";
import useAuthenticationStore from "../../../hooks/authentication.store";
import * as TeamsAPI from "../../../api/endpoints/teams";
import { useCurrentTeam } from "../../../hooks/team.query";
import { FaPaperPlane } from "react-icons/fa";
import Avatar from "../../../components/Avatar";
import { useCurrentUserRole } from "../../../hooks/user.query";
import { Restrict, Role } from "../../../components/Restrict";
import InvitationDialog from "./components/InvitationDialog";
import ChangeTeamAvatarModal from "./components/ChangeAvatarModal";
import { AiOutlineTeam } from "react-icons/ai";

const TeamView: FunctionComponent = () => {
  const location = useLocation();

  const { teamId, setCurrentTeamID } = useAuthenticationStore((state) => ({
    teamId: state.currentTeamId,
    setCurrentTeamID: state.setCurrentTeamID,
  }));

  const {
    data: team,
    isLoading: teamIsLoading,
    error: teamError,
  } = useCurrentTeam();

  const currentRole = useCurrentUserRole();

  const [openInvitationDialog, setOpenInvitationDialog] = useState(false);

  const [openChangeAvatarDialog, setOpenChangeAvatarDialog] = useState(false);

  const {
    data: teamUsers,
    isLoading: teamUsersIsLoading,
    error: teamUsersError,
  } = useQuery(["team", teamId, "users"], () => {
    if (!teamId) {
      return Promise.resolve(null);
    }

    return TeamsAPI.getUsers(teamId);
  });

  const teamName = useMemo(() => {
    return team?.displayName ? team.displayName : team?.name;
  }, [team]);

  const availableTabs = useMemo(() => {
    const tabs = [
      <Tab
        label="People"
        key="people"
        component={Link}
        to="/team/people"
        value="/team/people"
      />,
    ];

    if (Role.ADMIN.equalOrHigher(currentRole)) {
      tabs.push(
        <Tab
          label="Settings"
          key="settings"
          component={Link}
          to="/team/settings"
          value="/team/settings"
        />,
      );
    }

    if (Role.OWNER.equalOrHigher(currentRole)) {
      tabs.push(
        <Tab
          label="Billing & Plan"
          key="plan"
          component={Link}
          to="/team/plan"
          value="/team/plan"
        />,
      );
    }

    return tabs;
  }, [currentRole]);

  return (
    <>
      <Helmet>{team && <title>Team | {teamName}</title>}</Helmet>

      <Container
        error={(teamUsersError || teamError) && "Failed to load team"}
        loading={teamUsersIsLoading || teamIsLoading}
        header={
          <Stack direction="row" alignItems="center">
            <ButtonBase
              sx={{
                marginRight: 2,
                "&:hover": {
                  opacity: 0.8,
                  transition: (t) => t.transitions.create("opacity"),
                },
              }}
            >
              <Avatar
                src={team?.avatarUrl}
                name={teamName}
                onClick={() => setOpenChangeAvatarDialog(true)}
                sx={{
                  width: 72,
                  height: 72,
                }}
              />
            </ButtonBase>

            <Stack>
              <ContainerHeader>{teamName}</ContainerHeader>
              <Typography variant="body2" color="textSecondary">
                {teamUsers?.totalCount} member
                {teamUsers?.totalCount === 1 ? "" : "s"}{" "}
              </Typography>
            </Stack>
          </Stack>
        }
        secondaryActions={[
          <Button
            key="switch-team"
            startIcon={<AiOutlineTeam />}
            onClick={() => {
              setCurrentTeamID(undefined);
            }}
          >
            Switch team
          </Button>,
          <Restrict key="invite" min={Role.ADMIN}>
            <Button
              startIcon={<FaPaperPlane size={16} />}
              color="secondary"
              onClick={() => setOpenInvitationDialog(true)}
              sx={{
                span: {
                  color: (t) => t.palette.success.main,
                },
              }}
            >
              Invite people to your team
            </Button>
          </Restrict>,
        ]}
      >
        <Card>
          <Box sx={{ width: "100%" }}>
            <Tabs
              value={
                location.pathname === "/team"
                  ? "/team/people"
                  : location.pathname
              }
            >
              {availableTabs}
            </Tabs>
          </Box>
        </Card>

        <Suspense
          fallback={
            <DelayedVisibility>
              <Skeleton variant="rectangular" height={400} />
            </DelayedVisibility>
          }
        >
          <Outlet />
        </Suspense>
      </Container>

      <InvitationDialog
        open={openInvitationDialog}
        onClose={() => setOpenInvitationDialog(false)}
      />
      <ChangeTeamAvatarModal
        open={openChangeAvatarDialog}
        onClose={() => setOpenChangeAvatarDialog(false)}
        teamId={teamId}
      />
    </>
  );
};

export default TeamView;

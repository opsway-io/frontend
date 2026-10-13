import { Button, List, Skeleton, Stack, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import { IoAdd } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import useAuthenticationStore from "../../../hooks/authentication.store";
import { useUserTeams } from "../../../hooks/user.query";
import AuthCard from "../components/AuthCard";
import TeamListItem from "./TeamListItem";

const TeamSelectionPage: FunctionComponent = () => {
  const navigate = useNavigate();
  const authentication = useAuthenticationStore();
  const { data, isPending: isLoading } = useUserTeams(
    authentication.currentUserId,
  );

  const handleTeamSelect = (teamId: number) => {
    authentication.setCurrentTeamID(teamId);
    navigate("/monitors", { replace: true });
  };

  return (
    <>
      <Helmet>
        <title>Team selection</title>
      </Helmet>

      <Stack spacing={1.5} sx={{ width: "100%", maxWidth: 460 }}>
        <AuthCard
          title="Select a team"
          description="Choose the team you want to continue with."
          maxWidth={460}
        >
          {isLoading ? (
            <Stack spacing={1}>
              {[0, 1, 2].map((placeholder) => (
                <Skeleton
                  key={placeholder}
                  variant="rectangular"
                  height={60}
                  sx={{ borderRadius: "md" }}
                />
              ))}
            </Stack>
          ) : (
            <>
              <List
                sx={{
                  "--List-gap": "8px",
                  "--List-padding": "0px",
                  maxHeight: 480,
                  overflow: "auto",
                }}
              >
                {data?.teams?.map((team) => (
                  <TeamListItem
                    key={team.id}
                    name={team.name}
                    role={team.role}
                    avatarUrl={team.avatarUrl}
                    onClick={() => handleTeamSelect(team.id)}
                  />
                ))}

                <TeamListItem
                  name="Create new team"
                  icon={<IoAdd size={18} />}
                  muted
                  onClick={() => {
                    navigate("/login/team/register", { replace: true });
                  }}
                />
              </List>

              <Typography
                level="body-xs"
                textColor="text.tertiary"
                sx={{ textAlign: "center" }}
              >
                Don't see your team? Create a new one or accept an invite.
              </Typography>
            </>
          )}
        </AuthCard>

        <Button
          variant="plain"
          color="neutral"
          sx={{ alignSelf: "center" }}
          onClick={() => {
            authentication.logOut();
          }}
        >
          Log me out
        </Button>
      </Stack>
    </>
  );
};

export default TeamSelectionPage;

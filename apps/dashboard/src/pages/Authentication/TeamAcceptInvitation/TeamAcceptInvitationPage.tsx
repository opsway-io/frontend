import { Button, Skeleton, Stack, Typography } from "@mui/joy";
import { jwtDecode } from "jwt-decode";
import { FunctionComponent, useEffect } from "react";
import Confetti from "react-confetti";
import { Helmet } from "react-helmet";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useWindowSize } from "react-use";
import Avatar from "../../../components/Avatar/Avatar";
import useAuthenticationStore from "../../../hooks/authentication.store";
import { useAcceptTeamInvite, useCurrentTeam } from "../../../hooks/team.query";
import AuthCard from "../components/AuthCard";

interface InviteClaims {
  team_id: number;
}

const TeamAcceptInvitationPage: FunctionComponent = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const { mutate: acceptTeamInvite, isPending: isAcceptingTeamInvite } =
    useAcceptTeamInvite();
  const { data: currentTeam, isPending: isCurrentTeamLoading } =
    useCurrentTeam();
  const setCurrentTeamID = useAuthenticationStore(
    (state) => state.setCurrentTeamID,
  );

  const isLoading = isAcceptingTeamInvite || isCurrentTeamLoading;

  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    let claims: InviteClaims;
    try {
      claims = jwtDecode<InviteClaims>(token);
    } catch (e) {
      console.error("Failed to decode JWT token:", e);
      navigate("/", { replace: true });
      return;
    }

    acceptTeamInvite(token, {
      onSuccess: () => setCurrentTeamID(claims.team_id),
      onError: () => {
        alert("Something went wrong");
        navigate("/", { replace: true });
      },
    });
  }, [token, acceptTeamInvite, navigate, setCurrentTeamID]);

  return (
    <>
      <Helmet>
        <title>Team Invitation</title>
      </Helmet>

      <Confetti width={windowWidth} height={windowHeight} recycle={false} />

      <AuthCard title="Welcome to the team!">
        <Stack spacing={1.5} alignItems="center" sx={{ py: 1 }}>
          <Avatar
            loading={isLoading}
            name={currentTeam?.name}
            src={currentTeam?.avatarUrl}
            size="lg"
            sx={{ width: 88, height: 88, fontSize: "xl2" }}
          />
          {isLoading ? (
            <Skeleton variant="text" level="title-lg" width={180} />
          ) : (
            <Typography level="title-lg" textColor="text.secondary">
              {currentTeam?.name}
            </Typography>
          )}
        </Stack>

        <Button
          size="md"
          fullWidth
          onClick={() => navigate("/", { replace: true })}
        >
          Go to dashboard
        </Button>
      </AuthCard>
    </>
  );
};

export default TeamAcceptInvitationPage;

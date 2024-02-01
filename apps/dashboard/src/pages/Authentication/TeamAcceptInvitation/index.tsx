import {
  Button,
  Card,
  CardContent,
  Fade,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { FunctionComponent, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import Avatar from "../../../components/Avatar";
import { useNavigate } from "react-router-dom";
import { useQueryParams } from "../../../hooks/queryParams";
import Confetti from "react-confetti";
import { useAcceptTeamInvite, useCurrentTeam } from "../../../hooks/team.query";
import { useWindowSize } from "react-use";
import useAuthenticationStore from "../../../hooks/authentication.store";
import jwt_decode from "jwt-decode";

const TeamAcceptInvitationView: FunctionComponent = () => {
  const { params, isLoading: isLoadingQueryParams } = useQueryParams();
  const navigate = useNavigate();
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const { mutate: acceptTeamInvite, isLoading: isAcceptingTeamInvite } =
    useAcceptTeamInvite();
  const { data: currentTeam, isLoading: isCurrentTeamLoading } =
    useCurrentTeam();
  const setCurrentTeamID = useAuthenticationStore(
    (state) => state.setCurrentTeamID,
  );

  const isLoading = useMemo(() => {
    return (
      isLoadingQueryParams || isAcceptingTeamInvite || isCurrentTeamLoading
    );
  }, [isLoadingQueryParams, isAcceptingTeamInvite, isCurrentTeamLoading]);

  useEffect(() => {
    if (isLoadingQueryParams) {
      return;
    }

    const token = params.token;
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    let claims: any;
    try {
      claims = jwt_decode(token);
    } catch (e) {
      navigate("/", { replace: true });
      return;
    }

    acceptTeamInvite(token, {
      onSuccess: (data) => {
        setCurrentTeamID(claims.team_id);
      },
      onError: () => {
        alert("Something went wrong");
        navigate("/", { replace: true });
      },
    });
  }, [params, isLoadingQueryParams]);

  return (
    <>
      <Helmet>
        <title>Team Invitation</title>
      </Helmet>

      <Confetti width={windowWidth} height={windowHeight} recycle={false} />

      <Fade in={true} appear timeout={250}>
        <Card
          elevation={1}
          sx={{
            flex: 1,
            maxWidth: 500,
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              textAlign="center"
              sx={{
                fontWeight: 700,
              }}
            >
              Welcome to the team!
            </Typography>
          </CardContent>

          <CardContent
            component={Stack}
            spacing={2}
            alignItems="center"
            sx={{
              marginTop: 2,
              margin: 1,
            }}
          >
            <Avatar
              loading={isLoading}
              name={currentTeam?.name}
              src={currentTeam?.avatarUrl}
              sx={{
                width: 100,
                height: 100,
                margin: "0 auto",
              }}
            />
            {isLoading ? (
              <Skeleton variant="text" width={200} height={50} />
            ) : (
              <Typography
                textAlign="center"
                sx={{
                  color: "text.secondary",
                  fontSize: 24,
                }}
              >
                {currentTeam?.name}
              </Typography>
            )}
          </CardContent>

          <CardContent>
            <Button
              fullWidth
              variant="contained"
              color="success"
              size="large"
              onClick={() =>
                navigate("/", {
                  replace: true,
                })
              }
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </Fade>
    </>
  );
};

export default TeamAcceptInvitationView;

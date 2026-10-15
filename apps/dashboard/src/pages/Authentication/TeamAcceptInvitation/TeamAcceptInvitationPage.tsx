import { Alert, Box, Button, Skeleton, Stack, Typography } from "@mui/joy";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { FunctionComponent, useEffect, useMemo, useRef } from "react";
import Confetti from "react-confetti";
import { Helmet } from "react-helmet";
import { IoAlertCircleOutline } from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useWindowSize } from "react-use";
import Avatar from "../../../components/Avatar/Avatar";
import useAuthenticationStore from "../../../hooks/authentication.store";
import { useAcceptTeamInvite, useCurrentTeam } from "../../../hooks/team.query";
import { useCurrentUser } from "../../../hooks/user.query";
import AuthCard from "../components/AuthCard";

interface InviteClaims {
  sub?: string;
  team_id?: number;
  role?: string;
  type?: string;
  exp?: number;
}

const TeamAcceptInvitationPage: FunctionComponent = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const claims = useMemo<InviteClaims | null>(() => {
    if (!token) {
      return null;
    }
    try {
      return jwtDecode<InviteClaims>(token);
    } catch {
      return null;
    }
  }, [token]);

  const { data: currentUser, isPending: isCurrentUserLoading } =
    useCurrentUser();
  const {
    mutate: acceptTeamInvite,
    isSuccess: isAccepted,
    isError: isAcceptError,
    error: acceptError,
  } = useAcceptTeamInvite();
  const { data: currentTeam, isPending: isCurrentTeamLoading } =
    useCurrentTeam();

  const setCurrentTeamID = useAuthenticationStore(
    (state) => state.setCurrentTeamID,
  );
  const logOut = useAuthenticationStore((state) => state.logOut);

  const isEmailMismatch = Boolean(
    claims?.sub &&
    currentUser?.email &&
    claims.sub.trim().toLowerCase() !== currentUser.email.trim().toLowerCase(),
  );

  const hasAttemptedRef = useRef(false);

  useEffect(() => {
    if (
      !token ||
      !claims ||
      !claims.team_id ||
      isCurrentUserLoading ||
      !currentUser ||
      isEmailMismatch
    ) {
      return;
    }

    if (hasAttemptedRef.current) {
      return;
    }
    hasAttemptedRef.current = true;

    acceptTeamInvite(token, {
      onSuccess: () => {
        if (claims.team_id) {
          setCurrentTeamID(claims.team_id);
        }
      },
    });
  }, [
    token,
    claims,
    isCurrentUserLoading,
    currentUser,
    isEmailMismatch,
    acceptTeamInvite,
    setCurrentTeamID,
  ]);

  if (!token || !claims || !claims.team_id) {
    return (
      <>
        <Helmet>
          <title>Invalid Invitation</title>
        </Helmet>
        <AuthCard
          title="Invalid invitation"
          description="The invitation link is invalid or incomplete"
        >
          <Alert
            color="danger"
            variant="soft"
            startDecorator={<IoAlertCircleOutline size={20} />}
          >
            This invitation link is not valid or has expired.
          </Alert>
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
  }

  if (isCurrentUserLoading || !currentUser) {
    return (
      <>
        <Helmet>
          <title>Team Invitation</title>
        </Helmet>
        <AuthCard title="Checking invitation...">
          <Stack spacing={2} alignItems="center" sx={{ py: 2 }}>
            <Skeleton variant="circular" width={88} height={88} />
            <Skeleton variant="text" level="title-lg" width={180} />
          </Stack>
        </AuthCard>
      </>
    );
  }

  if (isEmailMismatch) {
    return (
      <>
        <Helmet>
          <title>Account Mismatch</title>
        </Helmet>
        <AuthCard
          title="Account mismatch"
          description="This invitation was sent to a different account"
        >
          <Stack spacing={2}>
            <Alert
              color="warning"
              variant="soft"
              startDecorator={<IoAlertCircleOutline size={20} />}
            >
              <Box>
                <Typography level="body-sm" sx={{ mb: 0.5 }}>
                  This invitation was sent to <strong>{claims.sub}</strong>.
                </Typography>
                <Typography level="body-xs" textColor="text.secondary">
                  You are currently signed in as{" "}
                  <strong>{currentUser.email}</strong>.
                </Typography>
              </Box>
            </Alert>

            <Typography level="body-sm" textColor="text.secondary">
              To accept this invitation, please switch to the invited account.
            </Typography>

            <Button
              size="md"
              fullWidth
              onClick={() => {
                logOut();
                const returnTo = encodeURIComponent(
                  `/login/team/invite?token=${token}`,
                );
                navigate(`/login?returnTo=${returnTo}`, { replace: true });
              }}
            >
              Switch account
            </Button>

            <Button
              size="md"
              variant="outlined"
              color="neutral"
              fullWidth
              onClick={() => navigate("/", { replace: true })}
            >
              Continue as {currentUser.email}
            </Button>
          </Stack>
        </AuthCard>
      </>
    );
  }

  if (isAcceptError) {
    const axiosError = acceptError as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError?.response?.data?.message ||
      acceptError?.message ||
      "Failed to accept invitation. It may have expired or already been used.";

    return (
      <>
        <Helmet>
          <title>Invitation Error</title>
        </Helmet>
        <AuthCard
          title="Unable to join team"
          description="We could not process your invitation"
        >
          <Stack spacing={2}>
            <Alert
              color="danger"
              variant="soft"
              startDecorator={<IoAlertCircleOutline size={20} />}
            >
              {errorMessage}
            </Alert>

            <Button
              size="md"
              fullWidth
              onClick={() => navigate("/", { replace: true })}
            >
              Go to dashboard
            </Button>
          </Stack>
        </AuthCard>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Team Invitation</title>
      </Helmet>

      {isAccepted && (
        <Confetti width={windowWidth} height={windowHeight} recycle={false} />
      )}

      <AuthCard title={isAccepted ? "Welcome to the team!" : "Joining team..."}>
        <Stack spacing={1.5} alignItems="center" sx={{ py: 1 }}>
          <Avatar
            loading={!isAccepted || isCurrentTeamLoading}
            name={currentTeam?.name}
            src={currentTeam?.avatarUrl}
            size="lg"
            sx={{ width: 88, height: 88, fontSize: "xl2" }}
          />
          {!isAccepted || isCurrentTeamLoading ? (
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
          disabled={!isAccepted}
          onClick={() => navigate("/", { replace: true })}
        >
          Go to dashboard
        </Button>
      </AuthCard>
    </>
  );
};

export default TeamAcceptInvitationPage;

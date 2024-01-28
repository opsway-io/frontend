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
import { FunctionComponent, Suspense, useState } from "react";
import { Helmet } from "react-helmet";
import { AiOutlineTeam } from "react-icons/ai";
import { GoSignOut } from "react-icons/go";
import { Link, Outlet, useLocation } from "react-router-dom";
import Avatar from "../../../components/Avatar";
import Container from "../../../components/Container";
import ContainerHeader from "../../../components/Container/header";
import DelayedVisibility from "../../../components/DelayedVisibility";
import useAuthenticationStore from "../../../hooks/authentication.store";
import { useCurrentUser } from "../../../hooks/user.query";
import ChangeAccountAvatarModal from "./components/ChangeAvatarModal";

const AccountView: FunctionComponent = () => {
  const { data: user, isLoading, error } = useCurrentUser();
  const { logOut, setCurrentTeamID } = useAuthenticationStore((state) => ({
    logOut: state.logOut,
    setCurrentTeamID: state.setCurrentTeamID,
  }));

  const [changeAvatarModalOpen, setChangeAvatarModalOpen] = useState(false);

  const location = useLocation();

  return (
    <>
      <Helmet>
        <title>My account</title>
      </Helmet>

      <Container
        loading={isLoading}
        error={error && "Failed to load your account"}
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
              onClick={() => setChangeAvatarModalOpen(true)}
            >
              <Avatar
                src={user?.avatarUrl}
                name={user?.name}
                sx={{
                  width: 72,
                  height: 72,
                }}
              />
            </ButtonBase>

            <Stack>
              <ContainerHeader>{user?.name}</ContainerHeader>
              <Typography variant="body2" color="textSecondary">
                {user?.displayName}
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
          <Button startIcon={<GoSignOut />} onClick={logOut}>
            Sign me out
          </Button>,
        ]}
      >
        <Card>
          <Box sx={{ width: "100%" }}>
            <Tabs
              value={
                location.pathname === "/account"
                  ? "/account/general"
                  : location.pathname
              }
            >
              <Tab
                label="General"
                component={Link}
                to="/account/general"
                value="/account/general"
              />
              <Tab
                label="Security"
                component={Link}
                to="/account/security"
                value="/account/security"
              />
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

      <ChangeAccountAvatarModal
        userId={user?.id}
        open={changeAvatarModalOpen}
        onClose={(ok) => {
          setChangeAvatarModalOpen(false);

          if (ok) {
            window.location.reload();
          }
        }}
      />
    </>
  );
};

export default AccountView;

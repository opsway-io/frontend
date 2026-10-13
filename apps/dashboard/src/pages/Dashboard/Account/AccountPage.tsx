import { Button, Stack, Typography } from "@mui/joy";
import { FunctionComponent, useState } from "react";
import { Helmet } from "react-helmet";
import { AiOutlineTeam } from "react-icons/ai";
import { GoSignOut } from "react-icons/go";
import { useShallow } from "zustand/react/shallow";
import * as UsersAPI from "../../../api/endpoints/users";
import ChangeAvatarDialog from "../../../components/ChangeAvatarDialog/ChangeAvatarDialog";
import Container from "../../../components/Container/Container";
import ContainerHeader from "../../../components/Container/ContainerHeader";
import RouteTabs, { RouteTab } from "../../../components/RouteTabs/RouteTabs";
import useAuthenticationStore from "../../../hooks/authentication.store";
import { useCurrentUser } from "../../../hooks/user.query";
import AvatarButton from "./components/AvatarButton";

const TABS: RouteTab[] = [
  { label: "General", path: "/account/general" },
  { label: "Security", path: "/account/security" },
  { label: "Notification Preferences", path: "/account/notifications" },
];

const AccountPage: FunctionComponent = () => {
  const { data: user, isPending: isLoading, error } = useCurrentUser();
  const { logOut, setCurrentTeamID } = useAuthenticationStore(
    useShallow((state) => ({
      logOut: state.logOut,
      setCurrentTeamID: state.setCurrentTeamID,
    })),
  );

  const [openAvatarDialog, setOpenAvatarDialog] = useState(false);

  return (
    <>
      <Helmet>
        <title>My account</title>
      </Helmet>

      <Container
        loading={isLoading}
        error={error && "Failed to load your account"}
        header={
          <Stack direction="row" alignItems="center" spacing={2}>
            <AvatarButton
              src={user?.avatarUrl}
              name={user?.name}
              label="Change avatar"
              onClick={() => setOpenAvatarDialog(true)}
            />

            <Stack>
              <ContainerHeader>{user?.name}</ContainerHeader>
              <Typography level="body-sm" textColor="text.secondary">
                {user?.displayName}
              </Typography>
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
          <Button
            key="sign-out"
            variant="outlined"
            color="neutral"
            startDecorator={<GoSignOut />}
            onClick={logOut}
          >
            Sign me out
          </Button>,
        ]}
      >
        <RouteTabs tabs={TABS} />
      </Container>

      <ChangeAvatarDialog
        open={openAvatarDialog}
        onUpload={async (image) => {
          if (user) await UsersAPI.updateAvatar(user.id, image);
        }}
        onClose={(ok) => {
          setOpenAvatarDialog(false);
          if (ok) window.location.reload();
        }}
      />
    </>
  );
};

export default AccountPage;

import {
  Box,
  Dropdown,
  ListDivider,
  ListItemDecorator,
  Menu,
  MenuButton,
  MenuItem,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { memo, FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../Avatar/Avatar";
import AppSwitcher from "../AppSwitcher/AppSwitcher";
import { useSidebarCollapsed } from "./sidebarContext";
import useAuthenticationStore from "../../hooks/authentication.store";
import { useUserTeams } from "../../hooks/user.query";
import {
  IoAdd,
  IoSettingsOutline,
  IoLogOutOutline,
  IoCheckmark,
  IoChevronDown,
} from "react-icons/io5";

interface SidebarHeaderProps {
  name?: string;
  picture?: string;
  loading?: boolean;
  teamDisplayName?: string;
}

const SidebarHeader: FunctionComponent<SidebarHeaderProps> = (props) => {
  const collapsed = useSidebarCollapsed();
  const navigate = useNavigate();
  const authentication = useAuthenticationStore();

  const { data: userTeams } = useUserTeams(authentication.currentUserId);

  const handleSwitchTeam = (teamId: number) => {
    authentication.setCurrentTeamID(teamId);
    navigate("/monitors", { replace: true });
  };

  return (
    <Box sx={{ mb: 2, width: "100%", display: "flex", alignItems: "center", gap: 0.5 }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Dropdown>
          <Tooltip title={collapsed ? "Account & Teams" : ""} placement="right">
            <MenuButton
              variant="plain"
              color="neutral"
              sx={{
                width: "100%",
                justifyContent: collapsed ? "center" : "flex-start",
                gap: 1.25,
                px: collapsed ? 0.5 : 1,
                py: 0.75,
                borderRadius: "md",
                textAlign: "left",
              }}
            >
              <Avatar src={props.picture} name={props.name} />

              {!collapsed && (
                <>
                  <Stack sx={{ minWidth: 0, flex: 1 }}>
                    {props.loading ? (
                      <>
                        <Skeleton
                          variant="text"
                          level="body-sm"
                          width={110}
                          sx={{ mb: 0.25 }}
                        />
                        <Skeleton variant="text" level="body-xs" width={70} />
                      </>
                    ) : (
                      <>
                        <Typography
                          level="title-sm"
                          noWrap
                          sx={{ lineHeight: 1.3 }}
                        >
                          {props.name}
                        </Typography>
                        <Typography
                          level="body-xs"
                          textColor="text.tertiary"
                          noWrap
                          sx={{ lineHeight: 1.3 }}
                        >
                          {props.teamDisplayName}
                        </Typography>
                      </>
                    )}
                  </Stack>
                  <Box
                    component={IoChevronDown}
                    sx={{ color: "text.tertiary", flexShrink: 0 }}
                  />
                </>
              )}
            </MenuButton>
          </Tooltip>

          <Menu placement="bottom-start" size="sm" sx={{ minWidth: 240 }}>
            <Typography
              level="body-xs"
              textTransform="uppercase"
              letterSpacing="0.06em"
              fontWeight={600}
              textColor="text.tertiary"
              sx={{ px: 1.5, pt: 1, pb: 0.5 }}
            >
              Switch team
            </Typography>

            {userTeams?.teams?.map((team) => (
              <MenuItem
                key={team.id}
                onClick={() => handleSwitchTeam(team.id)}
                selected={team.id === authentication.currentTeamId}
              >
                <Box sx={{ flex: 1 }}>{team.displayName || team.name}</Box>
                {team.id === authentication.currentTeamId && <IoCheckmark />}
              </MenuItem>
            ))}

            <MenuItem onClick={() => navigate("/login/team/register")}>
              <ListItemDecorator>
                <IoAdd />
              </ListItemDecorator>
              Create new team
            </MenuItem>

            <ListDivider />

            <MenuItem onClick={() => navigate("/account")}>
              <ListItemDecorator>
                <IoSettingsOutline />
              </ListItemDecorator>
              Account settings
            </MenuItem>

            <MenuItem onClick={() => authentication.logOut()}>
              <ListItemDecorator>
                <IoLogOutOutline />
              </ListItemDecorator>
              Sign out
            </MenuItem>
          </Menu>
        </Dropdown>
      </Box>

      {!collapsed && <AppSwitcher currentApp="monitoring" />}
    </Box>
  );
};

export default memo(SidebarHeader);

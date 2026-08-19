import {
  alpha,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { memo, useState, FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../Avatar";
import useSidebarStore from "../../hooks/sidebar.store";
import useAuthenticationStore from "../../hooks/authentication.store";
import { useUserTeams } from "../../hooks/user.query";
import { IoAdd, IoSettingsOutline, IoLogOutOutline, IoCheckmark } from "react-icons/io5";

interface SidebarHeaderProps {
  name?: string;
  picture?: string;
  loading?: boolean;
  teamDisplayName?: string;
}

const SidebarHeader: FunctionComponent<SidebarHeaderProps> = (props) => {
  const { collapsed } = useSidebarStore();
  const navigate = useNavigate();
  const authentication = useAuthenticationStore();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const { data: userTeams } = useUserTeams(authentication.currentUserId);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSwitchTeam = (teamId: number) => {
    authentication.setCurrentTeamID(teamId);
    handleClose();
    navigate("/monitors", { replace: true });
  };

  const handleLogout = () => {
    handleClose();
    authentication.logOut();
  };

  return (
    <>
      <Tooltip title={collapsed ? "Account & Teams" : ""} placement="right">
        <Button
          onClick={handleClick}
          startIcon={
            collapsed ? null : <Avatar src={props.picture} name={props.name} />
          }
          sx={{
            justifyContent: collapsed ? "center" : "left",
            fontSize: (theme) => theme.typography.body1.fontSize,
            width: "100%",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            marginBottom: (t) => t.spacing(2),
            color: (t) => t.palette.text.primary,
            "&.active": {
              backgroundColor: (t) => t.palette.action.selected,
              fontWeight: 600,
            },
          }}
        >
          {collapsed && <Avatar src={props.picture} name={props.name} />}

          {!collapsed && (
            <Stack spacing={0} alignContent="center" sx={{ textAlign: 'left' }}>
              {props.loading && (
                <>
                  <Skeleton
                    variant="rectangular"
                    width={120}
                    height={12}
                    sx={{
                      marginBottom: (t) => t.spacing(0.5),
                    }}
                  />
                  <Skeleton variant="rectangular" width={80} height={12} />
                </>
              )}

              {!props.loading && (
                <>
                  <Typography
                    variant="body1"
                    component="span"
                    lineHeight={1.2}
                    fontWeight={500}
                  >
                    {props.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    component="span"
                    color={(t) => alpha(t.palette.text.primary, 0.7)}
                    lineHeight={1.2}
                  >
                    {props.teamDisplayName}
                  </Typography>
                </>
              )}
            </Stack>
          )}
        </Button>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 250, maxWidth: '100%' },
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        <MenuItem disabled>
          <Typography variant="overline">Switch Team</Typography>
        </MenuItem>
        
        {userTeams?.teams?.map((team) => (
          <MenuItem 
            key={team.id} 
            onClick={() => handleSwitchTeam(team.id)}
            selected={team.id === authentication.currentTeamId}
          >
            <ListItemText primary={team.displayName || team.name} />
            {team.id === authentication.currentTeamId && (
              <ListItemIcon sx={{ minWidth: 'auto', ml: 1 }}>
                <IoCheckmark />
              </ListItemIcon>
            )}
          </MenuItem>
        ))}
        
        <MenuItem onClick={() => { handleClose(); navigate("/login/team/register"); }}>
          <ListItemIcon>
            <IoAdd />
          </ListItemIcon>
          <ListItemText primary="Create new team" />
        </MenuItem>

        <Divider />
        
        <MenuItem onClick={() => { handleClose(); navigate("/account"); }}>
          <ListItemIcon>
            <IoSettingsOutline />
          </ListItemIcon>
          <ListItemText primary="Account Settings" />
        </MenuItem>
        
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <IoLogOutOutline />
          </ListItemIcon>
          <ListItemText primary="Sign Out" />
        </MenuItem>
      </Menu>
    </>
  );
};

export default memo(SidebarHeader);

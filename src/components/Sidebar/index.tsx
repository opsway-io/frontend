import { alpha, Button, Chip, Paper, styled, Typography, useTheme } from "@mui/material";
import { FunctionComponent } from "react";
import { AiOutlineTeam } from "react-icons/ai";
import { IoBuildOutline, IoPulseOutline } from "react-icons/io5";
import { GoBrowser, GoGraph } from "react-icons/go";
import { RiAlarmWarningLine } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import useUser from "../../stores/user";
import Avatar from "../Avatar";

const SidebarContainer = styled(Paper)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: 250,
    flexShrink: 0,
    padding: theme.spacing(2),
    paddingTop: theme.spacing(4),
    boxSizing: "border-box",
    zIndex: 0,
}));

const Sidebar: FunctionComponent = () => {
    const user = useUser(state => state.user);
    const theme = useTheme();
    const iconColor = theme.palette.info.main;

    return (
        <SidebarContainer sx={{ display: { md: "inherit", xs: "none" } }} elevation={1}>
            <SidebarItem to="/monitors" text="Monitors" icon={<IoPulseOutline color={iconColor} />} />
            <SidebarItem to="/incidents" text="Incidents" icon={<RiAlarmWarningLine color={iconColor} />} count={2} />
            <SidebarItem to="/maintenance" text="Maintenance" icon={<IoBuildOutline color={iconColor} />} count={1} />
            <SidebarItem to="/status-pages" text="Status pages" icon={<GoBrowser color={iconColor} />} />
            <SidebarItem to="/reports" text="Reports" icon={<GoGraph color={iconColor} />} />
            <SidebarItem to="/people" text="People" icon={<AiOutlineTeam color={iconColor} />} />

            <SidebarActions picture={user?.picture} name={user?.displayName} />
        </SidebarContainer>
    );
};

interface SidebarItemProps {
    text: string;
    icon: React.ReactNode;
    to: string;
    count?: number;
}

const SidebarItem: FunctionComponent<SidebarItemProps> = (props) => {
    return (
        <Button
            startIcon={props.icon}
            sx={{
                justifyContent: "left",
                textTransform: "none",
                fontWeight: 500,
                fontSize: (theme) => theme.typography.body2.fontSize,
                padding: (theme) => theme.spacing(1),
                marginBottom: (theme) => theme.spacing(1),
                "&.active": {
                    backgroundColor: theme => theme.palette.grey[100],
                }
            }}
            component={NavLink}
            to={props.to}
        >
            {props.text}
            {props.count && <Chip color="info" style={{ marginLeft: "auto", minWidth: 32 }} label={props.count} size="small" />}
        </Button>
    );
};

const SidebarActionsContainer = styled("div")(({ theme }) => ({
    marginTop: "auto",
    display: "flex",
}));

interface SidebarActionsProps {
    name?: string;
    picture?: string;
}

const SidebarActions: FunctionComponent<SidebarActionsProps> = (props) => {
    return (
        <SidebarActionsContainer>
            <Button
                startIcon={<Avatar src={props.picture} />}
                sx={{
                    justifyContent: "left",
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: (theme) => theme.typography.body2.fontSize,
                    padding: (theme) => theme.spacing(1),
                    flex: 1,
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                }}
                component={NavLink}
                to="/account"
            >
                {props.name}
            </Button>
        </SidebarActionsContainer>
    );
};

export default Sidebar;

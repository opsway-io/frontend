import { Button, Chip, Divider, Link, Paper, styled, useTheme } from "@mui/material";
import { FunctionComponent } from "react";
import { AiOutlineGithub, AiOutlineTeam } from "react-icons/ai";
import { IoBookOutline, IoBuildOutline, IoCallOutline, IoHelpCircleOutline, IoPulseOutline } from "react-icons/io5";
import { GoBrowser, GoGraph } from "react-icons/go";
import { RiAlarmWarningLine } from "react-icons/ri";
import { TbComponents } from "react-icons/tb";
import { NavLink } from "react-router-dom";
import useUser from "../../stores/user";
import Avatar from "../Avatar";

const SidebarContainer = styled(Paper)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: 246,
    flexShrink: 0,
    padding: theme.spacing(2),
    paddingTop: theme.spacing(4),
    boxSizing: "border-box",
    zIndex: 0,
    borderRadius: 0,
}));

const Sidebar: FunctionComponent = () => {
    const user = useUser((state) => state.user);
    const theme = useTheme();
    const iconColor = theme.palette.info.main;

    return (
        <SidebarContainer sx={{ display: { md: "inherit", xs: "none" } }} elevation={1}>
            <SidebarItem to="/monitors" text="Monitors" icon={<IoPulseOutline color={iconColor} />} />
            <SidebarItem to="/incidents" text="Incidents" icon={<RiAlarmWarningLine color={iconColor} />} count={2} />
            <SidebarItem to="/on-call" text="On-Call" icon={<IoCallOutline color={iconColor} />} />
            <SidebarItem to="/maintenance" text="Maintenance" icon={<IoBuildOutline color={iconColor} />} count={1} />
            <SidebarItem to="/status-pages" text="Status pages" icon={<GoBrowser color={iconColor} />} />
            <SidebarItem to="/reports" text="Reports" icon={<GoGraph color={iconColor} />} />
            <SidebarItem to="/people" text="People" icon={<AiOutlineTeam color={iconColor} />} />
            <SidebarItem to="/integrations" text="Integrations" icon={<TbComponents color={iconColor} />} />

            <SidebarDivider />

            <SidebarLinkItem icon={<AiOutlineGithub />} href="https://github.com/opsway-io" text="GitHub" />
            <SidebarLinkItem icon={<IoBookOutline />} href="https://docs.opsway.io" text="Documentation" />

            <Divider
                sx={{
                    marginTop: 2,
                    marginBottom: 2,
                }}
            />

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
                fontSize: (theme) => theme.typography.body1.fontSize,
                padding: (theme) => theme.spacing(1),
                marginBottom: "4px",
                "&.active": {
                    backgroundColor: (theme) => theme.palette.grey[200],
                    fontWeight: 600,
                },
            }}
            component={NavLink}
            to={props.to}
        >
            {props.text}
            {props.count && (
                <Chip color="info" style={{ marginLeft: "auto", minWidth: 32 }} label={props.count} size="small" />
            )}
        </Button>
    );
};

interface SidebarLinkItemProps {
    text: string;
    icon: React.ReactNode;
    href: string;
}

const SidebarLinkItem: FunctionComponent<SidebarLinkItemProps> = (props) => {
    return (
        <Link
            component={Button}
            startIcon={props.icon}
            href={props.href}
            target="_blank"
            sx={{
                justifyContent: "flex-start",
                textDecoration: "none",
                opacity: 0.5,
            }}
        >
            {props.text}
        </Link>
    );
};

const SidebarActionsContainer = styled("div")(({ theme }) => ({
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
                    fontSize: (theme) => theme.typography.body1.fontSize,
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

const SidebarDivider: FunctionComponent = () => {
    return (
        <div
            style={{
                margin: "auto",
            }}
        />
    );
};

export default Sidebar;

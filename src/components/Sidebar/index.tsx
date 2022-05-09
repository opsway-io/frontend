import { Avatar, Button, ButtonBase, Chip, Paper, styled, Typography, useTheme } from "@mui/material";
import { FunctionComponent } from "react";
import { AiOutlineTeam } from "react-icons/ai";
import { IoBuildOutline, IoPulseOutline } from "react-icons/io5";
import { GoBrowser, GoGraph } from "react-icons/go";
import { RiAlarmWarningLine, RiPhoneLine } from "react-icons/ri";
import { Link, NavLink } from "react-router-dom";
import * as falso from "@ngneat/falso";

const SidebarContainer = styled(Paper)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: 250,
    flexShrink: 0,
    padding: theme.spacing(2),
    paddingTop: theme.spacing(6),
    boxSizing: "border-box",
}));

const SidebarLogo = styled("header")(({ theme }) => ({
    fontSize: theme.typography.h5.fontSize,
    fontWeight: "500",
    opacity: 0.8,
    marginBottom: theme.spacing(4),
    color: theme.palette.primary.main,
}));

const SidebarActions = styled("div")(({ theme }) => ({
    marginTop: "auto",
    display: "flex",
}));

const Sidebar: FunctionComponent = () => {
    const theme = useTheme();

    return (
        <SidebarContainer sx={{ display: { md: "inherit", xs: "none" } }}>
            {/* <SidebarLogo>
                opsway
            </SidebarLogo> */}

            <SidebarItem to="/monitors" text="Monitors" icon={<IoPulseOutline />} />
            <SidebarItem to="/incidents" text="Incidents" icon={<RiAlarmWarningLine />} count={2} />
            <SidebarItem to="/maintenance" text="Maintenance" icon={<IoBuildOutline />} count={1} />
            <SidebarItem to="/status-pages" text="Status pages" icon={<GoBrowser />} />
            <SidebarItem to="/reports" text="Reports" icon={<GoGraph />} />
            <SidebarItem to="/people" text="People" icon={<AiOutlineTeam />} />

            <SidebarActions>
                <Button
                    startIcon={<Avatar src={falso.randImg()} />}
                    component={NavLink}
                    style={{
                        justifyContent: "left",
                        textTransform: "none",
                        fontWeight: 500,
                        fontSize: theme.typography.body2.fontSize,
                        padding: theme.spacing(1),
                        flex: 1,
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                    }}
                    to="/account"
                >
                    {falso.randFirstName()}
                </Button>
            </SidebarActions>
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
    const theme = useTheme();

    return (
        <Button
            startIcon={props.icon}
            style={{
                justifyContent: "left",
                textTransform: "none",
                fontWeight: 500,
                fontSize: theme.typography.body2.fontSize,
                padding: theme.spacing(1),
            }}
            component={NavLink}
            to={props.to}
        >
            {props.text}
            {props.count && <Chip style={{ marginLeft: "auto" }} label={props.count} size="small" />}
        </Button>
    );
};

export default Sidebar;

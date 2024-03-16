import { FunctionComponent, useMemo } from "react";
import { AiOutlineTeam } from "react-icons/ai";
import { GoBrowser, GoGraph } from "react-icons/go";
import {
  IoArrowBack,
  IoArrowForward,
  IoBuildOutline,
  IoPulseOutline,
} from "react-icons/io5";
import { PiFireSimpleBold } from "react-icons/pi";
import { RiAlarmWarningLine } from "react-icons/ri";
import useSidebarStore from "../../hooks/sidebar.store";
import { useCurrentTeam } from "../../hooks/team.query";
import { useCurrentUser } from "../../hooks/user.query";
import SidebarContainer from "./container";
import SidebarDivider from "./divider";
import SidebarHeader from "./header";
import SidebarItem from "./item";

const Sidebar: FunctionComponent = () => {
  const {
    data: user,
    isLoading: isLoadingUser,
    error: errorUser,
  } = useCurrentUser();
  const { collapsed, setCollapsed } = useSidebarStore();
  const {
    data: team,
    isLoading: isLoadingTeam,
    error: errorTeam,
  } = useCurrentTeam();

  const isLoading = useMemo(() => {
    return isLoadingUser || isLoadingTeam;
  }, [isLoadingUser, isLoadingTeam]);

  return (
    <SidebarContainer>
      <SidebarHeader
        name={user?.displayName}
        picture={user?.avatarUrl}
        loading={isLoading || isLoadingTeam}
        teamDisplayName={team?.displayName || team?.name}
      />

      <SidebarItem
        to="/monitors"
        text="Monitors"
        icon={<IoPulseOutline />}
        iconColor={"semantic.monitors.main"}
      />

      {/* <SidebarItem to="/heartbeats" text="Heartbeats" icon={<BsHeartPulse />} /> */}

      <SidebarItem
        to="/alerting"
        text="Alerting"
        icon={<RiAlarmWarningLine />}
        iconColor={"semantic.alerting.main"}
      />

      <SidebarItem
        to="/incidents"
        text="Incidents"
        icon={<PiFireSimpleBold />}
        iconColor={"semantic.incidents.main"}
      />

      <SidebarItem
        to="/maintenance"
        text="Maintenance"
        icon={<IoBuildOutline />}
        iconColor={"semantic.maintenance.main"}
      />

      {/* 
      <SidebarItem
        to="/changelogs"
        text="Changelogs"
        icon={<VscRequestChanges />}
      /> */}

      <SidebarItem
        to="/status-pages"
        text="Pages"
        icon={<GoBrowser />}
        iconColor={"semantic.pages.main"}
      />

      <SidebarItem
        to="/reports"
        text="Reports"
        icon={<GoGraph />}
        iconColor={"semantic.reports.main"}
      />

      <SidebarItem
        to="/team"
        text="Team"
        icon={<AiOutlineTeam />}
        iconColor={"semantic.team.main"}
      />

      <SidebarDivider />

      {/* <SidebarItem
        link="https://opsway.io/docs"
        text="Documentation"
        icon={<IoBookOutline />}
      /> */}

      <SidebarItem
        onClick={() => setCollapsed(!collapsed)}
        text={collapsed ? "Expand" : "Collapse"}
        icon={collapsed ? <IoArrowForward /> : <IoArrowBack />}
      />
    </SidebarContainer>
  );
};

export default Sidebar;

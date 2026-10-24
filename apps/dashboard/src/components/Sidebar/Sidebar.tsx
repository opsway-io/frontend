import { FunctionComponent, ReactNode } from "react";
import { AiOutlineTeam } from "react-icons/ai";
import { GoBrowser, GoGraph } from "react-icons/go";
import {
  IoAppsOutline,
  IoArrowBack,
  IoArrowForward,
  IoBuildOutline,
  IoCardOutline,
  IoLayersOutline,
  IoPersonOutline,
  IoPulseOutline,
  IoSettingsOutline,
  IoSparklesOutline,
} from "react-icons/io5";
import { PiFireSimpleBold, PiTerminalWindowBold } from "react-icons/pi";
import { RiAlarmWarningLine } from "react-icons/ri";
import { useLocation } from "react-router-dom";
import useSidebarStore from "../../hooks/sidebar.store";
import { useCurrentTeam } from "../../hooks/team.query";
import { useCurrentUser } from "../../hooks/user.query";
import { Restrict, Role } from "../Restrict";
import { SidebarVariant, SidebarVariantContext } from "./sidebarContext";
import SidebarContainer from "./SidebarContainer";
import SidebarHeader from "./SidebarHeader";
import SidebarItem from "./SidebarItem";
import SidebarSection from "./SidebarSection";
import SidebarSpacer from "./SidebarSpacer";

interface SidebarProps {
  variant?: SidebarVariant;
}

interface NavigationItem {
  to: string;
  text: string;
  icon: ReactNode;
  iconColor?: string;
  /** Hide the item from users below this team role. */
  minRole?: Role;
}

interface NavigationSection {
  label: string;
  items: NavigationItem[];
}

const Sidebar: FunctionComponent<SidebarProps> = ({ variant = "rail" }) => {
  const { data: user, isPending: isLoadingUser } = useCurrentUser();
  const { data: team, isPending: isLoadingTeam } = useCurrentTeam();
  const { collapsed, setCollapsed } = useSidebarStore();
  const location = useLocation();

  const isMonitoringSubdomain =
    typeof window !== "undefined" &&
    (window.location.hostname.startsWith("monitoring") ||
      (!window.location.hostname.startsWith("my") &&
        (location.pathname.startsWith("/monitors") ||
          location.pathname.startsWith("/alerting") ||
          location.pathname.startsWith("/incidents") ||
          location.pathname.startsWith("/maintenance") ||
          location.pathname.startsWith("/reports"))));

  const hubNavigation: NavigationSection[] = [
    {
      label: "Opsway Platform",
      items: [
        {
          to: "/",
          text: "Suite Overview",
          icon: <IoAppsOutline />,
          iconColor: "semantic.pages",
        },
        {
          to: "/agents",
          text: "Autonomous Agents",
          icon: <IoSparklesOutline />,
          iconColor: "warning.400",
        },
        {
          to: "/services",
          text: "Service Catalog",
          icon: <IoLayersOutline />,
          iconColor: "semantic.maintenance",
        },
      ],
    },
    {
      label: "Products",
      items: [
        {
          to: "https://monitoring.opsway.eu",
          text: "Monitoring ↗",
          icon: <IoPulseOutline />,
          iconColor: "semantic.monitors",
        },
        {
          to: "https://logs.opsway.eu",
          text: "Log Search ↗",
          icon: <PiTerminalWindowBold />,
          iconColor: "info",
        },
      ],
    },
    {
      label: "Suite Governance",
      items: [
        {
          to: "/team",
          text: "Team & Access",
          icon: <AiOutlineTeam />,
          iconColor: "semantic.team",
        },
        {
          to: "/settings/billing",
          text: "Suite Billing",
          icon: <IoCardOutline />,
          iconColor: "warning.400",
          minRole: Role.ADMIN,
        },
        {
          to: "/account",
          text: "Account & Security",
          icon: <IoPersonOutline />,
          iconColor: "text.secondary",
        },
        {
          to: "/settings",
          text: "Platform Settings",
          icon: <IoSettingsOutline />,
          iconColor: "semantic.team",
          minRole: Role.ADMIN,
        },
      ],
    },
  ];

  const monitoringNavigation: NavigationSection[] = [
    {
      label: "Opsway Platform",
      items: [
        {
          to: "https://my.opsway.eu",
          text: "← Opsway Hub",
          icon: <IoArrowBack />,
          iconColor: "semantic.pages",
        },
      ],
    },
    {
      label: "Monitoring",
      items: [
        {
          to: "/monitors",
          text: "Monitors",
          icon: <IoPulseOutline />,
          iconColor: "semantic.monitors",
        },
        {
          to: "/services",
          text: "Services",
          icon: <IoLayersOutline />,
          iconColor: "semantic.maintenance",
        },
        {
          to: "/alerting",
          text: "Alerting",
          icon: <RiAlarmWarningLine />,
          iconColor: "semantic.alerting",
        },
        {
          to: "/incidents",
          text: "Incidents",
          icon: <PiFireSimpleBold />,
          iconColor: "semantic.incidents",
        },
        {
          to: "/maintenance",
          text: "Maintenance",
          icon: <IoBuildOutline />,
          iconColor: "semantic.maintenance",
        },
        {
          to: "/status-pages",
          text: "Status Pages",
          icon: <GoBrowser />,
          iconColor: "semantic.pages",
        },
        {
          to: "/reports",
          text: "Reports",
          icon: <GoGraph />,
          iconColor: "semantic.reports",
        },
      ],
    },
    {
      label: "Opsway Suite",
      items: [
        {
          to: "https://logs.opsway.eu",
          text: "Log Search ↗",
          icon: <PiTerminalWindowBold />,
          iconColor: "info",
        },
        {
          to: "https://my.opsway.eu/agents",
          text: "Autonomous Agents ↗",
          icon: <IoSparklesOutline />,
          iconColor: "warning.400",
        },
      ],
    },
    {
      label: "Organisation",
      items: [
        {
          to: "/team",
          text: "Team",
          icon: <AiOutlineTeam />,
          iconColor: "semantic.team",
        },
        {
          to: "/settings",
          text: "Settings",
          icon: <IoSettingsOutline />,
          iconColor: "semantic.team",
          minRole: Role.ADMIN,
        },
      ],
    },
  ];

  const currentNav = isMonitoringSubdomain ? monitoringNavigation : hubNavigation;

  return (
    <SidebarVariantContext.Provider value={variant}>
      <SidebarContainer>
        <SidebarHeader
          name={user?.displayName}
          picture={user?.avatarUrl}
          loading={isLoadingUser || isLoadingTeam}
          teamDisplayName={team?.displayName || team?.name}
        />

        {currentNav.map((section) => (
          <SidebarSection key={section.label} label={section.label}>
            {section.items.map(({ minRole, ...item }) =>
              minRole ? (
                <Restrict key={item.to} min={minRole}>
                  <SidebarItem {...item} />
                </Restrict>
              ) : (
                <SidebarItem key={item.to} {...item} />
              ),
            )}
          </SidebarSection>
        ))}

        <SidebarSpacer />

        {variant === "rail" && (
          <SidebarItem
            onClick={() => setCollapsed(!collapsed)}
            text={collapsed ? "Expand" : "Collapse"}
            icon={collapsed ? <IoArrowForward /> : <IoArrowBack />}
          />
        )}
      </SidebarContainer>
    </SidebarVariantContext.Provider>
  );
};

export default Sidebar;

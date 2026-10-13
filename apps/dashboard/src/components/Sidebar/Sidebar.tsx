import { FunctionComponent, ReactNode } from "react";
import { AiOutlineTeam } from "react-icons/ai";
import { GoBrowser, GoGraph } from "react-icons/go";
import {
  IoArrowBack,
  IoArrowForward,
  IoBuildOutline,
  IoPulseOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { PiFireSimpleBold } from "react-icons/pi";
import { RiAlarmWarningLine } from "react-icons/ri";
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

const navigation: NavigationSection[] = [
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
        text: "Pages",
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

const Sidebar: FunctionComponent<SidebarProps> = ({ variant = "rail" }) => {
  const { data: user, isPending: isLoadingUser } = useCurrentUser();
  const { data: team, isPending: isLoadingTeam } = useCurrentTeam();
  const { collapsed, setCollapsed } = useSidebarStore();

  return (
    <SidebarVariantContext.Provider value={variant}>
      <SidebarContainer>
        <SidebarHeader
          name={user?.displayName}
          picture={user?.avatarUrl}
          loading={isLoadingUser || isLoadingTeam}
          teamDisplayName={team?.displayName || team?.name}
        />

        {navigation.map((section) => (
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

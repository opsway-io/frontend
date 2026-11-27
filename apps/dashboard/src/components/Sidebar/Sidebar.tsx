import { FunctionComponent, ReactNode } from "react";
import { AiOutlineTeam } from "react-icons/ai";
import { GoBrowser, GoGraph } from "react-icons/go";
import {
  IoAppsOutline,
  IoArrowBack,
  IoArrowForward,
  IoBookOutline,
  IoBuildOutline,
  IoCardOutline,
  IoFlagOutline,
  IoGitBranchOutline,
  IoGitNetworkOutline,
  IoLayersOutline,
  IoPersonOutline,
  IoPulseOutline,
  IoSearchOutline,
  IoSettingsOutline,
  IoSparklesOutline,
  IoTerminalOutline,
} from "react-icons/io5";
import { PiFireSimpleBold, PiTerminalWindowBold } from "react-icons/pi";
import { RiAlarmWarningLine } from "react-icons/ri";
import { useLocation } from "react-router-dom";
import { ProductSlug } from "../../api/endpoints/platform";
import { usePlatformProducts } from "../../hooks/platform.query";
import useSidebarStore from "../../hooks/sidebar.store";
import { Restrict, Role } from "../Restrict";
import { SidebarVariant, SidebarVariantContext } from "./sidebarContext";
import SidebarContainer from "./SidebarContainer";
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
  end?: boolean;
  /** Hide the item from users below this team role. */
  minRole?: Role;
  /** Hide the item if this product is disabled for the current user. */
  product?: ProductSlug;
  /** Only show this item to platform owners. */
  platformOwnerOnly?: boolean;
}

interface NavigationSection {
  label: string;
  items: NavigationItem[];
}

const Sidebar: FunctionComponent<SidebarProps> = ({ variant = "rail" }) => {
  const { collapsed, setCollapsed } = useSidebarStore();
  const { data: platformProducts } = usePlatformProducts();
  const location = useLocation();
  const isPlatformOwner = platformProducts?.isPlatformOwner ?? false;
  const isProductVisible = (product?: ProductSlug) => {
    if (!product) return true;
    if (!platformProducts?.products) return true;
    return platformProducts.products[product] !== false;
  };

  const isAgentContextHost =
    typeof window !== "undefined" &&
    (window.location.hostname.startsWith("agent-context") ||
      window.location.hostname.startsWith("pantomath"));

  const isMonitoringHost =
    typeof window !== "undefined" &&
    window.location.hostname.startsWith("monitoring");

  const isAgentContextSubdomain =
    isAgentContextHost ||
    location.pathname.startsWith("/agent-context") ||
    location.pathname.startsWith("/pantomath") ||
    (typeof window !== "undefined" &&
      !window.location.hostname.startsWith("my") &&
      (location.pathname === "/products" ||
        location.pathname === "/mcp" ||
        location.pathname === "/info/agent-context" ||
        location.pathname === "/info/pantomath"));

  const isMonitoringSubdomain =
    isMonitoringHost ||
    (typeof window !== "undefined" &&
      !window.location.hostname.startsWith("my") &&
      (location.pathname.startsWith("/monitors") ||
        location.pathname.startsWith("/alerting") ||
        location.pathname.startsWith("/incidents") ||
        location.pathname.startsWith("/maintenance") ||
        location.pathname.startsWith("/status-pages") ||
        location.pathname.startsWith("/reports") ||
        location.pathname === "/info/monitoring"));

  const hubNavigation: NavigationSection[] = [
    {
      label: "Opsway Platform",
      items: [
        {
          to: "/",
          end: true,
          text: "Suite Overview",
          icon: <IoAppsOutline />,
          iconColor: "semantic.pages",
        },
        {
          to: "/services",
          text: "Service Catalog",
          icon: <IoLayersOutline />,
          iconColor: "semantic.maintenance",
        },
        {
          to: "/info",
          text: "Product Info & Guides",
          icon: <IoBookOutline />,
          iconColor: "info",
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
          product: "monitoring",
        },
        {
          to: "https://logs.opsway.eu",
          text: "Log Search ↗",
          icon: <PiTerminalWindowBold />,
          iconColor: "info",
          product: "log_search",
        },
        {
          to: "https://agent-context.opsway.eu",
          text: "Agent Context ↗",
          icon: <IoGitNetworkOutline />,
          iconColor: "#2dd4bf",
          product: "pantomath",
        },
        {
          to: "/agents",
          text: "Autonomous Agents",
          icon: <IoSparklesOutline />,
          iconColor: "warning.400",
          product: "managed_agent",
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
          text: "Usage & Billing",
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
          end: true,
          text: "Platform Settings",
          icon: <IoSettingsOutline />,
          iconColor: "semantic.team",
          minRole: Role.ADMIN,
        },
        {
          to: "/platform/products",
          text: "Product Rollout",
          icon: <IoFlagOutline />,
          iconColor: "warning.400",
          platformOwnerOnly: true,
        },
      ],
    },
  ];

  // Shared Organisation section kept identical across all product sub-sites
  // (monitoring.opsway.eu, agent-context.opsway.eu, and logs.opsway.eu).
  const productOrganisationSection: NavigationSection = {
    label: "Organisation",
    items: [
      {
        to: "/settings/billing",
        text: "Usage & Billing",
        icon: <IoCardOutline />,
        iconColor: "warning.400",
        minRole: Role.ADMIN,
      },
      {
        to: "/team",
        text: "Team",
        icon: <AiOutlineTeam />,
        iconColor: "semantic.team",
      },
      {
        to: "/settings",
        end: true,
        text: "Settings",
        icon: <IoSettingsOutline />,
        iconColor: "semantic.team",
        minRole: Role.ADMIN,
      },
    ],
  };

  const monitoringNavigation: NavigationSection[] = [
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
        {
          to: isMonitoringHost ? "/info" : "/info/monitoring",
          text: "Product Info & Guide",
          icon: <IoBookOutline />,
          iconColor: "semantic.monitors",
        },
      ],
    },
    productOrganisationSection,
  ];

  const agentContextNavigation: NavigationSection[] = [
    {
      label: "Agent Context",
      items: [
        {
          to: isAgentContextHost ? "/" : "/agent-context",
          end: true,
          text: "Context Playground",
          icon: <IoSearchOutline />,
          iconColor: "#2dd4bf",
        },
        {
          to: "/products",
          text: "Indexed Products",
          icon: <IoGitBranchOutline />,
          iconColor: "#2dd4bf",
        },
        {
          to: "/mcp",
          text: "MCP & IDE Setup",
          icon: <IoTerminalOutline />,
          iconColor: "info",
        },
        {
          to: isAgentContextHost ? "/info" : "/info/agent-context",
          text: "Product Info & Guide",
          icon: <IoBookOutline />,
          iconColor: "#2dd4bf",
        },
      ],
    },
    productOrganisationSection,
  ];

  const currentNav = isAgentContextSubdomain
    ? agentContextNavigation
    : isMonitoringSubdomain
      ? monitoringNavigation
      : hubNavigation;

  return (
    <SidebarVariantContext.Provider value={variant}>
      <SidebarContainer>
        {currentNav.map((section) => {
          const visibleItems = section.items.filter((item) => {
            if (item.platformOwnerOnly && !isPlatformOwner) return false;
            if (!isProductVisible(item.product)) return false;
            return true;
          });
          if (visibleItems.length === 0) return null;
          return (
            <SidebarSection key={section.label} label={section.label}>
              {visibleItems.map(({ minRole, product: _p, platformOwnerOnly: _o, ...item }) =>
                minRole ? (
                  <Restrict key={item.to} min={minRole}>
                    <SidebarItem {...item} />
                  </Restrict>
                ) : (
                  <SidebarItem key={item.to} {...item} />
                ),
              )}
            </SidebarSection>
          );
        })}

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

"use client";

import React from "react";
import { Divider, Tooltip, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BarChartIcon from "@mui/icons-material/BarChart";
import CodeIcon from "@mui/icons-material/Code";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ListIcon from "@mui/icons-material/List";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import StopIcon from "@mui/icons-material/Stop";

interface SidebarProps {
  variant?: "rail" | "drawer";
  collapsed: boolean;
  onToggleCollapsed: () => void;
  viewMode: "logs" | "dashboard" | "guide" | "billing" | "team";
  isLive: boolean;
  onSelectLogs: () => void;
  onSelectHistogram: () => void;
  onSelectGuide: () => void;
  onSelectBilling: () => void;
  onSelectTeam: () => void;
  onToggleLive: () => void;
  onNavigate?: () => void;
}

interface SidebarItemProps {
  text: string;
  icon: React.ReactNode;
  active?: boolean;
  activeIconColor?: string;
  href?: string;
  onClick?: () => void;
  collapsed: boolean;
}

function SidebarItem({
  text,
  icon,
  active = false,
  activeIconColor = "#5185a5",
  href,
  onClick,
  collapsed,
}: SidebarItemProps) {
  const baseClass = `w-full flex items-center min-h-[36px] gap-2.5 px-2.5 rounded-[8px] text-[14px] font-medium whitespace-nowrap transition-colors duration-100 cursor-pointer no-underline ${
    collapsed ? "justify-center" : "justify-start"
  } ${
    active
      ? "bg-white/[0.06] text-[#e7e9ee]"
      : "text-[#a3aab7] hover:bg-white/[0.06] hover:text-[#e7e9ee]"
  }`;

  const iconStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    color: active ? activeIconColor : "inherit",
    transition: "color 120ms",
  };

  const inner = (
    <>
      <span style={iconStyle}>{icon}</span>
      {!collapsed && <span className="truncate">{text}</span>}
    </>
  );

  const element = href ? (
    <a href={href} onClick={onClick} className={baseClass}>
      {inner}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={baseClass}>
      {inner}
    </button>
  );

  return (
    <Tooltip title={collapsed ? text : ""} placement="right">
      {element}
    </Tooltip>
  );
}

function SidebarSection({
  label,
  collapsed,
  children,
}: {
  label: string;
  collapsed: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      {collapsed ? (
        <Divider sx={{ my: 1, borderColor: "rgba(255, 255, 255, 0.08)" }} />
      ) : (
        <Typography
          noWrap
          sx={{
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontWeight: 600,
            color: "#7c8494",
            px: 1.25,
            pt: 1.5,
            pb: 0.5,
          }}
        >
          {label}
        </Typography>
      )}
      {children}
    </>
  );
}

/**
 * Standalone Opsway Log Search sidebar.
 * Suite switching and account controls live in the shared @opsway/shell OpswayTopBar.
 */
export function Sidebar({
  variant = "rail",
  collapsed,
  onToggleCollapsed,
  viewMode,
  isLive,
  onSelectLogs,
  onSelectHistogram,
  onSelectGuide,
  onSelectBilling,
  onSelectTeam,
  onToggleLive,
  onNavigate,
}: SidebarProps) {
  const isCollapsed = variant === "drawer" ? false : collapsed;

  return (
    <aside
      className={
        variant === "drawer"
          ? "flex flex-col gap-1 w-full h-full overflow-y-auto overflow-x-hidden bg-[#191c22] px-3 pt-3 pb-4 select-none"
          : `hidden md:flex flex-col gap-1 shrink-0 h-full overflow-y-auto overflow-x-hidden bg-[#191c22] border-r border-white/[0.08] px-3 pt-3 pb-4 select-none transition-[width] duration-150 ${
              isCollapsed ? "w-[64px]" : "w-[232px]"
            }`
      }
    >
      {/* Section 1: Log Search (canonical 2-section product sub-site layout) */}
      <SidebarSection label="Log Search" collapsed={isCollapsed}>
        <SidebarItem
          text="Log Records"
          icon={<ListIcon sx={{ fontSize: 18 }} />}
          active={viewMode === "logs" && !isLive}
          activeIconColor="#5185a5"
          collapsed={isCollapsed}
          onClick={() => {
            onSelectLogs();
            onNavigate?.();
          }}
        />
        <SidebarItem
          text="Histogram"
          icon={<BarChartIcon sx={{ fontSize: 18 }} />}
          active={viewMode === "dashboard" && !isLive}
          activeIconColor="#5185a5"
          collapsed={isCollapsed}
          onClick={() => {
            onSelectHistogram();
            onNavigate?.();
          }}
        />
        <SidebarItem
          text={isLive ? "Live Streaming" : "Live Tail"}
          icon={
            isLive ? (
              <StopIcon sx={{ fontSize: 18 }} />
            ) : (
              <PlayArrowIcon sx={{ fontSize: 18 }} />
            )
          }
          active={isLive}
          activeIconColor="#79ab5d"
          collapsed={isCollapsed}
          onClick={() => {
            onToggleLive();
            onNavigate?.();
          }}
        />
        <SidebarItem
          href="/mcp"
          text="MCP Endpoint"
          icon={<CodeIcon sx={{ fontSize: 18 }} />}
          collapsed={isCollapsed}
          onClick={onNavigate}
        />
        <SidebarItem
          text="Product Info & Guide"
          icon={<MenuBookOutlinedIcon sx={{ fontSize: 18 }} />}
          active={viewMode === "guide" && !isLive}
          activeIconColor="#5185a5"
          collapsed={isCollapsed}
          onClick={() => {
            onSelectGuide();
            onNavigate?.();
          }}
        />
      </SidebarSection>

      {/* Section 2: Organisation (shared structure across all product sub-sites) */}
      <SidebarSection label="Organisation" collapsed={isCollapsed}>
        <SidebarItem
          text="Usage & Billing"
          icon={<CreditCardIcon sx={{ fontSize: 18 }} />}
          active={viewMode === "billing" && !isLive}
          activeIconColor="#f4ac45"
          collapsed={isCollapsed}
          onClick={() => {
            onSelectBilling();
            onNavigate?.();
          }}
        />
        <SidebarItem
          text="Team"
          icon={<GroupOutlinedIcon sx={{ fontSize: 18 }} />}
          active={viewMode === "team" && !isLive}
          activeIconColor="#5185a5"
          collapsed={isCollapsed}
          onClick={() => {
            onSelectTeam();
            onNavigate?.();
          }}
        />
        <SidebarItem
          href="https://my.opsway.eu/settings"
          text="Settings"
          icon={<SettingsOutlinedIcon sx={{ fontSize: 18 }} />}
          collapsed={isCollapsed}
          onClick={onNavigate}
        />
      </SidebarSection>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Collapse / Expand toggle */}
      {variant === "rail" && (
        <SidebarItem
          onClick={onToggleCollapsed}
          text={isCollapsed ? "Expand" : "Collapse"}
          icon={
            isCollapsed ? (
              <ArrowForwardIcon sx={{ fontSize: 18 }} />
            ) : (
              <ArrowBackIcon sx={{ fontSize: 18 }} />
            )
          }
          collapsed={isCollapsed}
        />
      )}
    </aside>
  );
}

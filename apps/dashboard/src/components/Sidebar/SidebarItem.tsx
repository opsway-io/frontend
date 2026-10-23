import { ListItemButton, ListItemDecorator, Tooltip } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { FunctionComponent, ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useSidebarCollapsed } from "./sidebarContext";

interface SidebarItemProps {
  text: string;
  icon: ReactNode;
  /** Theme palette path for the active icon colour, e.g. `semantic.monitors`. */
  iconColor?: string;
  /** Route to navigate to. Items without a route act as buttons. */
  to?: string;
  onClick?: () => void;
}

const SidebarItem: FunctionComponent<SidebarItemProps> = ({
  text,
  icon,
  iconColor,
  to,
  onClick,
}) => {
  const collapsed = useSidebarCollapsed();

  const sx: SxProps = {
    width: "100%",
    flex: "none",
    minHeight: 36,
    gap: 1.25,
    px: 1.25,
    fontSize: "sm",
    fontWeight: 500,
    color: "text.secondary",
    justifyContent: collapsed ? "center" : "flex-start",
    textDecoration: "none",
    whiteSpace: "nowrap",

    "& svg": {
      fontSize: 18,
      flexShrink: 0,
      transition: "color 120ms",
    },

    "&:hover": {
      color: "text.primary",
    },

    "&.active": {
      color: "text.primary",
      backgroundColor: "neutral.softBg",

      svg: {
        color: iconColor
          ? `var(--joy-palette-${iconColor.replace(/\./g, "-")})`
          : "success.400",
      },
    },
  };

  const content = (
    <>
      <ListItemDecorator sx={{ minInlineSize: "auto", color: "inherit" }}>
        {icon}
      </ListItemDecorator>
      {!collapsed && <span>{text}</span>}
    </>
  );

  return (
    <Tooltip title={collapsed ? text : ""} placement="right">
      {to ? (
        to.startsWith("http") ? (
          <ListItemButton
            sx={sx}
            component="a"
            href={to}
            target="_blank"
            rel="noopener noreferrer"
          >
            {content}
          </ListItemButton>
        ) : (
          <ListItemButton sx={sx} component={NavLink} to={to}>
            {content}
          </ListItemButton>
        )
      ) : (
        <ListItemButton sx={sx} onClick={onClick}>
          {content}
        </ListItemButton>
      )}
    </Tooltip>
  );
};

export default SidebarItem;

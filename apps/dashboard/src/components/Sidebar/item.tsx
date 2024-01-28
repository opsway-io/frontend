import { Button, ButtonProps, SxProps, Theme, Tooltip } from "@mui/material";
import { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";
import useSidebarStore from "../../hooks/sidebar.store";

interface SidebarItemProps extends ButtonProps {
  text?: string;
  icon?: React.ReactNode;
  iconColor?: string;
  to?: string;
  link?: string;

  onClick?: () => void;
  onMouseEnter?: () => void;
}

const SidebarItem: FunctionComponent<SidebarItemProps> = (props) => {
  const { collapsed } = useSidebarStore();

  const sx: SxProps<Theme> = {
    color: (t) => t.palette.text.primary,

    "&.active": {
      backgroundColor: (t) => t.palette.action.selected,

      svg: {
        color: (t) => props.iconColor || t.palette.success.main,
      },
    },
    width: "100%",
    justifyContent: collapsed ? "center" : "left",
    fontSize: collapsed ? 24 : null,
    ...props.sx,
  };

  if (props.to) {
    return (
      <Tooltip
        title={collapsed && props.text ? props.text : ""}
        placement="right"
      >
        <Button
          sx={sx}
          component={NavLink}
          to={props.to || ""}
          startIcon={collapsed ? null : props.icon}
          onMouseEnter={props.onMouseEnter}
        >
          {collapsed && props.icon}
          {!collapsed && <span>{props.text}</span>}
        </Button>
      </Tooltip>
    );
  }

  if (props.link) {
    return (
      <Tooltip
        title={collapsed && props.text ? props.text : ""}
        placement="right"
      >
        <Button
          sx={sx}
          startIcon={collapsed ? null : props.icon}
          onMouseEnter={props.onMouseEnter}
          onClick={() => {
            window.open(props.link || "", "_blank");
          }}
        >
          {collapsed && props.icon}
          {!collapsed && <span>{props.text}</span>}
        </Button>
      </Tooltip>
    );
  }

  return (
    <Tooltip
      title={collapsed && props.text ? props.text : ""}
      placement="right"
    >
      <Button
        sx={sx}
        onClick={props.onClick}
        startIcon={collapsed ? null : props.icon}
        onMouseEnter={props.onMouseEnter}
      >
        {collapsed && props.icon}
        {!collapsed && <span>{props.text}</span>}
      </Button>
    </Tooltip>
  );
};

export default SidebarItem;

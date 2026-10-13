import { Sheet, styled } from "@mui/joy";
import { FunctionComponent, ReactNode, useContext } from "react";
import { SidebarVariantContext, useSidebarCollapsed } from "./sidebarContext";

interface SidebarContainerProps {
  children: ReactNode;
}

const Container = styled(Sheet)(({ theme }) => ({
  zIndex: theme.vars.zIndex.popup - 1,
  display: "flex",
  gap: theme.spacing(0.5),
  flexDirection: "column",
  flexShrink: 0,
  height: "100%",
  overflowY: "auto",
  overflowX: "hidden",
  backgroundColor: theme.vars.palette.background.surface,
  borderRight: `1px solid ${theme.vars.palette.divider}`,

  transition: "width 150ms ease",

  "& *": {
    "@keyframes fadeIn": {
      "0%": {
        opacity: 0,
      },
      "100%": {
        opacity: 1,
      },
    },

    animationName: "fadeIn",
    animationDuration: "100ms",
    animationDelay: "100ms",
    animationFillMode: "both",
  },

  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(1.5),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),

    width: 232,

    "&.collapsed": {
      width: 64,
    },
  },

  [theme.breakpoints.down("md")]: {
    display: "none",
  },

  "&.drawer": {
    display: "flex",
    width: "100%",
    border: "none",
    padding: theme.spacing(1.5),
    paddingTop: theme.spacing(2),
  },
}));

const SidebarContainer: FunctionComponent<SidebarContainerProps> = (props) => {
  const collapsed = useSidebarCollapsed();
  const variant = useContext(SidebarVariantContext);

  return (
    <Container
      className={variant === "drawer" ? "drawer" : collapsed ? "collapsed" : ""}
    >
      {props.children}
    </Container>
  );
};

export default SidebarContainer;

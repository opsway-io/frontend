import { Card, styled } from "@mui/material";
import { FunctionComponent } from "react";
import useSidebarStore from "../../hooks/sidebar.store";

interface SidebarContainerProps {
  children: React.ReactNode | React.ReactNode[];
}

const Container = styled(Card)(({ theme }) => ({
  zIndex: theme.zIndex.drawer,
  display: "flex",
  borderRadius: 0,
  gap: theme.spacing(1),
  flexDirection: "column",
  border: "none",

  transition: theme.transitions.create(["width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.standard,
  }),

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
    animationDuration: `${theme.transitions.duration.standard}ms`,
    animationDelay: `${theme.transitions.duration.standard}ms`,
    animationFillMode: "both",
  },

  [theme.breakpoints.up("md")]: {
    alignItems: "center",
    padding: theme.spacing(2),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    background: "transparent",

    width: 200,

    "&.collapsed": {
      width: 50,
    },
  },

  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const SidebarContainer: FunctionComponent<SidebarContainerProps> = (props) => {
  const { collapsed } = useSidebarStore();

  return (
    <Container className={collapsed ? "collapsed" : ""}>
      {props.children}
    </Container>
  );
};

export default SidebarContainer;

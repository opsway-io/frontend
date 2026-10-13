import { Drawer, IconButton, Sheet, styled } from "@mui/joy";
import { FunctionComponent, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";

const MobileBar = styled(Sheet)(({ theme }) => ({
  display: "none",
  flex: "none",
  alignItems: "center",
  justifyContent: "space-between",
  height: 56,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(1),
  backgroundColor: theme.vars.palette.background.surface,
  borderBottom: `1px solid ${theme.vars.palette.divider}`,

  [theme.breakpoints.down("md")]: {
    display: "flex",
  },
}));

/** Top bar with a drawer-based sidebar, shown below the `md` breakpoint. */
const MobileNavigation: FunctionComponent = () => {
  const { pathname } = useLocation();
  // The drawer is open for the path it was opened on, so navigating closes it.
  const [openedOnPath, setOpenedOnPath] = useState<string | null>(null);
  const open = openedOnPath === pathname;

  return (
    <>
      <MobileBar>
        <Link to="/monitors" style={{ display: "flex" }}>
          <img src="/img/logo.svg" alt="opsway" height={20} />
        </Link>
        <IconButton
          variant="plain"
          color="neutral"
          aria-label="Open navigation"
          onClick={() => setOpenedOnPath(pathname)}
        >
          <IoMenu size={20} />
        </IconButton>
      </MobileBar>

      <Drawer
        open={open}
        onClose={() => setOpenedOnPath(null)}
        size="sm"
        slotProps={{
          content: {
            sx: { bgcolor: "background.surface", width: 280 },
          },
        }}
      >
        <Sidebar variant="drawer" />
      </Drawer>
    </>
  );
};

export default MobileNavigation;

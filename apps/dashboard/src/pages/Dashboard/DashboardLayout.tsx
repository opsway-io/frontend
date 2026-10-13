import { Box, Skeleton, styled } from "@mui/joy";
import { FunctionComponent, Suspense } from "react";
import { Outlet } from "react-router-dom";
import Container from "../../components/Container/Container";
import DelayedVisibility from "../../components/DelayedVisibility/DelayedVisibility";
import Sidebar from "../../components/Sidebar/Sidebar";
import MobileNavigation from "./MobileNavigation";

const Layout = styled("div")(({ theme }) => ({
  display: "flex",
  height: "100%",
  width: "100%",
  minWidth: 0,

  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
  },

  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

const Main = styled("main")(() => ({
  overflow: "auto",
  flex: 1,
  minWidth: 0,
  height: "100%",
  display: "flex",
}));

const Navigation = styled("nav")(({ theme }) => ({
  display: "flex",
  flex: "none",
  height: "100%",

  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const PageSkeleton: FunctionComponent = () => (
  <DelayedVisibility>
    <Container>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Skeleton
          variant="rectangular"
          width={200}
          height={40}
          sx={{ borderRadius: "md" }}
        />
        <Skeleton
          variant="rectangular"
          height={200}
          sx={{ borderRadius: "lg" }}
        />
        <Skeleton
          variant="rectangular"
          height={200}
          sx={{ borderRadius: "lg" }}
        />
      </Box>
    </Container>
  </DelayedVisibility>
);

/** Authenticated app shell: sidebar navigation plus the routed page. */
const DashboardLayout: FunctionComponent = () => {
  return (
    <Layout>
      <MobileNavigation />
      <Navigation>
        <Sidebar />
      </Navigation>
      <Main>
        <Suspense fallback={<PageSkeleton />}>
          <Outlet />
        </Suspense>
      </Main>
    </Layout>
  );
};

export default DashboardLayout;

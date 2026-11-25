import { Box, Drawer, Skeleton, styled } from "@mui/joy";
import { OpswayAppId, OpswayTopBar } from "@opsway/shell";
import { FunctionComponent, Suspense, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Container from "../../components/Container/Container";
import DelayedVisibility from "../../components/DelayedVisibility/DelayedVisibility";
import Sidebar from "../../components/Sidebar/Sidebar";
import useAuthenticationStore from "../../hooks/authentication.store";
import { useCurrentTeam } from "../../hooks/team.query";
import { useCurrentUser, useUserTeams } from "../../hooks/user.query";

const Shell = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "100%",
  minWidth: 0,
}));

const Body = styled("div")(() => ({
  display: "flex",
  flexDirection: "row",
  flex: 1,
  minHeight: 0,
  minWidth: 0,
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

const isMonitoringHost =
  typeof window !== "undefined" &&
  window.location.hostname.startsWith("monitoring");

/** Authenticated app shell: global OpswayTopBar, standalone sidebar rail, and routed page. */
const DashboardLayout: FunctionComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authentication = useAuthenticationStore();
  const { data: user } = useCurrentUser();
  const { data: team } = useCurrentTeam();
  const { data: userTeams } = useUserTeams(authentication.currentUserId);

  // Track mobile drawer by pathname so navigating automatically closes it.
  const [openedOnPath, setOpenedOnPath] = useState<string | null>(null);
  const mobileDrawerOpen = openedOnPath === location.pathname;

  const isMonitoringContext =
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

  const currentApp: OpswayAppId = isMonitoringContext
    ? "monitoring"
    : location.pathname.startsWith("/agents")
      ? "agents"
      : "hub";

  const guideHref =
    currentApp === "monitoring"
      ? "/info/monitoring"
      : currentApp === "agents"
        ? "/info/agents"
        : "/info/hub";

  const handleSelectTeam = (teamId: number | string) => {
    authentication.setCurrentTeamID(Number(teamId));
    navigate(isMonitoringHost ? "/monitors" : "/", { replace: true });
  };

  return (
    <Shell>
      <OpswayTopBar
        currentApp={currentApp}
        brandHref={isMonitoringHost ? "/monitors" : "/"}
        guideHref={guideHref}
        onNavigate={(path) => navigate(path)}
        userName={user?.displayName}
        userSubtitle={team?.displayName || team?.name}
        avatarUrl={user?.avatarUrl}
        isAuthenticated={authentication.isAuthenticated()}
        teams={userTeams?.teams?.map((t) => ({
          id: t.id,
          name: t.displayName || t.name,
        }))}
        currentTeamId={authentication.currentTeamId}
        onSelectTeam={handleSelectTeam}
        onCreateTeam={() => navigate("/login/team/register")}
        onAccountSettings={() => navigate("/account")}
        onLogout={() => authentication.logOut()}
        onOpenMobileMenu={() => setOpenedOnPath(location.pathname)}
      />

      <Drawer
        open={mobileDrawerOpen}
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

      <Body>
        <Navigation>
          <Sidebar />
        </Navigation>
        <Main>
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </Main>
      </Body>
    </Shell>
  );
};

export default DashboardLayout;

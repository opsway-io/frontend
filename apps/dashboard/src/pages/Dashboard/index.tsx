import { Box, Fade, Skeleton, styled } from "@mui/material";
import { FunctionComponent, Suspense } from "react";
import { Outlet } from "react-router-dom";
import Container from "../../components/Container";
import DelayedVisibility from "../../components/DelayedVisibility";
import Sidebar from "../../components/Sidebar";

const Layout = styled("div")(({ theme }) => ({
  display: "flex",
  height: "100%",
  width: "100%",

  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
  },

  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

const Main = styled("main")(({ theme }) => ({
  overflow: "auto",
  width: "100%",
  height: "100%",
  display: "flex",
}));

const Navigation = styled("nav")(({ theme }) => ({
  display: "flex",
  flex: 1,
}));

const DashboardBaseView: FunctionComponent = () => {
  return (
    <Layout>
      <Navigation>
        <Sidebar />
      </Navigation>
      <Main>
        <Suspense
          fallback={
            <DelayedVisibility>
              <Container>
                <Fade in={true}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: (t) => t.spacing(1),
                    }}
                  >
                    <Skeleton variant="rectangular" width="200" height="40px" />
                    <Skeleton variant="rectangular" height="200px" />
                    <Skeleton variant="rectangular" height="200px" />
                  </Box>
                </Fade>
              </Container>
            </DelayedVisibility>
          }
        >
          <Outlet />
        </Suspense>
      </Main>
    </Layout>
  );
};

export default DashboardBaseView;

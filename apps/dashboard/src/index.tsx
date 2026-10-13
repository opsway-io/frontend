import "@fontsource/inter";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { Box, CssBaseline, CssVarsProvider } from "@mui/joy";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "./hooks/queryClient";
import { Helmet } from "react-helmet";
import { SnackbarProvider } from "./components/Snackbar/SnackbarProvider";
import Routes from "./routes/routes";
import { installInterceptors } from "./api/installInterceptors";
import { JoyTheme } from "@opsway/ui";

installInterceptors();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <BrowserRouter>
    <QueryClientProvider client={getQueryClient()}>
      <CssVarsProvider
        theme={JoyTheme}
        defaultMode="dark"
        modeStorageKey="opsway-mode"
        disableNestedContext
      >
        <CssBaseline />
        <SnackbarProvider>
          <Helmet>
            <title>opsway</title>
          </Helmet>

          <Box
            sx={{
              display: "flex",
              flex: 1,
              minWidth: 0,
              backgroundColor: "background.body",
            }}
          >
            <Routes />
          </Box>
        </SnackbarProvider>
      </CssVarsProvider>
    </QueryClientProvider>
  </BrowserRouter>,
);

import ReactDOM from "react-dom/client";
import "./index.scss";
import reportWebVitals from "./reportWebVitals";
import { Box, ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "./hooks/client.query";
import { Helmet } from "react-helmet";
import { SnackbarProvider } from "./components/Snackbar";
import Routes from "./routes/routes";
import { DarkTheme } from "@opsway/ui";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <BrowserRouter>
    <QueryClientProvider client={getQueryClient()}>
      <ThemeProvider theme={DarkTheme}>
        <SnackbarProvider>
          <Helmet>
            <title>opsway</title>
          </Helmet>

          <Box
            sx={{
              display: "flex",
              flex: 1,
              backgroundColor: (t) => t.palette.background.default,
            }}
          >
            <Routes />
          </Box>
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </BrowserRouter>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

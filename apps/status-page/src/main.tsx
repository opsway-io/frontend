import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./main.scss";
import { Box, Fade, ThemeProvider } from "@mui/material";
import { DarkTheme } from "@opsway/ui";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Suspense fallback={""}>
      <ThemeProvider theme={DarkTheme}>
        <Box
          sx={{
            backgroundColor: "#080a0f", // Deep dark background
            backgroundImage: "radial-gradient(ellipse at top, rgba(29, 33, 40, 0.5) 0%, rgba(8, 10, 15, 1) 100%)",
            color: "text.primary",
            flex: 1,
            height: "100%",
            overflow: "auto",
            minHeight: "100vh",
          }}
        >
          <Fade in={true} timeout={250}>
            <Box>
              <App />
            </Box>
          </Fade>
        </Box>
        {/* <Builder /> */}
      </ThemeProvider>
    </Suspense>
  </React.StrictMode>,
);

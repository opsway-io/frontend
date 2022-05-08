import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import IncidentsView from "./views/Dashboard/Incidents";
import MaintenanceView from "./views/Dashboard/Maintenance";
import StatusPagesView from "./views/Dashboard/StatusPages";
import MonitorsView from "./views/Dashboard/Monitors";
import LoginView from "./views/Login";
import NotFoundView from "./views/Errors/404";
import TeamView from "./views/Dashboard/Team";
import Account from "./views/Dashboard/Account";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <Routes>
                    <Route path="/account" element={<Account />} />
                    <Route path="/monitors" element={<MonitorsView />} />
                    <Route path="/incidents" element={<IncidentsView />} />
                    <Route path="/maintenance" element={<MaintenanceView />} />
                    <Route path="/status-pages" element={<StatusPagesView />} />
                    <Route path="/people" element={<TeamView />} />

                    <Route path="/login" element={<LoginView />} />

                    <Route path="*" element={<NotFoundView />} />
                </Routes>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

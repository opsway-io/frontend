import { FunctionComponent } from "react";
import { Route, Routes as RouterRoutes } from "react-router-dom";
import DashboardView from "../views/Dashboard";
import AccountView from "../views/Dashboard/Account";
import IncidentsView from "../views/Dashboard/Incidents";
import MaintenanceView from "../views/Dashboard/Maintenance";
import MonitorsView from "../views/Dashboard/Monitors";
import PeopleView from "../views/Dashboard/People";
import ReportsView from "../views/Dashboard/Reports";
import StatusPagesView from "../views/Dashboard/StatusPages";
import NotFoundView from "../views/Errors/404";
import LoginView from "../views/Login";
import ProtectedRoute from "./ProtectedRoute";
import RedirectAuthenticatedRoute from "./RedirectAuthenticatedRoute";

const Routes: FunctionComponent = () => {
    return (
        <RouterRoutes>
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <DashboardView />
                    </ProtectedRoute>
                }
            >
                <Route path="/account" element={<AccountView />} />
                <Route path="/monitors" element={<MonitorsView />} />
                <Route path="/incidents" element={<IncidentsView />} />
                <Route path="/maintenance" element={<MaintenanceView />} />
                <Route path="/status-pages" element={<StatusPagesView />} />
                <Route path="/reports" element={<ReportsView />} />
                <Route path="/people" element={<PeopleView />} />
            </Route>

            <Route
                path="/login"
                element={
                    <RedirectAuthenticatedRoute>
                        <LoginView />
                    </RedirectAuthenticatedRoute>
                }
            />

            <Route path="*" element={<NotFoundView />} />
        </RouterRoutes>
    );
};

export default Routes;

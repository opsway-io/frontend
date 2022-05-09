import { FunctionComponent } from "react";
import { Route, Routes as RouterRoutes } from "react-router-dom";
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
                path="/account"
                element={
                    <ProtectedRoute>
                        <AccountView />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/monitors"
                element={
                    <ProtectedRoute>
                        <MonitorsView />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/incidents"
                element={
                    <ProtectedRoute>
                        <IncidentsView />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/maintenance"
                element={
                    <ProtectedRoute>
                        <MaintenanceView />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/status-pages"
                element={
                    <ProtectedRoute>
                        <StatusPagesView />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/reports"
                element={
                    <ProtectedRoute>
                        <ReportsView />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/people"
                element={
                    <ProtectedRoute>
                        <PeopleView />
                    </ProtectedRoute>
                }
            />

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

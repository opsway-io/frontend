import { FunctionComponent, lazy, Suspense } from "react";
import { Navigate, Route, Routes as RouterRoutes } from "react-router-dom";

import { Role } from "../components/Restrict";
import RestrictedRoute from "./RestrictedRoute";

import DashboardBaseView from "../pages/Dashboard";
import AuthenticationBaseView from "../pages/Authentication";

const ErrorsBaseView = lazy(() => import("../pages/Errors"));

const NotFoundView = lazy(() => import("../pages/Errors/404"));
const AccessRestrictedView = lazy(() => import("../pages/Errors/403"));

const LoginView = lazy(() => import("../pages/Authentication/Login"));
const OAuthLoginView = lazy(() => import("../pages/Authentication/OAuth"));
const RegisterAccountView = lazy(
  () => import("../pages/Authentication/UserRegister"),
);
const ResetPasswordView = lazy(
  () => import("../pages/Authentication/ResetPassword"),
);
const ForgotPasswordView = lazy(
  () => import("../pages/Authentication/ForgotPassword"),
);

const AccountView = lazy(() => import("../pages/Dashboard/Account"));
const AccountGeneralTabView = lazy(
  () => import("../pages/Dashboard/Account/tabs/General"),
);
const AccountSecurityTabView = lazy(
  () => import("../pages/Dashboard/Account/tabs/Security"),
);

const TeamView = lazy(() => import("../pages/Dashboard/Team"));
const TeamPeopleTabView = lazy(
  () => import("../pages/Dashboard/Team/tabs/People"),
);
const TeamInvitationsTabView = lazy(
  () => import("../pages/Dashboard/Team/tabs/Invitations"),
);
const TeamSettingsTabView = lazy(
  () => import("../pages/Dashboard/Team/tabs/Settings"),
);
const TeamSubscriptionTabView = lazy(
  () => import("../pages/Dashboard/Team/tabs/Subscription"),
);
const TeamSelectionView = lazy(
  () => import("../pages/Authentication/TeamSelection"),
);
const TeamRegisterView = lazy(
  () => import("../pages/Authentication/TeamRegister"),
);

const MonitorsView = lazy(() => import("../pages/Dashboard/Monitors"));
const MonitorDetailView = lazy(
  () => import("../pages/Dashboard/Monitors/Detail"),
);
const MonitorCreateView = lazy(
  () => import("../pages/Dashboard/Monitors/Create"),
);
const MonitorCheckView = lazy(
  () => import("../pages/Dashboard/Monitors/Check"),
);
const MonitorSettingsView = lazy(
  () => import("../pages/Dashboard/Monitors/Settings"),
);

const HeartbeatsView = lazy(() => import("../pages/Dashboard/Heartbeats"));

const MaintenanceView = lazy(() => import("../pages/Dashboard/Maintenance"));
const MaintenanceCreateView = lazy(
  () => import("../pages/Dashboard/Maintenance/Create"),
);
const MaintenanceDetailView = lazy(
  () => import("../pages/Dashboard/Maintenance/Detail"),
);

const IncidentsView = lazy(() => import("../pages/Dashboard/Incidents"));
const IncidentsDetailView = lazy(() => import("../pages/Dashboard/Incidents/Detail"));

const AlertingView = lazy(() => import("../pages/Dashboard/Alerting"));

const ChangelogView = lazy(() => import("../pages/Dashboard/Changelog"));
const ChangelogEntriesCreateView = lazy(
  () => import("../pages/Dashboard/Changelog/Entries/Create"),
);
const ChangelogEntriesView = lazy(
  () => import("../pages/Dashboard/Changelog/Entries"),
);
const ChangelogEntriesDetailView = lazy(
  () => import("../pages/Dashboard/Changelog/Entries/Detail"),
);

const StatusPagesView = lazy(() => import("../pages/Dashboard/StatusPages"));
const StatusPagesCreateView = lazy(
  () => import("../pages/Dashboard/StatusPages/Create"),
);
const StatusPagesDetailView = lazy(
  () => import("../pages/Dashboard/StatusPages/Detail"),
);

const ReportsView = lazy(() => import("../pages/Dashboard/Reports"));

const TeamAcceptInvitationView = lazy(
  () => import("../pages/Authentication/TeamAcceptInvitation"),
);

const Routes: FunctionComponent = () => {
  return (
    <Suspense>
      <RouterRoutes>
        <Route
          element={
            <RestrictedRoute authenticated>
              <DashboardBaseView />
            </RestrictedRoute>
          }
        >
          <Route index element={<Navigate to="monitors" replace />} />

          {/* Account */}
          <Route path="account" element={<AccountView />}>
            <Route path="general" element={<AccountGeneralTabView />} />
            <Route path="security" element={<AccountSecurityTabView />} />
            <Route path="" element={<Navigate to="general" replace />} />
          </Route>

          {/* Monitor */}
          <Route path="monitors">
            <Route index path="" element={<MonitorsView />} />
            <Route path=":id" element={<MonitorDetailView />} />
            <Route
              path=":id/settings"
              element={
                <RestrictedRoute minRole={Role.ADMIN}>
                  <MonitorSettingsView />
                </RestrictedRoute>
              }
            />
            <Route
              path=":monitorId/checks/:checkId"
              element={<MonitorCheckView />}
            />
            <Route path="create" element={<MonitorCreateView />} />
          </Route>

          {/* Heartbeats */}
          <Route path="heartbeats">
            <Route index path="" element={<HeartbeatsView />} />
          </Route>

          {/* Alerting */}
          <Route path="alerting">
            <Route index path="" element={<AlertingView />} />
          </Route>

          {/* Incidents  */}
          <Route path="incidents">
            <Route index path="" element={<IncidentsView />} />
            <Route path=":id" element={<IncidentsDetailView />} />
          </Route>

          {/* Maintenance */}
          <Route path="maintenance">
            <Route index path="" element={<MaintenanceView />} />
            <Route path=":id" element={<MaintenanceDetailView />} />
            <Route path="create" element={<MaintenanceCreateView />} />
          </Route>

          {/* Changelog */}
          <Route path="changelogs">
            <Route index path="" element={<ChangelogView />} />

            <Route path=":id">
              <Route index path="" element={<ChangelogEntriesView />} />
              <Route
                path="create"
                element={
                  <RestrictedRoute minRole={Role.ADMIN}>
                    <ChangelogEntriesCreateView />
                  </RestrictedRoute>
                }
              />
              <Route
                path="entries/:id"
                element={<ChangelogEntriesDetailView />}
              />
            </Route>
          </Route>

          {/* Status Pages */}
          <Route path="status-pages" element={<StatusPagesView />} />
          <Route path="status-pages/:id" element={<StatusPagesDetailView />} />
          <Route
            path="status-pages/create"
            element={
              <RestrictedRoute minRole={Role.ADMIN}>
                <StatusPagesCreateView />
              </RestrictedRoute>
            }
          />

          {/* Reports */}
          <Route path="reports">
            <Route index path="" element={<ReportsView />} />
          </Route>

          {/* Team */}
          <Route path="team" element={<TeamView />}>
            <Route path="people" element={<TeamPeopleTabView />} />
            <Route
              path="invitations"
              element={
                <RestrictedRoute minRole={Role.ADMIN}>
                  <TeamInvitationsTabView />
                </RestrictedRoute>
              }
            />

            <Route
              path="settings"
              element={
                <RestrictedRoute minRole={Role.ADMIN}>
                  <TeamSettingsTabView />
                </RestrictedRoute>
              }
            />
            <Route
              path="subscription"
              element={
                <RestrictedRoute minRole={Role.OWNER}>
                  <TeamSubscriptionTabView />
                </RestrictedRoute>
              }
            />

            <Route path="" element={<Navigate to="people" replace />} />
          </Route>
        </Route>

        {/* Authentication  */}
        <Route path="login" element={<AuthenticationBaseView />}>
          <Route path="" element={<RestrictedRoute unauthenticated />}>
            <Route path="" element={<LoginView />} />

            <Route path="forgot-password" element={<ForgotPasswordView />} />
            <Route path="reset-password" element={<ResetPasswordView />} />

            <Route path="register" element={<RegisterAccountView />} />

            <Route path="oauth" element={<OAuthLoginView />} />
          </Route>

          <Route path="" element={<RestrictedRoute authenticated />}>
            <Route path="team/select" element={<TeamSelectionView />} />
            <Route path="team/register" element={<TeamRegisterView />} />
            <Route path="team/invite" element={<TeamAcceptInvitationView />} />
          </Route>
        </Route>

        {/* Errors */}
        <Route element={<ErrorsBaseView />}>
          <Route
            path="/error/access-restricted"
            element={<AccessRestrictedView />}
          />
          <Route path="*" element={<NotFoundView />} />
        </Route>
      </RouterRoutes>
    </Suspense>
  );
};

export default Routes;

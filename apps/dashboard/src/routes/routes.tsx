import { FunctionComponent, lazy, Suspense } from "react";
import { Navigate, Route, Routes as RouterRoutes } from "react-router-dom";

import { Role } from "../components/Restrict";
import RestrictedRoute from "./RestrictedRoute";

import DashboardLayout from "../pages/Dashboard/DashboardLayout";
import AuthenticationLayout from "../pages/Authentication/AuthenticationLayout";

const ErrorLayout = lazy(() => import("../pages/Errors/ErrorLayout"));

const NotFoundPage = lazy(() => import("../pages/Errors/NotFoundPage"));
const AccessRestrictedPage = lazy(
  () => import("../pages/Errors/AccessRestrictedPage"),
);

const LoginPage = lazy(() => import("../pages/Authentication/Login/LoginPage"));
const OAuthCallbackPage = lazy(
  () => import("../pages/Authentication/OAuth/OAuthCallbackPage"),
);
const UserRegisterPage = lazy(
  () => import("../pages/Authentication/UserRegister/UserRegisterPage"),
);
const ResetPasswordPage = lazy(
  () => import("../pages/Authentication/ResetPassword/ResetPasswordPage"),
);
const ForgotPasswordPage = lazy(
  () => import("../pages/Authentication/ForgotPassword/ForgotPasswordPage"),
);

const AccountPage = lazy(
  () => import("../pages/Dashboard/Account/AccountPage"),
);
const AccountGeneralTab = lazy(
  () => import("../pages/Dashboard/Account/tabs/GeneralTab"),
);
const AccountSecurityTab = lazy(
  () => import("../pages/Dashboard/Account/tabs/SecurityTab"),
);
const AccountNotificationRulesTab = lazy(
  () => import("../pages/Dashboard/Account/tabs/NotificationRulesTab"),
);

const TeamPage = lazy(() => import("../pages/Dashboard/Team/TeamPage"));
const TeamPeopleTab = lazy(
  () => import("../pages/Dashboard/Team/tabs/PeopleTab"),
);
const TeamInvitationsTab = lazy(
  () => import("../pages/Dashboard/Team/tabs/InvitationsTab"),
);

const SettingsPage = lazy(
  () => import("../pages/Dashboard/Settings/SettingsPage"),
);
const SettingsGeneralTab = lazy(
  () => import("../pages/Dashboard/Settings/tabs/GeneralTab"),
);
const SettingsIntegrationsTab = lazy(
  () => import("../pages/Dashboard/Settings/tabs/IntegrationsTab"),
);
const SettingsApiKeysTab = lazy(
  () => import("../pages/Dashboard/Settings/tabs/ApiKeysTab"),
);
const SettingsBillingTab = lazy(
  () => import("../pages/Dashboard/Settings/tabs/BillingTab"),
);
const TeamSelectionPage = lazy(
  () => import("../pages/Authentication/TeamSelection/TeamSelectionPage"),
);
const TeamRegisterPage = lazy(
  () => import("../pages/Authentication/TeamRegister/TeamRegisterPage"),
);

const MonitorsPage = lazy(
  () => import("../pages/Dashboard/Monitors/MonitorsPage"),
);
const MonitorDetailPage = lazy(
  () => import("../pages/Dashboard/Monitors/Detail/MonitorDetailPage"),
);
const CreateMonitorPage = lazy(
  () => import("../pages/Dashboard/Monitors/CreateMonitorPage"),
);
const CheckDetailPage = lazy(
  () => import("../pages/Dashboard/Monitors/CheckDetailPage"),
);
const MonitorSettingsPage = lazy(
  () => import("../pages/Dashboard/Monitors/MonitorSettingsPage"),
);

const AlertingPage = lazy(
  () => import("../pages/Dashboard/Alerting/AlertingPage"),
);
const AlertRulesTab = lazy(
  () => import("../pages/Dashboard/Alerting/tabs/AlertRulesTab"),
);
const EscalationTab = lazy(
  () => import("../pages/Dashboard/Alerting/tabs/EscalationTab"),
);
const AlertRuleCreatePage = lazy(
  () => import("../pages/Dashboard/Alerting/Create/AlertRuleCreatePage"),
);
const AlertRuleDetailPage = lazy(
  () => import("../pages/Dashboard/Alerting/Detail/AlertRuleDetailPage"),
);

const HeartbeatView = lazy(
  () => import("../pages/Dashboard/Heartbeats/HeartbeatsPage"),
);
const HeartbeatCreateView = lazy(
  () => import("../pages/Dashboard/Heartbeats/Create/HeartbeatCreatePage"),
);
const HeartbeatDetailView = lazy(
  () => import("../pages/Dashboard/Heartbeats/Detail/HeartbeatDetailPage"),
);
const IncidentDetailView = lazy(
  () => import("../pages/Dashboard/Incidents/Detail/IncidentDetailPage"),
);

const MaintenanceView = lazy(
  () => import("../pages/Dashboard/Maintenance/MaintenancePage"),
);
const MaintenanceCreateView = lazy(
  () => import("../pages/Dashboard/Maintenance/Create/MaintenanceCreatePage"),
);
const MaintenanceDetailView = lazy(
  () => import("../pages/Dashboard/Maintenance/Detail/MaintenanceDetailPage"),
);

const IncidentsView = lazy(
  () => import("../pages/Dashboard/Incidents/IncidentsPage"),
);
const IncidentsMonitorView = lazy(
  () => import("../pages/Dashboard/Incidents/Monitor/MonitorIncidentsPage"),
);

const ChangelogView = lazy(
  () => import("../pages/Dashboard/Changelog/ChangelogsPage"),
);
const ChangelogEntriesCreateView = lazy(
  () =>
    import("../pages/Dashboard/Changelog/Entries/Create/ChangelogEntryCreatePage"),
);
const ChangelogEntriesView = lazy(
  () => import("../pages/Dashboard/Changelog/Entries/ChangelogEntriesPage"),
);
const ChangelogEntriesDetailView = lazy(
  () =>
    import("../pages/Dashboard/Changelog/Entries/Detail/ChangelogEntryDetailPage"),
);

const StatusPagesView = lazy(
  () => import("../pages/Dashboard/StatusPages/StatusPagesPage"),
);
const StatusPagesCreateView = lazy(
  () => import("../pages/Dashboard/StatusPages/Create/StatusPageCreatePage"),
);
const StatusPagesDetailView = lazy(
  () => import("../pages/Dashboard/StatusPages/Detail/StatusPageDetailPage"),
);

const ReportsView = lazy(
  () => import("../pages/Dashboard/Reports/ReportsPage"),
);
const ReportDetailView = lazy(
  () => import("../pages/Dashboard/Reports/Detail/ReportDetailPage"),
);

const TeamAcceptInvitationPage = lazy(
  () =>
    import("../pages/Authentication/TeamAcceptInvitation/TeamAcceptInvitationPage"),
);

const Routes: FunctionComponent = () => {
  return (
    <Suspense>
      <RouterRoutes>
        <Route
          element={
            <RestrictedRoute authenticated>
              <DashboardLayout />
            </RestrictedRoute>
          }
        >
          <Route index element={<Navigate to="monitors" replace />} />

          {/* Account */}
          <Route path="account" element={<AccountPage />}>
            <Route path="general" element={<AccountGeneralTab />} />
            <Route path="security" element={<AccountSecurityTab />} />
            <Route
              path="notifications"
              element={<AccountNotificationRulesTab />}
            />
            <Route path="" element={<Navigate to="general" replace />} />
          </Route>

          {/* Monitor */}
          <Route path="monitors">
            <Route index path="" element={<MonitorsPage />} />
            <Route path=":id" element={<MonitorDetailPage />} />
            <Route
              path=":id/settings"
              element={
                <RestrictedRoute minRole={Role.ADMIN}>
                  <MonitorSettingsPage />
                </RestrictedRoute>
              }
            />
            <Route
              path=":monitorId/checks/:checkId"
              element={<CheckDetailPage />}
            />
            <Route path="create" element={<CreateMonitorPage />} />
          </Route>

          {/* Alerting */}
          <Route path="alerting">
            <Route element={<AlertingPage />}>
              <Route index element={<AlertRulesTab />} />
              <Route
                path="escalation"
                element={
                  <RestrictedRoute minRole={Role.ADMIN}>
                    <EscalationTab />
                  </RestrictedRoute>
                }
              />
            </Route>
            <Route path="create" element={<AlertRuleCreatePage />} />
            <Route path=":ruleId" element={<AlertRuleDetailPage />} />
          </Route>

          <Route path="heartbeats">
            <Route index path="" element={<HeartbeatView />} />
            <Route path="create" element={<HeartbeatCreateView />} />
            <Route path=":heartbeatId" element={<HeartbeatDetailView />} />
          </Route>

          {/* Incidents  */}
          <Route path="incidents">
            <Route index path="" element={<IncidentsView />} />
            <Route path=":id/monitor" element={<IncidentsMonitorView />} />
            <Route
              path="incident/:incidentId"
              element={<IncidentDetailView />}
            />
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
                path="entries/:entryId"
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
            <Route path=":id" element={<ReportDetailView />} />
          </Route>

          {/* Team */}
          <Route path="team" element={<TeamPage />}>
            <Route path="people" element={<TeamPeopleTab />} />
            <Route
              path="invitations"
              element={
                <RestrictedRoute minRole={Role.ADMIN}>
                  <TeamInvitationsTab />
                </RestrictedRoute>
              }
            />
            <Route index element={<Navigate to="people" replace />} />
          </Route>

          {/* Settings */}
          <Route
            path="settings"
            element={
              <RestrictedRoute minRole={Role.ADMIN}>
                <SettingsPage />
              </RestrictedRoute>
            }
          >
            <Route path="general" element={<SettingsGeneralTab />} />
            <Route path="integrations" element={<SettingsIntegrationsTab />} />
            <Route path="api-keys" element={<SettingsApiKeysTab />} />
            <Route path="billing" element={<SettingsBillingTab />} />
            <Route index element={<Navigate to="general" replace />} />
          </Route>

          {/* Old team URLs, kept for bookmarks and Stripe redirects */}
          <Route
            path="team/settings"
            element={<Navigate to="/settings/general" replace />}
          />
          <Route
            path="team/apikeys"
            element={<Navigate to="/settings/api-keys" replace />}
          />
          <Route
            path="team/subscription"
            element={<Navigate to="/settings/billing" replace />}
          />
          <Route
            path="team/escalation"
            element={<Navigate to="/alerting/escalation" replace />}
          />
        </Route>

        {/* Authentication  */}
        <Route path="login" element={<AuthenticationLayout />}>
          <Route element={<RestrictedRoute unauthenticated />}>
            <Route index element={<LoginPage />} />

            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />

            <Route path="register" element={<UserRegisterPage />} />

            <Route path="oauth" element={<OAuthCallbackPage />} />
          </Route>

          <Route element={<RestrictedRoute authenticated />}>
            <Route path="team/select" element={<TeamSelectionPage />} />
            <Route path="team/register" element={<TeamRegisterPage />} />
            <Route path="team/invite" element={<TeamAcceptInvitationPage />} />
          </Route>
        </Route>

        {/* Errors */}
        <Route element={<ErrorLayout />}>
          <Route
            path="/error/access-restricted"
            element={<AccessRestrictedPage />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </RouterRoutes>
    </Suspense>
  );
};

export default Routes;

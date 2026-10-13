import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import Container from "../../../components/Container/Container";
import RouteTabs, { RouteTab } from "../../../components/RouteTabs/RouteTabs";

const TABS: RouteTab[] = [
  { label: "General", path: "/settings/general" },
  { label: "Integrations", path: "/settings/integrations" },
  { label: "API Keys", path: "/settings/api-keys" },
  { label: "Billing", path: "/settings/billing" },
];

/** Team-wide settings. The route is restricted to admins and owners. */
const SettingsPage: FunctionComponent = () => (
  <>
    <Helmet>
      <title>Settings</title>
    </Helmet>

    <Container
      header="Settings"
      description="Manage your team's profile, integrations, API keys and billing."
    >
      <RouteTabs tabs={TABS} />
    </Container>
  </>
);

export default SettingsPage;

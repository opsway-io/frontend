import { Skeleton, Tab, TabList, Tabs } from "@mui/joy";
import { FunctionComponent, Suspense } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import DelayedVisibility from "../DelayedVisibility/DelayedVisibility";

export interface RouteTab {
  label: string;
  /** Absolute path of the tab's route, e.g. `/settings/general`. */
  path: string;
}

interface RouteTabsProps {
  tabs: RouteTab[];
}

/**
 * Tabs where each tab is a child route: the active tab follows the URL and
 * the selected tab's route is rendered below through `<Outlet />`.
 */
const RouteTabs: FunctionComponent<RouteTabsProps> = ({ tabs }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab =
    tabs.find((tab) => tab.path === location.pathname) ??
    tabs.find((tab) => location.pathname.startsWith(`${tab.path}/`)) ??
    tabs[0];

  return (
    <>
      <Tabs
        value={activeTab?.path ?? false}
        onChange={(_, value) => {
          if (typeof value === "string") navigate(value);
        }}
      >
        <TabList>
          {tabs.map((tab) => (
            <Tab key={tab.path} value={tab.path}>
              {tab.label}
            </Tab>
          ))}
        </TabList>
      </Tabs>

      <Suspense
        fallback={
          <DelayedVisibility>
            <Skeleton
              variant="rectangular"
              height={400}
              sx={{ borderRadius: "lg" }}
            />
          </DelayedVisibility>
        }
      >
        <Outlet />
      </Suspense>
    </>
  );
};

export default RouteTabs;

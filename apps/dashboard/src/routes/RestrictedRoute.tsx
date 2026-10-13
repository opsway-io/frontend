import { FunctionComponent, ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Role } from "../components/Restrict";
import useAuthenticationStore from "../hooks/authentication.store";
import { useCurrentUserRole } from "../hooks/user.query";

interface RestrictedRouteProps {
  /** Requires the current user to have at least this role in the team. */
  minRole?: Role | string;
  /** Requires a signed-in user with a selected team. */
  authenticated?: boolean;
  /** Only for signed-out users (sign in, sign up, …). */
  unauthenticated?: boolean;
  /** Rendered when allowed; defaults to the nested route `<Outlet />`. */
  children?: ReactNode;
}

/** Renders the guarded content: explicit children or the nested route. */
const renderAllowed = (children: ReactNode) =>
  children === undefined ? <Outlet /> : children;

const RestrictedRoute: FunctionComponent<RestrictedRouteProps> = (props) => {
  if (props.authenticated) {
    return <AuthenticatedRoute>{props.children}</AuthenticatedRoute>;
  }

  if (props.unauthenticated) {
    return <UnauthenticatedRoute>{props.children}</UnauthenticatedRoute>;
  }

  if (props.minRole) {
    return (
      <AuthenticatedRoute>
        <RoleRoute minRole={props.minRole}>{props.children}</RoleRoute>
      </AuthenticatedRoute>
    );
  }

  return null;
};

const AuthenticatedRoute: FunctionComponent<{ children?: ReactNode }> = ({
  children,
}) => {
  const authentication = useAuthenticationStore();
  const location = useLocation();

  if (!authentication.isAuthenticated()) {
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?returnTo=${returnTo}`} replace />;
  }

  // Without a selected team only the team select / create screens are allowed.
  if (
    !authentication.currentTeamId &&
    !location.pathname.startsWith("/login/team")
  ) {
    return <Navigate to="/login/team/select" replace />;
  }

  return renderAllowed(children);
};

const UnauthenticatedRoute: FunctionComponent<{ children?: ReactNode }> = ({
  children,
}) => {
  const authentication = useAuthenticationStore();
  const location = useLocation();

  if (authentication.isAuthenticated()) {
    const returnTo = new URLSearchParams(location.search).get("returnTo");
    return <Navigate to={returnTo || "/monitors"} replace />;
  }

  return renderAllowed(children);
};

const RoleRoute: FunctionComponent<{
  minRole: Role | string;
  children?: ReactNode;
}> = ({ minRole, children }) => {
  const currentRole = useCurrentUserRole();

  if (!currentRole) {
    return null;
  }

  const requiredRole = Role.fromString(minRole.toString());
  if (requiredRole && !requiredRole.equalOrHigher(currentRole)) {
    return <Navigate to="/error/access-restricted" replace />;
  }

  return renderAllowed(children);
};

export default RestrictedRoute;

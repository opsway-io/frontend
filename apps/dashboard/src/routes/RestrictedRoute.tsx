import { FunctionComponent } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Role } from "../components/Restrict";
import useAuthenticationStore from "../hooks/authentication.store";
import { useCurrentUserRole } from "../hooks/user.query";

interface RestrictedProps {
  minRole?: Role | string;
  authenticated?: boolean;
  unauthenticated?: boolean;
  children?: React.ReactNode | React.ReactNode[];
}

const RestrictedRoute: FunctionComponent<RestrictedProps> = (props) => {
  if (props.authenticated) {
    return <AuthenticatedRoute {...props} />;
  }

  if (props.unauthenticated) {
    return <UnauthenticatedRoute {...props} />;
  }

  if (props.minRole) {
    return (
      <AuthenticatedRoute {...props}>
        <RoleRoute {...props} />
      </AuthenticatedRoute>
    );
  }

  return <></>;
};

const AuthenticatedRoute = (props: RestrictedProps) => {
  const authentication = useAuthenticationStore();
  const location = useLocation();

  if (!authentication.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // allow team selection or create team if no team is selected
  if (
    !authentication.currentTeamId &&
    !location?.pathname.startsWith("/login/team")
  ) {
    return <Navigate to="/login/team/select" replace />;
  }

  if (props.children === undefined) {
    return <Outlet />;
  }

  return <>{props.children}</>;
};

const UnauthenticatedRoute = (props: RestrictedProps) => {
  const authentication = useAuthenticationStore();

  if (authentication.isAuthenticated()) {
    return <Navigate to="/monitors" replace />;
  }

  if (props.children === undefined) {
    return <Outlet />;
  }

  return <>{props.children}</>;
};

const RoleRoute = (props: RestrictedProps) => {
  const currentRole = useCurrentUserRole();

  if (!currentRole) {
    return null;
  }

  const minRole = Role.fromString(props.minRole as string);
  if (minRole) {
    if (!minRole.equalOrHigher(currentRole)) {
      return <Navigate to="/error/access-restricted" replace />;
    }
  }

  if (props.children === undefined) {
    return <Outlet />;
  }

  return <>{props.children}</>;
};

export default RestrictedRoute;

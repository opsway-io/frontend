import { FunctionComponent } from "react";
import { Navigate } from "react-router-dom";
import useAuthentication from "../stores/authentication";

interface ProtectedRouteProps {
    children: React.ReactNode | React.ReactNode[];
}

const ProtectedRoute: FunctionComponent<ProtectedRouteProps> = (props) => {
    const authentication = useAuthentication();

    if (!authentication.isAuthenticated()) {
        return <Navigate to="/login"  replace />;
    }

    return <>{props.children}</>;
};

export default ProtectedRoute;

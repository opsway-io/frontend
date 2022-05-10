import { FunctionComponent } from "react";
import { Navigate } from "react-router-dom";
import useAuthentication from "../stores/authentication";

interface RedirectAuthenticatedRouteProps {
    children: React.ReactNode | React.ReactNode[];
}

const RedirectAuthenticatedRoute: FunctionComponent<RedirectAuthenticatedRouteProps> = (props) => {
    const authentication = useAuthentication();

    if (authentication.isAuthenticated()) {
        return <Navigate to="/" replace />;
    }

    return <>{props.children}</>;
};

export default RedirectAuthenticatedRoute;

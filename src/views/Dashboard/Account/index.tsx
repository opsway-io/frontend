import { Button, Card, CardContent, CardHeader, Stack } from "@mui/material";
import { FunctionComponent } from "react";
import { GoSignOut } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import Container from "../../../components/Container";
import ContainerHeader from "../../../components/Container/header";
import Placeholder from "../../../components/Placeholder";
import useAuthentication from "../../../stores/authentication";
import useUser from "../../../stores/user";

const AccountView: FunctionComponent = () => {
    const [ user, clearUser ] = useUser(s => [s.user, s.clearUser]);
    const logOut = useAuthentication((state) => state.logOut);
    const navigate = useNavigate();

    const handleSignOut = async () => {
        logOut();
        clearUser();
        navigate("/login");
    };

    return (
        <Container>
            <ContainerHeader>Account</ContainerHeader>

            <Stack direction="row" alignItems="left" spacing={2}>
                <Button startIcon={<GoSignOut />} onClick={handleSignOut}>
                    Sign me out
                </Button>
            </Stack>

            <Card>
                <CardHeader title="Your information" />
                <CardContent>{user?.email}</CardContent>
            </Card>

            <Card>
                <CardHeader title="Settings" />
                <CardContent>
                    <Placeholder />
                </CardContent>
            </Card>

            <Card>
                <CardHeader title="Security" />
                <CardContent>
                    <Placeholder />
                </CardContent>
            </Card>
        </Container>
    );
};

export default AccountView;

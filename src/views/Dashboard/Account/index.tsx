import { Button, Card, CardContent, CardHeader, Stack } from "@mui/material";
import { FunctionComponent } from "react";
import { GoSignOut } from "react-icons/go";
import Container from "../../../components/Container";
import ContainerHeader from "../../../components/Container/header";
import useAuthentication from "../../../stores/authentication";
import useUser from "../../../stores/user";

const AccountView: FunctionComponent = () => {
    const user = useUser();
    const authentication = useAuthentication();

    return (
        <Container>
            <ContainerHeader>Account</ContainerHeader>

            <Stack direction="row" alignItems="left" spacing={2}>
                <Button startIcon={<GoSignOut />} onClick={authentication.logOut}>
                    Sign me out
                </Button>
            </Stack>

            <Card>
                <CardHeader title="Your information" />
                <CardContent>{user.email}</CardContent>
            </Card>

            <Card>
                <CardHeader title="Settings" />
                <CardContent>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum nesciunt sed mollitia at. Unde quidem
                    voluptas quod accusantium laudantium! Saepe ipsam cupiditate corrupti, sunt nostrum ratione
                    laboriosam asperiores sed provident.
                </CardContent>
            </Card>

            <Card>
                <CardHeader title="Security" />
                <CardContent>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum nesciunt sed mollitia at. Unde quidem
                    voluptas quod accusantium laudantium! Saepe ipsam cupiditate corrupti, sunt nostrum ratione
                    laboriosam asperiores sed provident.
                </CardContent>
            </Card>
        </Container>
    );
};

export default AccountView;

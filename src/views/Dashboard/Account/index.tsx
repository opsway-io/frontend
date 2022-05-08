import { Button, Card, CardContent, CardHeader, Stack } from "@mui/material";
import { FunctionComponent } from "react";
import { GoSignOut } from "react-icons/go";
import { Link } from "react-router-dom";
import Container from "../../../components/Container";
import ContainerHeader from "../../../components/Container/header";

const OnCallView: FunctionComponent = () => {
    return (
        <Container>
            <ContainerHeader>Account</ContainerHeader>

            <Stack direction="row" alignItems="left" spacing={2}>
                <Button startIcon={<GoSignOut />} component={Link} to="/login">
                    Sign me out
                </Button>
            </Stack>

            <Card>
                <CardHeader title="Your information" />
                <CardContent>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum nesciunt sed mollitia at. Unde quidem
                    voluptas quod accusantium laudantium! Saepe ipsam cupiditate corrupti, sunt nostrum ratione
                    laboriosam asperiores sed provident.
                </CardContent>
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

export default OnCallView;

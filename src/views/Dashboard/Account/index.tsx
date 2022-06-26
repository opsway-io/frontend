import { Button, Card, CardContent, CardHeader, Divider, Stack, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import { GoSignOut } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { CategoryList, CategoryListItem } from "../../../components/CategoryList";
import Container from "../../../components/Container";
import ContainerHeader from "../../../components/Container/header";
import Placeholder from "../../../components/Placeholder";
import useAuthentication from "../../../stores/authentication";
import useUser from "../../../stores/user";

const AccountView: FunctionComponent = () => {
    const [user, clearUser] = useUser((s) => [s.user, s.clearUser]);
    const logOut = useAuthentication((state) => state.logOut);
    const navigate = useNavigate();

    const handleSignOut = async () => {
        logOut();
        clearUser();
        navigate("/login");
    };

    return (
        <Container>
            <ContainerHeader>Your account</ContainerHeader>

            <Stack direction="row" alignItems="left" spacing={2}>
                <Button startIcon={<GoSignOut />} onClick={handleSignOut}>
                    Sign me out
                </Button>
            </Stack>

            <Card sx={{}}>
                <CardHeader title="Basic information" />
                <CardContent>
                    <CategoryList>
                        <CategoryListItem
                            title="Name"
                            description="Your full name and display name which other people can see."
                        >
                            <Placeholder />
                        </CategoryListItem>

                        <CategoryListItem title="Emails" description="Your primary email.">
                            <Placeholder />
                        </CategoryListItem>

                        <CategoryListItem
                            title="Phone numbers"
                            description="We're going to call all your phone numbers to get in touch with you in case of an incident."
                        >
                            <Placeholder />
                        </CategoryListItem>
                    </CategoryList>
                </CardContent>
            </Card>

            <Card>
                <CardHeader title="Settings" />
                <CardContent>
                    <CategoryList>
                        <CategoryListItem
                            title="Timezone"
                            description="Your timezone, used for timestamps and schedules."
                        >
                            <Placeholder />
                        </CategoryListItem>

                        <CategoryListItem title="Language" description="Language the page should use.">
                            <Placeholder />
                        </CategoryListItem>
                    </CategoryList>
                </CardContent>
            </Card>

            <Card
                sx={{
                    borderLeft: (theme) => `4px solid ${theme.palette.error.main}`,
                    boxSizing: "border-box",
                }}
            >
                <CardHeader title="Security" />
                <CardContent>
                    <CategoryList>
                        <CategoryListItem
                            title="Password"
                            description="Set your password if you want to be able to sign in using password."
                        >
                            <Placeholder />
                        </CategoryListItem>

                        <CategoryListItem
                            title="Two Factor Authentication"
                            description="Use Google Authenticator, 1Password or any other OTP client."
                        >
                            <Placeholder />
                        </CategoryListItem>

                        <CategoryListItem
                            title="Account deletion"
                            description="Permanently delete your account and all your data. This is irreversible."
                        >
                            <Placeholder />
                        </CategoryListItem>
                    </CategoryList>
                </CardContent>
            </Card>
        </Container>
    );
};

export default AccountView;

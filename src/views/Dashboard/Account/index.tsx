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
                        <CategoryListItem title="Name" description="Some description of this category.">
                            <Placeholder />
                        </CategoryListItem>

                        <CategoryListItem title="Emails" description="Some description of this category.">
                            <Placeholder />
                        </CategoryListItem>

                        <CategoryListItem title="Phone numbers" description="Some description of this category.">
                            <Placeholder />
                        </CategoryListItem>
                    </CategoryList>
                </CardContent>
            </Card>

            <Card>
                <CardHeader title="Settings" />
                <CardContent>
                    <CategoryList>
                        <CategoryListItem title="Timezone" description="Some description of this category.">
                            <Placeholder />
                        </CategoryListItem>

                        <CategoryListItem title="Language" description="Some description of this category.">
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
                        <CategoryListItem title="Password" description="Some description of this category.">
                            <Placeholder />
                        </CategoryListItem>

                        <CategoryListItem
                            title="Two Factor Authentication"
                            description="Some description of this category."
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

import { Button, Card, CardContent, Divider, Stack, styled, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import LoginForm from "./form";

const Container = styled("div")(({ theme }) => ({
    display: "flex",
    width: "100%",
    flexDirection: "column",
    backgroundColor: theme.palette.background.paper,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
}));

const LoginView: FunctionComponent = () => {
    return (
        <Container>
            <Card sx={{ maxWidth: 500 }} elevation={0}>
                <CardContent sx={{ margin: 2 }}>
                    <Stack spacing={2}>
                        <Typography
                            variant="h5"
                            fontWeight="500"
                            textAlign="center"
                            sx={{
                                paddingBottom: 4,
                            }}
                        >
                            Sign in to your account
                        </Typography>

                        <LoginForm />

                        <Button variant="text">I forgot my password</Button>
                        <Divider
                            sx={{
                                paddingTop: 2,
                                paddingBottom: 2,
                            }}
                        >
                            or
                        </Divider>

                        <Button variant="outlined">Create an account</Button>
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    );
};

export default LoginView;

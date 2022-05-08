import { Card, CardContent, CardHeader, Divider, Fade, Stack, styled, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import LoginForm from "./form";
import SSOLogin from "./sso";

const Container = styled("div")(({ theme }) => ({
    display: "flex",
    width: "100%",
    flexDirection: "column",
    backgroundColor: theme.palette.background.paper,
}));

const Header = styled("header")({
    marginTop: "0",
    flexGrow: 0,
});

const DialogContainer = styled("div")({
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
});

const LoginView: FunctionComponent = () => {
    return (
        <Container>
            <DialogContainer>
                <Card elevation={0}>
                    <CardContent sx={{ margin: 4 }}>
                        <Typography variant="h3" sx={{
                            marginBottom: 8,
                            textAlign: "center",
                        }}>Welcome back</Typography>

                        <Stack direction="row">
                            <LoginForm />

                            <Divider orientation="vertical" flexItem sx={{ margin: 4 }}>or</Divider>

                            <SSOLogin />
                        </Stack>
                    </CardContent>
                </Card>
            </DialogContainer>
        </Container>
    );
};

export default LoginView;

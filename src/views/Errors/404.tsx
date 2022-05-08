import { Stack, styled } from "@mui/material";
import { FunctionComponent } from "react";

const Container = styled("main")({
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "3rem",
    // backgroundImage: `url("https://www.transparenttextures.com/patterns/escheresque.png")`,
});

const Meta = styled("div")({
    display: "flex",
    justifyContent: "center",
    width: "100%",
    position: "absolute",
    bottom: "24px",
    fontSize: "12px",
    opacity: 0.5,
});

const NotFoundView: FunctionComponent = () => {
    return (
        <>
            <Container>
                <Stack direction="column">
                    <div>404</div>
                    <div style={{
                        borderTop: "4px solid #000",
                        margin: "12px 0px",
                    }}/>
                    <div>Page not found</div>
                </Stack>
            </Container>
            <Meta>3d2c18cb-889a-46ef-9c1e-7a2a7c33f0fc @ {new Date().getUTCDate()}</Meta>
        </>
    );
};

export default NotFoundView;

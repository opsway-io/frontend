import { Button, Container, Fade, styled, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import Blinking from "../../components/Blinking";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Section from "./components/Section";

const Main = styled("main")(({ theme }) => ({
    width: "100vw",
}));

const HomeView: FunctionComponent = () => {
    return (
        <>
            <Main>
                <Section color="info" skewBottom="left" spacing={8}>
                    <Container
                        maxWidth="lg"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "4rem",
                                lineHeight: "4rem",
                                textAlign: "center",
                            }}
                        >
                            Open Source Operations
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "1.5rem",
                                opacity: 0.75,
                                marginTop: (theme) => theme.spacing(2),
                                marginBottom: (theme) => theme.spacing(4),
                                maxWidth: "600px",
                                textAlign: "center",
                            }}
                        >
                            API monitoring, incident management and status page hosting for your stack in one place{" "}
                            <Blinking>_</Blinking>
                        </Typography>

                        <Button size="large" variant="outlined" color="success">
                            Get started now
                        </Button>

                        <Fade in={true} timeout={400}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginTop: "5rem",
                                    marginBottom: "-15rem",
                                    position: "relative",
                                }}
                            >
                                <img
                                    src="https://raw.githubusercontent.com/opsway-io/.github/main/profile/screenshot.webp"
                                    alt="Opsway dashboard screenshot"
                                    style={{
                                        maxWidth: "750px",
                                    }}
                                />
                            </div>
                        </Fade>
                    </Container>
                </Section>

                <div
                    style={{
                        height: "12rem",
                    }}
                ></div>

                <Section>
                    <Container maxWidth="lg">
                        <Typography variant="h4">lorem ipsum</Typography>

                        <Typography variant="body1">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, optio impedit culpa
                            quaerat necessitatibus, veniam architecto incidunt porro ducimus cupiditate expedita
                            quisquam in nemo accusantium sed facilis totam autem doloribus.
                        </Typography>
                    </Container>
                </Section>

                <Section color="success" skewBottom="right" skewTop="left">
                    <Container maxWidth="lg">
                        <Typography variant="h4">lorem ipsum</Typography>

                        <Typography variant="body1">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, optio impedit culpa
                            quaerat necessitatibus, veniam architecto incidunt porro ducimus cupiditate expedita
                            quisquam in nemo accusantium sed facilis totam autem doloribus.
                        </Typography>
                    </Container>
                </Section>

                <Section>
                    <Container maxWidth="lg">
                        <Typography variant="h4">lorem ipsum</Typography>

                        <Typography variant="body1">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, optio impedit culpa
                            quaerat necessitatibus, veniam architecto incidunt porro ducimus cupiditate expedita
                            quisquam in nemo accusantium sed facilis totam autem doloribus.
                        </Typography>
                    </Container>
                </Section>

                <Section color="info" skewTop="right">
                    <Container maxWidth="lg">
                        <Typography variant="h4">lorem ipsum</Typography>

                        <Typography variant="body1">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, optio impedit culpa
                            quaerat necessitatibus, veniam architecto incidunt porro ducimus cupiditate expedita
                            quisquam in nemo accusantium sed facilis totam autem doloribus.
                        </Typography>
                    </Container>
                </Section>
            </Main>
        </>
    );
};

export default HomeView;

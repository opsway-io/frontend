import { styled } from "@mui/material";
import { FunctionComponent } from "react";
import "./style.scss";

const Container = styled("div")(({ theme }) => ({
    width: "40px",
    height: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
}));

const Ringing = styled("div")(({ theme }) => ({
    borderRadius: "100%",
    width: "30px",
    height: "30px",
    border: `2px solid ${theme.palette.success.main}`,
    position: "absolute",
    animation: "pulsate 4s ease-out",
    animationIterationCount: "infinite",
    opacity: 0.0,
}));

const Dot = styled("div")(({ theme }) => ({
    width: "50%",
    height: "50%",
    backgroundColor: theme.palette.success.main,
    borderRadius: "100%",
}));

interface PulsingDotProps {}

const PulsingDot: FunctionComponent<PulsingDotProps> = () => {
    return (
        <Container>
            <Ringing />
            <Dot />
        </Container>
    );
};

export default PulsingDot;

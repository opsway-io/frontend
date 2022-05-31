import { styled } from "@mui/material";
import {keyframes} from "@emotion/react";

const blinkAnimation = keyframes`
    0% {
        opacity: 0;
    }
`;

const Blinking = styled("i")(({ theme }) => ({
    animation: `${blinkAnimation} 1.5s steps(2) infinite`,
}));

export default Blinking;

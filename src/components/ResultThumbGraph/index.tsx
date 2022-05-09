import { styled, Theme } from "@mui/material";
import { FunctionComponent } from "react";
import * as falso from "@ngneat/falso";

const Container = styled("div")(({ theme }) => ({
    display: "flex",
    height: "40px",
    justifyContent: "space-between",
    gap: 4,
    flexGrow: 0,
}));

const LineContainer = styled("div")(({ theme }) => ({
    cursor: "pointer",
    height: "100%",
    alignItems: "flex-end",
    display: "flex",
    backgroundColor: theme.palette.background.default,
    transition: "transform 0.2s",
    "&:hover": {
        transform: "translate(0, -4px)",
    },
}));

const Line = styled("div")(({ theme, value }: { theme?: Theme; value: number }) => ({
    height: `${value}%`,
    width: 8,
    backgroundColor: theme?.palette.success.main,
}));

interface ResultThumbGraphProps {}

const ResultThumbGraph: FunctionComponent<ResultThumbGraphProps> = () => {
    return (
        <Container>
            {new Array(24).fill(1).map((_, i) => (
                <LineContainer key={i}>
                    <Line value={falso.randNumber({ min: 0, max: 100 })} />
                </LineContainer>
            ))}
        </Container>
    );
};

export default ResultThumbGraph;

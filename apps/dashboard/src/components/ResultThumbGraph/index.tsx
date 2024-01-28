import { styled, Theme } from "@mui/material";
import { FunctionComponent, memo } from "react";
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
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translate(0, -4px)",
  },
}));

const Line = styled("div")(
  ({ theme, value }: { theme?: Theme; value: number }) => ({
    height: `${value}%`,
    width: 8,
    backgroundColor: theme?.palette.success.main,
  })
);

interface ResultThumbGraphProps {
  onClick?: (key: number) => void;
  stats: number[];
}

const ResultThumbGraph: FunctionComponent<ResultThumbGraphProps> = (props) => {
  let ratio = Math.max.apply(Math, props.stats) / 100;
  for (let i = 0; i < props.stats.length; i++) {
    props.stats[i] = Math.round(props.stats[i] / ratio);
  }
  return (
    <Container>
      {new Array(24).fill(1).map((_, i) => (
        <LineContainer key={i}>
          <Line value={props.stats[i]} onClick={() => props.onClick?.(i)} />
        </LineContainer>
      ))}
    </Container>
  );
};

export default memo(ResultThumbGraph);

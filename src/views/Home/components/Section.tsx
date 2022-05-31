import { Paper, useTheme } from "@mui/material";
import { FunctionComponent } from "react";

interface SectionProps {
    children: React.ReactNode | React.ReactNode[];
    color?: "info" | "success";
    skewBottom?: "left" | "right";
    skewTop?: "left" | "right";
    spacing?: number;
}

const rightBottom = "0,0 100,0 100,100";
const rightTop = "100,0 0,100 100,100";
const leftTop = "0,0 100,100 0,100";
const leftBottom = "0,0 100,0 0,100";

const defaultSpacing = 8;

const Section: FunctionComponent<SectionProps> = (props) => {
    const theme = useTheme();

    let backgroundColor = "transparent";
    let color = theme.palette.text.primary;

    if (props.color === "info") {
        backgroundColor = theme.palette.primary.main;
        color = theme.palette.primary.contrastText;
    }

    if (props.color === "success") {
        backgroundColor = theme.palette.success.main;
        color = theme.palette.success.contrastText;
    }

    return (
        <>
            {props.skewTop && (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="30"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    style={{ marginBottom: "-5px" }}
                >
                    <polygon
                        points={props.skewTop === "left" ? leftTop : rightTop}
                        style={{ fill: backgroundColor }}
                    ></polygon>
                </svg>
            )}
            <Paper
                sx={{
                    backgroundColor: backgroundColor,
                    color: color,
                    borderRadius: 0,
                    paddingTop: theme.spacing(props.spacing || defaultSpacing),
                    paddingBottom: theme.spacing(props.spacing || defaultSpacing),
                    boxSizing: "border-box",
                }}
            >
                {props.children}
            </Paper>
            {props.skewBottom && (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="30"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    style={{ marginBottom: "-5px" }}
                >
                    <polygon
                        points={props.skewBottom === "left" ? leftBottom : rightBottom}
                        style={{ fill: backgroundColor }}
                    ></polygon>
                </svg>
            )}
        </>
    );
};

export default Section;

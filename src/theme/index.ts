import { createTheme } from "@mui/material/styles";
import { Shadows } from "@mui/material/styles/shadows";

const shadows = new Array(25).fill("none") as Shadows;
shadows[1] = "0px 0px 6px -2px rgba(0,0,0,0.2)";
shadows[2] = "0px 0px 6px 0px rgba(0,0,0,0.2)";

const theme = createTheme({
    shape: {
        borderRadius: 4,
    },
    shadows: shadows,
    palette: {
        primary: {
            main: "#121826",
            contrastText: "#fff",
        },
        text: {
            primary: "#121826",
            secondary: "#a4a4a4",
        },
        info: {
            main: "#4F759B",
            contrastText: "#fff",
        },
        warning: {
            main: "#F4AC45",
            contrastText: "#121826",
        },
        error: {
            main: "#ea7663",
            contrastText: "#fff",
        },
        success: {
            main: "#84be79",
            contrastText: "#fff",
        },
        background: {
            default: "#f9fbfd",
            paper: "#fff",
        },
    },
    typography: {
        fontFamily: "Inter",
        button: {
            textTransform: "none",
        },
        h1: {
            fontWeight: 500,
        },
        h2: {
            fontWeight: 500,
        },
        h3: {
            fontWeight: 500,
        },
        h4: {
            fontWeight: 500,
        },
        h5: {
            fontWeight: 500,
        },
        h6: {
            fontWeight: 500,
        },
        body1: {
            fontSize: "0.9rem",
        },
        body2: {
            fontSize: "1rem",
        },
    },
    transitions: {
        duration: {
            standard: 100,
        },
    },
});

theme.components = {
    MuiMenu: {
        defaultProps: {
            elevation: 2,
        },
    },
    MuiPaper: {
        defaultProps: {
            elevation: 0,
        },
    },
    MuiCard: {
        defaultProps: {
            elevation: 1,
        },
    },
    MuiSkeleton: {
        defaultProps: {
            animation: "pulse",
        },
    },
    MuiInputBase: {
        styleOverrides: {
            root: {
                background: theme.palette.background.default,
            },
        },
    },
    MuiButton: {
        defaultProps: {
            disableElevation: true,
        },
    },
    MuiButtonBase: {
        defaultProps: {
            disableRipple: true,
            disableTouchRipple: true,
        },
    },
};

export default theme;

import { createTheme } from "@mui/material/styles";
import { Shadows } from "@mui/material/styles/shadows";

const shadows = new Array(25).fill("none") as Shadows;
shadows[1] = "0px 0px 6px -2px rgba(0,0,0,0.2)";

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
            main: "#a3d2d2",
            contrastText: "#fff",
        },
        warning: {
            main: "#f5de88",
            contrastText: "#fff",
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
        fontFamily: "Libre Franklin",
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
        }
    },
    transitions: {
        duration: {
            standard: 100,
        },
    },
});

theme.components = {
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
    MuiInputBase: {
        styleOverrides: {
            root: {
                background: "#eef2f7",
            },
        },
    },
    MuiButtonBase: {
        defaultProps: {
            disableRipple: true,
        },
        styleOverrides: {
            root: {
                "&.active": {
                    backgroundColor: "#f4f5f8",
                },
                "&:active": {
                    opacity: 0.6,
                },
            },
        },
    },
};

export default theme;

import { alpha, createTheme } from "@mui/material/styles";
import { Shadows } from "@mui/material/styles/shadows";

declare module "@mui/material/styles/createPalette" {
    interface Semantic {
        monitors: SimplePaletteColorOptions;
        alerting: SimplePaletteColorOptions;
        incidents: SimplePaletteColorOptions;
        maintenance: SimplePaletteColorOptions;
        pages: SimplePaletteColorOptions;
        reports: SimplePaletteColorOptions;
        team: SimplePaletteColorOptions;
    }

    interface Palette {
        semantic: Semantic;
    }
    interface PaletteOptions {
        semantic: Semantic;
    }
}

const shadows = new Array(25).fill("none") as Shadows;

const theme = createTheme({
    shape: {
        borderRadius: 6,
    },
    shadows: shadows,
    palette: {
        mode: "dark",
        primary: {
            main: "#ddd",
            contrastText: "#111",
        },
        secondary: {
            main: "#aaa",
            contrastText: "#111",
        },
        text: {
            primary: "#ddd",
            secondary: "#aaa",
        },
        info: {
            main: "#5185A5",
            contrastText: "#fff",
        },
        warning: {
            main: "#F4AC45",
            contrastText: "#111",
        },
        error: {
            main: "#CB4F4F",
            contrastText: "#fff",
        },
        success: {
            main: "#79AB5D",
            contrastText: "#111",
        },
        background: {
            default: "#1d2128",
            paper: "#1d2128",
        },
        semantic: {
            monitors: {
                main: "#79AB5D",
                contrastText: "#111",
            },
            alerting: {
                main: "#F4AC45",
                contrastText: "#111",
            },
            incidents: {
                main: "#CB4F4F",
                contrastText: "#fff",
            },
            maintenance: {
                main: "#5185A5",
                contrastText: "#fff",
            },
            pages: {
                main: "#7E9181",
                contrastText: "#fff",
            },
            reports: {
                main: "#A871B7",
                contrastText: "#fff",
            },
            team: {
                main: "#ddd",
                contrastText: "#fff",
            },
        },
    },
    typography: {
        fontFamily: "Inter",
        button: {
            textTransform: "none",
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
            enteringScreen: 100,
            leavingScreen: 100,
            short: 75,
            shorter: 50,
            shortest: 25,
        },
    },
});

theme.components = {
    MuiAvatar: {
        defaultProps: {
            variant: "rounded",
        },
    },
    MuiSwitch: {
        defaultProps: {
            color: "success",
        },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                border: `1px solid ${theme.palette.divider}`,
            },
        },
    },
    MuiCardHeader: {
        styleOverrides: {
            root: {
                paddingBottom: 0,
            },
            title: {
                fontSize: theme.typography.fontSize * 1.25,
            },
            subheader: {
                color: alpha(theme.palette.text.primary, 0.75),
            },
        },
    },
    MuiAlert: {
        defaultProps: {
            variant: "filled",
        },
        styleOverrides: {
            filledError: {
                color: theme.palette.error.contrastText,
            },
            filledInfo: {
                color: theme.palette.info.contrastText,
            },
            filledSuccess: {
                color: theme.palette.success.contrastText,
            },
            filledWarning: {
                color: theme.palette.warning.contrastText,
            },
        },
    },
    MuiChip: {
        styleOverrides: {
            root: {
                borderRadius: theme.shape.borderRadius,
            },
        },
    },
    MuiSkeleton: {
        defaultProps: {
            animation: "wave",
        },
        styleOverrides: {
            root: {
                borderRadius: theme.shape.borderRadius,
            },
        },
    },
    MuiListItemButton: {
        styleOverrides: {
            root: {
                borderRadius: theme.shape.borderRadius,
            },
        },
    },

    MuiTextField: {
        defaultProps: {
            variant: "outlined",
            InputLabelProps: {
                shrink: true,
            },
        },
    },

    MuiIconButton: {
        styleOverrides: {
            root: {
                borderRadius: theme.shape.borderRadius,
            },
        },
    },

    MuiButtonBase: {
        defaultProps: {
            disableRipple: true,
            disableTouchRipple: true,
        },
    },

    MuiButton: {
        variants: [
            {
                props: { variant: "gradiant1" },
                style: {
                    background: `linear-gradient(45deg, ${theme.palette.info.main} 0%, ${theme.palette.success.dark} 100%)`,
                    color: "white",
                },
            },
        ],
    },

    MuiInputBase: {
        styleOverrides: {
            root: {
                "& input": {
                    "&:-webkit-autofill": {
                        borderRadius: "0px !important",
                        "-webkit-box-shadow": "0 0 0 100000px #2a3239 inset !important",
                    },
                },
            },
        },
    },
};

declare module "@mui/material/Button" {
    interface ButtonPropsVariantOverrides {
        gradiant1: true;
    }
}

export { theme as DarkTheme };

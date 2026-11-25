import { createTheme } from "@mui/material/styles";

/**
 * Opsway Log Search MUI theme — mirrors the Joy UI design system
 * (`frontend/packages/ui/src/theme/joy.ts`) used by Monitoring and Hub.
 *
 * Dark only. Generous border radius, subtle 1px borders instead of shadows,
 * a neutral (near-white) primary action color, and muted status colors.
 */
export const opswayTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#eceef2", // JoyTheme primary.solidBg (neutral[100])
      light: "#f6f7f9", // neutral[50]
      dark: "#d5d9e0", // neutral[200]
      contrastText: "#1a1e25", // neutral[900]
    },
    secondary: {
      main: "#A871B7", // semantic.reports / AI purple
    },
    info: {
      main: "#5185a5", // info[500]
      light: "#6898b8", // info[400]
      dark: "#416d89", // info[600]
      contrastText: "#ffffff",
    },
    success: {
      main: "#79ab5d", // success[500]
      light: "#8bbd70", // success[400]
      dark: "#61904a", // success[600]
      contrastText: "#111111",
    },
    warning: {
      main: "#f4ac45", // warning[500]
      light: "#f6b558", // warning[400]
      dark: "#d98f26", // warning[600]
      contrastText: "#111111",
    },
    error: {
      main: "#cb4f4f", // danger[500]
      light: "#d86767", // danger[400]
      dark: "#b03b3b", // danger[600]
      contrastText: "#ffffff",
    },
    background: {
      default: "#14171c", // background.body
      paper: "#191c22", // background.surface
    },
    text: {
      primary: "#e7e9ee",
      secondary: "#a3aab7",
      disabled: "#677083",
    },
    divider: "rgba(255, 255, 255, 0.08)",
  },
  typography: {
    fontFamily:
      'var(--font-sans, "Inter"), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      letterSpacing: "-0.01em",
      lineHeight: 1.3,
    },
    h5: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    h6: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      defaultProps: {
        size: "small",
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
          fontSize: "0.875rem",
          padding: "6px 14px",
          transition:
            "background-color 120ms, border-color 120ms, color 120ms",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        contained: ({ ownerState }) => ({
          ...(ownerState.color === "primary" && {
            backgroundColor: "#eceef2",
            color: "#1a1e25",
            "&:hover": {
              backgroundColor: "#f6f7f9",
            },
            "&:active": {
              backgroundColor: "#d5d9e0",
            },
            "&.Mui-disabled": {
              backgroundColor: "#262b34",
              color: "#677083",
            },
          }),
        }),
        outlined: {
          borderColor: "rgba(255, 255, 255, 0.12)",
          color: "#d5d9e0",
          "&:hover": {
            borderColor: "rgba(255, 255, 255, 0.2)",
            backgroundColor: "rgba(255, 255, 255, 0.06)",
          },
        },
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#191c22",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "none",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1d2128",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 10,
          boxShadow: "0 12px 32px -6px rgb(0 0 0 / 0.5)",
          padding: 4,
        },
        list: {
          padding: 0,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: "0.875rem",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.06)",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.12)",
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: "rgba(255, 255, 255, 0.02)",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.12)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.2)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.25)",
            borderWidth: "2px",
          },
        },
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: false,
      },
      styleOverrides: {
        tooltip: {
          backgroundColor: "#eceef2",
          color: "#1a1e25",
          fontSize: "0.75rem",
          fontWeight: 500,
          borderRadius: 6,
          padding: "4px 8px",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "10px 14px",
        },
        head: {
          backgroundColor: "#191c22",
          color: "#7c8494",
          fontWeight: 500,
          fontSize: "0.8125rem",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
        },
      },
    },
  },
});

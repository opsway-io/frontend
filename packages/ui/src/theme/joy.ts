import { extendTheme } from "@mui/joy/styles";

/**
 * Opsway Joy UI theme.
 *
 * Dark only. Inspired by shadcn/ui: generous border radius, subtle 1px
 * borders instead of shadows, a neutral (near-white) primary action color and
 * muted status colors.
 */

type Scale = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

const neutral: Scale = {
  50: "#f6f7f9",
  100: "#eceef2",
  200: "#d5d9e0",
  300: "#b0b7c3",
  400: "#8a93a3",
  500: "#677083",
  600: "#4d5566",
  700: "#363c49",
  800: "#262b34",
  900: "#1a1e25",
};

const success: Scale = {
  50: "#f2f8ee",
  100: "#e0efd6",
  200: "#c3dfb0",
  300: "#a2cc87",
  400: "#8bbd70",
  500: "#79ab5d",
  600: "#61904a",
  700: "#4b7139",
  800: "#2f4826",
  900: "#1d2e18",
};

const warning: Scale = {
  50: "#fef7ec",
  100: "#fdebcf",
  200: "#fbd69f",
  300: "#f8c26f",
  400: "#f6b558",
  500: "#f4ac45",
  600: "#d98f26",
  700: "#ad6f1a",
  800: "#5e3e12",
  900: "#3a270c",
};

const danger: Scale = {
  50: "#fcf0f0",
  100: "#f7d9d9",
  200: "#efb3b3",
  300: "#e48888",
  400: "#d86767",
  500: "#cb4f4f",
  600: "#b03b3b",
  700: "#8c2f2f",
  800: "#4f1f1f",
  900: "#331515",
};

const info: Scale = {
  50: "#eef4f8",
  100: "#d6e4ee",
  200: "#adc9dc",
  300: "#85adca",
  400: "#6898b8",
  500: "#5185a5",
  600: "#416d89",
  700: "#33566c",
  800: "#223a49",
  900: "#16262f",
};

/**
 * Builds the full set of Joy variant tokens for a color scale so every color
 * (including custom ones like `info`) behaves consistently.
 */
const tokens = (scale: Scale, solidColor: string) => ({
  ...scale,
  plainColor: scale[300],
  plainHoverBg: `rgba(${hexToRgb(scale[500])} / 0.12)`,
  plainActiveBg: `rgba(${hexToRgb(scale[500])} / 0.2)`,
  plainDisabledColor: neutral[600],

  outlinedColor: scale[200],
  outlinedBorder: `rgba(${hexToRgb(scale[500])} / 0.45)`,
  outlinedHoverBg: `rgba(${hexToRgb(scale[500])} / 0.12)`,
  outlinedActiveBg: `rgba(${hexToRgb(scale[500])} / 0.2)`,
  outlinedDisabledColor: neutral[600],
  outlinedDisabledBorder: neutral[800],

  softColor: scale[200],
  softBg: `rgba(${hexToRgb(scale[500])} / 0.16)`,
  softHoverBg: `rgba(${hexToRgb(scale[500])} / 0.24)`,
  softActiveBg: `rgba(${hexToRgb(scale[500])} / 0.32)`,
  softDisabledColor: neutral[600],
  softDisabledBg: neutral[900],

  solidColor,
  solidBg: scale[500],
  solidHoverBg: scale[400],
  solidActiveBg: scale[600],
  solidDisabledColor: neutral[500],
  solidDisabledBg: neutral[800],

  mainChannel: hexToRgb(scale[500]),
  lightChannel: hexToRgb(scale[200]),
  darkChannel: hexToRgb(scale[700]),
});

function hexToRgb(hex: string) {
  const v = parseInt(hex.replace("#", ""), 16);
  return `${(v >> 16) & 255} ${(v >> 8) & 255} ${v & 255}`;
}

import type { PaletteRange } from "@mui/joy/styles";

declare module "@mui/joy/styles" {
  interface ColorPalettePropOverrides {
    info: true;
  }

  interface Palette {
    info: PaletteRange;
    semantic: {
      monitors: string;
      alerting: string;
      incidents: string;
      maintenance: string;
      pages: string;
      reports: string;
      team: string;
    };
  }
}

const JoyTheme = extendTheme({
  cssVarPrefix: "joy",
  fontFamily: {
    body: "Inter, var(--joy-fontFamily-fallback)",
    display: "Inter, var(--joy-fontFamily-fallback)",
  },
  radius: {
    xs: "6px",
    sm: "8px",
    md: "10px",
    lg: "14px",
    xl: "18px",
  },
  shadow: {
    xs: "none",
    sm: "none",
    md: "0 4px 12px -2px rgb(0 0 0 / 0.35)",
    lg: "0 12px 32px -6px rgb(0 0 0 / 0.5)",
    xl: "0 24px 48px -12px rgb(0 0 0 / 0.6)",
  },
  focus: {
    thickness: "2px",
  },
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          ...tokens(neutral, neutral[900]),
          plainColor: neutral[100],
          outlinedColor: neutral[100],
          outlinedBorder: "rgba(255 255 255 / 0.12)",
          outlinedHoverBg: "rgba(255 255 255 / 0.06)",
          outlinedActiveBg: "rgba(255 255 255 / 0.1)",
          plainHoverBg: "rgba(255 255 255 / 0.06)",
          plainActiveBg: "rgba(255 255 255 / 0.1)",
          softColor: neutral[100],
          softBg: "rgba(255 255 255 / 0.08)",
          softHoverBg: "rgba(255 255 255 / 0.12)",
          softActiveBg: "rgba(255 255 255 / 0.16)",
          solidBg: neutral[100],
          solidHoverBg: neutral[50],
          solidActiveBg: neutral[200],
          solidColor: neutral[900],
          mainChannel: hexToRgb(neutral[200]),
        },
        neutral: {
          ...tokens(neutral, neutral[50]),
          plainColor: neutral[300],
          outlinedColor: neutral[200],
          outlinedBorder: "rgba(255 255 255 / 0.12)",
          outlinedHoverBg: "rgba(255 255 255 / 0.06)",
          outlinedActiveBg: "rgba(255 255 255 / 0.1)",
          plainHoverBg: "rgba(255 255 255 / 0.06)",
          plainActiveBg: "rgba(255 255 255 / 0.1)",
          softColor: neutral[200],
          softBg: "rgba(255 255 255 / 0.06)",
          softHoverBg: "rgba(255 255 255 / 0.1)",
          softActiveBg: "rgba(255 255 255 / 0.14)",
          solidBg: neutral[700],
          solidHoverBg: neutral[600],
          solidActiveBg: neutral[800],
        },
        success: tokens(success, "#111"),
        warning: tokens(warning, "#111"),
        danger: tokens(danger, "#fff"),
        info: tokens(info, "#fff"),
        semantic: {
          monitors: success[500],
          alerting: warning[500],
          incidents: danger[500],
          maintenance: info[500],
          pages: "#7E9181",
          reports: "#A871B7",
          team: neutral[200],
        },
        background: {
          body: "#14171c",
          surface: "#191c22",
          popup: "#1d2128",
          level1: "#1f232a",
          level2: "#252a32",
          level3: "#2d323b",
          tooltip: neutral[100],
          backdrop: "rgba(10 12 15 / 0.6)",
        },
        divider: "rgba(255 255 255 / 0.08)",
        text: {
          primary: "#e7e9ee",
          secondary: "#a3aab7",
          tertiary: "#7c8494",
          icon: "#a3aab7",
        },
        focusVisible: "rgba(255 255 255 / 0.35)",
      },
    },
  },
  components: {
    JoyButton: {
      defaultProps: {
        size: "sm",
      },
      styleOverrides: {
        root: {
          fontWeight: 500,
          transition: "background-color 120ms, border-color 120ms, color 120ms",
        },
      },
    },
    JoyIconButton: {
      defaultProps: {
        size: "sm",
      },
    },
    JoyInput: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: ({ ownerState }) => ({
          backgroundColor: "rgba(255 255 255 / 0.02)",
          "--Input-focusedThickness": "2px",
          "--Input-focusedHighlight": "rgba(255 255 255 / 0.25)",
          ...(ownerState.variant === "outlined" && {
            "&:not(.Mui-error)": {
              "--variant-outlinedBorder": "rgba(255 255 255 / 0.12)",
              "--variant-outlinedHoverBorder": "rgba(255 255 255 / 0.2)",
            },
          }),
          "& input:-webkit-autofill": {
            // Prevent autofill from changing the text color
            transitionDelay: "9999999999999999s",
          },
        }),
      },
    },
    JoyTextarea: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: ({ ownerState }) => ({
          backgroundColor: "rgba(255 255 255 / 0.02)",
          "--Textarea-focusedThickness": "2px",
          "--Textarea-focusedHighlight": "rgba(255 255 255 / 0.25)",
          ...(ownerState.variant === "outlined" && {
            "&:not(.Mui-error)": {
              "--variant-outlinedBorder": "rgba(255 255 255 / 0.12)",
              "--variant-outlinedHoverBorder": "rgba(255 255 255 / 0.2)",
            },
          }),
        }),
      },
    },
    JoySelect: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255 255 255 / 0.02)",
          "--Select-focusedThickness": "2px",
          "--Select-focusedHighlight": "rgba(255 255 255 / 0.25)",
          "&:not(.Mui-error)": {
            "--variant-outlinedBorder": "rgba(255 255 255 / 0.12)",
            "--variant-outlinedHoverBorder": "rgba(255 255 255 / 0.2)",
          },
        },
      },
    },
    JoyAutocomplete: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255 255 255 / 0.02)",
          "--Input-focusedThickness": "2px",
          "--Input-focusedHighlight": "rgba(255 255 255 / 0.25)",
          "&:not(.Mui-error)": {
            "--variant-outlinedBorder": "rgba(255 255 255 / 0.12)",
            "--variant-outlinedHoverBorder": "rgba(255 255 255 / 0.2)",
          },
        },
      },
    },
    JoyCard: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(ownerState.variant === "outlined" && {
            backgroundColor: theme.vars.palette.background.surface,
            borderColor: theme.vars.palette.divider,
          }),
          boxShadow: "none",
        }),
      },
    },
    JoySheet: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(ownerState.variant === "outlined" && {
            borderColor: theme.vars.palette.divider,
          }),
        }),
      },
    },
    JoyModalDialog: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.vars.palette.background.popup,
          borderColor: theme.vars.palette.divider,
          boxShadow: theme.vars.shadow.lg,
        }),
      },
    },
    JoyMenu: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.vars.palette.background.popup,
          borderColor: theme.vars.palette.divider,
          boxShadow: theme.vars.shadow.md,
          "--List-padding": "4px",
          "--ListItem-radius": theme.vars.radius.sm,
        }),
      },
    },
    JoyChip: {
      defaultProps: {
        size: "sm",
      },
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    JoyTooltip: {
      defaultProps: {
        size: "sm",
        variant: "solid",
      },
    },
    JoySwitch: {
      defaultProps: {
        color: "success",
      },
    },
    JoySkeleton: {
      defaultProps: {
        animation: "wave",
      },
    },
    // Segmented, pill-style tabs (shadcn-like)
    JoyTabs: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
        },
      },
    },
    JoyTabList: {
      defaultProps: {
        disableUnderline: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          alignSelf: "flex-start",
          gap: 4,
          padding: 4,
          borderRadius: theme.vars.radius.lg,
          backgroundColor: theme.vars.palette.background.level1,
          border: `1px solid ${theme.vars.palette.divider}`,
          overflowX: "auto",
          scrollbarWidth: "none",
          "--ListItem-radius": theme.vars.radius.md,
          "--ListItem-minHeight": "32px",
        }),
      },
    },
    JoyTab: {
      defaultProps: {
        disableIndicator: true,
        variant: "plain",
        color: "neutral",
      },
      styleOverrides: {
        root: ({ theme }) => ({
          fontWeight: 500,
          fontSize: theme.vars.fontSize.sm,
          whiteSpace: "nowrap",
          color: theme.vars.palette.text.secondary,
          "&:hover": {
            color: theme.vars.palette.text.primary,
          },
          '&[aria-selected="true"]': {
            color: theme.vars.palette.text.primary,
            backgroundColor: theme.vars.palette.background.level3,
          },
        }),
      },
    },
    JoyTabPanel: {
      styleOverrides: {
        root: {
          padding: 0,
          paddingTop: 16,
        },
      },
    },
    JoyTable: {
      styleOverrides: {
        root: ({ theme }) => ({
          "--TableCell-borderColor": theme.vars.palette.divider,
          "--TableCell-headBackground": "transparent",
          "& thead th": {
            color: theme.vars.palette.text.tertiary,
            fontWeight: 500,
          },
        }),
      },
    },
    JoyListItemButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.vars.radius.sm,
        }),
      },
    },
    JoyAvatar: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.vars.radius.sm,
        }),
      },
    },
  },
});

export { JoyTheme };

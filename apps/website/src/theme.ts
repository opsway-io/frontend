import { extendTheme } from "@mui/joy/styles";

/**
 * Dark marketing-site theme in the style of Untitled UI: flat dark surfaces,
 * a neutral gray scale, the opsway green as the single brand color, crisp 1px
 * borders and only a hairline "xs" shadow on controls.
 */

// Untitled UI "gray (dark mode)" scale, tuned to the dashboard background.
const gray = {
  50: "#F5F5F6",
  100: "#F0F1F1",
  200: "#ECECED",
  300: "#CECFD2",
  400: "#94969C",
  500: "#85888E",
  600: "#61646C",
  700: "#333741",
  800: "#22262e",
  900: "#191c22",
};

const brand = {
  50: "#F3F8EF",
  100: "#E4F0DB",
  200: "#C8E1B6",
  300: "#A6CE8C",
  400: "#86B868",
  500: "#6A9E4C",
  600: "#55853A",
  700: "#44692F",
  800: "#375428",
  900: "#2E4523",
};

const shadowXs = "0 1px 2px rgba(0 0 0 / 0.3)";

const WebsiteTheme = extendTheme({
  cssVarPrefix: "joy",
  fontFamily: {
    body: "Inter, var(--joy-fontFamily-fallback)",
    display: "Inter, var(--joy-fontFamily-fallback)",
  },
  radius: {
    xs: "4px",
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "16px",
  },
  shadow: {
    xs: shadowXs,
    sm: shadowXs,
    md: "0 4px 8px -2px rgba(16 24 40 / 0.1), 0 2px 4px -2px rgba(16 24 40 / 0.06)",
    lg: "0 12px 16px -4px rgba(16 24 40 / 0.08), 0 4px 6px -2px rgba(16 24 40 / 0.03)",
    xl: "0 20px 24px -4px rgba(16 24 40 / 0.08), 0 8px 8px -4px rgba(16 24 40 / 0.03)",
  },
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          ...brand,
          solidBg: brand[600],
          solidHoverBg: brand[500],
          solidActiveBg: brand[700],
          solidColor: "#fff",
          softColor: brand[300],
          softBg: "rgba(106 158 76 / 0.12)",
          softHoverBg: "rgba(106 158 76 / 0.2)",
          softActiveBg: "rgba(106 158 76 / 0.28)",
          outlinedColor: brand[300],
          outlinedBorder: brand[700],
          outlinedHoverBg: "rgba(106 158 76 / 0.08)",
          plainColor: brand[300],
          plainHoverBg: "rgba(106 158 76 / 0.08)",
        },
        success: { ...brand },
        neutral: {
          ...gray,
          plainColor: gray[400],
          plainHoverColor: gray[100],
          plainHoverBg: gray[800],
          plainActiveBg: gray[700],
          outlinedColor: gray[300],
          outlinedBorder: gray[700],
          outlinedHoverBg: gray[800],
          outlinedActiveBg: gray[700],
          softColor: gray[300],
          softBg: gray[800],
          softHoverBg: gray[700],
          solidBg: gray[50],
          solidColor: gray[900],
          solidHoverBg: gray[300],
        },
        text: {
          primary: gray[50],
          secondary: gray[400],
          tertiary: gray[500],
          icon: gray[400],
        },
        background: {
          body: "#14171c",
          surface: "#14171c",
          popup: gray[900],
          level1: gray[900],
          level2: gray[800],
          level3: gray[700],
        },
        divider: "#262a32",
        focusVisible: brand[400],
      },
    },
  },
  components: {
    JoyButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          fontWeight: 600,
          boxShadow:
            ownerState.variant === "solid" || ownerState.variant === "outlined"
              ? shadowXs
              : "none",
          ...(ownerState.variant === "outlined" &&
            ownerState.color === "neutral" && {
              backgroundColor: "transparent",
            }),
        }),
      },
    },
    JoyCard: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    JoyChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    JoyLink: {
      defaultProps: {
        underline: "hover",
      },
    },
  },
});

export { WebsiteTheme };

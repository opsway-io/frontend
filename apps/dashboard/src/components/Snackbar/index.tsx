import { Box, Card, Stack, Typography, styled, useTheme } from "@mui/material";
import {
  SnackbarContent,
  CustomContentProps,
  SnackbarProvider as NotistackProvider,
  SnackbarProviderProps,
} from "notistack";
import { forwardRef } from "react";
import {
  IoAlert,
  IoCheckmark,
  IoInformation,
  IoWarningOutline,
} from "react-icons/io5";

const StyledSnackbarContent = styled(SnackbarContent)(({ theme }) => ({
  minWidth: 350,

  display: "flex",
  justifyContent: "center",

  "& > *": {
    width: "100%",
  },
}));

const SuccessVariant = forwardRef<HTMLDivElement, CustomContentProps>(
  (props, ref) => {
    const { id, message } = props;
    const t = useTheme();

    return (
      <StyledSnackbarContent ref={ref} role="alert">
        <Card
          sx={{
            padding: (t) => t.spacing(2),
          }}
        >
          <Stack direction="row" spacing={2}>
            <Box
              sx={{
                backgroundColor: (t) => t.palette.success.main,
                width: 24,
                height: 24,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: (t) => `${t.shape.borderRadius}px`,
              }}
            >
              <IoCheckmark size={16} color={t.palette.success.contrastText} />
            </Box>
            <Typography>{message}</Typography>
          </Stack>
        </Card>
      </StyledSnackbarContent>
    );
  }
);

const ErrorVariant = forwardRef<HTMLDivElement, CustomContentProps>(
  (props, ref) => {
    const { id, message } = props;
    const t = useTheme();

    return (
      <StyledSnackbarContent ref={ref} role="alert">
        <Card
          sx={{
            padding: (t) => t.spacing(2),
          }}
        >
          <Stack direction="row" spacing={2}>
            <Box
              sx={{
                backgroundColor: (t) => t.palette.error.main,
                width: 24,
                height: 24,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: (t) => `${t.shape.borderRadius}px`,
              }}
            >
              <IoAlert size={16} color={t.palette.error.contrastText} />
            </Box>
            <Typography>{message}</Typography>
          </Stack>
        </Card>
      </StyledSnackbarContent>
    );
  }
);

const InfoVariant = forwardRef<HTMLDivElement, CustomContentProps>(
  (props, ref) => {
    const { id, message } = props;
    const t = useTheme();

    return (
      <StyledSnackbarContent ref={ref} role="alert">
        <Card
          sx={{
            padding: (t) => t.spacing(2),
          }}
        >
          <Stack direction="row" spacing={2}>
            <Box
              sx={{
                backgroundColor: (t) => t.palette.info.main,
                width: 24,
                height: 24,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: (t) => `${t.shape.borderRadius}px`,
              }}
            >
              <IoInformation size={16} color={t.palette.info.contrastText} />
            </Box>
            <Typography>{message}</Typography>
          </Stack>
        </Card>
      </StyledSnackbarContent>
    );
  }
);

const WarningVariant = forwardRef<HTMLDivElement, CustomContentProps>(
  (props, ref) => {
    const { id, message } = props;
    const t = useTheme();

    return (
      <StyledSnackbarContent ref={ref} role="alert">
        <Card
          sx={{
            padding: (t) => t.spacing(2),
          }}
        >
          <Stack direction="row" spacing={2}>
            <Box
              sx={{
                backgroundColor: (t) => t.palette.warning.main,
                width: 24,
                height: 24,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: (t) => `${t.shape.borderRadius}px`,
              }}
            >
              <IoWarningOutline
                size={16}
                color={t.palette.warning.contrastText}
              />
            </Box>
            <Typography>{message}</Typography>
          </Stack>
        </Card>
      </StyledSnackbarContent>
    );
  }
);

export const SnackbarProvider = (props: SnackbarProviderProps) => {
  return (
    <NotistackProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      autoHideDuration={3000}
      Components={{
        success: SuccessVariant,
        error: ErrorVariant,
        info: InfoVariant,
        warning: WarningVariant,
      }}
      {...props}
    >
      {props.children}
    </NotistackProvider>
  );
};

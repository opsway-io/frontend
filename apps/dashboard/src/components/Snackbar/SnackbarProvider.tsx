import { Box, Sheet, Typography } from "@mui/joy";
import {
  SnackbarContent,
  CustomContentProps,
  SnackbarProvider as NotistackProvider,
  SnackbarProviderProps,
} from "notistack";
import { ComponentType, forwardRef } from "react";
import {
  IoAlert,
  IoCheckmark,
  IoInformation,
  IoWarningOutline,
} from "react-icons/io5";

type SnackColor = "success" | "danger" | "info" | "warning";

const createVariant = (
  color: SnackColor,
  Icon: ComponentType<{ size?: number }>,
) => {
  const Variant = forwardRef<HTMLDivElement, CustomContentProps>(
    (props, ref) => {
      const { message } = props;

      return (
        <SnackbarContent
          ref={ref}
          role="alert"
          style={{ minWidth: 340, maxWidth: 440 }}
        >
          <Sheet
            variant="outlined"
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1.5,
              pr: 2,
              borderRadius: "lg",
              bgcolor: "background.popup",
              boxShadow: "md",
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                flexShrink: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "sm",
                bgcolor: `${color}.softBg`,
                color: `${color}.400`,
              }}
            >
              <Icon size={16} />
            </Box>
            <Typography level="body-sm" textColor="text.primary">
              {message}
            </Typography>
          </Sheet>
        </SnackbarContent>
      );
    },
  );

  Variant.displayName = `Snackbar(${color})`;

  return Variant;
};

const SuccessVariant = createVariant("success", IoCheckmark);
const ErrorVariant = createVariant("danger", IoAlert);
const InfoVariant = createVariant("info", IoInformation);
const WarningVariant = createVariant("warning", IoWarningOutline);

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

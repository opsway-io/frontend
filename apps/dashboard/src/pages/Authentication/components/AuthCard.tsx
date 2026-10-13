import { Card, Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { FunctionComponent, ReactNode } from "react";

interface AuthCardProps {
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode | ReactNode[];
  maxWidth?: number;
  sx?: SxProps;
}

/**
 * Centered card used by all authentication screens.
 */
const AuthCard: FunctionComponent<AuthCardProps> = ({
  title,
  description,
  children,
  maxWidth = 420,
  sx,
}) => {
  return (
    <Card
      variant="outlined"
      sx={[
        {
          width: "100%",
          maxWidth,
          borderRadius: "xl",
          p: { xs: 3, sm: 4 },
          gap: 2.5,
          "@keyframes authCardIn": {
            from: { opacity: 0, transform: "translateY(8px)" },
            to: { opacity: 1, transform: "none" },
          },
          animation: "authCardIn 250ms ease-out both",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {(title || description) && (
        <Stack spacing={0.75} sx={{ textAlign: "center" }}>
          {title && <Typography level="h3">{title}</Typography>}
          {description && (
            <Typography level="body-sm" textColor="text.secondary">
              {description}
            </Typography>
          )}
        </Stack>
      )}

      {children}
    </Card>
  );
};

export default AuthCard;

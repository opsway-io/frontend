import { Box, Card, Divider, Stack, Typography } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";

interface SettingsCardProps {
  title: ReactNode;
  description?: ReactNode;
  /** Rendered right-aligned below the content (e.g. a save button). */
  actions?: ReactNode;
  /** Rendered next to the title (e.g. a "create" button). */
  headerAction?: ReactNode;
  danger?: boolean;
  children?: ReactNode;
}

/**
 * A settings section: rounded card with a title, a muted description,
 * stacked content and right aligned actions.
 */
const SettingsCard: FunctionComponent<SettingsCardProps> = (props) => {
  return (
    <Card
      sx={{
        p: { xs: 2, md: 3 },
        gap: 2,
        ...(props.danger && {
          borderColor: "rgba(var(--joy-palette-danger-mainChannel) / 0.45)",
          bgcolor: "rgba(var(--joy-palette-danger-mainChannel) / 0.04)",
        }),
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "flex-start" }}
        gap={2}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            level="title-md"
            color={props.danger ? "danger" : undefined}
          >
            {props.title}
          </Typography>
          {props.description && (
            <Typography
              level="body-sm"
              textColor="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {props.description}
            </Typography>
          )}
        </Box>
        {props.headerAction && (
          <Box sx={{ flexShrink: 0 }}>{props.headerAction}</Box>
        )}
      </Stack>

      {props.children && <Stack gap={2}>{props.children}</Stack>}

      {props.actions && (
        <>
          <Divider />
          <Stack direction="row" justifyContent="flex-end" gap={1}>
            {props.actions}
          </Stack>
        </>
      )}
    </Card>
  );
};

export default SettingsCard;

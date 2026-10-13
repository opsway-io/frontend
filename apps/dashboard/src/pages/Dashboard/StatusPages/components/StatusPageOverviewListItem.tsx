import { Box, Card, Chip, IconButton, Link, Stack, Tooltip } from "@mui/joy";
import { FunctionComponent } from "react";
import { IoGlobeOutline, IoOpenOutline } from "react-icons/io5";
import { Link as RouterLink } from "react-router-dom";
import { StatusPage } from "../../../../api/endpoints/statuspages";

interface StatusPageOverviewListItemProps {
  statusPage: StatusPage;
}

const countMonitors = (statusPage: StatusPage) =>
  (statusPage.monitorIds?.length ?? 0) +
  (statusPage.groups ?? []).reduce(
    (sum, group) => sum + (group.monitorIds?.length ?? 0),
    0,
  );

const StatusPageOverviewListItem: FunctionComponent<
  StatusPageOverviewListItemProps
> = ({ statusPage }) => {
  const monitorCount = countMonitors(statusPage);

  return (
    <Card
      orientation="horizontal"
      sx={{
        alignItems: "center",
        gap: 2,
        py: 1.5,
        transition: "background-color 120ms, border-color 120ms",
        "&:hover": {
          bgcolor: "background.level1",
          borderColor: "neutral.outlinedBorder",
        },
      }}
    >
      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          flexShrink: 0,
          borderRadius: "sm",
          bgcolor: "neutral.softBg",
          color: "semantic.pages",
        }}
      >
        <IoGlobeOutline size={18} />
      </Box>

      <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
        <Link
          overlay
          component={RouterLink}
          to={`/status-pages/${statusPage.id}`}
          level="title-sm"
          textColor="text.primary"
          underline="none"
          sx={{
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {statusPage.name} - {statusPage.domain}
        </Link>

        <Stack direction="row" spacing={1}>
          <Chip variant="soft" color="neutral">
            {monitorCount} {monitorCount === 1 ? "monitor" : "monitors"}
          </Chip>
          {statusPage.isPrivate && (
            <Chip variant="soft" color="warning">
              Password protected
            </Chip>
          )}
        </Stack>
      </Stack>

      <Tooltip title="Open in a new tab">
        <IconButton
          component="a"
          href={`https://${statusPage.domain}`}
          target="_blank"
          rel="noopener noreferrer"
          variant="plain"
          color="neutral"
          aria-label="Open in a new tab"
          sx={{ position: "relative", zIndex: 1 }}
        >
          <IoOpenOutline size={18} />
        </IconButton>
      </Tooltip>
    </Card>
  );
};

export default StatusPageOverviewListItem;

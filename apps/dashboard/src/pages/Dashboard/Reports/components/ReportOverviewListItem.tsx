import { Box, Card, Chip, Link, Stack, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { IoChevronForward, IoStatsChart } from "react-icons/io5";
import { Link as RouterLink } from "react-router-dom";
import { Report } from "../../../../api/endpoints/reports";
import { reportStatusColor } from "../reportStatus";

interface ReportOverviewListItemProps {
  report: Report;
}

const ReportOverviewListItem: FunctionComponent<
  ReportOverviewListItemProps
> = ({ report }) => (
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
        color: "semantic.reports",
      }}
    >
      <IoStatsChart size={18} />
    </Box>

    <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
      <Link
        overlay
        component={RouterLink}
        to={String(report.id)}
        level="title-sm"
        textColor="text.primary"
        underline="none"
      >
        Report #{report.id}
      </Link>
      <Stack direction="row" spacing={1}>
        <Chip variant="soft" color="info">
          {report.type}
        </Chip>
        <Chip variant="soft" color={reportStatusColor(report.status)}>
          {report.status}
        </Chip>
      </Stack>
    </Stack>

    <Typography level="body-xs" textColor="text.tertiary" noWrap>
      {new Date(report.createdAt).toLocaleString()}
    </Typography>
    <Box
      component={IoChevronForward}
      sx={{ color: "text.tertiary", flexShrink: 0 }}
    />
  </Card>
);

export default ReportOverviewListItem;

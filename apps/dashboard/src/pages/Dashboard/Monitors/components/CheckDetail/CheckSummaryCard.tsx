import { Box, Card, Chip, Sheet, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { Check } from "../../../../../api/endpoints/monitors/checks";
import { formatNanosecondsAsMilliseconds } from "../../models/checkPhases";

interface CheckSummaryCardProps {
  check?: Check | null;
  method?: string;
  url?: string;
}

const getStatusColor = (check?: Check | null) => {
  if (!check) {
    return "neutral";
  }
  return check.statusCode >= 200 && check.statusCode < 300
    ? "success"
    : "danger";
};

const CheckSummaryCard: FunctionComponent<CheckSummaryCardProps> = ({
  check,
  method,
  url,
}) => {
  return (
    <Card>
      <Box>
        <Typography level="title-md">Summary</Typography>
        <Typography level="body-sm" textColor="text.secondary">
          Result from {new Date(check?.createdAt || 0).toLocaleString()}
        </Typography>
      </Box>
      <Sheet
        variant="soft"
        sx={{
          borderRadius: "md",
          px: 1.5,
          py: 1,
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Chip variant="outlined" color="neutral">
          {method}
        </Chip>
        <Typography
          level="body-sm"
          fontFamily="code"
          sx={{ mr: "auto", minWidth: 0, wordBreak: "break-all" }}
        >
          {url}
        </Typography>
        <Chip variant="soft" color={getStatusColor(check)}>
          {check?.statusCode}
        </Chip>
        <Chip
          variant="soft"
          color={check ? (check.tls ? "success" : "danger") : "neutral"}
        >
          TLS
        </Chip>
        <Chip variant="soft" color="info">
          {check
            ? formatNanosecondsAsMilliseconds(check.timing.total)
            : undefined}
        </Chip>
      </Sheet>
    </Card>
  );
};

export default CheckSummaryCard;

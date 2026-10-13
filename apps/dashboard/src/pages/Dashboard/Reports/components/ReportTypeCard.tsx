import { Box, Card, Link, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { ReportTypeOption } from "../reportTypes";

interface ReportTypeCardProps {
  option: ReportTypeOption;
  onSelect: () => void;
}

const ReportTypeCard: FunctionComponent<ReportTypeCardProps> = ({
  option,
  onSelect,
}) => (
  <Card
    sx={{
      gap: 1,
      transition: "background-color 120ms, border-color 120ms",
      "&:hover": {
        bgcolor: "background.level1",
        borderColor: "neutral.outlinedBorder",
      },
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        borderRadius: "sm",
        bgcolor: "neutral.softBg",
        color: "semantic.reports",
        fontSize: "lg",
      }}
    >
      {option.icon}
    </Box>
    <Link
      overlay
      component="button"
      type="button"
      onClick={onSelect}
      level="title-sm"
      textColor="text.primary"
      underline="none"
      sx={{ justifyContent: "flex-start", textAlign: "left" }}
    >
      {option.title}
    </Link>
    <Typography level="body-sm" textColor="text.secondary">
      {option.description}
    </Typography>
  </Card>
);

export default ReportTypeCard;

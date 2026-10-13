import { Link, Sheet, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { IoAlertCircle, IoCheckmarkCircle } from "react-icons/io5";
import { Link as RouterLink } from "react-router-dom";

interface MonitorsStatusBannerProps {
  /** Number of monitors that currently have an open incident. */
  failingCount: number;
}

/** "All checks are passing" / "N monitors are failing" banner. */
const MonitorsStatusBanner: FunctionComponent<MonitorsStatusBannerProps> = ({
  failingCount,
}) => {
  const failing = failingCount > 0;

  return (
    <Sheet
      variant="soft"
      color={failing ? "danger" : "success"}
      sx={{
        borderRadius: "lg",
        border: "1px solid",
        borderColor: failing
          ? "danger.outlinedBorder"
          : "success.outlinedBorder",
        px: 2,
        py: 1.25,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
      }}
    >
      {failing ? <IoAlertCircle size={18} /> : <IoCheckmarkCircle size={18} />}
      <Typography level="title-sm" textColor="inherit">
        {failing
          ? `${failingCount} ${failingCount === 1 ? "monitor has" : "monitors have"} open incidents`
          : "All checks are passing"}
      </Typography>
      {failing && (
        <Link
          component={RouterLink}
          to="/incidents"
          level="body-sm"
          color="danger"
          underline="always"
        >
          View incidents
        </Link>
      )}
    </Sheet>
  );
};

export default MonitorsStatusBanner;

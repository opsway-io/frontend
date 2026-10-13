import { Skeleton, Stack } from "@mui/joy";
import { FunctionComponent } from "react";

const statCardKeys = ["uptime", "average", "last-check", "tls"];

const MonitorDetailSkeleton: FunctionComponent = () => (
  <>
    <Skeleton variant="rectangular" height={56} sx={{ borderRadius: "lg" }} />
    <Stack direction="row" spacing={2}>
      {statCardKeys.map((key) => (
        <Skeleton
          key={key}
          variant="rectangular"
          height={96}
          sx={{ flex: 1, borderRadius: "lg" }}
        />
      ))}
    </Stack>
    <Skeleton variant="rectangular" height={500} sx={{ borderRadius: "lg" }} />
    <Skeleton variant="rectangular" height={200} sx={{ borderRadius: "lg" }} />
  </>
);

export default MonitorDetailSkeleton;
